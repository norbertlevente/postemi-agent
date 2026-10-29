/*
  Unit tests for the optional skills (src/skills.ts). Built by
  scripts/test.mjs and run with `node --test`. Every test works in its own
  temporary folder: a fake home with fake agent folders, a fake package
  skills folder, an in-memory config store and a fake terminal.
*/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  ANSWER_KEY,
  HINT,
  HINT_KEY,
  QUESTIONS,
  Store,
  Terminal,
  canAsk,
  chooseAgents,
  detectAgents,
  installSets,
  knownAgents,
  offerOptionalSkills,
  parseSetNames,
  removeSets,
  setState,
} from '../src/skills';

const TTY: Terminal = { stdinTTY: true, stderrTTY: true, json: false, ci: false };

function tmp(): string {
  return mkdtempSync(join(tmpdir(), 'postemi-skills-test-'));
}

function skill(root: string, name: string, body = 'text') {
  mkdirSync(join(root, name, 'reference'), { recursive: true });
  writeFileSync(join(root, name, 'SKILL.md'), `---\nname: ${name}\ndescription: test\n---\n\n${body}\n`);
  writeFileSync(join(root, name, 'reference', 'a.md'), body);
}

function fakePackage(): string {
  const source = tmp();
  for (const name of ['postemi', 'postemi-writing', 'postemi-templates', 'postemi-growth']) skill(source, name);
  return source;
}

function memoryStore(initial: Record<string, string> = {}): Store & { data: Record<string, string> } {
  const data = { ...initial };
  return { data, get: (k) => data[k], set: (k, v) => void (data[k] = v) };
}

function scriptedAsk(answers: string[]) {
  const asked: string[] = [];
  return {
    asked,
    ask: async (q: string) => {
      asked.push(q);
      return answers.shift() ?? '';
    },
  };
}

test('detects only the agents whose folder exists, and honours CODEX_HOME', () => {
  const home = tmp();
  mkdirSync(join(home, '.claude'));
  mkdirSync(join(home, '.cursor'));
  assert.deepEqual(detectAgents(home).map((a) => a.id), ['claude', 'cursor']);

  const codexHome = join(home, 'elsewhere-codex');
  mkdirSync(codexHome);
  const found = detectAgents(home, { CODEX_HOME: codexHome });
  assert.deepEqual(found.map((a) => a.id), ['claude', 'codex', 'cursor']);
  assert.equal(found[1].skillsDir, join(codexHome, 'skills'));
  rmSync(home, { recursive: true, force: true });
});

test('parses skill names', () => {
  assert.deepEqual(parseSetNames(['writing']), ['writing']);
  assert.deepEqual(parseSetNames(['all']), ['writing', 'growth']);
  assert.deepEqual(parseSetNames(['postemi-templates', 'Growth']), ['writing', 'growth']);
  assert.deepEqual(parseSetNames(['core']), ['core']);
  assert.throws(() => parseSetNames(['bogus']), /Unknown skill/);
});

test('installing writing copies writing, templates and core, and nothing else', () => {
  const source = fakePackage();
  const home = tmp();
  mkdirSync(join(home, '.claude'));
  const [claude] = detectAgents(home);

  const written = installSets(source, ['writing'], claude);
  assert.deepEqual(written, ['postemi', 'postemi-writing', 'postemi-templates']);
  assert.ok(existsSync(join(claude.skillsDir, 'postemi-writing', 'reference', 'a.md')));
  assert.ok(!existsSync(join(claude.skillsDir, 'postemi-growth')));
  assert.equal(setState(source, 'writing', claude), 'installed');
  assert.equal(setState(source, 'growth', claude), 'missing');

  // A newer package: outdated until installed again.
  skill(source, 'postemi-writing', 'new text');
  assert.equal(setState(source, 'writing', claude), 'outdated');
  installSets(source, ['writing'], claude);
  assert.equal(setState(source, 'writing', claude), 'installed');
  rmSync(source, { recursive: true, force: true });
  rmSync(home, { recursive: true, force: true });
});

test('never overwrites a foreign folder with the same name', () => {
  const source = fakePackage();
  const home = tmp();
  const [claude] = knownAgents(home);
  mkdirSync(join(claude.skillsDir, 'postemi-growth'), { recursive: true });
  writeFileSync(join(claude.skillsDir, 'postemi-growth', 'notes.txt'), 'mine');
  assert.throws(() => installSets(source, ['growth'], claude), /not the postemi-growth skill/);
  assert.equal(readFileSync(join(claude.skillsDir, 'postemi-growth', 'notes.txt'), 'utf8'), 'mine');
  rmSync(source, { recursive: true, force: true });
  rmSync(home, { recursive: true, force: true });
});

test('remove deletes only the named sets and only real skill folders', () => {
  const source = fakePackage();
  const home = tmp();
  const [claude] = knownAgents(home);
  installSets(source, ['writing', 'growth'], claude);
  assert.deepEqual(removeSets(['growth'], claude), ['postemi-growth']);
  assert.ok(existsSync(join(claude.skillsDir, 'postemi-writing')));
  assert.ok(existsSync(join(claude.skillsDir, 'postemi')));
  assert.deepEqual(removeSets(['growth'], claude), []);

  mkdirSync(join(claude.skillsDir, 'postemi-growth'));
  assert.deepEqual(removeSets(['growth'], claude), []);
  assert.ok(existsSync(join(claude.skillsDir, 'postemi-growth')));
  rmSync(source, { recursive: true, force: true });
  rmSync(home, { recursive: true, force: true });
});

test('asks only a person at a terminal', () => {
  assert.equal(canAsk(TTY), true);
  assert.equal(canAsk({ ...TTY, stdinTTY: false }), false);
  assert.equal(canAsk({ ...TTY, stderrTTY: false }), false);
  assert.equal(canAsk({ ...TTY, json: true }), false);
  assert.equal(canAsk({ ...TTY, ci: true }), false);
});

test('asks once on a terminal, default No, and remembers the answers', async () => {
  const store = memoryStore();
  const log: string[] = [];
  const first = scriptedAsk(['y', '']);
  const chosen = await offerOptionalSkills({ terminal: TTY, store, ask: first.ask, log: (l) => log.push(l) });
  assert.deepEqual(chosen, ['writing']);
  assert.deepEqual(first.asked, [QUESTIONS.writing, QUESTIONS.growth]);
  assert.equal(store.data[ANSWER_KEY.writing], 'yes');
  assert.equal(store.data[ANSWER_KEY.growth], 'no');

  const second = scriptedAsk(['y', 'y']);
  assert.deepEqual(await offerOptionalSkills({ terminal: TTY, store, ask: second.ask, log: () => {} }), []);
  assert.deepEqual(second.asked, []);

  // `postemi skills add` with no name asks again on purpose.
  const forced = scriptedAsk(['n', 'yes']);
  assert.deepEqual(await offerOptionalSkills({ terminal: TTY, store, ask: forced.ask, log: () => {} }, true), ['growth']);
});

test('anything but y or yes is No', async () => {
  const store = memoryStore();
  const log: string[] = [];
  const { ask } = scriptedAsk(['maybe', 'N']);
  assert.deepEqual(await offerOptionalSkills({ terminal: TTY, store, ask, log: (l) => log.push(l) }), []);
  assert.match(log.join('\n'), /postemi skills add/);
});

test('off a terminal it never asks and hints at most once', async () => {
  for (const terminal of [
    { ...TTY, stdinTTY: false },
    { ...TTY, json: true },
    { ...TTY, ci: true },
  ]) {
    const store = memoryStore();
    const log: string[] = [];
    const { ask, asked } = scriptedAsk(['y', 'y']);
    assert.deepEqual(await offerOptionalSkills({ terminal, store, ask, log: (l) => log.push(l) }), []);
    assert.deepEqual(await offerOptionalSkills({ terminal, store, ask, log: (l) => log.push(l) }, true), []);
    assert.deepEqual(asked, []);
    assert.deepEqual(log, [HINT]);
    assert.equal(store.data[HINT_KEY], 'shown');
    assert.equal(store.data[ANSWER_KEY.writing], undefined);
  }
});

test('chooses agents: --agent, one found, several found on a terminal, --yes', async () => {
  const home = tmp();
  const all = knownAgents(home);
  const [claude, codex, cursor] = all;
  const quiet = { ask: async () => '', log: () => {} };

  assert.deepEqual(
    (await chooseAgents({ found: [claude], all, requested: ['grok'], yes: false, terminal: TTY, ...quiet })).map((a) => a.id),
    ['grok']
  );
  assert.deepEqual(
    (await chooseAgents({ found: [claude, codex], all, requested: ['claude,codex'], yes: false, terminal: TTY, ...quiet })).map((a) => a.id),
    ['claude', 'codex']
  );
  await assert.rejects(
    chooseAgents({ found: [claude], all, requested: ['vim'], yes: false, terminal: TTY, ...quiet }),
    /Unknown agent/
  );
  assert.deepEqual(await chooseAgents({ found: [claude], all, yes: false, terminal: TTY, ...quiet }), [claude]);

  const picked = scriptedAsk(['1,3']);
  assert.deepEqual(
    await chooseAgents({ found: [claude, codex, cursor], all, yes: false, terminal: TTY, ask: picked.ask, log: () => {} }),
    [claude, cursor]
  );
  assert.equal(picked.asked.length, 1);

  const enter = scriptedAsk(['']);
  assert.deepEqual(
    await chooseAgents({ found: [claude, codex], all, yes: false, terminal: TTY, ask: enter.ask, log: () => {} }),
    [claude, codex]
  );

  const none = scriptedAsk(['1']);
  assert.deepEqual(
    await chooseAgents({ found: [claude, codex], all, yes: true, terminal: TTY, ask: none.ask, log: () => {} }),
    [claude, codex]
  );
  assert.deepEqual(
    await chooseAgents({ found: [claude, codex], all, yes: false, terminal: { ...TTY, json: true }, ask: none.ask, log: () => {} }),
    [claude, codex]
  );
  assert.deepEqual(none.asked, []);
  rmSync(home, { recursive: true, force: true });
});

test('the npm package ships every skill folder the CLI installs', () => {
  const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
  assert.ok(pkg.files.includes('skills'), 'package.json "files" must include skills');
  for (const name of ['postemi', 'postemi-writing', 'postemi-templates', 'postemi-growth']) {
    assert.ok(existsSync(join(__dirname, '..', 'skills', name, 'SKILL.md')), `skills/${name}/SKILL.md`);
  }
});
