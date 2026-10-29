# Postemi listing kit

Everything a directory, marketplace or MCP listing asks for: copy, logos,
covers, screenshots and a demo video. Black and white, like the brand.

- [`copy.md`](./copy.md): name, tagline, descriptions, features, categories,
  tags, FAQ, pricing, MCP details, install snippets, company and contact
- [`REGISTRY.md`](./REGISTRY.md): the official MCP Registry entry
  (`com.postemi/postemi`, [`../server.json`](../server.json)) and how to publish it

Quick facts: https://postemi.com, MCP server `https://mcp.postemi.com/mcp`
(Streamable HTTP, OAuth in the browser), 37 platforms and apps, 7-day free
trial, plans from 19 a month, norbert@postemi.com.

Every URL below is a raw GitHub URL that works once this folder is on `main`.
Screenshots come from the demo workspace (Studio Nord), light theme. The
1440x900 and 1270x760 sets are rendered at 2x and scaled down.

Which image where:

| Listing asks for | Use |
|---|---|
| Square logo or avatar | `logo/postemi-square-white-512.png` (or `-black-` on dark pages) |
| App icon with rounded corners | `logo/postemi-app-icon-black-1024.png` |
| SVG logo | `logo/postemi-square-white.svg`, or `logo/postemi-mark-black.svg` without background |
| Wide or horizontal logo | `logo/postemi-logo-wide-white-1600x480.png`, or `logo/postemi-logo-black.svg` |
| Open Graph or social card | `cover/postemi-og-1200x630.png` |
| Gallery or cover (Product Hunt and similar) | `cover/postemi-cover-1270x760.png`, then the 1270x760 screenshots |
| MCP or AI agent directory cover | `cover/postemi-mcp-1200x630.png` |
| Screenshots | `screenshots/1440x900/`, or `screenshots/1270x760/` |
| Demo video or GIF | `video/demo-schedule-post.mp4` (GIF where video is not accepted) |

## Logos and icons

| File | Size | Use | Raw URL |
|---|---|---|---|
| [`postemi-app-icon-black-1024.png`](./logo/postemi-app-icon-black-1024.png) | 1024x1024, 5 KB | Rounded app icon, black (transparent corners) | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-app-icon-black-1024.png |
| [`postemi-app-icon-black-512.png`](./logo/postemi-app-icon-black-512.png) | 512x512, 2 KB | Rounded app icon, black (transparent corners) | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-app-icon-black-512.png |
| [`postemi-app-icon-black.svg`](./logo/postemi-app-icon-black.svg) | vector | Rounded app icon, black (transparent corners) | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-app-icon-black.svg |
| [`postemi-app-icon-white-1024.png`](./logo/postemi-app-icon-white-1024.png) | 1024x1024, 6 KB | Rounded app icon, white with a hairline edge | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-app-icon-white-1024.png |
| [`postemi-app-icon-white-512.png`](./logo/postemi-app-icon-white-512.png) | 512x512, 2 KB | Rounded app icon, white with a hairline edge | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-app-icon-white-512.png |
| [`postemi-logo-black.svg`](./logo/postemi-logo-black.svg) | vector | Brand logo (mark and wordmark), transparent | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-logo-black.svg |
| [`postemi-logo-white.svg`](./logo/postemi-logo-white.svg) | vector | Brand logo (mark and wordmark), transparent | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-logo-white.svg |
| [`postemi-logo-wide-black-1600x480.png`](./logo/postemi-logo-wide-black-1600x480.png) | 1600x480, 7 KB | Wide logo on black | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-logo-wide-black-1600x480.png |
| [`postemi-logo-wide-white-1600x480.png`](./logo/postemi-logo-wide-white-1600x480.png) | 1600x480, 7 KB | Wide logo on white | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-logo-wide-white-1600x480.png |
| [`postemi-mark-black.svg`](./logo/postemi-mark-black.svg) | vector | Brand mark, transparent | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-mark-black.svg |
| [`postemi-mark-white.svg`](./logo/postemi-mark-white.svg) | vector | Brand mark, transparent | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-mark-white.svg |
| [`postemi-square-black-1024.png`](./logo/postemi-square-black-1024.png) | 1024x1024, 4 KB | White mark on black, 20% safe padding | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-square-black-1024.png |
| [`postemi-square-black-256.png`](./logo/postemi-square-black-256.png) | 256x256, 0 KB | White mark on black, 20% safe padding | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-square-black-256.png |
| [`postemi-square-black-400.png`](./logo/postemi-square-black-400.png) | 400x400, 1 KB | White mark on black, 20% safe padding | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-square-black-400.png |
| [`postemi-square-black-512.png`](./logo/postemi-square-black-512.png) | 512x512, 1 KB | White mark on black, 20% safe padding | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-square-black-512.png |
| [`postemi-square-black.svg`](./logo/postemi-square-black.svg) | vector | White mark on black, 20% safe padding | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-square-black.svg |
| [`postemi-square-white-1024.png`](./logo/postemi-square-white-1024.png) | 1024x1024, 4 KB | Mark on white, 20% safe padding (fits circle crops) | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-square-white-1024.png |
| [`postemi-square-white-256.png`](./logo/postemi-square-white-256.png) | 256x256, 0 KB | Mark on white, 20% safe padding (fits circle crops) | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-square-white-256.png |
| [`postemi-square-white-400.png`](./logo/postemi-square-white-400.png) | 400x400, 1 KB | Mark on white, 20% safe padding (fits circle crops) | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-square-white-400.png |
| [`postemi-square-white-512.png`](./logo/postemi-square-white-512.png) | 512x512, 1 KB | Mark on white, 20% safe padding (fits circle crops) | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-square-white-512.png |
| [`postemi-square-white.svg`](./logo/postemi-square-white.svg) | vector | Mark on white, 20% safe padding (fits circle crops) | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-square-white.svg |
| [`postemi-wordmark-black.svg`](./logo/postemi-wordmark-black.svg) | vector | Wordmark only, transparent | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-wordmark-black.svg |
| [`postemi-wordmark-white.svg`](./logo/postemi-wordmark-white.svg) | vector | Wordmark only, transparent | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/logo/postemi-wordmark-white.svg |

## Covers and Open Graph

| File | Size | Use | Raw URL |
|---|---|---|---|
| [`postemi-cover-1270x760.png`](./cover/postemi-cover-1270x760.png) | 1270x760, 69 KB |  | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/cover/postemi-cover-1270x760.png |
| [`postemi-cover-1600x900.png`](./cover/postemi-cover-1600x900.png) | 1600x900, 67 KB | Wide cover with the New post screenshot | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/cover/postemi-cover-1600x900.png |
| [`postemi-mcp-1200x630.png`](./cover/postemi-mcp-1200x630.png) | 1200x630, 22 KB | AI agent cover with the MCP URL (MCP directories) | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/cover/postemi-mcp-1200x630.png |
| [`postemi-mcp-1270x760.png`](./cover/postemi-mcp-1270x760.png) | 1270x760, 24 KB | AI agent cover with the MCP URL (MCP directories) | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/cover/postemi-mcp-1270x760.png |
| [`postemi-og-1200x630.png`](./cover/postemi-og-1200x630.png) | 1200x630, 64 KB | Open Graph image: headline and calendar screenshot | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/cover/postemi-og-1200x630.png |

## Screenshots, 1440x900

| File | Size | Use | Raw URL |
|---|---|---|---|
| [`postemi-01-calendar.png`](./screenshots/1440x900/postemi-01-calendar.png) | 1440x900, 71 KB | Calendar, week view | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/screenshots/1440x900/postemi-01-calendar.png |
| [`postemi-02-new-post.png`](./screenshots/1440x900/postemi-02-new-post.png) | 1440x900, 69 KB | New post: one editor, three networks, live preview | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/screenshots/1440x900/postemi-02-new-post.png |
| [`postemi-03-new-post-templates.png`](./screenshots/1440x900/postemi-03-new-post-templates.png) | 1440x900, 88 KB | New post with Templates | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/screenshots/1440x900/postemi-03-new-post-templates.png |
| [`postemi-04-channels.png`](./screenshots/1440x900/postemi-04-channels.png) | 1440x900, 73 KB | Channels: connect 37 platforms and apps | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/screenshots/1440x900/postemi-04-channels.png |
| [`postemi-05-insights.png`](./screenshots/1440x900/postemi-05-insights.png) | 1440x900, 49 KB | Insights | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/screenshots/1440x900/postemi-05-insights.png |
| [`postemi-06-notifications.png`](./screenshots/1440x900/postemi-06-notifications.png) | 1440x900, 62 KB | Notifications | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/screenshots/1440x900/postemi-06-notifications.png |

## Screenshots, 1270x760

| File | Size | Use | Raw URL |
|---|---|---|---|
| [`postemi-01-calendar.png`](./screenshots/1270x760/postemi-01-calendar.png) | 1270x760, 73 KB | Calendar, week view | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/screenshots/1270x760/postemi-01-calendar.png |
| [`postemi-02-new-post.png`](./screenshots/1270x760/postemi-02-new-post.png) | 1270x760, 62 KB | New post: one editor, three networks, live preview | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/screenshots/1270x760/postemi-02-new-post.png |
| [`postemi-03-new-post-templates.png`](./screenshots/1270x760/postemi-03-new-post-templates.png) | 1270x760, 76 KB | New post with Templates | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/screenshots/1270x760/postemi-03-new-post-templates.png |
| [`postemi-04-channels.png`](./screenshots/1270x760/postemi-04-channels.png) | 1270x760, 79 KB | Channels: connect 37 platforms and apps | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/screenshots/1270x760/postemi-04-channels.png |
| [`postemi-05-insights.png`](./screenshots/1270x760/postemi-05-insights.png) | 1270x760, 44 KB | Insights | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/screenshots/1270x760/postemi-05-insights.png |
| [`postemi-06-notifications.png`](./screenshots/1270x760/postemi-06-notifications.png) | 1270x760, 55 KB | Notifications | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/screenshots/1270x760/postemi-06-notifications.png |

## Demo video

| File | Size | Use | Raw URL |
|---|---|---|---|
| [`demo-schedule-post.gif`](./video/demo-schedule-post.gif) | 960x600, 925 KB | Demo: pick channels, write once, add to queue, see it in the calendar | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/video/demo-schedule-post.gif |
| [`demo-schedule-post.mp4`](./video/demo-schedule-post.mp4) | 1440x900, 13 s, 351 KB | Demo: pick channels, write once, add to queue, see it in the calendar | https://raw.githubusercontent.com/norbertlevente/postemi-agent/main/listing/video/demo-schedule-post.mp4 |

## Rebuilding the images

The screenshots and video come from the Postemi web app's demo build
(`NEXT_PUBLIC_POSTEMI_BACKEND=demo`, session cookie `__Host-pm_session=demo`)
with Playwright; the logos and covers are rendered from the brand SVGs in the
web app's `public/brand/` with Geist. Keep the headline and counts in step with
`copy.md` and postemi.com.
