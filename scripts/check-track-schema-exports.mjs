import ts from "typescript";

const REQUIRED_EXPORTS = Object.freeze([
  "TRACK_REQUIRED_PROPERTIES",
  "TRACK_OPTIONAL_PROPERTIES",
]);

function hasExportModifier(statement) {
  return Boolean(
    statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
  );
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

  for (const name of REQUIRED_EXPORTS) {
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

  return errors;
}
