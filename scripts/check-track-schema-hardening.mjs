#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { fromRoot } from "./project-root.mjs";

const EXPECTED_COUNTS = Object.freeze({ total: 56, mvp: 8, deferred: 48 });
const EXPECTED_SUPPORT_SOURCES = Object.freeze([
  Object.freeze({ module: "./math", path: "src/game/math.ts" }),
]);
const EXPECTED_AGGREGATE_BASIS =
  "aggregate of expected_digest and configured support-source Git blob identities";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function gitBlobSha1(source) {
  const body = Buffer.from(String(source), "utf8");
  return createHash("sha1")
    .update(Buffer.from(`blob ${body.length}\0`, "utf8"))
    .update(body)
    .digest("hex");
}

function sameJson(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function parseTypeScript(fileName, source, errors) {
  const file = ts.createSourceFile(
    fileName,
    String(source ?? ""),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  for (const diagnostic of file.parseDiagnostics) {
    const line = diagnostic.start === undefined
      ? "unknown"
      : file.getLineAndCharacterOfPosition(diagnostic.start).line + 1;
    errors.push(
      `${fileName}:${line} does not parse: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`,
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

function stringValue(node) {
  const value = node && unwrapExpression(node);
  return value && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value))
    ? value.text
    : null;
}

function findTypeAlias(file, name) {
  return file.statements.find(
    (statement) => ts.isTypeAliasDeclaration(statement) && statement.name.text === name,
  );
}

function stringUnionFromTypeNode(node, context, errors) {
  const type = node && ts.isParenthesizedTypeNode(node) ? node.type : node;
  const members = type && ts.isUnionTypeNode(type) ? type.types : type ? [type] : [];
  const values = [];
  for (const member of members) {
    if (!ts.isLiteralTypeNode(member) || !ts.isStringLiteral(member.literal)) {
      errors.push(`${context} must contain string-literal members only`);
      continue;
    }
    values.push(member.literal.text);
  }
  return values;
}

function extractTrackDefContract(file, errors) {
  const alias = findTypeAlias(file, "TrackDef");
  if (!alias || !ts.isTypeLiteralNode(alias.type)) {
    errors.push("TrackDef must remain a type literal");
    return { required: [], optional: [], theme: [] };
  }
  const required = [];
  const optional = [];
  let theme = [];
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
    if (name === "theme") {
      theme = stringUnionFromTypeNode(member.type, "TrackDef.theme", errors);
    }
  }
  if (theme.length === 0) errors.push("TrackDef.theme literal union is missing");
  return { required, optional, theme };
}

function findVariable(file, name) {
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) {
        return declaration;
      }
    }
  }
  return null;
}

function extractStringArray(file, name, errors) {
  const declaration = findVariable(file, name);
  const initializer = declaration?.initializer && unwrapExpression(declaration.initializer);
  if (!initializer || !ts.isArrayLiteralExpression(initializer)) {
    errors.push(`${name} must remain an array literal`);
    return [];
  }
  const values = [];
  for (const element of initializer.elements) {
    const value = stringValue(element);
    if (value === null) errors.push(`${name} may contain string literals only`);
    else values.push(value);
  }
  return values;
}

function validateIdentityHelper(file, errors) {
  const helper = file.statements.find(
    (statement) => ts.isFunctionDeclaration(statement) && statement.name?.text === "defineTracks",
  );
  if (
    !helper
    || helper.parameters.length !== 1
    || !ts.isIdentifier(helper.parameters[0].name)
    || !helper.body
    || helper.body.statements.length !== 1
    || !ts.isReturnStatement(helper.body.statements[0])
  ) {
    errors.push("defineTracks must remain the one-parameter identity helper");
    return;
  }
  const parameter = helper.parameters[0].name.text;
  const returned = helper.body.statements[0].expression
    && unwrapExpression(helper.body.statements[0].expression);
  if (!returned || !ts.isIdentifier(returned) || returned.text !== parameter) {
    errors.push("defineTracks must return its exact input without transformation");
  }
}

function buildFileAuthority(file) {
  const definitions = new Set();
  const imports = new Map();
  for (const statement of file.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      definitions.add(statement.name.text);
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) definitions.add(declaration.name.text);
      }
    }
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
      continue;
    }
    const clause = statement.importClause;
    if (!clause || clause.isTypeOnly) continue;
    const moduleName = statement.moduleSpecifier.text;
    if (clause.name) imports.set(clause.name.text, { moduleName, importedName: "default" });
    if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const element of clause.namedBindings.elements) {
        if (element.isTypeOnly) continue;
        imports.set(element.name.text, {
          moduleName,
          importedName: element.propertyName?.text ?? element.name.text,
        });
      }
    }
  }
  return { definitions, imports };
}

function importedDefineTracksIsIdentity(authority) {
  const binding = authority.imports.get("defineTracks");
  return binding?.moduleName === "./track-schema"
    && binding?.importedName === "defineTracks"
    && !authority.definitions.has("defineTracks");
}

function findTrackArray(file, authority, errors) {
  const declaration = findVariable(file, "TRACKS");
  if (!declaration?.initializer) {
    errors.push("TRACKS declaration or initializer is missing");
    return null;
  }
  const initializer = unwrapExpression(declaration.initializer);
  if (ts.isArrayLiteralExpression(initializer)) return initializer;
  if (!ts.isCallExpression(initializer)) {
    errors.push("TRACKS must be an array literal or imported defineTracks(array literal)");
    return null;
  }
  const callee = unwrapExpression(initializer.expression);
  if (
    !ts.isIdentifier(callee)
    || callee.text !== "defineTracks"
    || !importedDefineTracksIsIdentity(authority)
  ) {
    errors.push("TRACKS wrapper must resolve to imported defineTracks from ./track-schema");
    return null;
  }
  if (initializer.arguments.length !== 1) {
    errors.push("defineTracks must receive exactly one array literal");
    return null;
  }
  const argument = unwrapExpression(initializer.arguments[0]);
  if (!ts.isArrayLiteralExpression(argument)) {
    errors.push("defineTracks must receive exactly one array literal");
    return null;
  }
  return argument;
}

function isFunctionLike(node) {
  return ts.isArrowFunction(node)
    || ts.isFunctionExpression(node)
    || ts.isFunctionDeclaration(node)
    || ts.isMethodDeclaration(node)
    || ts.isGetAccessorDeclaration(node)
    || ts.isSetAccessorDeclaration(node);
}

function isAssignmentOperator(kind) {
  return kind >= ts.SyntaxKind.FirstAssignment && kind <= ts.SyntaxKind.LastAssignment;
}

function isStrictPointBuilderIife(node) {
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

  const statements = callable.body.statements;
  const finalStatement = statements.at(-1);
  if (!finalStatement || !ts.isReturnStatement(finalStatement) || !finalStatement.expression) {
    return false;
  }
  const returned = unwrapExpression(finalStatement.expression);
  if (!ts.isIdentifier(returned)) return false;
  const arrayName = returned.text;

  let declarationCount = 0;
  for (const statement of statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name)
        && declaration.name.text === arrayName
        && declaration.initializer
        && ts.isArrayLiteralExpression(unwrapExpression(declaration.initializer))
      ) {
        declarationCount += 1;
      }
    }
  }
  if (declarationCount !== 1) return false;

  let pushCount = 0;
  let returnCount = 0;
  let nestedFunction = false;
  let reassigned = false;
  const visit = (current) => {
    if (current !== callable && current !== callable.body && isFunctionLike(current)) {
      nestedFunction = true;
      return;
    }
    if (ts.isReturnStatement(current)) returnCount += 1;
    if (
      ts.isBinaryExpression(current)
      && isAssignmentOperator(current.operatorToken.kind)
      && ts.isIdentifier(unwrapExpression(current.left))
      && unwrapExpression(current.left).text === arrayName
    ) {
      reassigned = true;
    }
    if (
      ts.isCallExpression(current)
      && ts.isPropertyAccessExpression(current.expression)
      && current.expression.name.text === "push"
      && ts.isIdentifier(current.expression.expression)
      && current.expression.expression.text === arrayName
    ) {
      pushCount += 1;
    }
    ts.forEachChild(current, visit);
  };
  visit(callable.body);
  return !nestedFunction && !reassigned && returnCount === 1 && pushCount > 0;
}

function validatePointForms(trackArray, errors) {
  if (!trackArray) return;
  trackArray.elements.forEach((element, index) => {
    const track = unwrapExpression(element);
    if (!ts.isObjectLiteralExpression(track)) return;
    const pointsProperty = track.properties.find(
      (property) => ts.isPropertyAssignment(property) && propertyName(property.name) === "points",
    );
    if (!pointsProperty || !ts.isPropertyAssignment(pointsProperty)) return;
    const points = unwrapExpression(pointsProperty.initializer);
    if (ts.isArrayLiteralExpression(points)) {
      if (points.elements.length < 3) {
        errors.push(`track[${index}].points array literal must contain at least 3 entries`);
      }
      return;
    }
    if (!isStrictPointBuilderIife(points)) {
      errors.push(
        `track[${index}].points must use the reviewed same-scope local-array/push/final-return IIFE`,
      );
    }
  });
}

function loadSupportSource(path, supportSources) {
  if (supportSources && Object.hasOwn(supportSources, path)) {
    return supportSources[path];
  }
  return readFileSync(fromRoot(...path.split("/")), "utf8");
}

export function validateTrackSchemaHardening({
  schema,
  classification,
  typeSource,
  trackSource,
  trackSchemaSource,
  supportSources,
  coreResult,
}) {
  const errors = [];
  const typeFile = parseTypeScript("src/game/types.ts", typeSource, errors);
  const trackFile = parseTypeScript("src/game/tracks.ts", trackSource, errors);
  const helperSource = trackSchemaSource
    ?? readFileSync(fromRoot("src", "game", "track-schema.ts"), "utf8");
  const helperFile = parseTypeScript("src/game/track-schema.ts", helperSource, errors);
  const typeContract = extractTrackDefContract(typeFile, errors);

  if (!sameJson(schema?.type_contract?.theme_enum, typeContract.theme)) {
    errors.push("schema theme enum must exactly match the TrackDef.theme literal union");
  }

  const requiredKeys = extractStringArray(helperFile, "TRACK_REQUIRED_PROPERTIES", errors);
  const optionalKeys = extractStringArray(helperFile, "TRACK_OPTIONAL_PROPERTIES", errors);
  if (!sameJson(requiredKeys, typeContract.required)) {
    errors.push("TRACK_REQUIRED_PROPERTIES must exactly equal required TrackDef keys");
  }
  if (!sameJson(optionalKeys, typeContract.optional)) {
    errors.push("TRACK_OPTIONAL_PROPERTIES must exactly equal optional TrackDef keys");
  }
  const combinedKeys = [...requiredKeys, ...optionalKeys];
  if (
    new Set(requiredKeys).size !== requiredKeys.length
    || new Set(optionalKeys).size !== optionalKeys.length
    || new Set(combinedKeys).size !== combinedKeys.length
    || combinedKeys.length !== typeContract.required.length + typeContract.optional.length
  ) {
    errors.push("exported TrackDef key lists must be unique and form an exact partition");
  }
  validateIdentityHelper(helperFile, errors);

  const authority = buildFileAuthority(trackFile);
  const trackArray = findTrackArray(trackFile, authority, errors);
  validatePointForms(trackArray, errors);

  const declaredCounts = {
    total: schema?.catalogue?.expected_track_count,
    mvp: schema?.catalogue?.expected_mvp_count,
    deferred: schema?.catalogue?.expected_deferred_count,
  };
  if (!sameJson(declaredCounts, EXPECTED_COUNTS)) {
    errors.push("schema declared counts must remain exactly 56 total, 8 MVP and 48 deferred");
  }
  const entries = classification?.entries ?? [];
  const actualCounts = {
    total: entries.length,
    mvp: entries.filter((entry) => entry.status === "mvp").length,
    deferred: entries.filter((entry) => entry.status === "deferred").length,
  };
  if (!sameJson(actualCounts, EXPECTED_COUNTS)) {
    errors.push("classification entries must remain exactly 56 total, 8 MVP and 48 deferred");
  }

  const integrity = schema?.runtime_definition_integrity;
  const declaredSupport = integrity?.support_sources;
  if (
    !Array.isArray(declaredSupport)
    || declaredSupport.length !== EXPECTED_SUPPORT_SOURCES.length
    || integrity?.aggregate_basis !== EXPECTED_AGGREGATE_BASIS
    || integrity?.capture_state !== "pinned"
  ) {
    errors.push("configured support-source integrity contract is incomplete");
  }

  const supportSourceIdentities = [];
  if (Array.isArray(declaredSupport)) {
    for (let index = 0; index < declaredSupport.length; index += 1) {
      const declaration = declaredSupport[index];
      const expected = EXPECTED_SUPPORT_SOURCES[index];
      if (!expected || declaration?.module !== expected.module || declaration?.path !== expected.path) {
        errors.push(`support source ${index} must remain ${expected?.module ?? "absent"} / ${expected?.path ?? "absent"}`);
        continue;
      }
      let source;
      try {
        source = loadSupportSource(declaration.path, supportSources);
      } catch (error) {
        errors.push(`support source ${declaration.path} is unreadable: ${error instanceof Error ? error.message : String(error)}`);
        continue;
      }
      const computed = gitBlobSha1(source);
      if (declaration.git_blob_sha1 !== computed) {
        errors.push(`support source ${declaration.path} Git blob identity differs from the pinned value`);
      }
      supportSourceIdentities.push({
        module: declaration.module,
        path: declaration.path,
        git_blob_sha1: computed,
      });
    }
  }

  const trackDigest = coreResult?.digest ?? "";
  const aggregateDigest = sha256(JSON.stringify({
    track_definition_digest: trackDigest,
    support_sources: supportSourceIdentities,
  }));
  if (
    !/^[0-9a-f]{64}$/.test(integrity?.expected_aggregate_digest ?? "")
    || integrity.expected_aggregate_digest !== aggregateDigest
  ) {
    errors.push("aggregate runtime definition digest differs from the pinned RSH-013 baseline");
  }
  if (schema?.semantic_invariants?.configured_support_sources_are_hashed !== true) {
    errors.push("semantic invariant configured_support_sources_are_hashed must remain true");
  }

  return { errors, aggregateDigest, supportSourceIdentities };
}
