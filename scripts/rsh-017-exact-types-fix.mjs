#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";
import ts from "typescript";

const read = (path) => readFileSync(path, "utf8");
const write = (path, source) => writeFileSync(path, source);
const sha256 = (source) => createHash("sha256").update(source).digest("hex");
const gitBlobSha1 = (source) => {
  const body = Buffer.from(source, "utf8");
  return createHash("sha1")
    .update(Buffer.from(`blob ${body.length}\0`, "utf8"))
    .update(body)
    .digest("hex");
};
const lineCount = (source) => (source.match(/\n/g) ?? []).length;
const identity = (source) => ({
  lines: lineCount(source),
  bytes: Buffer.byteLength(source),
  sha256: sha256(source),
  git_blob_sha1: gitBlobSha1(source),
});
const replaceOnce = (source, before, after, label) => {
  const pieces = source.split(before);
  if (pieces.length !== 2) throw new Error(`${label} must occur exactly once`);
  return pieces[0] + after + pieces[1];
};
const extractBody = (source, method) => {
  const begin = `// RSH-017-BODY-BEGIN:${method}\n`;
  const end = `\n// RSH-017-BODY-END:${method}`;
  const start = source.indexOf(begin);
  const finish = source.indexOf(end, start + begin.length);
  if (
    start < 0
    || finish < 0
    || source.indexOf(begin, start + begin.length) >= 0
    || source.indexOf(end, finish + end.length) >= 0
  ) throw new Error(`${method} body markers are missing or duplicated`);
  return source.slice(start + begin.length, finish);
};
const format = (value) => Number(value).toLocaleString("en-US");

const manifestPath = "ENGINE-ADAPTER-MANIFEST.json";
const oldManifestSource = read(manifestPath);
const oldManifestHash = sha256(oldManifestSource);
const manifest = JSON.parse(oldManifestSource);
const enginePath = manifest.extraction.engine.path;
const supportPath = manifest.extraction.support.path;
const oldEngineMeta = structuredClone(manifest.extraction.engine);
const oldSupportMeta = structuredClone(manifest.extraction.support);
const oldAdapterMeta = new Map(
  manifest.extraction.adapters.map((adapter) => [adapter.path, structuredClone(adapter)]),
);

let engineSource = read(enginePath);
const adapterSources = Object.fromEntries(
  manifest.extraction.adapters.map((adapter) => [adapter.path, read(adapter.path)]),
);

let acceptedEngine = replaceOnce(
  engineSource,
  manifest.reconstruction.adapter_import_block,
  "",
  "existing adapter import block",
);
for (const method of manifest.reconstruction.methods) {
  const body = extractBody(adapterSources[method.path], method.name);
  acceptedEngine = replaceOnce(
    acceptedEngine,
    method.wrapper_source,
    method.original_prefix + body + method.original_suffix,
    `${method.name} existing facade wrapper`,
  );
}
if (sha256(acceptedEngine) !== manifest.reconstruction.expected_sha256) {
  throw new Error("accepted RSH-016 engine reconstruction drifted before type repair");
}

const sourceFile = ts.createSourceFile(
  "accepted-engine.ts",
  acceptedEngine,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);
const raceClass = sourceFile.statements.find(
  (statement) => ts.isClassDeclaration(statement) && statement.name?.text === "RaceEngine",
);
if (!raceClass) throw new Error("RaceEngine class not found in accepted source");
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const printNode = (node) => printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
const nameOf = (node) => {
  const name = node?.name;
  if (name && (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name))) {
    return name.text;
  }
  return null;
};
const hasModifier = (node, kind) => node.modifiers?.some((modifier) => modifier.kind === kind) ?? false;
const classMembers = new Map();
const readonlyMembers = new Set();
const callableMembers = new Map();
for (const member of raceClass.members) {
  const name = nameOf(member);
  if (name) {
    classMembers.set(name, member);
    if (hasModifier(member, ts.SyntaxKind.ReadonlyKeyword)) readonlyMembers.add(name);
  }
  if (name && ts.isMethodDeclaration(member)) {
    callableMembers.set(name, {
      parameters: member.parameters,
      async: hasModifier(member, ts.SyntaxKind.AsyncKeyword),
      generator: Boolean(member.asteriskToken),
      typeParameters: member.typeParameters ?? [],
    });
  } else if (
    name
    && ts.isPropertyDeclaration(member)
    && member.initializer
    && (ts.isArrowFunction(member.initializer) || ts.isFunctionExpression(member.initializer))
  ) {
    callableMembers.set(name, {
      parameters: member.initializer.parameters,
      async: hasModifier(member.initializer, ts.SyntaxKind.AsyncKeyword),
      generator: Boolean(member.initializer.asteriskToken),
      typeParameters: member.initializer.typeParameters ?? [],
    });
  }
  if (ts.isConstructorDeclaration(member)) {
    for (const parameter of member.parameters) {
      const parameterName = ts.isIdentifier(parameter.name) ? parameter.name.text : null;
      const isParameterProperty = parameter.modifiers?.some((modifier) => [
        ts.SyntaxKind.PublicKeyword,
        ts.SyntaxKind.PrivateKeyword,
        ts.SyntaxKind.ProtectedKeyword,
        ts.SyntaxKind.ReadonlyKeyword,
      ].includes(modifier.kind));
      if (parameterName && isParameterProperty) {
        classMembers.set(parameterName, parameter);
        if (hasModifier(parameter, ts.SyntaxKind.ReadonlyKeyword)) readonlyMembers.add(parameterName);
      }
    }
  }
}

const signatureFor = (methodName) => {
  const member = callableMembers.get(methodName);
  if (!member) throw new Error(`accepted callable member missing: ${methodName}`);
  if (member.typeParameters.length) throw new Error(`generic adapter method requires explicit review: ${methodName}`);
  if (member.generator) throw new Error(`generator adapter method requires explicit review: ${methodName}`);
  const parameters = member.parameters.map((parameter, index) => {
    if (parameter.dotDotDotToken) throw new Error(`rest adapter parameter requires explicit review: ${methodName}`);
    const parameterName = printNode(parameter.name);
    const optional = parameter.questionToken ? "?" : "";
    const initializer = parameter.initializer ? ` = ${printNode(parameter.initializer)}` : "";
    return `${parameterName}${optional}: Parameters<RaceEngine[${JSON.stringify(methodName)}]>[${index}]${initializer}`;
  });
  return `export ${member.async ? "async " : ""}function ${methodName}(this: EngineAdapterHost${parameters.length ? `, ${parameters.join(", ")}` : ""})`;
};

for (const adapter of manifest.extraction.adapters) {
  let source = adapterSources[adapter.path];
  const hostImport = 'import type { EngineAdapterHost } from "./adapter-host";';
  const engineTypeImport = 'import type { RaceEngine } from "../engine";';
  if (!source.includes(engineTypeImport)) {
    source = replaceOnce(source, hostImport, `${engineTypeImport}\n${hostImport}`, `${adapter.id} RaceEngine type import`);
  }
  for (const methodName of adapter.methods) {
    const signature = signatureFor(methodName);
    const begin = `// RSH-017-BEGIN:${methodName}\n`;
    const bodyBegin = `// RSH-017-BODY-BEGIN:${methodName}\n`;
    const start = source.indexOf(begin);
    const body = source.indexOf(bodyBegin, start + begin.length);
    if (start < 0 || body < 0) throw new Error(`${methodName} adapter signature boundary missing`);
    source = source.slice(0, start + begin.length) + signature + "\n" + source.slice(body);
    const reconstruction = manifest.reconstruction.methods.find((entry) => entry.name === methodName);
    if (!reconstruction) throw new Error(`manifest reconstruction entry missing: ${methodName}`);
    reconstruction.adapter_signature = signature;
  }
  adapterSources[adapter.path] = source;
  write(adapter.path, source);
}

const hostMembers = new Set();
const bareThis = [];
for (const [path, source] of Object.entries(adapterSources)) {
  const adapterFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const visit = (node) => {
    if (ts.isPropertyAccessExpression(node) && node.expression.kind === ts.SyntaxKind.ThisKeyword) {
      hostMembers.add(node.name.text);
    } else if (ts.isElementAccessExpression(node) && node.expression.kind === ts.SyntaxKind.ThisKeyword) {
      const argument = node.argumentExpression;
      if (argument && (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument))) {
        hostMembers.add(argument.text);
      } else {
        bareThis.push(`${path}: dynamic this element access`);
      }
    } else if (node.kind === ts.SyntaxKind.ThisKeyword) {
      const parent = node.parent;
      const owned = (
        (ts.isPropertyAccessExpression(parent) || ts.isElementAccessExpression(parent))
        && parent.expression === node
      );
      if (!owned) bareThis.push(`${path}: bare this usage`);
    }
    ts.forEachChild(node, visit);
  };
  visit(adapterFile);
}
if (bareThis.length) throw new Error(`unsupported adapter this usage:\n${bareThis.join("\n")}`);
const hostKeys = [...hostMembers].sort((left, right) => left.localeCompare(right));
const missingHostKeys = hostKeys.filter((key) => !classMembers.has(key));
if (missingHostKeys.length) throw new Error(`adapter host members absent from RaceEngine: ${missingHostKeys.join(", ")}`);
const supportSource = [
  'import type { RaceEngine } from "../engine";',
  "",
  "// RSH-017 exposes no runtime state here. Each adapter-visible member is",
  "// explicitly bound to the accepted RaceEngine member type; no index",
  "// signature, ambient overload or permissive any boundary is allowed.",
  "export type EngineAdapterHost = {",
  ...hostKeys.map((key) => `  ${readonlyMembers.has(key) ? "readonly " : ""}${key}: RaceEngine[${JSON.stringify(key)}];`),
  "};",
  "",
].join("\n");
write(supportPath, supportSource);

const oldImportBlock = manifest.reconstruction.adapter_import_block;
const bridgeName = "engineAdapterHost";
const bridgeSource = [
  `function ${bridgeName}(engine: RaceEngine): EngineAdapterHost {`,
  "  return engine as unknown as EngineAdapterHost;",
  "}",
].join("\n");
const newImportBlock = [
  'import type { EngineAdapterHost } from "./engine/adapter-host";',
  oldImportBlock.trimEnd(),
  "",
  bridgeSource,
  "",
].join("\n");
engineSource = replaceOnce(engineSource, oldImportBlock, newImportBlock, "adapter import/bridge block");
for (const method of manifest.reconstruction.methods) {
  const oldWrapper = method.wrapper_source;
  const newWrapper = oldWrapper.replace(".call(this", `.call(${bridgeName}(this)`);
  if (newWrapper === oldWrapper) throw new Error(`${method.name} wrapper lacks direct this bridge`);
  engineSource = replaceOnce(engineSource, oldWrapper, newWrapper, `${method.name} typed facade wrapper`);
  method.wrapper_source = newWrapper;
}
manifest.reconstruction.adapter_import_block = newImportBlock;
write(enginePath, engineSource);

const newEngineMeta = { path: enginePath, ...identity(engineSource) };
const newSupportMeta = { path: supportPath, ...identity(supportSource) };
manifest.extraction.engine = newEngineMeta;
manifest.extraction.support = newSupportMeta;
for (const adapter of manifest.extraction.adapters) {
  Object.assign(adapter, identity(adapterSources[adapter.path]));
}
const adapterLines = manifest.extraction.adapters.reduce((sum, adapter) => sum + adapter.lines, 0);
const adapterBytes = manifest.extraction.adapters.reduce((sum, adapter) => sum + adapter.bytes, 0);
const totalLines = newEngineMeta.lines + adapterLines + newSupportMeta.lines;
const totalBytes = newEngineMeta.bytes + adapterBytes + newSupportMeta.bytes;
manifest.typing = {
  strategy: "explicit_private_member_indexed_access",
  race_engine_type_import: "../engine",
  host_member_count: hostKeys.length,
  host_members: hostKeys,
  parameter_strategy: "Parameters<RaceEngine[method]>[index]",
  return_strategy: "inferred_from_preserved_method_body",
  bridge_name: bridgeName,
  bridge_source: bridgeSource,
  permissive_index_signature: false,
  ambient_module_overloads: false,
  support_contains_any: false,
};
write(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const newManifestHash = sha256(read(manifestPath));

const trackedFiles = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean);
const textExtensions = new Set([".json", ".md", ".mjs", ".ts", ".tsx", ".yml", ".yaml"]);
const identityReplacements = new Map([
  [oldEngineMeta.sha256, newEngineMeta.sha256],
  [oldEngineMeta.git_blob_sha1, newEngineMeta.git_blob_sha1],
  [oldSupportMeta.sha256, newSupportMeta.sha256],
  [oldSupportMeta.git_blob_sha1, newSupportMeta.git_blob_sha1],
  [oldManifestHash, newManifestHash],
]);
for (const adapter of manifest.extraction.adapters) {
  const old = oldAdapterMeta.get(adapter.path);
  identityReplacements.set(old.sha256, adapter.sha256);
  identityReplacements.set(old.git_blob_sha1, adapter.git_blob_sha1);
}
for (const path of trackedFiles) {
  if (!textExtensions.has(extname(path))) continue;
  let source;
  try {
    source = read(path);
  } catch {
    continue;
  }
  let updated = source;
  for (const [before, after] of identityReplacements) updated = updated.split(before).join(after);
  if (updated !== source) write(path, updated);
}

const preflightPath = "RSH-017-ENGINE-ADAPTER-PREFLIGHT.json";
const preflight = JSON.parse(read(preflightPath));
preflight.extraction.engine = structuredClone(newEngineMeta);
preflight.extraction.adapter_lines = adapterLines;
preflight.extraction.adapter_bytes = adapterBytes;
preflight.extraction.support = structuredClone(newSupportMeta);
preflight.extraction.total_engine_source_lines = totalLines;
preflight.extraction.total_engine_source_bytes = totalBytes;
preflight.extraction.adapters = manifest.extraction.adapters.map((adapter) => structuredClone(adapter));
preflight.typing = structuredClone(manifest.typing);
write(preflightPath, JSON.stringify(preflight, null, 2) + "\n");

const oldAdapterLines = [...oldAdapterMeta.values()].reduce((sum, adapter) => sum + adapter.lines, 0);
const oldAdapterBytes = [...oldAdapterMeta.values()].reduce((sum, adapter) => sum + adapter.bytes, 0);
const metricPairs = [
  [`${format(oldEngineMeta.lines)} lines / ${format(oldEngineMeta.bytes)} bytes`, `${format(newEngineMeta.lines)} lines / ${format(newEngineMeta.bytes)} bytes`],
  [`${format(oldSupportMeta.lines)} lines / ${format(oldSupportMeta.bytes)} bytes`, `${format(newSupportMeta.lines)} lines / ${format(newSupportMeta.bytes)} bytes`],
  [`${format(oldAdapterLines)} lines / ${format(oldAdapterBytes)} bytes`, `${format(adapterLines)} lines / ${format(adapterBytes)} bytes`],
  [`${format(oldEngineMeta.lines + oldAdapterLines + oldSupportMeta.lines)} lines / ${format(oldEngineMeta.bytes + oldAdapterBytes + oldSupportMeta.bytes)} bytes`, `${format(totalLines)} lines / ${format(totalBytes)} bytes`],
];
for (const adapter of manifest.extraction.adapters) {
  const old = oldAdapterMeta.get(adapter.path);
  metricPairs.push([
    `${format(old.lines)} lines / ${format(old.bytes)} bytes`,
    `${format(adapter.lines)} lines / ${format(adapter.bytes)} bytes`,
  ]);
}
for (const path of trackedFiles.filter((path) => path.endsWith(".md"))) {
  let source = read(path);
  for (const [before, after] of metricPairs) source = source.split(before).join(after);
  write(path, source);
}

const contractPath = "RSH-017-ENGINE-ADAPTER-CONTRACT.md";
let contract = read(contractPath);
if (!contract.includes("## Exact Type Boundary")) {
  contract += [
    "",
    "## Exact Type Boundary",
    "",
    `- the host declares exactly **${hostKeys.length}** adapter-visible RaceEngine members;`,
    "- every host member uses its exact `RaceEngine[\"member\"]` type;",
    "- every adapter parameter is bound to `Parameters<RaceEngine[\"method\"]>[index]`;",
    "- adapter return types are inferred from the preserved accepted method bodies;",
    `- every facade wrapper crosses one explicit \`${bridgeName}(this)\` bridge;`,
    "- index signatures, ambient module overloads and `any` are forbidden in the host boundary.",
    "",
  ].join("\n");
  write(contractPath, contract);
}

const checkerPath = "scripts/check-engine-adapters.mjs";
let checker = read(checkerPath);
const supportAnchor = '  if (sha256(input.supportSource) !== manifest.extraction.support.sha256 || gitBlobSha1(input.supportSource) !== manifest.extraction.support.git_blob_sha1) errors.push("engine adapter host changed");\n';
if (!checker.includes("engine adapter host must not contain any")) {
  const typingChecks = supportAnchor + [
    '  if (/\\bany\\b/.test(input.supportSource)) errors.push("engine adapter host must not contain any");',
    '  if (/\\[[^\\]]*:\\s*string\\s*\\]/.test(input.supportSource)) errors.push("engine adapter host must not contain an index signature");',
    '  if (/declare\\s+module/.test(input.supportSource)) errors.push("engine adapter host must not contain ambient module overloads");',
    '  if (!manifest.typing || manifest.typing.permissive_index_signature !== false || manifest.typing.ambient_module_overloads !== false || manifest.typing.support_contains_any !== false) errors.push("engine adapter typing authority is invalid");',
    '  if (manifest.typing && manifest.typing.host_member_count !== manifest.typing.host_members?.length) errors.push("engine adapter host member authority is inconsistent");',
    '  for (const key of manifest.typing?.host_members ?? []) {',
    '    const declaration = `${key}: RaceEngine[${JSON.stringify(key)}];`;',
    '    if (!input.supportSource.includes(declaration)) errors.push(`engine adapter host member type changed: ${key}`);',
    '  }',
    '  if (!input.engineSource.includes(manifest.typing?.bridge_source ?? "__missing_bridge__")) errors.push("engine adapter bridge changed");',
    '  for (const method of manifest.reconstruction.methods) {',
    '    const source = input.adapterSources[method.path] ?? "";',
    '    if (!method.adapter_signature || (source.split(method.adapter_signature).length - 1) !== 1) errors.push(`engine adapter exact signature changed: ${method.name}`);',
    '    if (!method.wrapper_source.includes(`${manifest.typing?.bridge_name}(this)`)) errors.push(`engine facade typed bridge changed: ${method.name}`);',
    '  }',
    "",
  ].join("\n");
  checker = replaceOnce(checker, supportAnchor, typingChecks, "engine typing validator insertion");
}
checker = checker.replace(
  'path === ".github/workflows/rsh-017-source-transfer.yml" || path.startsWith(".rsh017-overlay.part-")',
  'path.startsWith(".github/workflows/rsh-017-") || path.startsWith(".rsh017-overlay.part-")',
);
write(checkerPath, checker);

const testPath = "scripts/check-engine-adapters.test.mjs";
let tests = read(testPath)
  .replace(`assert.equal(result.engineLines, ${oldEngineMeta.lines});`, `assert.equal(result.engineLines, ${newEngineMeta.lines});`)
  .replace(`assert.equal(result.engineBytes, ${oldEngineMeta.bytes});`, `assert.equal(result.engineBytes, ${newEngineMeta.bytes});`);
if (!tests.includes('test("permissive adapter typing and bridge drift fail closed"')) {
  tests += [
    "",
    'test("permissive adapter typing and bridge drift fail closed", () => {',
    "  const host = baseline();",
    '  host.supportSource = host.supportSource.replace("export type EngineAdapterHost = {", "export type EngineAdapterHost = {\\n  [key: string]: any;");',
    '  assert.match(messages(validateEngineAdapters(host)), /host must not contain any|index signature|host changed/);',
    "",
    "  const signature = baseline();",
    '  signature.adapterSources["src/game/engine/physics-adapter.ts"] = signature.adapterSources["src/game/engine/physics-adapter.ts"].replace(',
    '    `Parameters<RaceEngine["fixed"]>[0]`,',
    '    "any",',
    "  );",
    '  assert.match(messages(validateEngineAdapters(signature)), /exact signature|identity changed/);',
    "",
    "  const bridge = baseline();",
    '  bridge.engineSource = bridge.engineSource.replace("engineAdapterHost(this)", "this as any");',
    '  assert.match(messages(validateEngineAdapters(bridge)), /bridge|engine\\.ts differs|facade wrapper/);',
    "});",
    "",
  ].join("\n");
  write(testPath, tests);
}

const finalManifestHash = sha256(read(manifestPath));
checker = read(checkerPath)
  .replace(/export const EXPECTED_MANIFEST_SHA256 = "[a-f0-9]{64}";/, `export const EXPECTED_MANIFEST_SHA256 = "${finalManifestHash}";`)
  .replace(/export const EXPECTED_ENGINE_SHA256 = "[a-f0-9]{64}";/, `export const EXPECTED_ENGINE_SHA256 = "${newEngineMeta.sha256}";`);
write(checkerPath, checker);

console.log(JSON.stringify({
  hostMembers: hostKeys.length,
  engine: newEngineMeta,
  support: newSupportMeta,
  adapters: manifest.extraction.adapters.map(({ id, lines, bytes, sha256 }) => ({ id, lines, bytes, sha256 })),
  manifestSha256: finalManifestHash,
  totalLines,
  totalBytes,
}, null, 2));
