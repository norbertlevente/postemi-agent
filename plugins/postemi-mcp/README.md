# Postemi: Social Media Scheduler (Claude plugin)

Connects Claude to Postemi (https://postemi.com) over MCP, so Claude can write,
schedule and publish social media posts to 20 platforms, including Facebook,
Instagram, X, LinkedIn, TikTok, YouTube, Threads, Bluesky, Pinterest and
Mastodon, with a content calendar and photo and video uploads in full
quality. Browser sign-in, no key.

## Install

```sh
claude plugin marketplace add norbertlevente/postemi-agent
claude plugin install postemi@postemi-agent
```

Then sign in when Claude asks (`/mcp` → postemi → Authenticate in Claude
Code, or the sign-in prompt in the desktop app).

## Requirements

- A Postemi account (https://postemi.com/app/login) on the Pro plan or higher
  (Pro, Creator or Team). Basic has no API or MCP access.
- At least one channel connected in Postemi. Claude cannot connect a social
  account.

## Where data goes

The plugin talks to one service only: the Postemi MCP server named in this
plugin's `.mcp.json`. What it sends: the post text, schedule times, channel
ids and settings you ask Claude to use, and the media you upload. Postemi
stores posts and media in your workspace until you delete them.

- Privacy policy: https://postemi.com/privacy
- Terms: https://postemi.com/terms
- Help: https://postemi.com/help
- Docs: https://postemi.com/docs/mcp
- Support: norbert@postemi.com

Made by Kiss Industries (Basel, Switzerland), the company behind Postemi.

Publishing steps for the owner: [`PUBLISHING.md`](../../PUBLISHING.md).
