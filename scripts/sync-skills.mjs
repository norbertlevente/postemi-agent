#!/usr/bin/env node
/*
  Copies the shared skills from skills/ into the plugins that ship them, so
  each plugin folder is complete on its own (the plugin directories and the
  ChatGPT ZIP take a folder, not a link):

    main plugins (postemi-cli, postemi-mcp, postemi-chatgpt, postemi-cursor,
    postemi-grok):  skills/postemi-writing, skills/postemi-templates
    optional plugin postemi-growth:  skills/postemi-growth

  postemi-growth is NOT in the main plugins: it is its own plugin in the
  Claude Code, Cursor and Grok marketplaces, so a person installs it only
  when they want it. A shared skill a plugin should not have is deleted.

  `pnpm test` (scripts/check.mjs) fails when a copy differs or a skill is
  where it should not be. Run this after editing any shared skill, or after
  scripts/sync-templates.mjs. The `postemi` skill itself is not copied: each
  main plugin has its own version (CLI, MCP, ChatGPT, Cursor, Grok).
*/
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SHARED_SKILLS = ['postemi-writing', 'postemi-growth', 'postemi-templates'];
export const MAIN_PLUGINS = ['postemi-cli', 'postemi-mcp', 'postemi-chatgpt', 'postemi-cursor', 'postemi-grok'];

/** Which shared skills each plugin ships. */
export const PLUGIN_SKILLS = {
  ...Object.fromEntries(MAIN_PLUGINS.map((p) => [p, ['postemi-writing', 'postemi-templates']])),
  'postemi-growth': ['postemi-growth'],
};

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let copies = 0;
  for (const [plugin, wanted] of Object.entries(PLUGIN_SKILLS)) {
    for (const skill of SHARED_SKILLS) {
      const to = join(root, 'plugins', plugin, 'skills', skill);
      rmSync(to, { recursive: true, force: true });
      if (!wanted.includes(skill)) continue;
      const from = join(root, 'skills', skill);
      if (!existsSync(join(from, 'SKILL.md'))) {
        console.error(`sync-skills: ${from}/SKILL.md not found`);
        process.exit(1);
      }
      cpSync(from, to, { recursive: true });
      copies++;
    }
  }
  console.log(`sync-skills: ${copies} skill copies in ${Object.keys(PLUGIN_SKILLS).length} plugins`);
}
