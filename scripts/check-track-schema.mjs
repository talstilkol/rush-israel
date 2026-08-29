#!/usr/bin/env node
import { readFileSync, realpathSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { fromRoot } from "./project-root.mjs";

export const EXPECTED_RSH_012_MERGE = "94524201dfe87f1f22f8d8bdd9d97aad507c0438";

function sameJson(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function parseTypeScript(fileName, source, errors) {
  const file = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  for (const diagnostic of file.parseDiagnostics) {
    const position = diagnostic.start === undefined
      ? "unknown"
      : file.getLineAndCharacterOfPosition(diagnostic.start).line + 1;
    errors.push(`${fileName}:${position} does not parse: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`);
  }
  return file;
}

function unwrapExpression(node) {
  let current = node;
  while (
    current
    && (ts.isAsExpression(current)
      || ts.isSatisfiesExpression(current)
      || ts.isParenthesizedExpression(current))
  ) {
    current = current.expression;
  }
  return current;
}

function propertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return null;
}

function findTypeAlias(file, name) {
  return file.statements.find(
    (statement) => ts.isTypeAliasDeclaration(statement) && statement.name.text === name,
  );
}

function extractStringUnion(file, name, errors) {
  const alias = findTypeAlias(file, name);
  if (!alias || !ts.isUnionTypeNode(alias.type)) {
    errors.push(`${name} must be a string-literal union`);
    return [];
  }
  const values = [];
  for (const node of alias.type.types) {
    if (!ts.isLiteralTypeNode(node) || !ts.isStringLiteral(node.literal)) {
      errors.push(`${name} contains a non-string-literal member`);
      continue;
    }
    values.push(node.literal.text);
  }
  return values;
}

function extractTrackDefContract(file, errors) {
  const alias = findTypeAlias(file, "TrackDef");
  if (!alias || !ts.isTypeLiteralNode(alias.type)) {
    errors.push("TrackDef must remain a type literal");
    return { required: [], optional: [] };
  }
  const required = [];
  const optional = [];
  for (const member of alias.type.members) {
    if (!ts.isPropertySignature(member) || !member.name) {
      errors.push("TrackDef may contain property signatures only");
      continue;
    }
    const name = propertyName(member.name);
    if (!name) {
      errors.push("TrackDef contains a computed property name");
      continue;
    }
    (member.questionToken ? optional : required).push(name);
  }
  return { required, optional };
}

function findTrackArray(file, errors) {
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== "TRACKS") continue;
      if (!declaration.initializer) {
        errors.push("TRACKS must have an initializer");
        return null;
      }
      const initializer = unwrapExpression(declaration.initializer);
      if (ts.isArrayLiteralExpression(initializer)) return initializer;
      if (ts.isCallExpression(initializer) && initializer.arguments.length > 0) {
        const first = unwrapExpression(initializer.arguments[0]);
        if (ts.isArrayLiteralExpression(first)) return first;
      }
      errors.push("TRACKS must be an array literal or defineTracks(array literal)");
      return null;
    }
  }
  errors.push("TRACKS declaration not found");
  return null;
}

function objectProperties(node, context, errors, { allowSpread = false } = {}) {
  if (!ts.isObjectLiteralExpression(node)) {
    errors.push(`${context} must be an object literal`);
    return new Map();
  }
  const result = new Map();
  for (const property of node.properties) {
    if (ts.isSpreadAssignment(property)) {
      if (!allowSpread) errors.push(`${context} must not contain a top-level spread`);
      continue;
    }
    if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) {
      errors.push(`${context} contains an unsupported property form`);
      continue;
    }
    const name = propertyName(property.name);
    if (!name) {
      errors.push(`${context} contains a computed property name`);
      continue;
    }
    if (result.has(name)) errors.push(`${context} contains duplicate property ${name}`);
    result.set(name, ts.isPropertyAssignment(property) ? unwrapExpression(property.initializer) : property);
  }
  return result;
}

function stringValue(node) {
  return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    ? node.text
    : null;
}

function numberValue(node) {
  if (!node) return null;
  const value = unwrapExpression(node);
  if (ts.isNumericLiteral(value)) return Number(value.text);
  if (
    ts.isPrefixUnaryExpression(value)
    && (value.operator === ts.SyntaxKind.MinusToken || value.operator === ts.SyntaxKind.PlusToken)
  ) {
    const inner = numberValue(value.operand);
    if (inner === null) return null;
    return value.operator === ts.SyntaxKind.MinusToken ? -inner : inner;
  }
  return null;
}

function booleanValue(node) {
  if (!node) return null;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  return null;
}

function validateStructuredObject(node, required, context, errors, { allowSpread = false } = {}) {
  const props = objectProperties(node, context, errors, { allowSpread });
  const hasSpread = ts.isObjectLiteralExpression(node)
    && node.properties.some((property) => ts.isSpreadAssignment(property));
  for (const key of required) {
    if (!props.has(key) && !(allowSpread && hasSpread && (key === "x" || key === "z"))) {
      errors.push(`${context} is missing ${key}`);
    }
  }
  return props;
}

function validateTrackObject(node, index, schema, errors) {
  const context = `track[${index}]`;
  const props = objectProperties(node, context, errors);
  const required = schema.type_contract.required_properties;
  const optional = schema.type_contract.optional_properties;
  const allowed = new Set([...required, ...optional]);

  for (const key of required) {
    if (!props.has(key)) errors.push(`${context} is missing required property ${key}`);
  }
  for (const key of props.keys()) {
    if (!allowed.has(key)) errors.push(`${context} contains unknown property ${key}`);
  }

  const id = stringValue(props.get("id"));
  const city = stringValue(props.get("city"));
  const theme = stringValue(props.get("theme"));
  const image = stringValue(props.get("image"));
  if (!id) errors.push(`${context}.id must be a non-empty string literal`);
  if (!city) errors.push(`${context}.city must be a non-empty string literal`);
  if (!theme) errors.push(`${context}.theme must be a non-empty string literal`);

  for (const key of schema.field_contracts.localized_strings.properties) {
    const value = stringValue(props.get(key));
    if (value === null || value.trim() === "") {
      errors.push(`${context}.${key} must be a non-empty string literal`);
    }
  }

  if (id && image !== `/tracks/${id}.jpg`) {
    errors.push(`${context}.image must equal /tracks/${id}.jpg`);
  }
  if (city && !schema.type_contract.city_enum.includes(city)) {
    errors.push(`${context}.city is not in the canonical CityId enum`);
  }
  if (theme && !schema.type_contract.theme_enum.includes(theme)) {
    errors.push(`${context}.theme is not in the canonical theme enum`);
  }

  const width = numberValue(props.get("width"));
  if (width === null || !Number.isFinite(width) || width <= 0 || width > 200) {
    errors.push(`${context}.width must be a finite number literal in (0, 200]`);
  }
  const seed = numberValue(props.get("seed"));
  if (seed === null || !Number.isInteger(seed) || seed <= 0) {
    errors.push(`${context}.seed must be a positive integer literal`);
  }
  const checkpoints = numberValue(props.get("checkpointCount"));
  if (
    checkpoints === null
    || !Number.isInteger(checkpoints)
    || checkpoints < 1
    || checkpoints > 128
  ) {
    errors.push(`${context}.checkpointCount must be an integer in [1, 128]`);
  }
  for (const key of ["ground", "sand"]) {
    const value = numberValue(props.get(key));
    if (value === null || !Number.isFinite(value)) {
      errors.push(`${context}.${key} must be a finite number expression`);
    }
  }

  const points = props.get("points");
  if (!points || !ts.isArrayLiteralExpression(points) || points.elements.length < 3) {
    errors.push(`${context}.points must be an array literal with at least three entries`);
  }
  const elevation = props.get("elevation");
  if (!elevation || !ts.isArrowFunction(elevation) || elevation.parameters.length > 1) {
    errors.push(`${context}.elevation must be an arrow function with at most one parameter`);
  }
  const sky = props.get("sky");
  if (!sky || !ts.isObjectLiteralExpression(sky)) {
    errors.push(`${context}.sky must be an object literal`);
  }

  const streets = props.get("streets");
  if (!streets || !ts.isArrayLiteralExpression(streets) || streets.elements.length < 1) {
    errors.push(`${context}.streets must be a non-empty array literal`);
  } else {
    let previousFrom = -Infinity;
    streets.elements.forEach((element, streetIndex) => {
      const streetContext = `${context}.streets[${streetIndex}]`;
      const street = validateStructuredObject(
        unwrapExpression(element),
        ["from", "to", "he", "en"],
        streetContext,
        errors,
      );
      const from = numberValue(street.get("from"));
      const to = numberValue(street.get("to"));
      if (
        from === null
        || to === null
        || from < 0
        || to > 1
        || from >= to
        || from < previousFrom
      ) {
        errors.push(`${streetContext} must have an ordered normalized range 0 <= from < to <= 1`);
      }
      if (from !== null) previousFrom = from;
      for (const key of ["he", "en"]) {
        const value = stringValue(street.get(key));
        if (value === null || value.trim() === "") {
          errors.push(`${streetContext}.${key} must be a non-empty string literal`);
        }
      }
    });
  }

  const pois = props.get("pois");
  if (!pois || !ts.isArrayLiteralExpression(pois)) {
    errors.push(`${context}.pois must be an array literal`);
  } else {
    pois.elements.forEach((element, poiIndex) => {
      const poiContext = `${context}.pois[${poiIndex}]`;
      const poi = validateStructuredObject(
        unwrapExpression(element),
        ["x", "z", "r", "he", "en"],
        poiContext,
        errors,
        { allowSpread: true },
      );
      const radius = numberValue(poi.get("r"));
      if (radius === null || radius <= 0) errors.push(`${poiContext}.r must be positive`);
      for (const key of ["he", "en"]) {
        const value = stringValue(poi.get(key));
        if (value === null || value.trim() === "") {
          errors.push(`${poiContext}.${key} must be a non-empty string literal`);
        }
      }
    });
  }

  if (props.has("water")) {
    validateStructuredObject(
      props.get("water"),
      ["x", "z", "w", "d", "color"],
      `${context}.water`,
      errors,
    );
  }
  if (props.has("waters")) {
    const waters = props.get("waters");
    if (!ts.isArrayLiteralExpression(waters)) {
      errors.push(`${context}.waters must be an array literal`);
    } else {
      waters.elements.forEach((element, waterIndex) => {
        validateStructuredObject(
          unwrapExpression(element),
          ["x", "z", "w", "d", "color"],
          `${context}.waters[${waterIndex}]`,
          errors,
        );
      });
    }
  }
  if (props.has("clearZones")) {
    const zones = props.get("clearZones");
    if (!ts.isArrayLiteralExpression(zones)) {
      errors.push(`${context}.clearZones must be an array literal`);
    } else {
      zones.elements.forEach((element, zoneIndex) => {
        validateStructuredObject(
          unwrapExpression(element),
          ["x", "z", "w", "d"],
          `${context}.clearZones[${zoneIndex}]`,
          errors,
        );
      });
    }
  }
  if (props.has("open") && booleanValue(props.get("open")) === null) {
    errors.push(`${context}.open must be a boolean literal`);
  }

  return {
    id,
    city,
    theme,
    image,
    width,
    seed,
    checkpointCount: checkpoints,
  };
}

export function validateTrackSchema({ schema, classification, typeSource, trackSource }) {
  const errors = [];
  if (!schema || typeof schema !== "object") return ["track schema is not an object"];
  if (schema.schema_version !== "1.0.0") errors.push("schema version must be 1.0.0");
  if (schema.document_type !== "rush-canonical-track-schema") {
    errors.push("document type must be rush-canonical-track-schema");
  }
  if (schema.repository !== "talstilkol/rush-israel" || schema.canonical_branch !== "main") {
    errors.push("schema repository authority is incorrect");
  }
  if (schema.observed_source_commit !== EXPECTED_RSH_012_MERGE) {
    errors.push("schema source commit must match the accepted RSH-012 merge");
  }

  const typeFile = parseTypeScript("src/game/types.ts", typeSource, errors);
  const trackFile = parseTypeScript("src/game/tracks.ts", trackSource, errors);
  const trackIds = extractStringUnion(typeFile, "TrackId", errors);
  const cityIds = extractStringUnion(typeFile, "CityId", errors);
  const typeContract = extractTrackDefContract(typeFile, errors);
  const array = findTrackArray(trackFile, errors);

  if (!sameJson(schema.catalogue?.ids_in_canonical_order, trackIds)) {
    errors.push("schema TrackId order must exactly match src/game/types.ts");
  }
  if (!sameJson(schema.type_contract?.city_enum, cityIds)) {
    errors.push("schema CityId enum must exactly match src/game/types.ts");
  }
  if (!sameJson(schema.type_contract?.required_properties, typeContract.required)) {
    errors.push("schema required properties must exactly match required TrackDef keys");
  }
  if (!sameJson(schema.type_contract?.optional_properties, typeContract.optional)) {
    errors.push("schema optional properties must exactly match optional TrackDef keys");
  }
  if (schema.type_contract?.unknown_properties_allowed !== false) {
    errors.push("unknown track properties must remain prohibited");
  }
  if (schema.type_contract?.duplicate_properties_allowed !== false) {
    errors.push("duplicate track properties must remain prohibited");
  }

  const catalogueEntries = classification?.entries ?? [];
  const catalogueIds = catalogueEntries.map((entry) => entry.id);
  if (!sameJson(catalogueIds, trackIds)) {
    errors.push("classification order must exactly match TrackId order");
  }
  if (
    classification?.counts?.total !== 56
    || classification?.counts?.mvp !== 8
    || classification?.counts?.deferred !== 48
  ) {
    errors.push("classification counts must remain 56 total, 8 MVP and 48 deferred");
  }
  const mvpIds = catalogueEntries.filter((entry) => entry.status === "mvp").map((entry) => entry.id);
  if (!sameJson([...mvpIds].sort(), [...schema.catalogue.mvp_ids].sort())) {
    errors.push("schema MVP set must exactly match the frozen classification");
  }

  const summaries = [];
  if (array) {
    if (array.elements.length !== schema.catalogue.expected_track_count) {
      errors.push(`TRACKS must contain exactly ${schema.catalogue.expected_track_count} object literals`);
    }
    array.elements.forEach((element, index) => {
      const value = unwrapExpression(element);
      if (!ts.isObjectLiteralExpression(value)) {
        errors.push(`TRACKS[${index}] must be an object literal`);
        return;
      }
      summaries.push(validateTrackObject(value, index, schema, errors));
    });
  }

  const ids = summaries.map((entry) => entry.id);
  if (ids.some((id) => id === null) || new Set(ids).size !== ids.length) {
    errors.push("track definition IDs must be non-null and unique");
  }
  if (!sameJson(ids, trackIds)) errors.push("TRACKS order must exactly match TrackId order");
  if (!sameJson(ids, catalogueIds)) errors.push("TRACKS order must exactly match catalogue order");

  if (schema.semantic_invariants?.release_gates_green !== 0
    || schema.semantic_invariants?.release_gates_total !== 13) {
    errors.push("release-gate truth must remain 0/13");
  }
  if (schema.change_control?.schema_changes_require_owner_authorization !== true
    || schema.change_control?.track_id_addition_or_removal_requires_owner_authorization !== true
    || schema.change_control?.mvp_mapping_changes_require_owner_authorization !== true
    || schema.change_control?.RSH_014_may_relocate_definitions_without_changing_runtime_data !== true
    || schema.change_control?.RSH_015_authorized !== false) {
    errors.push("track-schema change control is incomplete or over-authorized");
  }

  const digest = createHash("sha256").update(JSON.stringify(summaries)).digest("hex");
  return { errors, summaries, digest };
}

function isMainModule(moduleUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(entry) === fileURLToPath(moduleUrl);
  } catch {
    return false;
  }
}

if (isMainModule(import.meta.url)) {
  const schema = JSON.parse(readFileSync(fromRoot("TRACK-SCHEMA.json"), "utf8"));
  const classification = JSON.parse(
    readFileSync(fromRoot("TRACK-CATALOGUE-CLASSIFICATION.json"), "utf8"),
  );
  const typeSource = readFileSync(fromRoot("src", "game", "types.ts"), "utf8");
  const trackSource = readFileSync(fromRoot("src", "game", "tracks.ts"), "utf8");
  const result = validateTrackSchema({ schema, classification, typeSource, trackSource });
  if (result.errors.length) {
    console.error("track-schema fail\n" + result.errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(`track-schema ok: 56 definitions; digest ${result.digest}; 8 MVP; 48 deferred; 0/13 gates`);
}
