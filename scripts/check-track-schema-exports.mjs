import ts from "typescript";

const REQUIRED_ARRAY_AUTHORITIES = Object.freeze([
  "TRACK_REQUIRED_PROPERTIES",
  "TRACK_OPTIONAL_PROPERTIES",
]);
const REQUIRED_IDENTITY_HELPERS = Object.freeze([
  "defineTrack",
  "defineTracks",
]);

function hasExportModifier(statement) {
  return Boolean(
    statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
  );
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

function validateIdentityHelper(file, name, errors) {
  const helpers = file.statements.filter(
    (statement) => ts.isFunctionDeclaration(statement) && statement.name?.text === name,
  );
  if (helpers.length !== 1) {
    errors.push(`${name} export authority must be exactly one function declaration`);
    return;
  }
  const helper = helpers[0];
  if (!hasExportModifier(helper)) {
    errors.push(`${name} must remain exported`);
  }
  if (
    helper.parameters.length !== 1
    || !ts.isIdentifier(helper.parameters[0].name)
    || !helper.body
    || helper.body.statements.length !== 1
    || !ts.isReturnStatement(helper.body.statements[0])
  ) {
    errors.push(`${name} must remain the one-parameter identity helper`);
    return;
  }
  const parameter = helper.parameters[0].name.text;
  const returned = helper.body.statements[0].expression
    && unwrapExpression(helper.body.statements[0].expression);
  if (!returned || !ts.isIdentifier(returned) || returned.text !== parameter) {
    errors.push(`${name} must return its exact input without transformation`);
  }
}

export function validateTrackSchemaExports(trackSchemaSource) {
  const errors = [];
  const file = ts.createSourceFile(
    "src/game/track-schema.ts",
    String(trackSchemaSource ?? ""),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  for (const name of REQUIRED_ARRAY_AUTHORITIES) {
    let authority = null;
    for (const statement of file.statements) {
      if (!ts.isVariableStatement(statement)) continue;
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.name.text === name) {
          authority = { statement, declarationList: statement.declarationList };
        }
      }
    }
    if (!authority) {
      errors.push(`${name} export authority is missing`);
      continue;
    }
    if (!hasExportModifier(authority.statement)) {
      errors.push(`${name} must remain exported`);
    }
    if (!(authority.declarationList.flags & ts.NodeFlags.Const)) {
      errors.push(`${name} must remain a const authority`);
    }
  }

  for (const name of REQUIRED_IDENTITY_HELPERS) {
    validateIdentityHelper(file, name, errors);
  }

  return errors;
}
