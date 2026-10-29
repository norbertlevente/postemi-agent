/**
 * Agent skills that ship inside the npm package (`skills/` next to `dist/`)
 * and that `postemi skills add` copies into the skill folders of the coding
 * agents found on this machine.
 *
 *   core     skills/postemi                 always installed with any other set
 *   writing  skills/postemi-writing          optional (ideas, hooks, templates)
 *            skills/postemi-templates        goes with writing
 *   growth   skills/postemi-growth           optional (niche, cadence, 30-day plan)
 *
 * Everything here takes its paths, environment and I/O as arguments, so the
 * unit tests run it against a temporary home folder and a fake terminal.
 */

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'fs';
import { join } from 'path';

export type SkillSet = 'core' | 'writing' | 'growth';
export type OptionalSet = Exclude<SkillSet, 'core'>;

export const OPTIONAL_SETS: OptionalSet[] = ['writing', 'growth'];

/** The folders (each holds a SKILL.md) that make up one set. */
export const SKILL_SETS: Record<SkillSet, string[]> = {
  core: ['postemi'],
  writing: ['postemi-writing', 'postemi-templates'],
  growth: ['postemi-growth'],
};

export const SET_SUMMARY: Record<SkillSet, string> = {
  core: 'the postemi commands and their rules (always on)',
  writing: 'write posts: ideas, hooks, formatting, network rules, templates',
  growth: 'grow an audience: niche, cadence, 30-day plan, weekly review',
};

export type AgentId = 'claude' | 'codex' | 'cursor' | 'grok';
export const AGENT_IDS: AgentId[] = ['claude', 'codex', 'cursor', 'grok'];

export interface Agent {
  id: AgentId;
  name: string;
  /** The agent's own folder; the agent counts as installed when it exists. */
  home: string;
  /** Where its user-level skills live. */
  skillsDir: string;
}

/*
  Where each agent reads user-level skills:
  - Claude Code: ~/.claude/skills (or $CLAUDE_CONFIG_DIR/skills).
  - Codex: $CODEX_HOME/skills, default ~/.codex/skills (Codex also reads
    ~/.agents/skills; its own skill installer writes to $CODEX_HOME/skills).
  - Cursor: ~/.cursor/skills.
  - Grok Build: ~/.grok/skills (Grok also reads the Claude and Cursor folders
    and keeps one copy per skill name, so a second copy does no harm).
*/
export function knownAgents(home: string, env: NodeJS.ProcessEnv = {}): Agent[] {
  const claudeHome = env.CLAUDE_CONFIG_DIR || join(home, '.claude');
  const codexHome = env.CODEX_HOME || join(home, '.codex');
  const cursorHome = join(home, '.cursor');
  const grokHome = join(home, '.grok');
  return [
    { id: 'claude', name: 'Claude Code', home: claudeHome, skillsDir: join(claudeHome, 'skills') },
    { id: 'codex', name: 'Codex', home: codexHome, skillsDir: join(codexHome, 'skills') },
    { id: 'cursor', name: 'Cursor', home: cursorHome, skillsDir: join(cursorHome, 'skills') },
    { id: 'grok', name: 'Grok Build', home: grokHome, skillsDir: join(grokHome, 'skills') },
  ];
}

/** The agents whose folder exists on this machine. */
export function detectAgents(home: string, env: NodeJS.ProcessEnv = {}): Agent[] {
  return knownAgents(home, env).filter((agent) => isDir(agent.home));
}

/** `writing`, `growth`, `all`, `core`, or a folder name like `postemi-writing`. */
export function parseSetNames(names: string[]): SkillSet[] {
  const out = new Set<SkillSet>();
  for (const raw of names) {
    const name = raw.trim().toLowerCase().replace(/^postemi-?/, '') || 'core';
    if (name === 'all') OPTIONAL_SETS.forEach((s) => out.add(s));
    else if (name === 'templates') out.add('writing');
    else if (name === 'core' || name === 'writing' || name === 'growth') out.add(name);
    else throw new Error(`Unknown skill "${raw}". Use writing, growth, all or core.`);
  }
  return [...out];
}

function isDir(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function listFiles(dir: string, prefix = ''): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    if (isDir(path)) out.push(...listFiles(path, join(prefix, name)));
    else out.push(join(prefix, name));
  }
  return out;
}

function sameTree(a: string, b: string): boolean {
  const fa = listFiles(a);
  const fb = listFiles(b);
  return (
    fa.length === fb.length &&
    fa.every((f, i) => fb[i] === f && readFileSync(join(a, f)).equals(readFileSync(join(b, f))))
  );
}

/** The `name:` in a SKILL.md's front matter, or null. */
export function skillName(dir: string): string | null {
  try {
    const text = readFileSync(join(dir, 'SKILL.md'), 'utf8');
    const match = /^---\r?\n[\s\S]*?^name:\s*["']?([\w-]+)["']?\s*$/m.exec(text);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export type FolderState = 'installed' | 'outdated' | 'missing';

/** One skill folder in one agent, compared with the copy in the package. */
export function folderState(source: string, folder: string, agent: Agent): FolderState {
  const target = join(agent.skillsDir, folder);
  if (skillName(target) !== folder) return 'missing';
  return sameTree(join(source, folder), target) ? 'installed' : 'outdated';
}

/** A set is as installed as its least installed folder. */
export function setState(source: string, set: SkillSet, agent: Agent): FolderState {
  const states = SKILL_SETS[set].map((f) => folderState(source, f, agent));
  if (states.includes('missing')) return 'missing';
  if (states.includes('outdated')) return 'outdated';
  return 'installed';
}

/**
 * Copy the sets' folders into the agent's skill folder, replacing an older
 * copy. Core comes along with any set. Refuses to overwrite a folder of the
 * same name that is not this skill (another SKILL.md name, or no SKILL.md).
 * Returns the folders written.
 */
export function installSets(source: string, sets: SkillSet[], agent: Agent): string[] {
  const folders = foldersFor(sets.includes('core') ? sets : ['core', ...sets]);
  for (const folder of folders) {
    if (skillName(join(source, folder)) !== folder) {
      throw new Error(`The package has no ${folder} skill at ${join(source, folder)}`);
    }
    const target = join(agent.skillsDir, folder);
    if (existsSync(target) && skillName(target) !== folder) {
      throw new Error(`${target} exists and is not the ${folder} skill; move it away first`);
    }
  }
  mkdirSync(agent.skillsDir, { recursive: true });
  for (const folder of folders) {
    const target = join(agent.skillsDir, folder);
    rmSync(target, { recursive: true, force: true });
    cpSync(join(source, folder), target, { recursive: true });
  }
  return folders;
}

/** Remove the sets' folders (only folders whose SKILL.md names that skill). */
export function removeSets(sets: SkillSet[], agent: Agent): string[] {
  const removed: string[] = [];
  for (const folder of foldersFor(sets)) {
    const target = join(agent.skillsDir, folder);
    if (skillName(target) !== folder) continue;
    rmSync(target, { recursive: true, force: true });
    removed.push(folder);
  }
  return removed;
}

function foldersFor(sets: SkillSet[]): string[] {
  return [...new Set(sets.flatMap((s) => SKILL_SETS[s]))];
}

/* ------------------------------------------------------------------------ */
/* The one-time question                                                     */
/* ------------------------------------------------------------------------ */

export interface Terminal {
  stdinTTY: boolean;
  stderrTTY: boolean;
  /** `--json` on the command: an agent or a script runs it. */
  json: boolean;
  /** The CI environment variable is set. */
  ci: boolean;
}

export function terminalFrom(argv: { json?: unknown }, env: NodeJS.ProcessEnv = process.env): Terminal {
  return {
    stdinTTY: !!process.stdin.isTTY,
    stderrTTY: !!process.stderr.isTTY,
    json: !!argv.json,
    ci: !!env.CI && env.CI !== 'false' && env.CI !== '0',
  };
}

/** Questions only for a person at a terminal. */
export function canAsk(t: Terminal): boolean {
  return t.stdinTTY && t.stderrTTY && !t.json && !t.ci;
}

/** Saved answers live in ~/.postemi/config.json under these keys. */
export const ANSWER_KEY: Record<OptionalSet, string> = {
  writing: 'skills.writing',
  growth: 'skills.growth',
};
export const HINT_KEY = 'skills.hint';

export interface Store {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
}

export const QUESTIONS: Record<OptionalSet, string> = {
  writing:
    'Postemi can also help you write posts. Install the optional writing skill (ideas, hooks, templates)? [y/N] ',
  growth: 'Install the optional growth skill (niche, cadence, 30-day plan)? [y/N] ',
};

export const HINT =
  'Tip: optional agent skills for writing posts and growing an audience: postemi skills list, postemi skills add writing|growth';

export function isYes(answer: string): boolean {
  return /^(y|yes)$/i.test(answer.trim());
}

/** Both questions already answered once. */
export function alreadyOffered(store: Store): boolean {
  return OPTIONAL_SETS.every((s) => !!store.get(ANSWER_KEY[s]));
}

export interface OfferDeps {
  terminal: Terminal;
  store: Store;
  ask: (question: string) => Promise<string>;
  log: (line: string) => void;
}

/**
 * Ask the two questions and save the answers. Returns the sets the person
 * said yes to. `force` asks again even if both were answered before (an
 * explicit `postemi skills add` with no name); off a terminal it never asks.
 *
 * The rule after `auth:login`: ask once, on a terminal only, default No.
 * Off a terminal (an agent, a pipe, CI, --json) print one hint line to
 * stderr, once ever.
 */
export async function offerOptionalSkills(deps: OfferDeps, force = false): Promise<OptionalSet[]> {
  const { terminal, store, ask, log } = deps;
  if (!force && alreadyOffered(store)) return [];
  if (!canAsk(terminal)) {
    if (!store.get(HINT_KEY)) {
      log(HINT);
      store.set(HINT_KEY, 'shown');
    }
    return [];
  }
  const chosen: OptionalSet[] = [];
  for (const set of OPTIONAL_SETS) {
    const yes = isYes(await ask(QUESTIONS[set]));
    store.set(ANSWER_KEY[set], yes ? 'yes' : 'no');
    if (yes) chosen.push(set);
  }
  if (!chosen.length) log('No optional skills. Add them any time with: postemi skills add');
  return chosen;
}

/**
 * Which agents to install into. `--agent` wins (an agent named there is used
 * even if its folder does not exist yet). Otherwise every agent found; with
 * more than one on a terminal (and no --yes) the person picks.
 */
export async function chooseAgents(opts: {
  found: Agent[];
  all: Agent[];
  requested?: string[];
  yes: boolean;
  terminal: Terminal;
  ask: (question: string) => Promise<string>;
  log: (line: string) => void;
}): Promise<Agent[]> {
  const { found, all, requested, yes, terminal, ask, log } = opts;
  if (requested && requested.length) {
    const ids = requested.flatMap((r) => String(r).split(',')).map((r) => r.trim().toLowerCase()).filter(Boolean);
    if (ids.includes('all')) return found;
    return ids.map((id) => {
      const agent = all.find((a) => a.id === id);
      if (!agent) throw new Error(`Unknown agent "${id}". Use ${AGENT_IDS.join(', ')} or all.`);
      return agent;
    });
  }
  if (found.length <= 1 || yes || !canAsk(terminal)) return found;

  log('Agents found on this machine:');
  found.forEach((a, i) => log(`  ${i + 1}. ${a.name}  (${a.skillsDir})`));
  const answer = (await ask(`Install for which? [all, or numbers like 1,3] `)).trim().toLowerCase();
  if (!answer || answer === 'all' || answer === 'a') return found;
  const picked = answer
    .split(/[\s,]+/)
    .map((n) => found[Number(n) - 1])
    .filter((a): a is Agent => !!a);
  return [...new Set(picked)];
}
