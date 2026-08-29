import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { extname, join, posix, relative, sep } from "node:path";
import ts from "typescript";
import { fromRoot, projectRoot } from "./project-root.mjs";

const ACCEPTED_TRACK_CONSUMERS = Object.freeze({
  "src/components/game-app.tsx": "956cfa131200b3c9d9d0902a1b2d6d4d9a8d8728",
  "src/game/daily.ts": "f4bdd7c7d3fb7e18f22797dd8ae6d7beff4b5e6c",
  "src/game/engine.ts": "692663c6d05ab59c1d99c7a357999839b9ebb0ec",
  "src/game/world.ts": "07b7e0b559e66f89641357db5aa2be8bcd8c3135",
});

const SOURCE_EXTENSIONS = new Set([
  ".cjs",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
]);

function gitBlobSha1(source) {
  const body = Buffer.from(String(source ?? ""), "utf8");
  return createHash("sha1")
    .update(Buffer.from(`blob ${body.length}\0`, "utf8"))
    .update(body)
    .digest("hex");
}

function normalizeResolvedModulePath(modulePath) {
  return modulePath.replace(/\.(?:[cm]?[jt]sx?)$/u, "");
}

function normalizedModulePath(filePath, moduleName) {
  if (moduleName.startsWith("@/")) {
    return normalizeResolvedModulePath(`src/${moduleName.slice(2)}`);
  }
  if (!moduleName.startsWith(".")) return null;
  const resolved = posix.normalize(posix.join(posix.dirname(filePath), moduleName));
  return normalizeResolvedModulePath(resolved);
}

function resolvesToTrackModule(filePath, moduleName) {
  const resolved = normalizedModulePath(filePath, moduleName);
  if (resolved === "src/game/tracks/index") {
    // The canonical facade is independently pinned by TRACK-MODULE-MANIFEST.json.
    // Other direct imports of the modular index remain protected consumers.
    return filePath !== "src/game/tracks.ts";
  }
  return resolved === "src/game/tracks";
}

function hasRuntimeBindings(clause) {
  if (!clause || clause.isTypeOnly) return false;
  if (clause.name) return true;
  const bindings = clause.namedBindings;
  if (bindings && ts.isNamespaceImport(bindings)) return true;
  if (bindings && ts.isNamedImports(bindings)) {
    return bindings.elements.some((element) => !element.isTypeOnly);
  }
  return false;
}

function stringLiteralValue(node) {
  return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    ? node.text
    : null;
}

function scriptKindFor(filePath) {
  if (filePath.endsWith(".tsx")) return ts.ScriptKind.TSX;
  if (filePath.endsWith(".jsx")) return ts.ScriptKind.JSX;
  if (filePath.endsWith(".js") || filePath.endsWith(".mjs") || filePath.endsWith(".cjs")) {
    return ts.ScriptKind.JS;
  }
  return ts.ScriptKind.TS;
}

function importsTrackRuntime(filePath, source) {
  const file = ts.createSourceFile(
    filePath,
    String(source ?? ""),
    ts.ScriptTarget.Latest,
    true,
    scriptKindFor(filePath),
  );
  let found = false;
  const visit = (node) => {
    if (found) return;

    if (ts.isImportDeclaration(node)) {
      const moduleName = stringLiteralValue(node.moduleSpecifier);
      if (
        moduleName
        && resolvesToTrackModule(filePath, moduleName)
        && hasRuntimeBindings(node.importClause)
      ) {
        found = true;
        return;
      }
    }

    if (ts.isExportDeclaration(node) && node.moduleSpecifier && !node.isTypeOnly) {
      const moduleName = stringLiteralValue(node.moduleSpecifier);
      const clause = node.exportClause;
      const hasRuntimeExport = !clause
        || !ts.isNamedExports(clause)
        || clause.elements.some((element) => !element.isTypeOnly);
      if (
        moduleName
        && resolvesToTrackModule(filePath, moduleName)
        && hasRuntimeExport
      ) {
        found = true;
        return;
      }
    }

    if (
      ts.isImportEqualsDeclaration(node)
      && !node.isTypeOnly
      && ts.isExternalModuleReference(node.moduleReference)
    ) {
      const moduleName = stringLiteralValue(node.moduleReference.expression);
      if (moduleName && resolvesToTrackModule(filePath, moduleName)) {
        found = true;
        return;
      }
    }

    if (ts.isCallExpression(node) && node.arguments.length > 0) {
      const moduleName = stringLiteralValue(node.arguments[0]);
      const dynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      const commonJsRequire = ts.isIdentifier(node.expression)
        && node.expression.text === "require";
      if (
        moduleName
        && (dynamicImport || commonJsRequire)
        && resolvesToTrackModule(filePath, moduleName)
      ) {
        found = true;
        return;
      }
    }

    ts.forEachChild(node, visit);
  };
  visit(file);
  return found;
}

function readRepositorySources() {
  const sources = {};
  const sourceRoot = fromRoot("src");

  const walk = (directory) => {
    const entries = readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }
      if (!entry.isFile() || !SOURCE_EXTENSIONS.has(extname(entry.name))) continue;
      const repoPath = relative(projectRoot, absolutePath).split(sep).join("/");
      sources[repoPath] = readFileSync(absolutePath, "utf8");
    }
  };

  walk(sourceRoot);
  return sources;
}

export function validateTrackConsumerSourcePin({ consumerSources } = {}) {
  const errors = [];
  const sources = consumerSources ?? readRepositorySources();
  if (!sources || typeof sources !== "object" || Array.isArray(sources)) {
    return {
      errors: ["track consumer source map must be an object"],
      consumers: [],
      identities: [],
    };
  }

  const expectedPaths = Object.keys(ACCEPTED_TRACK_CONSUMERS).sort();
  const consumers = Object.entries(sources)
    .filter(([filePath, source]) => importsTrackRuntime(filePath, source))
    .map(([filePath]) => filePath)
    .sort();

  if (JSON.stringify(consumers) !== JSON.stringify(expectedPaths)) {
    errors.push(
      "runtime track consumer set differs from the accepted RSH-013 baseline"
      + `; expected ${JSON.stringify(expectedPaths)}; actual ${JSON.stringify(consumers)}`,
    );
  }

  const identities = [];
  for (const filePath of expectedPaths) {
    const source = sources[filePath];
    if (typeof source !== "string") {
      errors.push(`accepted runtime track consumer ${filePath} is missing`);
      continue;
    }
    const actualGitBlobSha1 = gitBlobSha1(source);
    const expectedGitBlobSha1 = ACCEPTED_TRACK_CONSUMERS[filePath];
    if (actualGitBlobSha1 !== expectedGitBlobSha1) {
      errors.push(
        `${filePath} Git blob identity ${actualGitBlobSha1}`
        + ` differs from accepted RSH-013 baseline ${expectedGitBlobSha1}`,
      );
    }
    identities.push({
      path: filePath,
      git_blob_sha1: actualGitBlobSha1,
    });
  }

  return { errors, consumers, identities };
}
