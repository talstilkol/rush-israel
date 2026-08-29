import ts from "typescript";

function bindsLocalName(importDeclaration, localName) {
  const clause = importDeclaration.importClause;
  if (!clause) return false;
  if (clause.name?.text === localName) return true;
  const bindings = clause.namedBindings;
  if (bindings && ts.isNamespaceImport(bindings)) return bindings.name.text === localName;
  if (bindings && ts.isNamedImports(bindings)) {
    return bindings.elements.some((element) => element.name.text === localName);
  }
  return false;
}

function isCanonicalTrackDefImport(statement) {
  if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
    return false;
  }
  const clause = statement.importClause;
  const bindings = clause?.namedBindings;
  if (
    statement.moduleSpecifier.text !== "./types"
    || !clause?.isTypeOnly
    || clause.name
    || !bindings
    || !ts.isNamedImports(bindings)
    || bindings.elements.length !== 1
  ) {
    return false;
  }
  const element = bindings.elements[0];
  return element.name.text === "TrackDef"
    && (element.propertyName?.text ?? "TrackDef") === "TrackDef"
    && !element.isTypeOnly;
}

function declarationName(statement) {
  if (
    ts.isTypeAliasDeclaration(statement)
    || ts.isInterfaceDeclaration(statement)
    || ts.isClassDeclaration(statement)
    || ts.isEnumDeclaration(statement)
    || ts.isFunctionDeclaration(statement)
    || ts.isModuleDeclaration(statement)
  ) {
    return statement.name && ts.isIdentifier(statement.name) ? statement.name.text : null;
  }
  return null;
}

export function validateTrackDefImportAuthority(trackSchemaSource) {
  const errors = [];
  const file = ts.createSourceFile(
    "src/game/track-schema.ts",
    String(trackSchemaSource ?? ""),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  for (const diagnostic of file.parseDiagnostics) {
    const line = diagnostic.start === undefined
      ? "unknown"
      : file.getLineAndCharacterOfPosition(diagnostic.start).line + 1;
    errors.push(
      `src/game/track-schema.ts:${line} does not parse: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`,
    );
  }

  const trackDefImports = file.statements.filter(
    (statement) => ts.isImportDeclaration(statement) && bindsLocalName(statement, "TrackDef"),
  );
  const canonicalImports = trackDefImports.filter(isCanonicalTrackDefImport);
  if (canonicalImports.length !== 1 || trackDefImports.length !== 1) {
    errors.push(
      "TrackDef must remain exactly one type-only named import from ./types with its canonical name",
    );
  }

  for (const statement of file.statements) {
    if (declarationName(statement) === "TrackDef") {
      errors.push("track-schema.ts must not declare or shadow the canonical TrackDef import");
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.name.text === "TrackDef") {
          errors.push("track-schema.ts must not declare a value named TrackDef");
        }
      }
    }
  }

  return errors;
}
