# Postemi CLI

**Social media scheduling from the command line, or from your AI agent.**

Postemi (https://postemi.com) is a social media scheduler, and this is its
command-line tool. It uses the same public API as the web app: what you
schedule here shows up in your Postemi calendar, and what you schedule there
you can see here too.

Channels: 25+ platforms, including Facebook, Instagram, X, LinkedIn, TikTok, YouTube, Threads, Bluesky, Pinterest and Mastodon.

Plan: the CLI, the API and MCP need the Pro plan or higher (Pro, Creator or
Team). Basic has no API access.

[`SKILL.md`](./SKILL.md) is the full command reference, written for AI agents.
Show it to Claude, ChatGPT, Codex, OpenClaw or Hermes and they can use the
whole CLI with no further explanation.

## Install

```bash
npm install -g postemi
postemi --help
```

Node.js 18 or newer.

## Sign in

```bash
postemi auth:login     # device flow: opens postemi.com/app/device in the browser
postemi auth:status    # checks the credential
postemi auth:logout    # deletes the stored credential
```

You approve the login in the browser while signed in to Postemi, and choose
there which workspace and which channels the key may reach. The CLI stores it
in `~/.postemi/credentials.json` (mode `0600`).

No account yet? Create one from the terminal:

```bash
postemi auth:signup --email anna@example.com    # e-mails a code, asks for it and for the terms
postemi auth:signup --email anna@example.com --code 123456 --accept-terms --workspace-name "Anna's Cafe"
```

The person must agree to https://postemi.com/terms and
https://postemi.com/privacy first. An account made with `postemi auth:signup`
has no free trial: next come `postemi billing:plans` and
`postemi billing:subscribe`. Signing up at https://postemi.com/app/signup
instead starts a 7-day free trial; then run `postemi auth:login`.

For a server, CI or an agent without a browser, use an API key from
Settings, Developers in the web app:

```bash
export POSTEMI_API_KEY=your_api_key
```

| Variable | Default | Purpose |
|---|---|---|
| `POSTEMI_API_KEY` | none | API key, when you do not use `auth:login` |
| `POSTEMI_API_URL` | `https://api.postemi.com` | API base |
| `POSTEMI_WORKSPACE` | none | Workspace id for every command (same as `--workspace`) |
| `POSTEMI_TIMEZONE` | none | IANA zone for dates written without an offset |
| `POSTEMI_AUTH_SERVER` | `https://api.postemi.com` | Where `auth:login` runs the device flow |
| `POSTEMI_CLIENT_NAME` | `Postemi CLI` | Name shown on the approval page |

Stored credentials from `auth:login` take precedence over `POSTEMI_API_KEY`.

## Quick start

```bash
postemi auth:status
postemi integrations:list                        # your channels and their ids
postemi config:set timezone Europe/London        # once: how to read dates without an offset

IMG=$(postemi upload ./photo.jpg | jq -r '.path')
postemi posts:create -c "Hello from the terminal" -m "$IMG" \
  -s "2026-12-31 09:00" -i "<integration-id>"
```

Results are JSON on stdout; status lines and errors go to stderr, and every
failure exits 1. Run `postemi <command> --help` for each command.

## More

- [`SKILL.md`](./SKILL.md): every command, flag and rule
- [`PROVIDER_SETTINGS.md`](./PROVIDER_SETTINGS.md): per-channel settings
- [`SUPPORTED_FILE_TYPES.md`](./SUPPORTED_FILE_TYPES.md): the eight accepted media types
- [`examples/`](./examples): ready `--json` payloads
- MCP server for chat clients: `https://mcp.postemi.com/mcp`
- Help: https://postemi.com/help, support: norbert@postemi.com
- Privacy: https://postemi.com/privacy, terms: https://postemi.com/terms

## Plugins for AI agents

This repository also holds the Postemi plugins, in [`plugins/`](./plugins):

| Folder | For | What it is |
|---|---|---|
| [`plugins/postemi-mcp`](./plugins/postemi-mcp) | Claude (chat, desktop, Code) | The hosted MCP server `https://mcp.postemi.com/mcp` plus a skill |
| [`plugins/postemi-cli`](./plugins/postemi-cli) | Claude Code | This CLI's skill; the agent runs `postemi` commands |
| [`plugins/postemi-chatgpt`](./plugins/postemi-chatgpt) | ChatGPT | The ChatGPT app package |
| [`plugins/postemi-cursor`](./plugins/postemi-cursor) | Cursor | MCP server, skill and commands |
| [`plugins/postemi-grok`](./plugins/postemi-grok) | Grok Build | MCP server, skill and commands |

In Claude Code:

```bash
claude plugin marketplace add norbertlevente/postemi-agent
claude plugin install postemi@postemi-agent        # MCP server
claude plugin install postemi-cli@postemi-agent    # CLI skill
```

The skill on its own (for OpenClaw and other agents) is
[`skills/postemi/SKILL.md`](./skills/postemi/SKILL.md).

### Writing and growth skills

Three more skills help the agent write the posts, not only schedule them.
Every plugin above ships them:

| Skill | What it teaches |
|---|---|
| [`skills/postemi-writing`](./skills/postemi-writing) | post ideas, hooks and headlines, opening lines, formatting, threads, each network's writing rules, a check before publishing |
| [`skills/postemi-growth`](./skills/postemi-growth) | choosing networks and a first niche, a 30-day test, reading the numbers, cadence, 30 angles for one topic, repurposing, bios and profile links, a weekly review |
| [`skills/postemi-templates`](./skills/postemi-templates) | the template and hook library of the Postemi composer, generated from the web app |

## Development

```bash
pnpm install
pnpm build        # dist/index.js
pnpm test         # type check, build, and scripts/check.mjs (manifests, skill copies, no other-brand text)
node dist/index.js --help

pnpm sync:templates ../postemi/src/lib/app/templates   # regenerate skills/postemi-templates/reference from the web app
pnpm sync:skills                                       # copy the three shared skills into every plugin
```

Release steps: [`PUBLISHING.md`](./PUBLISHING.md). Changes: [`CHANGELOG.md`](./CHANGELOG.md).

License: AGPL-3.0, see [`LICENSE`](./LICENSE).
Source: https://github.com/norbertlevente/postemi-agent
