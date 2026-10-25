#!/usr/bin/env node
/*
  Repository checks, run by `pnpm test` after the type check and the build.

    1. Every JSON manifest parses.
    2. The copies of the CLI skill are identical (SKILL.md, the one the npm
       package ships; skills/postemi/SKILL.md, the one ClawHub and skills.sh
       read; plugins/postemi-cli/skills/postemi/SKILL.md, the Claude Code
       plugin's).
    3. No file names the other brand or its region: the npm package files
       (from `npm pack --dry-run`, so dist/ too) and every file in git, except
       this one and the server's tool names the ChatGPT skills must use.
    4. The built CLI answers --help and names itself `postemi`.
*/
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const fail = (message) => failures.push(message);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

// 1. JSON
const jsonFiles = walk(root).filter((f) => f.endsWith('.json') && !relative(root, f).startsWith('dist'));
for (const file of jsonFiles) {
  try {
    JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`${relative(root, file)}: invalid JSON (${error.message})`);
  }
}

// 2. Skill copies
const skill = readFileSync(join(root, 'skills/postemi/SKILL.md'), 'utf8');
for (const copy of ['SKILL.md', 'plugins/postemi-cli/skills/postemi/SKILL.md']) {
  if (readFileSync(join(root, copy), 'utf8') !== skill) {
    fail(`${copy} differs from skills/postemi/SKILL.md (copy it over)`);
  }
}

// 3. Brand leaks
const LEAK = /posty|POSTY_|budapest|forint|hungar|magyar|\.hu\b|fotoai|kreator|[áéíóöőúüű]/gi;
/*
  Allowed: `open_posty` and `posty://` are the MCP server's own tool and link
  names (the ChatGPT skills must call them by name); `psty_` is the API key
  prefix; the Postiz attribution in LICENSE.
*/
const ALLOWED = [/open_posty/g, /posty:\/\//g];
const packFiles = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: root, encoding: 'utf8' })
)[0].files.map((f) => f.path);
const gitFiles = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
  .split('\n')
  .filter((f) => f && f !== 'scripts/check.mjs' && !/\.(png|jpg)$/.test(f));
for (const file of new Set([...packFiles, ...gitFiles])) {
  if (file.endsWith('.map')) continue; // same text as dist/index.js
  let text = readFileSync(join(root, file), 'utf8');
  for (const allowed of ALLOWED) text = text.replace(allowed, '');
  // The CLI must still translate two plan names for the API (src/brand.ts).
  if (file === 'dist/index.js') text = text.replace(/basic: "alap"|team: "csapat"/g, '');
  const leaks = text.match(LEAK);
  if (leaks) fail(`${file}: ${[...new Set(leaks)].join(', ')}`);
}

// 4. The built CLI
const help = execFileSync(process.execPath, [join(root, 'dist/index.js'), '--help'], { encoding: 'utf8' });
if (!help.startsWith('postemi <command>')) fail('dist/index.js --help does not start with "postemi <command>"');
if (/fotoai/i.test(help)) fail('dist/index.js --help lists FotoAI commands');

if (failures.length) {
  console.error(`check: ${failures.length} problem(s)\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(`check: ok (${jsonFiles.length} JSON files, ${packFiles.length} package files, ${gitFiles.length} files in git)`);
