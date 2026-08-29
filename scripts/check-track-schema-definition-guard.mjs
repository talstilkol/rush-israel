import ts from "typescript";

function unwrapExpression(node) {
  let current = node;
  while (
    current
    && (ts.isAsExpression(current)
      || ts.isSatisfiesExpression(current)
      || ts.isParenthesizedExpression(current)
      || ts.isNonNullExpression(current)
      || ts.isPartiallyEmittedExpression(current))
  ) {
    current = current.expression;
  }
  return current;
}

function createProgram(sourceText) {
  const fileName = "/src/game/tracks.ts";
  const sourceFile = ts.createSourceFile(
    fileName,
    String(sourceText ?? ""),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const options = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    noLib: true,
    noResolve: true,
    skipLibCheck: true,
  };
  const host = {
    fileExists: (name) => name === fileName,
    readFile: (name) => (name === fileName ? sourceFile.text : undefined),
    getSourceFile: (name) => (name === fileName ? sourceFile : undefined),
    getDefaultLibFileName: () => "lib.d.ts",
    writeFile: () => {},
    getCurrentDirectory: () => "/",
    getDirectories: () => [],
    getCanonicalFileName: (name) => name,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => "\n",
  };
  const program = ts.createProgram([fileName], options, host);
  return {
    sourceFile: program.getSourceFile(fileName) ?? sourceFile,
    checker: program.getTypeChecker(),
  };
}

function isTopLevelRuntimeDefinition(statement, declaration) {
  if (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) return true;
  return ts.isVariableStatement(statement)
    && ts.isVariableDeclaration(declaration)
    && Boolean(declaration.initializer);
}

function collectTopLevelDefinitions(sourceFile, checker) {
  const bySymbol = new Map();
  for (const statement of sourceFile.statements) {
    if (
      (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement))
      && statement.name
      && isTopLevelRuntimeDefinition(statement, statement)
    ) {
      const symbol = checker.getSymbolAtLocation(statement.name);
      if (symbol) {
        const entry = { name: statement.name.text, symbol, node: statement, nameNode: statement.name };
        bySymbol.set(symbol, entry);
      }
      continue;
    }
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        !ts.isIdentifier(declaration.name)
        || declaration.name.text === "TRACKS"
        || !isTopLevelRuntimeDefinition(statement, declaration)
      ) {
        continue;
      }
      const symbol = checker.getSymbolAtLocation(declaration.name);
      if (symbol) {
        const entry = {
          name: declaration.name.text,
          symbol,
          node: declaration,
          nameNode: declaration.name,
        };
        bySymbol.set(symbol, entry);
      }
    }
  }
  return { bySymbol };
}

function findTracksDeclaration(sourceFile, checker, errors) {
  const matches = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === "TRACKS") {
        matches.push({ statement, declaration });
      }
    }
  }
  if (matches.length !== 1 || !matches[0].declaration.initializer) {
    errors.push("TRACKS referenced-definition guard requires exactly one initialized top-level declaration");
    return null;
  }
  const symbol = checker.getSymbolAtLocation(matches[0].declaration.name);
  if (!symbol) {
    errors.push("TRACKS referenced-definition guard could not resolve the TRACKS symbol");
    return null;
  }
  return {
    ...matches[0],
    symbol,
    initializer: unwrapExpression(matches[0].declaration.initializer),
  };
}

function symbolsReferencedWithin(node, checker, definitions) {
  const result = new Set();
  const visit = (current) => {
    if (ts.isIdentifier(current)) {
      const symbol = checker.getSymbolAtLocation(current);
      if (symbol && definitions.bySymbol.has(symbol)) result.add(symbol);
    }
    ts.forEachChild(current, visit);
  };
  visit(node);
  return result;
}

function collectProtectedDefinitions(tracksInitializer, checker, definitions) {
  const protectedSymbols = new Set();
  const pending = [...symbolsReferencedWithin(tracksInitializer, checker, definitions)];
  while (pending.length) {
    const symbol = pending.pop();
    if (protectedSymbols.has(symbol)) continue;
    protectedSymbols.add(symbol);
    const definition = definitions.bySymbol.get(symbol);
    if (!definition) continue;
    for (const nested of symbolsReferencedWithin(definition.node, checker, definitions)) {
      if (!protectedSymbols.has(nested)) pending.push(nested);
    }
  }
  return protectedSymbols;
}

function isInside(node, ancestor) {
  return node.pos >= ancestor.pos && node.end <= ancestor.end;
}

function locationOf(sourceFile, node) {
  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return `${position.line + 1}:${position.character + 1}`;
}

export function analyzeTrackDefinitionClosure(trackSource) {
  const errors = [];
  const { sourceFile, checker } = createProgram(trackSource);
  for (const diagnostic of sourceFile.parseDiagnostics) {
    const line = diagnostic.start === undefined
      ? "unknown"
      : sourceFile.getLineAndCharacterOfPosition(diagnostic.start).line + 1;
    errors.push(
      `src/game/tracks.ts:${line} does not parse: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`,
    );
  }

  const tracks = findTracksDeclaration(sourceFile, checker, errors);
  if (!tracks) return { errors, protectedDefinitions: [] };
  const definitions = collectTopLevelDefinitions(sourceFile, checker);
  const protectedSymbols = collectProtectedDefinitions(tracks.initializer, checker, definitions);
  const protectedNodes = [...protectedSymbols]
    .map((symbol) => definitions.bySymbol.get(symbol)?.node)
    .filter(Boolean);
  const protectedDefinitions = [...protectedSymbols]
    .map((symbol) => definitions.bySymbol.get(symbol)?.name)
    .filter(Boolean)
    .sort();

  const seen = new Set();
  const visit = (node) => {
    if (ts.isIdentifier(node)) {
      const symbol = checker.getSymbolAtLocation(node);
      if (symbol && protectedSymbols.has(symbol)) {
        const definition = definitions.bySymbol.get(symbol);
        const isDeclarationName = node === definition?.nameNode;
        const isHashedDefinitionUse = protectedNodes.some(
          (definitionNode) => isInside(node, definitionNode),
        );
        const isTrackInitializerUse = isInside(node, tracks.initializer);
        if (!isDeclarationName && !isHashedDefinitionUse && !isTrackInitializerUse) {
          const key = `${node.pos}:${node.end}:${definition?.name ?? node.text}`;
          if (!seen.has(key)) {
            seen.add(key);
            errors.push(
              `src/game/tracks.ts:${locationOf(sourceFile, node)} referenced runtime definition ${definition?.name ?? node.text} is used outside its hashed declaration closure and TRACKS initializer`,
            );
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return { errors, protectedDefinitions };
}

export function validateTrackDefinitionClosure(trackSource) {
  return analyzeTrackDefinitionClosure(trackSource).errors;
}
