/** Conservative whole-repository runtime/build/QA inventory. Never grants a freeze. */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, lstatSync, realpathSync, existsSync, writeFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { inspectActionUses } from './ci-action-pins.mjs';
import { projectRoot } from './project-root.mjs';

export const CLOSURE_ROOTS = ['src', 'server', 'scripts', 'public', 'golden-baseline', '.github/workflows'];
export const ROOT_FILES = ['package.json', 'package-lock.json', 'tsconfig.json', '.npmrc', '.nvmrc', '.node-version', '.env.example'];
const configPattern = /(?:\.config\.[cm]?[jt]s|^tsconfig(?:\.[^/]+)?\.json)$/;
const codePattern = /\.[cm]?[jt]sx?$/;
const hash = value => createHash('sha256').update(value).digest('hex');
const ordered = rows => rows.sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : JSON.stringify(a) > JSON.stringify(b) ? 1 : 0);
const packageName = spec => spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
const builtins = new Set(builtinModules.flatMap(name => [name, `node:${name}`]));

export function collectClosureFiles(root = projectRoot) {
  const files = [], errors = [];
  const walk = relative => {
    const absolute = path.join(root, relative);
    if (!existsSync(absolute)) { errors.push(`missing closure input: ${relative}`); return; }
    const stat = lstatSync(absolute);
    if (stat.isSymbolicLink()) { errors.push(`symlink is not a sealed input: ${relative}`); return; }
    if (stat.isDirectory()) for (const name of readdirSync(absolute).sort()) walk(`${relative}/${name}`);
    else if (stat.isFile()) files.push(relative);
    else errors.push(`unsupported input type: ${relative}`);
  };
  for (const entry of CLOSURE_ROOTS) walk(entry);
  const configs = readdirSync(root).filter(name => configPattern.test(name));
  for (const entry of new Set([...ROOT_FILES, ...configs])) walk(entry);
  return { files: [...new Set(files)].sort(), errors };
}

export function buildDependencyClosure(root = projectRoot) {
  const inventory = collectClosureFiles(root);
  const errors = [...inventory.errors], fileSet = new Set(inventory.files);
  const files = inventory.files.map(name => {
    const bytes = readFileSync(path.join(root, name));
    return { path: name, bytes: bytes.length, sha256: hash(bytes) };
  });
  let lock = {}, pkg = {};
  try { lock = JSON.parse(readFileSync(path.join(root, 'package-lock.json'), 'utf8')); }
  catch (error) { errors.push(`invalid package lock: ${error.message}`); }
  try { pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')); }
  catch (error) { errors.push(`invalid package metadata: ${error.message}`); }
  const declared = { ...pkg.dependencies, ...pkg.devDependencies };
  const imports = [], externalResources = [], dynamicAssetExpressions = [], actions = [];
  const analysed = new Set(), pending = inventory.files.filter(name => /^(src|server)\//.test(name) && codePattern.test(name));
  for (const config of inventory.files.filter(name => configPattern.test(name) && codePattern.test(name))) pending.push(config);
  // Follow real capture/build dependencies too, not test-fixture import expressions.
  pending.push('scripts/pixel-golden.mjs', 'scripts/run-with-server.mjs', 'scripts/capture-golden.mjs');
  const dependency = (from, specifier, kind, typeOnly = false) => {
    const row = { from, specifier, kind, typeOnly };
    if (builtins.has(specifier)) { row.target = specifier; row.resolution = 'node_builtin'; }
    else if (specifier === 'virtual:grok-og-identity' && fileSet.has('scripts/grok-pwa-plugin.mjs')) {
      row.resolution = 'repository_virtual_provider'; row.target = 'scripts/grok-pwa-plugin.mjs'; pending.push(row.target);
    } else if (specifier.startsWith('virtual:')) {
      row.resolution = 'virtual_module_unqualified';
      externalResources.push({ from, resource: specifier, kind: 'virtual_module', qualification: 'provider_contract_required' });
    } else if (/^https?:/.test(specifier)) {
      row.resolution = 'remote_unqualified';
      externalResources.push({ from, resource: specifier, kind: 'module', qualification: 'immutable_bytes_required' });
    } else if (specifier.startsWith('.') || specifier.startsWith('@/') || specifier.startsWith('/')) {
      const clean = specifier.split(/[?#]/)[0];
      const relative = path.posix.normalize(clean.startsWith('@/') ? `src/${clean.slice(2)}`
        : clean.startsWith('/') ? clean.slice(1) : path.posix.join(path.posix.dirname(from), clean));
      if (relative.startsWith('../') || relative === '..') errors.push(`import escapes repository: ${from} -> ${specifier}`);
      const candidates = [relative, ...['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mts', '.cjs', '.json', '.css'].map(ext => relative + ext),
        ...['.ts', '.tsx', '.js', '.mjs'].map(ext => `${relative}/index${ext}`)];
      if (/\.js$/.test(relative)) candidates.push(relative.replace(/\.js$/, '.ts'), relative.replace(/\.js$/, '.tsx'));
      const target = candidates.find(candidate => fileSet.has(candidate));
      if (!target) { row.resolution = 'unresolved'; errors.push(`unresolved local import: ${from} -> ${specifier}`); }
      else { row.resolution = 'repository'; row.target = target; if (codePattern.test(target)) pending.push(target); }
    } else {
      const name = packageName(specifier), entry = lock.packages?.[`node_modules/${name}`];
      row.package = name;
      if (!declared[name] || !entry?.version || !/^sha(?:256|384|512)-[A-Za-z0-9+/]+=*$/.test(entry?.integrity ?? '')) {
        row.resolution = 'unresolved'; errors.push(`unsealed package import: ${from} -> ${specifier}`);
      } else { row.resolution = 'locked_package'; row.version = entry.version; row.integrity = entry.integrity; }
    }
    imports.push(row);
  };
  while (pending.length) {
    const from = pending.pop();
    if (analysed.has(from)) continue;
    analysed.add(from);
    if (!fileSet.has(from)) { errors.push(`missing analysed module: ${from}`); continue; }
    const text = readFileSync(path.join(root, from), 'utf8');
    const source = ts.createSourceFile(from, text, ts.ScriptTarget.Latest, true);
    for (const diagnostic of source.parseDiagnostics) errors.push(`parse error: ${from}:${diagnostic.start}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`);
    const visit = node => {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) {
        dependency(from, node.moduleSpecifier.text, ts.isImportDeclaration(node) ? 'static_import' : 're_export',
          !!node.isTypeOnly || !!node.importClause?.isTypeOnly);
      }
      if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || node.expression.getText(source) === 'require')) {
        const argument = node.arguments[0];
        const kind = node.expression.kind === ts.SyntaxKind.ImportKeyword ? 'dynamic_import' : 'require';
        if (argument && ts.isStringLiteralLike(argument)) dependency(from, argument.text, kind);
        else errors.push(`unresolved ${kind}: ${from}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
      }
      if (ts.isCallExpression(node) && /^import\.meta\.glob/.test(node.expression.getText(source))) errors.push(`unresolved module glob: ${from}`);
      if (ts.isTemplateExpression(node) && node.head.text.startsWith('/game/')) dynamicAssetExpressions.push({ from, expression: node.getText(source), coverage: 'entire_public_tree_included' });
      if (ts.isTemplateExpression(node) && /^https?:\/\//.test(node.head.text)) {
        externalResources.push({ from, resource: node.getText(source), kind: 'dynamic_remote_expression', qualification: 'host_and_usage_review_required' });
      } else if (ts.isStringLiteralLike(node)) {
        for (const match of node.text.matchAll(/https?:\/\/[^\s"'<>`)]+/g)) {
          const resource = match[0];
          const isHarnessOrigin = ['scripts/pixel-golden.mjs', 'scripts/run-with-server.mjs', 'scripts/capture-golden.mjs'].includes(from)
            && /^http:\/\/127\.0\.0\.1:8080\//.test(resource);
          if (!isHarnessOrigin) externalResources.push({ from, resource, kind: 'potential_remote_reference', qualification: 'usage_and_bytes_review_required' });
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  for (const name of inventory.files) {
    if (name.endsWith('.css')) {
      const text = readFileSync(path.join(root, name), 'utf8');
      for (const match of text.matchAll(/url\(\s*["']?(https?:\/\/[^"')\s]+)["']?\s*\)/g))
        externalResources.push({ from: name, resource: match[1], kind: 'css_url', qualification: 'immutable_bytes_required' });
    }
    if (name.startsWith('.github/workflows/') && /\.ya?ml$/.test(name)) {
      const text = readFileSync(path.join(root, name), 'utf8');
      const result = inspectActionUses(text, name);
      actions.push(...result.actions); externalResources.push(...result.unresolved);
    }
    if (name.startsWith('public/') && /\.(glb|gltf)$/.test(name)) {
      try {
        const bytes = readFileSync(path.join(root, name));
        let model;
        if (name.endsWith('.gltf')) model = JSON.parse(bytes.toString());
        else {
          if (bytes.length < 20 || bytes.readUInt32LE(0) !== 0x46546c67 || bytes.readUInt32LE(4) !== 2
            || bytes.readUInt32LE(8) !== bytes.length || bytes.readUInt32LE(16) !== 0x4e4f534a
            || 20 + bytes.readUInt32LE(12) > bytes.length) throw new Error('invalid GLB JSON header');
          model = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString().trim());
        }
        for (const item of [...(model.buffers ?? []), ...(model.images ?? [])]) {
          if (!item.uri || item.uri.startsWith('data:')) continue;
          if (/^[a-z]+:|^\/\//i.test(item.uri)) externalResources.push({ from: name, resource: item.uri, kind: 'gltf_uri', qualification: 'immutable_bytes_required' });
          else {
            const target = path.posix.normalize(path.posix.join(path.posix.dirname(name), decodeURIComponent(item.uri)));
            if (!target.startsWith('public/') || !fileSet.has(target)) errors.push(`unresolved model asset: ${name} -> ${item.uri}`);
          }
        }
      } catch (error) { errors.push(`invalid model dependency data: ${name}: ${error.message}`); }
    }
  }
  const unique = rows => ordered([...new Map(rows.map(row => [JSON.stringify(row), row])).values()]);
  const result = { schema_version: 1, unit: 'RSH-036', strategy: 'conservative_full_local_surface_not_minimal_reachability',
    roots: [...CLOSURE_ROOTS], root_files: [...ROOT_FILES], root_config_pattern: configPattern.source,
    files, imports: unique(imports), actions: unique(actions), dynamic_asset_expressions: unique(dynamicAssetExpressions), external_resources: unique(externalResources),
    errors: [...new Set(errors)].sort(), local_inventory_complete: errors.length === 0,
    complete_dependency_closure: errors.length === 0 && externalResources.length === 0, freeze_granted: false,
    limits: ['All local files in the declared roots are sealed, including currently unused dynamic targets and all public asset bytes.',
      'Package sources are identified by package-lock integrity, not vendored or executed by this scanner.',
      'Virtual providers, remote assets and mutable action tags require separate qualification; inventory is not release acceptance.'] };
  result.digest_sha256 = hash(JSON.stringify(result));
  return result;
}

export function validateDependencyClosure(root = projectRoot, manifest) {
  const actual = buildDependencyClosure(root), errors = [...actual.errors];
  try {
    const expected = manifest ?? JSON.parse(readFileSync(path.join(root, 'AYALON-DEPENDENCY-CLOSURE.json'), 'utf8'));
    if (JSON.stringify(expected) !== JSON.stringify(actual)) errors.push('dependency inventory drift: changed, added, removed or unresolved inputs; regenerate only after review');
  } catch (error) { errors.push(`missing or invalid dependency inventory: ${error.message}`); }
  return { errors, fileCount: actual.files.length, importCount: actual.imports.length,
    externalCount: actual.external_resources.length, complete: actual.complete_dependency_closure, freezeGranted: false };
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--write')) {
    const result = buildDependencyClosure();
    if (result.errors.length) { console.error(JSON.stringify(result.errors)); process.exitCode = 1; }
    else { writeFileSync(path.join(projectRoot, 'AYALON-DEPENDENCY-CLOSURE.json'), JSON.stringify(result, null, 2) + '\n'); console.log(`Wrote ${result.files.length} local inputs; ${result.external_resources.length} external qualifications remain; no freeze granted`); }
  } else {
    const result = validateDependencyClosure();
    console.log(JSON.stringify(result, null, 2));
    if (result.errors.length) process.exitCode = 1;
  }
}
