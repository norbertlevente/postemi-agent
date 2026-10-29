# Changelog

All notable changes to the Postemi CLI (npm `postemi`) are listed here.

## Unreleased

- Three new agent skills, shipped in every plugin (CLI, MCP, ChatGPT, Cursor,
  Grok): `postemi-writing` (ideas, hooks, openers, formatting, network rules,
  a pre-publish check), `postemi-growth` (niche, 30-day test, numbers,
  cadence, 30 angles, repurposing, profile funnel, weekly review) and
  `postemi-templates` (the composer's templates and hooks, generated from the
  web app by `scripts/sync-templates.mjs`).
- `scripts/sync-skills.mjs` copies them into the plugins; `pnpm test` checks
  the copies, their links and that they hold no em or en dashes.
- No change to the CLI commands.

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
