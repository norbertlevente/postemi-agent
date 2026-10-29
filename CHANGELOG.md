# Changelog

All notable changes to the Postemi CLI (npm `postemi`) are listed here.

## 1.1.0 (2026-10-29)

- New command `postemi skills` (`list`, `add`, `remove`): installs the agent
  skills into Claude Code, Codex, Cursor and Grok Build (the ones found on
  the machine; `--agent` and `--yes` skip the questions). The core `postemi`
  skill comes with any of them; `writing` (`postemi-writing` and
  `postemi-templates`) and `growth` (`postemi-growth`) are optional. The npm
  package now ships `skills/`.
- After `postemi auth:login` on a terminal the CLI asks once whether to
  install the writing and the growth skill (default No) and remembers the
  answers in `~/.postemi/config.json`. Off a terminal (an agent, `--json`,
  `CI`) it never asks and prints one hint, once. `auth:login` takes `--json`.
- The skills: `postemi-writing` (ideas, hooks, openers, formatting, network
  rules, a pre-publish check), `postemi-growth` (niche, 30-day test, numbers,
  cadence, 30 angles, repurposing, profile funnel, weekly review) and
  `postemi-templates` (the composer's templates and hooks, generated from the
  web app by `scripts/sync-templates.mjs`). Writing and templates ship in
  every main plugin; growth is its own optional plugin, `postemi-growth`.
- `scripts/sync-skills.mjs` copies them into the plugins; `pnpm test` runs
  unit tests and checks the copies, their links and that they hold no em or
  en dashes.

## 1.0.1

- The source moved to its own repository,
  https://github.com/norbertlevente/postemi-agent. `repository`, `bugs` and the
  plugin manifests point there; the Claude Code marketplace is now
  `norbertlevente/postemi-agent` (`claude plugin install postemi-cli@postemi-agent`).
- The CLI reads `POSTEMI_*` environment variables only.
- No change to the commands, their flags or their output.

## 1.0.0

- First release of the Postemi CLI, command `postemi`: posts, integrations,
  analytics, uploads and upload links, workspaces, billing (plans Basic, Pro,
  Creator and Team; a Stripe Checkout link the person pays themselves),
  settings, `auth:login` (device flow on postemi.com/app/device),
  `auth:signup`, `auth:status` and `auth:logout`.
- Talks to `https://api.postemi.com`; stores credentials and settings in
  `~/.postemi`.
