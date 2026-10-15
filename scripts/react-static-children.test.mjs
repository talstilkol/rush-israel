import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import ts from 'typescript';
import { fromRoot } from './project-root.mjs';

// React's static-children entry point requires an array. A single translated
// string or nested element produces console errors only when that UI appears.
test('handwritten static JSX calls never pass a single element or string as children', () => {
  const errors = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!path.endsWith('.tsx')) continue;
      const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      function visit(node) {
        if (ts.isCallExpression(node) && node.expression.getText(source) === 'jsxs') {
          const props = node.arguments[1];
          if (props && ts.isObjectLiteralExpression(props)) {
            const children = props.properties.find(property => ts.isPropertyAssignment(property) && property.name.getText(source) === 'children');
            if (children) {
              const value = children.initializer;
              const array = ts.isArrayLiteralExpression(value);
              const mappedArray = ts.isCallExpression(value) && ts.isPropertyAccessExpression(value.expression) && value.expression.name.text === 'map';
              if (!array && !mappedArray) errors.push(`${path}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
            }
          }
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
    }
  }
  walk(fromRoot('src'));
  assert.deepEqual(errors, []);
});
