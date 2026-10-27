// The mock must parse as ES2017 modules (webpack 4's parser, old Safari) and import with explicit ".js"
// specifiers. Uses acorn from the site's node_modules when it is installed, else skips.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

var ROOT = fileURLToPath(new URL('..', import.meta.url));

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    var p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'test' || name === 'tools' || name === 'node_modules' ? [] : files(p);
    return name.endsWith('.js') ? [p] : [];
  });
}

var acorn = null;
try {
  acorn = createRequire(join(ROOT, '../../../package.json'))('acorn');
} catch (e) { /* not installed */ }

test('runtime files parse as ES2017 modules with explicit .js imports', { skip: acorn ? false : 'acorn not installed' }, () => {
  var list = files(ROOT);
  assert.ok(list.length > 10);
  for (var f of list) {
    var src = readFileSync(f, 'utf8');
    var ast;
    try {
      ast = acorn.parse(src, { ecmaVersion: 2017, sourceType: 'module' });
    } catch (e) {
      assert.fail(f + ': ' + e.message);
    }
    ast.body.filter((n) => n.type === 'ImportDeclaration' || ((n.type === 'ExportNamedDeclaration' || n.type === 'ExportAllDeclaration') && n.source)).forEach((n) => {
      assert.match(n.source.value, /^\.{1,2}\/.*\.js$/, f + ' imports ' + n.source.value);
    });
  }
});
