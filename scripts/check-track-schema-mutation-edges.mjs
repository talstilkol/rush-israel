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

function addSymbol(identifier, tainted, checker) {
  const symbol = checker.getSymbolAtLocation(identifier);
  if (!symbol || tainted.has(symbol)) return false;
  tainted.add(symbol);
  return true;
}

function addBindingSymbols(name, tainted, checker) {
  if (ts.isIdentifier(name)) return addSymbol(name, tainted, checker);
  let changed = false;
  if (ts.isArrayBindingPattern(name) || ts.isObjectBindingPattern(name)) {
    for (const element of name.elements) {
      if (ts.isBindingElement(element)) {
        changed = addBindingSymbols(element.name, tainted, checker) || changed;
      }
    }
  }
  return changed;
}

function addAssignmentSymbols(node, tainted, checker) {
  const value = unwrapExpression(node);
  if (ts.isIdentifier(value)) return addSymbol(value, tainted, checker);
  let changed = false;
  if (ts.isArrayLiteralExpression(value)) {
    for (const element of value.elements) {
      if (ts.isOmittedExpression(element)) continue;
      changed = addAssignmentSymbols(
        ts.isSpreadElement(element) ? element.expression : element,
        tainted,
        checker,
      ) || changed;
    }
  } else if (ts.isObjectLiteralExpression(value)) {
    for (const property of value.properties) {
      if (ts.isSpreadAssignment(property)) {
        changed = addAssignmentSymbols(property.expression, tainted, checker) || changed;
      } else if (ts.isPropertyAssignment(property)) {
        changed = addAssignmentSymbols(property.initializer, tainted, checker) || changed;
      } else if (ts.isShorthandPropertyAssignment(property)) {
        changed = addAssignmentSymbols(property.name, tainted, checker) || changed;
      }
    }
  } else if (
    ts.isBinaryExpression(value)
    && value.operatorToken.kind === ts.SyntaxKind.EqualsToken
  ) {
    changed = addAssignmentSymbols(value.left, tainted, checker) || changed;
  }
  return changed;
}

function expressionIsTainted(node, tainted, checker) {
  if (!node) return false;
  const value = unwrapExpression(node);
  if (ts.isIdentifier(value)) {
    const symbol = checker.getSymbolAtLocation(value);
    return Boolean(symbol && tainted.has(symbol));
  }
  if (ts.isPropertyAccessExpression(value) || ts.isElementAccessExpression(value)) {
    return expressionIsTainted(value.expression, tainted, checker);
  }
  if (ts.isCallExpression(value) || ts.isNewExpression(value)) {
    const callee = unwrapExpression(value.expression);
    const receiver = (
      ts.isPropertyAccessExpression(callee) || ts.isElementAccessExpression(callee)
    ) ? callee.expression : null;
    return expressionIsTainted(receiver, tainted, checker)
      || (value.arguments ?? []).some(
        (argument) => expressionIsTainted(argument, tainted, checker),
      );
  }
  if (ts.isConditionalExpression(value)) {
    return expressionIsTainted(value.whenTrue, tainted, checker)
      || expressionIsTainted(value.whenFalse, tainted, checker);
  }
  if (ts.isBinaryExpression(value)) {
    if (value.operatorToken.kind === ts.SyntaxKind.CommaToken) {
      return expressionIsTainted(value.right, tainted, checker);
    }
    return expressionIsTainted(value.left, tainted, checker)
      || expressionIsTainted(value.right, tainted, checker);
  }
  if (ts.isAwaitExpression(value) || ts.isYieldExpression(value) || ts.isSpreadElement(value)) {
    return expressionIsTainted(value.expression, tainted, checker);
  }
  if (ts.isArrayLiteralExpression(value)) {
    return value.elements.some((element) => expressionIsTainted(element, tainted, checker));
  }
  if (ts.isObjectLiteralExpression(value)) {
    return value.properties.some((property) => {
      if (ts.isSpreadAssignment(property)) {
        return expressionIsTainted(property.expression, tainted, checker);
      }
      if (ts.isPropertyAssignment(property)) {
        return expressionIsTainted(property.initializer, tainted, checker);
      }
      if (ts.isShorthandPropertyAssignment(property)) {
        return expressionIsTainted(property.name, tainted, checker);
      }
      return false;
    });
  }
  return false;
}

function isDestructuringTarget(node) {
  const value = unwrapExpression(node);
  return ts.isArrayLiteralExpression(value) || ts.isObjectLiteralExpression(value);
}

function isRetainingPropertyTarget(node) {
  const value = unwrapExpression(node);
  return ts.isPropertyAccessExpression(value) || ts.isElementAccessExpression(value);
}

function locationOf(sourceFile, node) {
  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return `${position.line + 1}:${position.character + 1}`;
}

export function validateTrackMutationEdges(trackSource) {
  const errors = [];
  const { sourceFile, checker } = createProgram(trackSource);
  const declarations = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === "TRACKS") {
        declarations.push(declaration);
      }
    }
  }
  if (declarations.length !== 1) return errors;
  const tracksSymbol = checker.getSymbolAtLocation(declarations[0].name);
  if (!tracksSymbol) return errors;

  const tainted = new Set([tracksSymbol]);
  let changed = true;
  while (changed) {
    changed = false;
    const collect = (node) => {
      if (
        ts.isVariableDeclaration(node)
        && node.initializer
        && expressionIsTainted(node.initializer, tainted, checker)
      ) {
        changed = addBindingSymbols(node.name, tainted, checker) || changed;
      }
      if (
        ts.isBinaryExpression(node)
        && node.operatorToken.kind === ts.SyntaxKind.EqualsToken
        && expressionIsTainted(node.right, tainted, checker)
      ) {
        changed = addAssignmentSymbols(node.left, tainted, checker) || changed;
      }
      ts.forEachChild(node, collect);
    };
    collect(sourceFile);
  }

  const seen = new Set();
  const report = (node, detail) => {
    const key = `${node.pos}:${node.end}:${detail}`;
    if (seen.has(key)) return;
    seen.add(key);
    errors.push(
      `src/game/tracks.ts:${locationOf(sourceFile, node)} TRACKS mutation edge rejected (${detail})`,
    );
  };
  const inspect = (node) => {
    if (
      ts.isBinaryExpression(node)
      && node.operatorToken.kind === ts.SyntaxKind.EqualsToken
      && expressionIsTainted(node.right, tainted, checker)
      && isDestructuringTarget(node.left)
    ) {
      report(node, "destructuring assignment retains a protected track reference");
    }
    if (
      ts.isBinaryExpression(node)
      && node.operatorToken.kind === ts.SyntaxKind.EqualsToken
      && expressionIsTainted(node.right, tainted, checker)
      && isRetainingPropertyTarget(node.left)
    ) {
      report(node, "property assignment retains a protected track reference");
    }
    if (
      ts.isNewExpression(node)
      && (node.arguments ?? []).some(
        (argument) => expressionIsTainted(argument, tainted, checker),
      )
    ) {
      report(node, "constructor receives a protected track reference");
    }
    ts.forEachChild(node, inspect);
  };
  inspect(sourceFile);
  return errors;
}
