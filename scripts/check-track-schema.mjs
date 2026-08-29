#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { fromRoot } from "./project-root.mjs";

export const EXPECTED_RSH_012_MERGE = "94524201dfe87f1f22f8d8bdd9d97aad507c0438";

const EXPECTED_FIELD_CONTRACTS = {
  localized_strings: {
    properties: [
      "nameHe",
      "nameEn",
      "cityHe",
      "cityEn",
      "lengthHint",
      "description",
      "descriptionEn",
    ],
    non_empty: true,
  },
  image: {
    kind: "string_literal",
    pattern: "^/tracks/<id>\\.jpg$",
  },
  width: {
    kind: "finite_number_literal",
    exclusive_minimum: 0,
    maximum: 200,
  },
  seed: {
    kind: "positive_integer_literal",
  },
  checkpointCount: {
    kind: "positive_integer_literal",
    minimum: 1,
    maximum: 128,
  },
  points: {
    kind: "array_literal_or_zero_argument_array_builder_iife",
    minimum_literal_items: 3,
    builder_requires_local_array_return: true,
    builder_requires_push: true,
  },
  elevation: {
    kind: "arrow_function",
    maximum_parameters: 1,
  },
  sky: {
    kind: "object_literal",
    spread_allowed: true,
  },
  ground: {
    kind: "finite_number_expression",
  },
  sand: {
    kind: "finite_number_expression",
  },
  streets: {
    kind: "array_literal",
    minimum_items: 1,
    required_item_properties: ["from", "to", "he", "en"],
  },
  pois: {
    kind: "array_literal",
    minimum_items: 0,
    required_item_properties: ["x", "z", "r", "he", "en"],
    spread_coordinates_allowed: true,
  },
  water: {
    kind: "object_literal",
    required_properties: ["x", "z", "w", "d", "color"],
  },
  waters: {
    kind: "array_literal",
    required_item_properties: ["x", "z", "w", "d", "color"],
  },
  clearZones: {
    kind: "array_literal",
    required_item_properties: ["x", "z", "w", "d"],
  },
  open: {
    kind: "boolean_literal",
  },
};

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function sameJson(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function sameUniqueSet(actual, expected) {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  return actual.length === expected.length
    && actualSet.size === actual.length
    && expectedSet.size === expected.length
    && actual.every((value) => expectedSet.has(value));
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
    errors.push(
      `${fileName}:${position} does not parse: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`,
    );
  }
  return file;
}

function unwrapExpression(node) {
  let current = node;
  while (
    current
    && (ts.isAsExpression(current)
      || ts.isSatisfiesExpression(current)
      || ts.isParenthesizedExpression(current)
      || ts.isNonNullExpression(current))
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
      if (ts.isCallExpression(initializer)) {
        const callee = unwrapExpression(initializer.expression);
        if (!ts.isIdentifier(callee) || callee.text !== "defineTracks") {
          errors.push("TRACKS array wrapper must be the identity helper defineTracks");
          return null;
        }
        if (initializer.arguments.length !== 1) {
          errors.push("defineTracks must receive exactly one array literal");
          return null;
        }
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

function isGeneratedPointArrayIife(node) {
  const value = unwrapExpression(node);
  if (!ts.isCallExpression(value) || value.arguments.length !== 0) return false;
  const callable = unwrapExpression(value.expression);
  if (
    (!ts.isArrowFunction(callable) && !ts.isFunctionExpression(callable))
    || callable.parameters.length !== 0
    || !ts.isBlock(callable.body)
  ) {
    return false;
  }

  const localArrays = new Set();
  const pushedArrays = new Set();
  const returnedArrays = new Set();
  const visit = (current) => {
    if (ts.isVariableDeclaration(current) && ts.isIdentifier(current.name)) {
      const initializer = current.initializer && unwrapExpression(current.initializer);
      if (initializer && ts.isArrayLiteralExpression(initializer)) {
        localArrays.add(current.name.text);
      }
    }
    if (
      ts.isCallExpression(current)
      && ts.isPropertyAccessExpression(current.expression)
      && current.expression.name.text === "push"
      && ts.isIdentifier(current.expression.expression)
    ) {
      pushedArrays.add(current.expression.expression.text);
    }
    if (ts.isReturnStatement(current) && current.expression) {
      const returned = unwrapExpression(current.expression);
      if (ts.isIdentifier(returned)) returnedArrays.add(returned.text);
      if (ts.isArrayLiteralExpression(returned)) {
        returnedArrays.add(`__direct_array_${returned.elements.length}`);
      }
    }
    ts.forEachChild(current, visit);
  };
  visit(callable.body);

  const minimum = EXPECTED_FIELD_CONTRACTS.points.minimum_literal_items;
  if ([...returnedArrays].some((name) => name.startsWith("__direct_array_")
    && Number(name.slice("__direct_array_".length)) >= minimum)) {
    return true;
  }
  return [...returnedArrays].some(
    (name) => localArrays.has(name) && pushedArrays.has(name),
  );
}

function validatePoints(node, context, contract, errors) {
  if (
    node
    && ts.isArrayLiteralExpression(node)
    && node.elements.length >= contract.minimum_literal_items
  ) {
    return;
  }
  if (node && isGeneratedPointArrayIife(node)) return;
  errors.push(
    `${context}.points must be an array literal with at least ${contract.minimum_literal_items} entries or a zero-argument array-builder IIFE`,
  );
}

function canonicalAst(node) {
  const record = { kind: ts.SyntaxKind[node.kind] };
  if (
    ts.isIdentifier(node)
    || ts.isStringLiteral(node)
    || ts.isNumericLiteral(node)
    || ts.isNoSubstitutionTemplateLiteral(node)
    || ts.isBigIntLiteral(node)
    || ts.isRegularExpressionLiteral(node)
  ) {
    record.text = node.text;
  }
  const children = [];
  ts.forEachChild(node, (child) => children.push(canonicalAst(child)));
  if (children.length) record.children = children;
  return record;
}

function astSha(node) {
  return sha256(JSON.stringify(canonicalAst(node)));
}

function buildTopLevelDefinitions(file) {
  const definitions = new Map();
  const runtimeImports = new Map();

  for (const statement of file.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      definitions.set(statement.name.text, statement);
      continue;
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name)
          && declaration.name.text !== "TRACKS"
          && declaration.initializer
        ) {
          definitions.set(declaration.name.text, declaration);
        }
      }
      continue;
    }
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
      continue;
    }
    const clause = statement.importClause;
    if (!clause || clause.isTypeOnly) continue;
    const moduleName = statement.moduleSpecifier.text;
    if (clause.name) {
      runtimeImports.set(clause.name.text, {
        moduleName,
        importedName: "default",
      });
    }
    const bindings = clause.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const element of bindings.elements) {
        if (element.isTypeOnly) continue;
        runtimeImports.set(element.name.text, {
          moduleName,
          importedName: element.propertyName?.text ?? element.name.text,
        });
      }
    }
    if (bindings && ts.isNamespaceImport(bindings)) {
      runtimeImports.set(bindings.name.text, {
        moduleName,
        importedName: "*",
      });
    }
  }

  return { definitions, runtimeImports };
}

function identifierNames(node) {
  const names = new Set();
  const visit = (current) => {
    if (ts.isIdentifier(current)) names.add(current.text);
    ts.forEachChild(current, visit);
  };
  visit(node);
  return names;
}

function definitionClosure(node, fileAuthority, supportSources) {
  const definitionNames = new Set();
  const importEntries = new Map();
  const pending = [...identifierNames(node)];

  while (pending.length) {
    const name = pending.pop();
    if (fileAuthority.definitions.has(name) && !definitionNames.has(name)) {
      definitionNames.add(name);
      for (const nested of identifierNames(fileAuthority.definitions.get(name))) {
        if (!definitionNames.has(nested)) pending.push(nested);
      }
    }
    const imported = fileAuthority.runtimeImports.get(name);
    if (imported) {
      const source = supportSources?.[imported.moduleName];
      importEntries.set(name, {
        key: `import:${imported.moduleName}:${imported.importedName}:${name}`,
        source_sha256: typeof source === "string" ? sha256(source) : null,
      });
    }
  }

  const local = [...definitionNames]
    .sort()
    .map((name) => ({
      key: `local:${name}`,
      ast_sha256: astSha(fileAuthority.definitions.get(name)),
    }));
  const imported = [...importEntries.values()].sort((left, right) =>
    left.key.localeCompare(right.key),
  );
  return [...local, ...imported];
}

function validateTrackObject(node, index, schema, fileAuthority, supportSources, errors) {
  const context = `track[${index}]`;
  const props = objectProperties(node, context, errors);
  const required = schema.type_contract.required_properties;
  const optional = schema.type_contract.optional_properties;
  const allowed = new Set([...required, ...optional]);
  const fields = schema.field_contracts;

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

  for (const key of fields.localized_strings.properties) {
    const value = stringValue(props.get(key));
    if (value === null || (fields.localized_strings.non_empty && value.trim() === "")) {
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
  const widthContract = fields.width;
  if (
    width === null
    || !Number.isFinite(width)
    || width <= widthContract.exclusive_minimum
    || width > widthContract.maximum
  ) {
    errors.push(
      `${context}.width must be a finite number literal in (${widthContract.exclusive_minimum}, ${widthContract.maximum}]`,
    );
  }
  const seed = numberValue(props.get("seed"));
  if (seed === null || !Number.isInteger(seed) || seed <= 0) {
    errors.push(`${context}.seed must be a positive integer literal`);
  }
  const checkpoints = numberValue(props.get("checkpointCount"));
  const checkpointContract = fields.checkpointCount;
  if (
    checkpoints === null
    || !Number.isInteger(checkpoints)
    || checkpoints < checkpointContract.minimum
    || checkpoints > checkpointContract.maximum
  ) {
    errors.push(
      `${context}.checkpointCount must be an integer in [${checkpointContract.minimum}, ${checkpointContract.maximum}]`,
    );
  }
  for (const key of ["ground", "sand"]) {
    const value = numberValue(props.get(key));
    if (value === null || !Number.isFinite(value)) {
      errors.push(`${context}.${key} must be a finite number expression`);
    }
  }

  validatePoints(props.get("points"), context, fields.points, errors);

  const elevation = props.get("elevation");
  if (
    !elevation
    || !ts.isArrowFunction(elevation)
    || elevation.parameters.length > fields.elevation.maximum_parameters
  ) {
    errors.push(
      `${context}.elevation must be an arrow function with at most ${fields.elevation.maximum_parameters} parameter`,
    );
  }
  const sky = props.get("sky");
  if (!sky || !ts.isObjectLiteralExpression(sky)) {
    errors.push(`${context}.sky must be an object literal`);
  }

  const streets = props.get("streets");
  if (
    !streets
    || !ts.isArrayLiteralExpression(streets)
    || streets.elements.length < fields.streets.minimum_items
  ) {
    errors.push(
      `${context}.streets must be an array literal with at least ${fields.streets.minimum_items} item`,
    );
  } else {
    let previousFrom = -Infinity;
    streets.elements.forEach((element, streetIndex) => {
      const streetContext = `${context}.streets[${streetIndex}]`;
      const street = validateStructuredObject(
        unwrapExpression(element),
        fields.streets.required_item_properties,
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
  if (
    !pois
    || !ts.isArrayLiteralExpression(pois)
    || pois.elements.length < fields.pois.minimum_items
  ) {
    errors.push(`${context}.pois must be an array literal`);
  } else {
    pois.elements.forEach((element, poiIndex) => {
      const poiContext = `${context}.pois[${poiIndex}]`;
      const poi = validateStructuredObject(
        unwrapExpression(element),
        fields.pois.required_item_properties,
        poiContext,
        errors,
        { allowSpread: fields.pois.spread_coordinates_allowed },
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
      fields.water.required_properties,
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
          fields.waters.required_item_properties,
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
          fields.clearZones.required_item_properties,
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
    object_ast_sha256: astSha(node),
    referenced_runtime_definitions: definitionClosure(node, fileAuthority, supportSources),
  };
}

export function validateTrackSchema({
  schema,
  classification,
  typeSource,
  trackSource,
  supportSources = {},
}) {
  const errors = [];
  if (!schema || typeof schema !== "object") return ["track schema is not an object"];
  if (schema.schema_version !== "1.0.2") errors.push("schema version must be 1.0.2");
  if (schema.document_type !== "rush-canonical-track-schema") {
    errors.push("document type must be rush-canonical-track-schema");
  }
  if (schema.repository !== "talstilkol/rush-israel" || schema.canonical_branch !== "main") {
    errors.push("schema repository authority is incorrect");
  }
  if (schema.observed_source_commit !== EXPECTED_RSH_012_MERGE) {
    errors.push("schema source commit must match the accepted RSH-012 merge");
  }
  if (!sameJson(schema.field_contracts, EXPECTED_FIELD_CONTRACTS)) {
    errors.push("declared field contracts must exactly match the enforced RSH-013 authority");
  }

  const typeFile = parseTypeScript("src/game/types.ts", typeSource, errors);
  const trackFile = parseTypeScript("src/game/tracks.ts", trackSource, errors);
  const trackIds = extractStringUnion(typeFile, "TrackId", errors);
  const cityIds = extractStringUnion(typeFile, "CityId", errors);
  const typeContract = extractTrackDefContract(typeFile, errors);
  const array = findTrackArray(trackFile, errors);
  const fileAuthority = buildTopLevelDefinitions(trackFile);

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
      summaries.push(
        validateTrackObject(value, index, schema, fileAuthority, supportSources, errors),
      );
    });
  }

  const definitionIds = summaries.map((entry) => entry.id);
  if (definitionIds.some((id) => id === null) || new Set(definitionIds).size !== definitionIds.length) {
    errors.push("track definition IDs must be non-null and unique");
  }
  if (!sameUniqueSet(definitionIds, trackIds)) {
    errors.push("TRACKS definitions must contain the same unique IDs as TrackId");
  }
  if (!sameUniqueSet(definitionIds, catalogueIds)) {
    errors.push("TRACKS definitions must contain the same unique IDs as the classification catalogue");
  }

  const integrity = schema.runtime_definition_integrity;
  const expectedBasis =
    "ordered array of TrackId, canonical TypeScript AST hash of each track object, and recursive hashes of referenced top-level runtime definitions plus imported runtime support sources";
  if (
    integrity?.algorithm !== "sha256"
    || integrity?.basis !== expectedBasis
    || integrity?.source_order_is_runtime_order !== true
    || integrity?.canonical_track_id_order_is_independent !== true
    || !sameJson(integrity?.support_sources, ["src/game/math.ts"])
  ) {
    errors.push("runtime-definition integrity contract is incomplete");
  }
  if (
    fileAuthority.runtimeImports.has("clamp")
    && typeof supportSources["./math"] !== "string"
  ) {
    errors.push("runtime support source ./math must be supplied for digest closure");
  }

  const invariants = schema.semantic_invariants;
  for (const key of [
    "track_ids_unique",
    "track_definition_set_matches_track_id_union",
    "track_definition_set_matches_catalogue_entries",
    "runtime_definition_order_preserved_by_RSH_014",
    "canonical_track_id_order_independent_from_runtime_definition_order",
    "referenced_runtime_helpers_are_hashed",
    "image_path_matches_track_id",
    "all_tracks_classified_exactly_once",
    "mvp_set_exactly_frozen",
    "deferred_tracks_retained",
    "streets_use_normalized_progress",
    "street_ranges_must_be_ordered",
    "source_must_parse_without_diagnostics",
  ]) {
    if (invariants?.[key] !== true) errors.push(`semantic invariant ${key} must remain true`);
  }
  if (invariants?.release_gates_green !== 0 || invariants?.release_gates_total !== 13) {
    errors.push("release-gate truth must remain 0/13");
  }
  if (
    schema.change_control?.schema_changes_require_owner_authorization !== true
    || schema.change_control?.track_id_addition_or_removal_requires_owner_authorization !== true
    || schema.change_control?.mvp_mapping_changes_require_owner_authorization !== true
    || schema.change_control?.["RSH-014_may_relocate_definitions_without_changing_runtime_data"] !== true
    || schema.change_control?.["RSH-015_authorized"] !== false
  ) {
    errors.push("track-schema change control is incomplete or over-authorized");
  }
  if (
    Object.hasOwn(schema.change_control ?? {}, "RSH_014_may_relocate_definitions_without_changing_runtime_data")
    || Object.hasOwn(schema.change_control ?? {}, "RSH_015_authorized")
  ) {
    errors.push("canonical change-control keys must use hyphenated RSH IDs");
  }

  const digest = sha256(JSON.stringify(summaries));
  if (integrity?.expected_digest === null) {
    if (integrity.capture_state !== "pending_exact_ci_capture") {
      errors.push("unpinned runtime digest must remain in pending exact-CI capture state");
    }
  } else if (
    !/^[0-9a-f]{64}$/.test(integrity?.expected_digest ?? "")
    || integrity.capture_state !== "pinned"
    || integrity.expected_digest !== digest
  ) {
    errors.push("runtime definition digest differs from the pinned RSH-013 baseline");
  }

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
  const mathSource = readFileSync(fromRoot("src", "game", "math.ts"), "utf8");
  const result = validateTrackSchema({
    schema,
    classification,
    typeSource,
    trackSource,
    supportSources: { "./math": mathSource },
  });
  if (result.errors.length) {
    console.error("track-schema fail\n" + result.errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(
    `track-schema ok: 56 definitions; digest ${result.digest}; helper closure pinned; 8 MVP; 48 deferred; 0/13 gates`,
  );
}
