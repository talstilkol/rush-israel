import ts from "typescript";

const MUTATING_METHODS = new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift",
]);

const ARRAY_CALLBACK_METHODS = new Set([
  "every",
  "filter",
  "find",
  "findIndex",
  "findLast",
  "findLastIndex",
  "flatMap",
  "forEach",
  "map",
  "some",
]);

const REDUCE_METHODS = new Set(["reduce", "reduceRight"]);
const SAFE_PROTECTED_ARGUMENT_CALLS = new Set([
  "JSON.stringify",
  "Object.isFrozen",
  "Object.isSealed",
  "Object.isExtensible",
  "structuredClone",
]);

const OBJECT_MUTATORS = new Set([
  "Object.assign",
  "Object.defineProperties",
  "Object.defineProperty",
  "Object.freeze",
  "Object.preventExtensions",
  "Object.seal",
  "Reflect.defineProperty",
  "Reflect.deleteProperty",
  "Reflect.set",
  "Reflect.setPrototypeOf",
]);

function unwrapExpression(node) {
  let current = node;
  while (
    current
    && (ts.isAsExpression(current)
      || ts.isTypeAssertionExpression(current)
      || ts.isSatisfiesExpression(current)
      || ts.isParenthesizedExpression(current)
      || ts.isNonNullExpression(current)
      || ts.isPartiallyEmittedExpression(current))
  ) {
    current = current.expression;
  }
  return current;
}

function propertyName(node) {
  if (ts.isPropertyAccessExpression(node)) return node.name.text;
  if (ts.isElementAccessExpression(node)) {
    const argument = node.argumentExpression && unwrapExpression(node.argumentExpression);
    return argument && (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument))
      ? argument.text
      : null;
  }
  return null;
}

function dottedName(node) {
  const value = unwrapExpression(node);
  if (ts.isIdentifier(value)) return value.text;
  if (ts.isPropertyAccessExpression(value)) {
    const left = dottedName(value.expression);
    return left ? `${left}.${value.name.text}` : null;
  }
  return null;
}

function isAssignmentOperator(kind) {
  return kind >= ts.SyntaxKind.FirstAssignment && kind <= ts.SyntaxKind.LastAssignment;
}

function isIncrementOrDecrement(kind) {
  return kind === ts.SyntaxKind.PlusPlusToken || kind === ts.SyntaxKind.MinusMinusToken;
}

function createInMemoryProgram(sourceText) {
  const fileName = "/src/game/tracks.ts";
  const options = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    noLib: true,
    noResolve: true,
    skipLibCheck: true,
  };
  const sourceFile = ts.createSourceFile(
    fileName,
    String(sourceText ?? ""),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
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

function symbolsFromBindingName(name, checker) {
  const symbols = [];
  const visit = (current) => {
    if (ts.isIdentifier(current)) {
      const symbol = checker.getSymbolAtLocation(current);
      if (symbol) symbols.push(symbol);
      return;
    }
    if (ts.isObjectBindingPattern(current) || ts.isArrayBindingPattern(current)) {
      for (const element of current.elements) {
        if (ts.isBindingElement(element)) visit(element.name);
      }
    }
  };
  visit(name);
  return symbols;
}

function functionLikeFromExpression(node) {
  const value = node && unwrapExpression(node);
  return value && (ts.isArrowFunction(value) || ts.isFunctionExpression(value)) ? value : null;
}

function symbolForCallable(value, checker) {
  if (ts.isIdentifier(value)) return checker.getSymbolAtLocation(value);
  if (ts.isPropertyAccessExpression(value)) return checker.getSymbolAtLocation(value.name);
  if (ts.isElementAccessExpression(value) && value.argumentExpression) {
    return checker.getSymbolAtLocation(value.argumentExpression)
      ?? checker.getSymbolAtLocation(value);
  }
  return checker.getSymbolAtLocation(value);
}

function functionLikeDeclarations(node, checker) {
  const value = unwrapExpression(node);
  const inline = functionLikeFromExpression(value);
  if (inline) return [inline];
  const symbol = symbolForCallable(value, checker);
  if (!symbol) return [];
  const declarations = [];
  for (const declaration of symbol.declarations ?? []) {
    if (
      (ts.isFunctionDeclaration(declaration)
        || ts.isMethodDeclaration(declaration)
        || ts.isGetAccessorDeclaration(declaration)
        || ts.isSetAccessorDeclaration(declaration))
      && declaration.body
    ) {
      declarations.push(declaration);
    }
    if (ts.isVariableDeclaration(declaration) || ts.isPropertyAssignment(declaration)) {
      const initializer = declaration.initializer && functionLikeFromExpression(declaration.initializer);
      if (initializer) declarations.push(initializer);
    }
  }
  return [...new Set(declarations)];
}

function addParameterSymbols(callable, indexes, tainted, checker) {
  let changed = false;
  for (const index of indexes) {
    const parameter = callable.parameters[index];
    if (!parameter) continue;
    for (const symbol of symbolsFromBindingName(parameter.name, checker)) {
      if (!tainted.has(symbol)) {
        tainted.add(symbol);
        changed = true;
      }
    }
  }
  return changed;
}

function addBindingSymbols(name, tainted, checker) {
  let changed = false;
  for (const symbol of symbolsFromBindingName(name, checker)) {
    if (!tainted.has(symbol)) {
      tainted.add(symbol);
      changed = true;
    }
  }
  return changed;
}

function templateSubstitutions(node) {
  if (!ts.isTaggedTemplateExpression(node)) return [];
  return ts.isTemplateExpression(node.template)
    ? node.template.templateSpans.map((span) => span.expression)
    : [];
}

function callableReturnsTainted(callable, tainted, checker, resolvingCallables) {
  if (resolvingCallables.has(callable)) return false;
  resolvingCallables.add(callable);
  try {
    if (ts.isArrowFunction(callable) && !ts.isBlock(callable.body)) {
      return expressionIsTainted(callable.body, tainted, checker, resolvingCallables);
    }
    if (!callable.body || !ts.isBlock(callable.body)) return false;
    let found = false;
    const visit = (current) => {
      if (found) return;
      if (
        current !== callable
        && (ts.isFunctionDeclaration(current)
          || ts.isFunctionExpression(current)
          || ts.isArrowFunction(current)
          || ts.isMethodDeclaration(current)
          || ts.isGetAccessorDeclaration(current)
          || ts.isSetAccessorDeclaration(current))
      ) {
        return;
      }
      if (ts.isReturnStatement(current) && current.expression) {
        if (expressionIsTainted(current.expression, tainted, checker, resolvingCallables)) {
          found = true;
        }
        return;
      }
      ts.forEachChild(current, visit);
    };
    visit(callable.body);
    return found;
  } finally {
    resolvingCallables.delete(callable);
  }
}

function expressionIsTainted(node, tainted, checker, resolvingCallables = new Set()) {
  if (!node) return false;
  const value = unwrapExpression(node);
  if (ts.isIdentifier(value)) {
    const symbol = checker.getSymbolAtLocation(value);
    return Boolean(symbol && tainted.has(symbol));
  }
  if (ts.isPropertyAccessExpression(value) || ts.isElementAccessExpression(value)) {
    if (expressionIsTainted(value.expression, tainted, checker, resolvingCallables)) return true;
    return functionLikeDeclarations(value, checker).some(
      (callable) => callableReturnsTainted(callable, tainted, checker, resolvingCallables),
    );
  }
  if (ts.isCallExpression(value) || ts.isNewExpression(value)) {
    const callee = value.expression && unwrapExpression(value.expression);
    const receiver = callee
      && (ts.isPropertyAccessExpression(callee) || ts.isElementAccessExpression(callee))
      ? callee.expression
      : null;
    if (expressionIsTainted(receiver, tainted, checker, resolvingCallables)) return true;
    if ((value.arguments ?? []).some(
      (argument) => expressionIsTainted(argument, tainted, checker, resolvingCallables),
    )) {
      return true;
    }
    if (ts.isCallExpression(value)) {
      return functionLikeDeclarations(callee, checker).some(
        (callable) => callableReturnsTainted(callable, tainted, checker, resolvingCallables),
      );
    }
    return false;
  }
  if (ts.isTaggedTemplateExpression(value)) {
    if (templateSubstitutions(value).some(
      (expression) => expressionIsTainted(expression, tainted, checker, resolvingCallables),
    )) {
      return true;
    }
    return functionLikeDeclarations(value.tag, checker).some(
      (callable) => callableReturnsTainted(callable, tainted, checker, resolvingCallables),
    );
  }
  if (ts.isConditionalExpression(value)) {
    return expressionIsTainted(value.whenTrue, tainted, checker, resolvingCallables)
      || expressionIsTainted(value.whenFalse, tainted, checker, resolvingCallables);
  }
  if (ts.isBinaryExpression(value)) {
    if (value.operatorToken.kind === ts.SyntaxKind.CommaToken) {
      return expressionIsTainted(value.right, tainted, checker, resolvingCallables);
    }
    if (isAssignmentOperator(value.operatorToken.kind)) {
      return expressionIsTainted(value.right, tainted, checker, resolvingCallables);
    }
    return expressionIsTainted(value.left, tainted, checker, resolvingCallables)
      || expressionIsTainted(value.right, tainted, checker, resolvingCallables);
  }
  if (ts.isAwaitExpression(value) || ts.isYieldExpression(value) || ts.isSpreadElement(value)) {
    return expressionIsTainted(value.expression, tainted, checker, resolvingCallables);
  }
  if (ts.isArrayLiteralExpression(value)) {
    return value.elements.some(
      (element) => expressionIsTainted(element, tainted, checker, resolvingCallables),
    );
  }
  if (ts.isObjectLiteralExpression(value)) {
    return value.properties.some((property) => {
      if (ts.isSpreadAssignment(property)) {
        return expressionIsTainted(property.expression, tainted, checker, resolvingCallables);
      }
      if (ts.isPropertyAssignment(property)) {
        return expressionIsTainted(property.initializer, tainted, checker, resolvingCallables);
      }
      if (ts.isShorthandPropertyAssignment(property)) {
        return expressionIsTainted(property.name, tainted, checker, resolvingCallables);
      }
      if (ts.isMethodDeclaration(property) || ts.isGetAccessorDeclaration(property)) {
        return callableReturnsTainted(property, tainted, checker, resolvingCallables);
      }
      return false;
    });
  }
  return false;
}

function collectTaintedAliases(sourceFile, tracksSymbol, checker) {
  const tainted = new Set([tracksSymbol]);
  let changed = true;
  while (changed) {
    changed = false;
    const visit = (node) => {
      if (
        ts.isVariableDeclaration(node)
        && node.initializer
        && expressionIsTainted(node.initializer, tainted, checker)
      ) {
        changed = addBindingSymbols(node.name, tainted, checker) || changed;
      }
      if (
        (ts.isBindingElement(node) || ts.isParameter(node))
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
        const left = unwrapExpression(node.left);
        if (ts.isIdentifier(left)) {
          const symbol = checker.getSymbolAtLocation(left);
          if (symbol && !tainted.has(symbol)) {
            tainted.add(symbol);
            changed = true;
          }
        }
      }
      if (ts.isForOfStatement(node) && expressionIsTainted(node.expression, tainted, checker)) {
        if (ts.isVariableDeclarationList(node.initializer)) {
          for (const declaration of node.initializer.declarations) {
            changed = addBindingSymbols(declaration.name, tainted, checker) || changed;
          }
        } else if (ts.isIdentifier(node.initializer)) {
          const symbol = checker.getSymbolAtLocation(node.initializer);
          if (symbol && !tainted.has(symbol)) {
            tainted.add(symbol);
            changed = true;
          }
        }
      }
      if (ts.isCallExpression(node)) {
        const callee = unwrapExpression(node.expression);
        const receiver = (
          ts.isPropertyAccessExpression(callee) || ts.isElementAccessExpression(callee)
        ) ? callee.expression : null;
        const method = (
          ts.isPropertyAccessExpression(callee) || ts.isElementAccessExpression(callee)
        ) ? propertyName(callee) : null;
        if (receiver && expressionIsTainted(receiver, tainted, checker)) {
          if (method && ARRAY_CALLBACK_METHODS.has(method)) {
            for (const callback of functionLikeDeclarations(node.arguments[0], checker)) {
              changed = addParameterSymbols(callback, [0, 2], tainted, checker) || changed;
            }
          }
          if (method && REDUCE_METHODS.has(method)) {
            for (const callback of functionLikeDeclarations(node.arguments[0], checker)) {
              changed = addParameterSymbols(callback, [0, 1, 3], tainted, checker) || changed;
            }
          }
        }
        for (const callable of functionLikeDeclarations(callee, checker)) {
          node.arguments.forEach((argument, index) => {
            if (expressionIsTainted(argument, tainted, checker)) {
              changed = addParameterSymbols(callable, [index], tainted, checker) || changed;
            }
          });
        }
      }
      if (ts.isTaggedTemplateExpression(node)) {
        const substitutions = templateSubstitutions(node);
        const protectedParameterIndexes = [];
        substitutions.forEach((expression, index) => {
          if (expressionIsTainted(expression, tainted, checker)) {
            protectedParameterIndexes.push(index + 1);
          }
        });
        if (protectedParameterIndexes.length) {
          for (const callable of functionLikeDeclarations(node.tag, checker)) {
            changed = addParameterSymbols(
              callable,
              protectedParameterIndexes,
              tainted,
              checker,
            ) || changed;
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }
  return tainted;
}

function mutationTargetIsTainted(node, tainted, checker) {
  const value = unwrapExpression(node);
  if (ts.isIdentifier(value)) return expressionIsTainted(value, tainted, checker);
  if (ts.isPropertyAccessExpression(value) || ts.isElementAccessExpression(value)) {
    return expressionIsTainted(value.expression, tainted, checker);
  }
  return expressionIsTainted(value, tainted, checker);
}

function locationOf(sourceFile, node) {
  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return `${position.line + 1}:${position.character + 1}`;
}

export function validateTrackMutationGuard(trackSource) {
  const errors = [];
  const { sourceFile, checker } = createInMemoryProgram(trackSource);
  for (const diagnostic of sourceFile.parseDiagnostics) {
    const line = diagnostic.start === undefined
      ? "unknown"
      : sourceFile.getLineAndCharacterOfPosition(diagnostic.start).line + 1;
    errors.push(
      `src/game/tracks.ts:${line} does not parse: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`,
    );
  }

  const declarations = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === "TRACKS") {
        declarations.push({ statement, declaration });
      }
    }
  }
  if (declarations.length !== 1) {
    errors.push("TRACKS runtime authority must be exactly one top-level declaration");
    return errors;
  }
  const [{ statement, declaration }] = declarations;
  if (!(statement.declarationList.flags & ts.NodeFlags.Const)) {
    errors.push("TRACKS runtime authority must remain a const declaration");
  }
  const tracksSymbol = checker.getSymbolAtLocation(declaration.name);
  if (!tracksSymbol) {
    errors.push("TRACKS runtime authority symbol could not be resolved");
    return errors;
  }

  const tainted = collectTaintedAliases(sourceFile, tracksSymbol, checker);
  const seen = new Set();
  const report = (node, detail) => {
    const key = `${node.pos}:${node.end}:${detail}`;
    if (seen.has(key)) return;
    seen.add(key);
    errors.push(
      `src/game/tracks.ts:${locationOf(sourceFile, node)} TRACKS runtime authority must not be mutated after declaration (${detail})`,
    );
  };

  const visit = (node) => {
    if (
      ts.isBinaryExpression(node)
      && isAssignmentOperator(node.operatorToken.kind)
      && mutationTargetIsTainted(node.left, tainted, checker)
    ) {
      report(node, "assignment to TRACKS or a retained nested reference");
    }
    if (
      (ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node))
      && isIncrementOrDecrement(node.operator)
      && mutationTargetIsTainted(node.operand, tainted, checker)
    ) {
      report(node, "increment or decrement of a retained value");
    }
    if (ts.isDeleteExpression(node) && mutationTargetIsTainted(node.expression, tainted, checker)) {
      report(node, "delete of a retained value");
    }
    if (ts.isCallExpression(node)) {
      const callee = unwrapExpression(node.expression);
      const receiver = (
        ts.isPropertyAccessExpression(callee) || ts.isElementAccessExpression(callee)
      ) ? callee.expression : null;
      const method = (
        ts.isPropertyAccessExpression(callee) || ts.isElementAccessExpression(callee)
      ) ? propertyName(callee) : null;
      const protectedReceiver = Boolean(
        receiver && expressionIsTainted(receiver, tainted, checker),
      );
      if (protectedReceiver && method && MUTATING_METHODS.has(method)) {
        report(node, `mutating method ${method}`);
      }
      if (
        protectedReceiver
        && method
        && (ARRAY_CALLBACK_METHODS.has(method) || REDUCE_METHODS.has(method))
        && node.arguments[0]
        && functionLikeDeclarations(node.arguments[0], checker).length === 0
      ) {
        report(node, `unreviewed callback passed to protected method ${method}`);
      }

      const callName = dottedName(callee);
      if (
        callName
        && OBJECT_MUTATORS.has(callName)
        && node.arguments[0]
        && expressionIsTainted(node.arguments[0], tainted, checker)
      ) {
        report(node, `mutator ${callName}`);
      }

      if (
        method === "call"
        && ts.isPropertyAccessExpression(unwrapExpression(receiver))
        && MUTATING_METHODS.has(unwrapExpression(receiver).name.text)
        && node.arguments[0]
        && expressionIsTainted(node.arguments[0], tainted, checker)
      ) {
        report(node, `borrowed mutating method ${unwrapExpression(receiver).name.text}`);
      }

      const protectedArgument = node.arguments.some(
        (argument) => expressionIsTainted(argument, tainted, checker),
      );
      if (protectedArgument) {
        const analyzable = functionLikeDeclarations(callee, checker).length > 0;
        const safeCall = Boolean(callName && SAFE_PROTECTED_ARGUMENT_CALLS.has(callName));
        if (!analyzable && !safeCall && !OBJECT_MUTATORS.has(callName ?? "")) {
          report(node, `protected value passed to unreviewed call ${callName ?? "<expression>"}`);
        }
      }
    }
    if (
      ts.isTaggedTemplateExpression(node)
      && templateSubstitutions(node).some(
        (expression) => expressionIsTainted(expression, tainted, checker),
      )
    ) {
      report(node, `protected value passed through tagged template ${dottedName(node.tag) ?? "<expression>"}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return errors;
}
