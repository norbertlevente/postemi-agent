# Changelog

All notable changes to the Postemi CLI (npm `postemi`) are listed here.

## 1.2.0 (2026-11-19)

Brings the Postemi CLI up to date with everything the public API offers.

- **Changing posts after they are made.** `posts:get <id>` reads one
  channel's post in full: every part with its media, the alt text, the video
  cover, the settings, the tags, the state, the publish time and, for a
  failed post, the reason. `posts:update <id>` changes a scheduled, draft or
  failed post (send every part again with `-c`/`-m`, or `--json` with
  `{date, type, settings, parts:[{content, attachments, altText, cover}]}`);
  without `-s` the post keeps its time, without `-t` a draft stays a draft.
  `posts:reschedule <id...> -s <date>` moves posts without touching their
  content. `posts:retry <id...> [-s date] [--confirmed]` publishes failed
  posts again when a retry can work: Postemi decides per post and never risks
  a second copy; the answer quotes the platform's own message.
- **Alt text and video covers.** `--alt <text>` (repeat it, in `-m` order)
  on `posts:create` and `posts:update`. `--cover-frame <seconds>` picks a
  frame of the post's first video as its cover (Instagram, TikTok with
  `DIRECT_POST`); `--cover-image <url>` sets a separate cover picture
  (Instagram). With `--json` these go on the media items instead.
- **`upload:url <https-url>`**: imports an image or video that is already
  online into the media library (POST /upload-from-url), same answer as
  `upload`.
- **`notifications:list [--page N]`**: the workspace notifications, newest
  first, 100 a page (failed posts, channels that need a reconnect).
- **Analytics.** Every analytics route of the API has a command:
  `analytics:platform <integration-id>` (now also `analytics:channel`) for a
  channel over `-d` days and `analytics:post <post-id>` for one published
  post. They return the platform's own numbers; an empty answer or
  `{"missing": true}` now comes with a one-line explanation on stderr
  (stdout stays the JSON). The ids are URL-encoded.
- **The `postemi` CLI skill is rewritten**: a Confirm step before anything is
  posted, the channel status table (37 platforms and apps, unchanged), media,
  covers and alt text, changing and retrying posts, the surprising behaviours
  (links removed from X, 24 hour caps, the YouTube daily cap, the monthly X
  quota), analytics. Account creation, key scopes, billing, rate limits and
  the analytics repair move to `reference/details.md` (shipped in the npm
  package and in `skills/postemi`).
- **Writing and growth skills**: Pinterest is live everywhere in them; the
  writing skill writes in the user's language and points at the analytics
  commands and the MCP analytics tools; the growth skill reads the numbers
  with `get_analytics` and `get_post_analytics` on MCP.
- **MCP skills** (the Claude plugin, ChatGPT, Cursor, Grok): the current tool
  list, with `get_post`, `update_post`, `reschedule_post`, `retry_post`,
  `read_settings`, `update_settings`, `open_postemi` and the analytics tools
  `get_analytics` and `get_post_analytics`; the rules for X links, the 24 hour
  caps, the monthly X quota, alt text and covers, failed posts.
- Repository: `pnpm sync:skills` also copies the CLI skill to the root and
  the `postemi-cli` plugin; `pnpm test` checks those copies and every skill
  file for dashes and broken links. Plugins: `postemi`, `postemi-cli`,
  `postemi-cursor`, `postemi-grok` and the ChatGPT app 1.1.0,
  `postemi-growth` 1.0.1.

## 1.1.1 (2026-10-29)

- The `postemi` skill and the package description list all 37 platforms and
  apps Postemi offers, Pinterest live and the newer channels (Hashnode,
  Lemmy, Nostr, Webflow, Shopify, newsletters and more) in beta. The old text
  said 25+ and called Pinterest coming soon.
- The ChatGPT skills call `open_postemi` and read `postemi://` links, the
  Postemi MCP server's names since today.

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
