#!/usr/bin/env node
/*
  Unit tests: builds test/*.test.ts with tsup into .test-build/ (git ignores
  it) and runs them with `node --test`. Part of `pnpm test`.
*/
import { execFileSync } from 'node:child_process';
import { readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'tsup';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, '.test-build');
const entries = readdirSync(join(root, 'test'))
  .filter((f) => f.endsWith('.test.ts'))
  .map((f) => join(root, 'test', f));

rmSync(out, { recursive: true, force: true });
await build({ entry: entries, outDir: out, format: ['cjs'], config: false, silent: true, platform: 'node', target: 'node18', removeNodeProtocol: false });
try {
  execFileSync(process.execPath, ['--test', ...readdirSync(out).filter((f) => f.endsWith('.js')).map((f) => join(out, f))], {
    stdio: 'inherit',
  });
} catch {
  process.exit(1);
} finally {
  rmSync(out, { recursive: true, force: true });
}
