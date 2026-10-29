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
| Agent skills `postemi-writing`, `postemi-growth`, `postemi-templates` | `skills/<name>/`, copied into every plugin by `pnpm sync:skills` | the `postemi` skill or the MCP tools |
| Gemini CLI extension | separate repo `norbertlevente/postemi-gemini` | same MCP URL |

The Claude marketplace in `.claude-plugin/marketplace.json` is named
`postemi-agent` and lists `postemi` and `postemi-cli`.

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
`SUPPORTED_FILE_TYPES.md`, `examples/`, `LICENSE` and `package.json`.

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
  `grok plugin validate plugins/postemi-grok` must pass first.

## Versions

Bump `version` in `package.json` and add a `CHANGELOG.md` entry for every npm
release; npm versions are immutable. The plugin manifests have their own
versions (`plugins/*/…/plugin.json`); bump one when its plugin changes.

| Error | Cause |
|---|---|
| `403 Forbidden` | Not logged in to npm, or not an owner of `postemi` |
| `EPUBLISHCONFLICT` | That version is already published; bump |
| Command not found after install | `bin` wrong, or `dist/index.js` lost its shebang |
