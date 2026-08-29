import ts from "typescript";

const REQUIRED_ARRAY_AUTHORITIES = Object.freeze([
  "TRACK_REQUIRED_PROPERTIES",
  "TRACK_OPTIONAL_PROPERTIES",
]);
const IDENTITY_HELPER_CONTRACTS = Object.freeze({
  defineTrack: Object.freeze({ constraint: "TrackDef" }),
  defineTracks: Object.freeze({ constraint: "readonly TrackDef[]" }),
});

function hasModifier(node, kind) {
  return Boolean(node.modifiers?.some((modifier) => modifier.kind === kind));
}

function hasExportModifier(statement) {
  return hasModifier(statement, ts.SyntaxKind.ExportKeyword);
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

function unwrapTypeNode(node) {
  let current = node;
  while (current && ts.isParenthesizedTypeNode(current)) current = current.type;
  return current;
}

function isNamedTypeReference(node, name) {
  const type = unwrapTypeNode(node);
  return Boolean(
    type
    && ts.isTypeReferenceNode(type)
    && ts.isIdentifier(type.typeName)
    && type.typeName.text === name
    && (!type.typeArguments || type.typeArguments.length === 0),
  );
}

function constraintMatches(node, expected) {
  const constraint = unwrapTypeNode(node);
  if (expected === "TrackDef") return isNamedTypeReference(constraint, "TrackDef");
  if (expected !== "readonly TrackDef[]") return false;
  if (
    !constraint
    || !ts.isTypeOperatorNode(constraint)
    || constraint.operator !== ts.SyntaxKind.ReadonlyKeyword
  ) {
    return false;
  }
  const array = unwrapTypeNode(constraint.type);
  return Boolean(
    array
    && ts.isArrayTypeNode(array)
    && isNamedTypeReference(array.elementType, "TrackDef"),
  );
}

function validateGenericContract(helper, name, contract, errors) {
  const typeParameters = helper.typeParameters ?? [];
  if (typeParameters.length !== 1) {
    errors.push(`${name} must declare exactly one const generic parameter`);
    return;
  }
  const typeParameter = typeParameters[0];
  if (!hasModifier(typeParameter, ts.SyntaxKind.ConstKeyword)) {
    errors.push(`${name} generic parameter must remain const`);
  }
  if (typeParameter.default) {
    errors.push(`${name} generic parameter must not declare a default`);
  }
  if (!constraintMatches(typeParameter.constraint, contract.constraint)) {
    errors.push(`${name} generic constraint must remain ${contract.constraint}`);
  }

  const genericName = typeParameter.name.text;
  const parameter = helper.parameters[0];
  if (
    !parameter
    || parameter.questionToken
    || parameter.dotDotDotToken
    || parameter.initializer
    || !isNamedTypeReference(parameter.type, genericName)
    || !isNamedTypeReference(helper.type, genericName)
  ) {
    errors.push(`${name} parameter and return types must both remain the exact generic parameter`);
  }
}

function validateIdentityHelper(file, name, contract, errors) {
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
  validateGenericContract(helper, name, contract, errors);

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

  for (const [name, contract] of Object.entries(IDENTITY_HELPER_CONTRACTS)) {
    validateIdentityHelper(file, name, contract, errors);
  }

  return errors;
}
