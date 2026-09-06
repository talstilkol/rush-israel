/** Reviewed template compatibility boundary, not a general JavaScript sandbox. */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

export const SHARED_TEMPLATE = 'scripts/grok-pwa-shared.mjs';
export const REVIEWED_SHARED_SHA256 = '860da7df5e0e5698ccc0ed9def2eb981c2f396831c5523368d031ec740b88b9c';
// Each function and its transitive calls were reviewed in the hash-bound shared module.
// These exports do not generate platform scripts, remote card URLs or vendor head tags.
export const SAFE_TEMPLATE_EXPORTS = Object.freeze([
  'acceptsHtml', 'appNameFromHost', 'escapeHtml', 'isDocumentPath', 'isInstallQuery',
  'OG_SITE_REL_PATH', 'readOgSite', 'renderInstallPageHtml', 'renderWebManifest',
  'siteHasCustomCard', 'snapshotOgIdentity',
]);
const safe = new Set(SAFE_TEMPLATE_EXPORTS);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

export function inspectTemplateImport(sourceText, file, target = SHARED_TEMPLATE) {
  const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true), errors = [];
  const isShared = spec => {
    if (!ts.isStringLiteralLike(spec)) return false;
    const name = spec.text.split(/[?#]/)[0];
    const resolved = name.startsWith('@/') ? `src/${name.slice(2)}`
      : name.startsWith('/') ? name.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(file), name));
    return resolved === target;
  };
  const visit = node => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && isShared(node.moduleSpecifier)) {
      if (!ts.isImportDeclaration(node) || node.importClause?.name || !node.importClause?.namedBindings || !ts.isNamedImports(node.importClause.namedBindings)) {
        errors.push(`unreviewed template import form: ${file}`);
      } else for (const element of node.importClause.namedBindings.elements) {
        const name = (element.propertyName ?? element.name).text;
        if (!safe.has(name)) errors.push(`unsafe template export ${name}: ${file}`);
      }
    }
    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || node.expression.getText(source) === 'require') && node.arguments[0] && isShared(node.arguments[0])) {
      errors.push(`dynamic template access is not qualified: ${file}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return [...new Set(errors)];
}

export function inspectProductHeadBoundary(root, analysedPaths) {
  const errors = [], consumers = [];
  try {
    if (hash(readFileSync(path.join(root, SHARED_TEMPLATE))) !== REVIEWED_SHARED_SHA256) errors.push('reviewed template bytes changed; external qualification must be repeated');
  } catch { errors.push('reviewed template module missing'); }
  for (const file of [...new Set(analysedPaths)].sort()) {
    if (file === SHARED_TEMPLATE || /(?:\.test\.|\.d\.[cm]?ts$)/.test(file)) continue;
    const text = readFileSync(path.join(root, file), 'utf8');
    const found = inspectTemplateImport(text, file);
    errors.push(...found);
    if (text.includes('grok-pwa-shared.mjs')) consumers.push(file);
  }
  // The real two serving paths must consume the product injector, not just a fixture.
  for (const file of ['scripts/grok-pwa-plugin.mjs', 'server/middleware/grok-pwa.ts']) {
    let text = '';
    try { text = readFileSync(path.join(root, file), 'utf8'); } catch { errors.push(`product serving module missing: ${file}`); }
    if (!text.includes('rush-head.mjs') || !text.includes('createRushHeadInjector')) errors.push(`product head injector absent: ${file}`);
  }
  return { shared_module: SHARED_TEMPLATE, reviewed_sha256: REVIEWED_SHARED_SHA256, consumers,
    qualified: errors.length === 0, errors,
    limitation: 'Qualification covers literal imports in the analysed product/build graph and exact reviewed compatibility bytes, not arbitrary eval or hostile filesystem execution.' };
}
