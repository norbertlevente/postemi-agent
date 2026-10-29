# Publishing Postemi

Everything in this repository is prepared and committed. **Only the owner
pushes, runs `npm publish`, and clicks Publish or Submit** in a directory.
Do the steps in this order; each one says how to check it.

## What exists

| Artefact | Where | Points at |
|---|---|---|
| npm package `postemi` (command `postemi`) | repository root (`src/`, built by `pnpm build` into `dist/`) | `https://api.postemi.com`, device login on postemi.com/app/device |
| Claude chat bundle `postemi` | `plugins/postemi-mcp` | `https://mcp.postemi.com/mcp` |
| Claude Code plugin `postemi-cli` | `plugins/postemi-cli` | the `postemi` command |
| ChatGPT app "Postemi: Social Media Scheduler" | `plugins/postemi-chatgpt` (see its `SUBMIT.md`) | `https://mcp.postemi.com/mcp` |
| Cursor plugin `postemi` | `plugins/postemi-cursor`, listed in `.cursor-plugin/marketplace.json` | same |
| Grok Build plugin `postemi` | `plugins/postemi-grok` | same |
| Agent skill `postemi` (ClawHub, Hermes, skills.sh) | `skills/postemi/SKILL.md` | the `postemi` command |
| Agent skills `postemi-writing`, `postemi-templates` | `skills/<name>/`, copied into every main plugin by `pnpm sync:skills`; in the npm package for `postemi skills add writing` | the `postemi` skill or the MCP tools |
| Optional plugin `postemi-growth` (Claude Code, Cursor, Grok) | `plugins/postemi-growth`, skill copied by `pnpm sync:skills`; in the npm package for `postemi skills add growth` | the `postemi` skill or the MCP tools |
| Gemini CLI extension | separate repo `norbertlevente/postemi-gemini` | same MCP URL |

The Claude marketplace in `.claude-plugin/marketplace.json` is named
`postemi-agent` and lists `postemi`, `postemi-cli` and the optional
`postemi-growth`. The Cursor marketplace lists `postemi` and `postemi-growth`.

## 0. Before anything: checks

```bash
curl -s https://api.postemi.com/public/v1/status            # names Postemi
curl -si https://mcp.postemi.com/mcp | head -5              # 401 with WWW-Authenticate
pnpm install
pnpm test                                                   # type check, build, repository checks
node dist/index.js auth:login                               # approve on postemi.com/app/device
node dist/index.js auth:status                              # authenticated: true
node dist/index.js integrations:list
```

## 1. Create and push the repository (owner)

```bash
gh repo create norbertlevente/postemi-agent --private --description "Postemi CLI, agent skill and plugins" --source . --remote origin
git push -u origin main
```

Make it public when it should be listed (`gh repo edit norbertlevente/postemi-agent --visibility public --accept-visibility-change-consequences`).
The Claude marketplace, skills.sh, the Claude directory and the Cursor
Marketplace all read the public repository, so steps 3, 5 and 7 come after
it is public.

Check:

```bash
claude plugin marketplace add norbertlevente/postemi-agent
claude plugin install postemi@postemi-agent
claude plugin install postemi-cli@postemi-agent
claude plugin install postemi-growth@postemi-agent
```

## 2. npm `postemi` 1.0.1 (owner, in Terminal.app: the 2FA is a passkey)

1.0.0 is already on npm. 1.0.1 changes only the package metadata (the
repository moved to `postemi-agent`), so the command behaves the same.

```bash
pnpm run release:check               # builds, packs and dry-runs; publishes nothing
npm publish --access public          # prepublishOnly rebuilds dist/
```

Check: `npm view postemi version` (1.0.1, a few minutes after),
`npm i -g postemi && postemi --help && postemi auth:status`.
The tarball holds `dist/index.js` (starts with `#!/usr/bin/env node`),
`dist/index.js.map`, `README.md`, `SKILL.md`, `PROVIDER_SETTINGS.md`,
`SUPPORTED_FILE_TYPES.md`, `examples/`, `skills/` (core, writing, templates,
growth, for `postemi skills add`), `LICENSE` and `package.json`.

## 3. Claude directory: the chat bundle (owner submits)

Must be live first:

1. The Postemi MCP server at the URL in `plugins/postemi-mcp/.mcp.json`, with
   OAuth sign-in (discovery, dynamic client registration, consent) and the
   full tool list. Check it in Claude Code: install from a local checkout,
   `/mcp` → postemi → Authenticate, then list channels and preview a post.
2. https://postemi.com/ai/claude, /docs/mcp, /help, /privacy and /terms
   answer 200.
3. This repository public on GitHub (step 1). A push to `main` fires the
   Anthropic directory webhook once the bundle is listed, so ask before
   pushing.

Steps:

1. Open https://claude.ai/directory/manage and start a NEW plugin bundle
   submission.
2. Repository `norbertlevente/postemi-agent`, path `plugins/postemi-mcp`.
   Name, display name, description, links and icon come from
   `plugins/postemi-mcp/.claude-plugin/plugin.json`.
3. The icon (`.claude-plugin/icon.png`, 512 x 512, the black Postemi mark on
   white) is read ONCE, at the first save. Check it before the first save.
4. Listing text: the `description` in `plugin.json`.
5. Optional: a separate Postemi MCP connector with the same URL as
   `.mcp.json`. The directory pairs a bundle and a connector by URL. Use a
   Postemi reviewer account (for example `reviewer@postemi.com`, with
   Facebook, Instagram and YouTube connected).
6. Click Submit (owner only).

If the MCP URL changes, change it in `.mcp.json` only, before the first
submission. Do not submit `postemi-cli`: the CLI plugin is not listed at
Anthropic; it lives in this repository's marketplace.

## 4. ChatGPT app (owner submits)

Follow `plugins/postemi-chatgpt/SUBMIT.md`. Open TODOs there: the demo video
(`review.demo_recording_url`), the review test image on postemi.com, the
reviewer account. ZIP the folder contents without `SUBMIT.md`:

```bash
cd plugins/postemi-chatgpt && zip -r ../../postemi-chatgpt-1.0.0.zip plugin.json mcp.json assets skills
```

Upload with the general "Upload new or existing plugin" box, so it is a NEW
app. After approval, publish by hand.

## 5. ClawHub `postemi` (feeds Hermes), skills.sh

From the repository root (the path must be a folder):

```bash
clawhub skill publish ./skills/postemi --slug postemi --version 1.0.1
```

Check: the scan is CLEAN, `hermes skills install clawhub/postemi` works.
skills.sh lists skills from public GitHub repositories, so once step 1 has
made the repository public, `skills/postemi` is installable from
`norbertlevente/postemi-agent`.

## 6. Gemini CLI extension (owner creates the repository)

The extension is its own repository, `postemi-gemini`:

```bash
cd ../postemi-gemini
gh repo create norbertlevente/postemi-gemini --public --description "Postemi extension for Gemini CLI" --source . --remote origin
gh repo edit norbertlevente/postemi-gemini --add-topic gemini-cli-extension
git push -u origin main
```

Check: `gemini extensions install https://github.com/norbertlevente/postemi-gemini`,
then `/mcp` shows `postemi` and the browser sign-in opens on postemi.com.

## 7. Cursor and Grok

- Cursor Marketplace (cursor.com/marketplace/publish): repository
  `norbertlevente/postemi-agent`, plugin `postemi` from
  `.cursor-plugin/marketplace.json` (`plugins/postemi-cursor`).
- Grok Build: a pull request to `xai-org/plugin-marketplace` vendoring
  `plugins/postemi-grok` as `external_plugins/postemi`.
  `grok plugin validate plugins/postemi-grok` must pass first. The optional
  growth plugin goes in the same pull request as `external_plugins/postemi-growth`
  (`grok plugin validate plugins/postemi-growth`).
- Cursor lists `postemi-growth` from the same `.cursor-plugin/marketplace.json`.

## Optional skills, per format

The core `postemi` skill is always on. `postemi-writing` (with
`postemi-templates`) ships in every main plugin. `postemi-growth` is optional:

| Format | How growth is optional |
|---|---|
| npm CLI | `postemi skills add growth` (and `writing`): asked once after `auth:login` on a terminal, never for an agent |
| Claude Code | separate plugin `postemi-growth` in the `postemi-agent` marketplace |
| Cursor | separate plugin `postemi-growth` in `.cursor-plugin/marketplace.json` |
| Grok Build | separate plugin `postemi-growth`, vendored next to `postemi` |
| Claude chat bundle (`postemi-mcp`) | not in the bundle; the directory takes one bundle, so growth comes as MCP prompts (below) |
| ChatGPT app | not in the package; one app per listing, so growth comes as MCP prompts (below) |

## MCP plan: writing and growth as prompts (server side, not built yet)

MCP prompts are picked by the user (a slash command or a menu entry in the
client), so they are optional by nature: nothing loads until the user asks.
The hosted server at `https://mcp.postemi.com/mcp` lives in the platform
repository, not here; this is the plan for it:

- **Prompts**
  - `write_post` (arguments: `topic`, optional `network`, `goal`): the
    `postemi-writing` rules for that network plus the check before
    publishing, ending in `preview_post`.
  - `use_template` (arguments: `template` id or a goal like launch, tip,
    poll; optional `network`): one template from `postemi-templates` with its
    placeholders, to fill in with the user.
  - `content_plan_30_days` (arguments: `topic`, `networks`, optional
    `posts_per_week`): the `postemi-growth` 30-day test and the 30 angles,
    ending in drafts the user previews and schedules.
- **Resources** the client reads only when a prompt or the user asks for
  them: `postemi://skills/writing`, `postemi://skills/writing/networks`,
  `postemi://skills/templates` (the index) and
  `postemi://skills/templates/<group>`, `postemi://skills/growth` and
  `postemi://skills/growth/30-angles`. Text from `skills/` in this repository,
  copied into the server at build time.
- **Server instructions**: one line saying the three prompts exist and are
  optional ("If the user wants help writing or planning, offer the
  write_post, use_template or content_plan_30_days prompts"), so the model
  offers them instead of loading them on every chat.

## Versions

Bump `version` in `package.json` and add a `CHANGELOG.md` entry for every npm
release; npm versions are immutable. The plugin manifests have their own
versions (`plugins/*/…/plugin.json`); bump one when its plugin changes.

| Error | Cause |
|---|---|
| `403 Forbidden` | Not logged in to npm, or not an owner of `postemi` |
| `EPUBLISHCONFLICT` | That version is already published; bump |
| Command not found after install | `bin` wrong, or `dist/index.js` lost its shebang |
