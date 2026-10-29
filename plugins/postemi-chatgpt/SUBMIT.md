# Submitting Postemi to the ChatGPT app directory (owner)

This package is a NEW app, "Postemi: Social Media Scheduler", version 1.0.0.
It is not a version of any other app on the same OpenAI account. Only the
owner submits. Nothing here has
been uploaded or submitted.

## Identity: do not reuse another app's id

- `plugin.json` `name` is `postemi`. A package whose `name` is an existing
  OpenAI app id (`app-...`) lands on that app's listing when uploaded. Never
  copy another app's id here.
- TODO (owner): the OpenAI app id field is empty on purpose. Create the new
  app first (see below). If OpenAI then assigns an id like `app-...` and later
  uploads need it to match, put that id in `name` and commit it. Until then
  `postemi` stays.
- Create it with the dashboard's general "Upload new or existing plugin" box
  (this is the path that makes a separate plugin). Do NOT use an existing
  listing's own "Upload plugin to make changes" box.

## Must be live first

1. The Postemi MCP server at the URL in `mcp.json` (one place; change it there
   only, for example if the backend ends up on `/mcp-oauth`), with OAuth
   sign-in, the full tool list, the cards, the side panel, the settings page
   and the @ menu. The widget CSP and the upload card's storage CORS must
   allow the new app's sandbox origin (a bucket rule written for another app's
   origin does not).
2. https://postemi.com, /help, /privacy, /terms and /app/login answer 200.
3. The review test image at https://postemi.com/review/postemi-test-photo.jpg
   (TODO: add the review test photo to the Postemi web repo as
   `public/review/postemi-test-photo.jpg` and deploy).
4. Test in developer mode first: ChatGPT Settings, Security and login,
   Developer mode; add the URL from `mcp.json`; Refresh. Check the sidebar
   entry, the side panel, the settings page and the @ menu on desktop.

## Reviewer account (TODO, owner creates)

- E-mail: `reviewer@postemi.com` (placeholder; create the mailbox and the
  account).
- Login: https://postemi.com/app/login
- Setup: a plan with API and MCP access, a Facebook Page, Instagram and
  YouTube connected, a timezone set.
- Enter the credentials in the dashboard's Review information dialog. They are
  not in the package.

## Demo video (TODO, owner records)

`review.demo_recording_url` in `plugin.json` holds a TODO text. Record the
13-step script (the positive test cases in `plugin.json`, in order) on the Postemi reviewer account, upload it to YouTube (unlisted is
fine) and put the link there before the final upload.

## Steps on platform.openai.com

1. Plugins, "Upload new or existing plugin", the owner's verified identity. Upload a
   ZIP of this folder's contents (`plugin.json`, `mcp.json`, `assets/`,
   `skills/`; leave `SUBMIT.md` out). Check that a NEW plugin named "Postemi:
   Social Media Scheduler" was created and that no existing listing changed.
2. MCPs tab: Connect account for the scan (the reviewer account or the
   owner's), run the scan, resolve findings.
3. Review information: reviewer credentials, check the test cases, the video
   link and the 25 countries listed below.
4. Submit (owner only). After approval, publish by hand.

## Listing facts

- Display name: Postemi: Social Media Scheduler
- Version: 1.0.0, English only (no translations)
- Countries: CH, AT, DE, CZ, SK, PL, RO, SI, GB, IE, US, CA, FR, ES, IT, PT,
  NL, BE, LU, SE, DK, NO, FI, HR, GR
- Links: https://postemi.com, /help, /privacy, /terms
- Brand colour #0A0A0A (dark mode #FFFFFF); logo `assets/logo.png` (512 x 512,
  black mark on white), composer icon `assets/logo.svg` (black mark).
- The MCP server at mcp.postemi.com lists `open_postemi` and
  `open_postemi_panel`, the widgets `ui://postemi/*` and the @-menu links
  `postemi://`; the skills call them as written. (The old tool names still
  run there as hidden aliases, but are never listed.) Submit only after
  the backend with these names is deployed.
