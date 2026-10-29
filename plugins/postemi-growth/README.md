# Postemi Growth (optional plugin)

An optional skill for [Postemi](https://postemi.com), the social media
scheduler: how to grow an audience, not only post. It covers choosing
networks and a first niche, a 30-day posting test, cadence per network,
reading the numbers, 30 post angles for one topic, repurposing one idea
across networks, bios and profile links, and a weekly review.

It is separate from the main Postemi plugins so you install it only if you
want it. It writes nothing and schedules nothing itself: install it next to
the main plugin, which has the tools (MCP) or the commands (CLI), and the
writing skill.

## Install

Claude Code:

```bash
claude plugin marketplace add norbertlevente/postemi-agent
claude plugin install postemi@postemi-agent           # or postemi-cli@postemi-agent
claude plugin install postemi-growth@postemi-agent    # this plugin
```

Cursor: install **postemi-growth** from the same marketplace as **postemi**.
Grok Build: `grok plugin install postemi-growth` from the marketplace that
lists Postemi.

With the CLI instead of a plugin: `postemi skills add growth`.

## What it adds

- Skill `postemi-growth`, with `reference/30-angles.md` and
  `reference/review.md`.

No MCP server, no hooks, no commands; it runs no code and sends no data.

## License

AGPL-3.0. Use of the hosted service is governed by Postemi's terms:
https://postemi.com/terms
