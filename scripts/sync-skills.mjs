#!/usr/bin/env node
/*
  Copies the shared writing skills from skills/ into every plugin that ships
  skills, so each plugin folder is complete on its own (the plugin
  directories and the ChatGPT ZIP take a folder, not a link):

    skills/postemi-writing, skills/postemi-growth, skills/postemi-templates
      -> plugins/<plugin>/skills/<same name>

  `pnpm test` (scripts/check.mjs) fails when a copy differs. Run this after
  editing any of the three skills, or after scripts/sync-templates.mjs.
  The `postemi` skill itself is not copied: each plugin has its own version
  (CLI, MCP, ChatGPT, Cursor, Grok).
*/
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SHARED_SKILLS = ['postemi-writing', 'postemi-growth', 'postemi-templates'];
export const SKILL_PLUGINS = ['postemi-cli', 'postemi-mcp', 'postemi-chatgpt', 'postemi-cursor', 'postemi-grok'];

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const plugin of SKILL_PLUGINS) {
    for (const skill of SHARED_SKILLS) {
      const from = join(root, 'skills', skill);
      if (!existsSync(join(from, 'SKILL.md'))) {
        console.error(`sync-skills: ${from}/SKILL.md not found`);
        process.exit(1);
      }
      const to = join(root, 'plugins', plugin, 'skills', skill);
      rmSync(to, { recursive: true, force: true });
      cpSync(from, to, { recursive: true });
    }
  }
  console.log(`sync-skills: ${SHARED_SKILLS.length} skills -> ${SKILL_PLUGINS.length} plugins`);
}
