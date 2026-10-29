import { homedir } from 'os';
import { join } from 'path';
import { createInterface } from 'readline';
import { loadSettings, saveRawSetting } from '../settings';
import { result, status } from '../output';
import { BRAND } from '../brand';
import {
  ANSWER_KEY,
  OPTIONAL_SETS,
  SET_SUMMARY,
  SKILL_SETS,
  SkillSet,
  Store,
  Terminal,
  chooseAgents,
  detectAgents,
  installSets,
  knownAgents,
  offerOptionalSkills,
  parseSetNames,
  removeSets,
  setState,
  terminalFrom,
} from '../skills';

/** The package's own skills folder: dist/../skills. */
export function bundledSkillsDir(): string {
  return join(__dirname, '..', 'skills');
}

const settingsStore: Store = {
  get: (key) => {
    const value = loadSettings()[key];
    return typeof value === 'string' && value ? value : undefined;
  },
  set: (key, value) => saveRawSetting(key, value),
};

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

function die(message: string): never {
  console.error(`❌ ${message}`);
  process.exit(1);
}

/** `postemi skills list` */
export async function skillsList() {
  const source = bundledSkillsDir();
  const settings = loadSettings();
  const agents = knownAgents(homedir(), process.env);
  const found = new Set(detectAgents(homedir(), process.env).map((a) => a.id));
  const sets: SkillSet[] = ['core', ...OPTIONAL_SETS];

  result({
    agents: agents.map((a) => ({ id: a.id, name: a.name, found: found.has(a.id), skillsDir: a.skillsDir })),
    skills: sets.map((set) => ({
      name: set,
      optional: set !== 'core',
      folders: SKILL_SETS[set],
      about: SET_SUMMARY[set],
      answer: set === 'core' ? null : settings[ANSWER_KEY[set]] ?? null,
      installed: Object.fromEntries(
        agents.filter((a) => found.has(a.id)).map((a) => [a.id, setState(source, set, a)])
      ),
    })),
  });
}

async function install(sets: SkillSet[], argv: any, terminal: Terminal) {
  const home = homedir();
  const agents = await chooseAgents({
    found: detectAgents(home, process.env),
    all: knownAgents(home, process.env),
    requested: argv.agent,
    yes: !!argv.yes,
    terminal,
    ask,
    log: status,
  });
  if (!agents.length) {
    throw new Error(
      `No agent skill folder found (~/.claude, ~/.codex, ~/.cursor, ~/.grok). Pass --agent claude (or codex, cursor, grok) to create one.`
    );
  }

  const installed: Record<string, string[]> = {};
  for (const agent of agents) {
    try {
      installed[agent.id] = installSets(bundledSkillsDir(), sets, agent);
    } catch (error: any) {
      throw new Error(`${agent.name}: ${error.message}`);
    }
    status(`✅ ${agent.name}: ${installed[agent.id].join(', ')} in ${agent.skillsDir}`);
  }
  for (const set of sets) {
    if (set !== 'core') settingsStore.set(ANSWER_KEY[set], 'yes');
  }
  status('Start a new agent session to load them.');
  return installed;
}

/** `postemi skills add [writing|growth|all|core]` */
export async function skillsAdd(argv: any) {
  const terminal = terminalFrom(argv);
  const names: string[] = argv.skills ?? [];
  let sets: SkillSet[];

  if (!names.length) {
    if (terminal.json || !terminal.stdinTTY || !terminal.stderrTTY || terminal.ci) {
      die(`Name the skill: ${BRAND.cli} skills add writing|growth|all`);
    }
    sets = await offerOptionalSkills({ terminal, store: settingsStore, ask, log: status }, true);
    if (!sets.length) {
      result({ installed: {} });
      return;
    }
  } else {
    try {
      sets = parseSetNames(names);
    } catch (error: any) {
      die(error.message);
    }
  }
  try {
    result({ installed: await install(sets, argv, terminal) });
  } catch (error: any) {
    die(error.message);
  }
}

/** `postemi skills remove <writing|growth|all|core>` */
export async function skillsRemove(argv: any) {
  const names: string[] = argv.skills ?? [];
  if (!names.length) die(`Name the skill: ${BRAND.cli} skills remove writing|growth|all`);
  let sets: SkillSet[];
  let agents;
  try {
    sets = parseSetNames(names);
    agents = await chooseAgents({
      found: detectAgents(homedir(), process.env),
      all: knownAgents(homedir(), process.env),
      requested: argv.agent ?? ['all'],
      yes: true,
      terminal: terminalFrom(argv),
      ask,
      log: status,
    });
  } catch (error: any) {
    die(error.message);
  }
  const removed: Record<string, string[]> = {};
  for (const agent of agents) {
    removed[agent.id] = removeSets(sets, agent);
    if (removed[agent.id].length) status(`🗑️  ${agent.name}: removed ${removed[agent.id].join(', ')}`);
  }
  for (const set of sets) {
    if (set !== 'core') settingsStore.set(ANSWER_KEY[set], 'no');
  }
  result({ removed });
}

/**
 * After a successful `auth:login`: offer the optional skills once, on a
 * terminal. Off a terminal, one hint line, once. Never fatal.
 */
export async function offerSkillsAfterLogin(argv: any) {
  try {
    const terminal = terminalFrom(argv);
    const sets = await offerOptionalSkills({ terminal, store: settingsStore, ask, log: status });
    if (sets.length) await install(sets, {}, terminal);
  } catch (error: any) {
    status(`Skills not installed: ${error?.message || error}. Try: ${BRAND.cli} skills add`);
  }
}
