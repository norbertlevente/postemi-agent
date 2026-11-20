# Submit Postemi to the ChatGPT directory

Create a new plugin in the owner's OpenAI **Personal** organization. The
package name is `postemi`, the listing name is **Postemi Social Media Scheduler**,
and the first version is `1.0.0`. Use the general upload control and choose
**With MCP** if prompted. Use Norbert Levente Kiss as the verified developer
identity and a project with global data residency.

## Production MCP checks

The package declares Streamable HTTP at https://mcp.postemi.com/mcp. OAuth
and dynamic client registration use discovery. On 2026-11-19 the public documents
advertised S256 PKCE, the unauthenticated initialize returned HTTP 401 with the
Bearer discovery challenge, and dynamic registration accepted
`https://chatgpt.com/connector_platform_oauth_redirect`.

Before upload, deploy and verify the hosted MCP contract in ChatGPT:

- Make sure both analytics tools are live. Confirm the scope and available tools
  after signing in with the review account.
- Version the submitted tool metadata, `_meta`, UI resource URIs and server
  instructions together on the host. Check that `update_post` advertises
  `destructiveHint: true`, as it does in the backend source. Review all tools'
  `readOnlyHint`, `openWorldHint` and `destructiveHint` values against their actual
  effects. The channel schema lookup can fetch and persist updated X account
  status. The channel options lookup may refresh credentials or disconnect a
  channel after a failed refresh.
- Verify the scan treats `get_integration_schema` as one channel's posting rules.
  The channel lookups are three fixed tools (`list_channel_options`,
  `search_channel_options`, `list_channel_sub_options`) since 2026-11-20; the
  `get_channel_options` dispatcher the first scan flagged (6.2(b)) is gone.
- Keep subscription plans, checkout, upgrade and billing portal links off the
  submitted ChatGPT surface. The backend filters the four billing tools for
  recognized ChatGPT requests, and the shared server instructions still
  describe them. Remove that billing guidance from the ChatGPT instructions
  and confirm that the registered portal client receives the filtered tool
  list. Check OAuth onboarding and cards too. The directory allows access to
  existing paid accounts. Complete the optional commerce declaration once the
  hosted behavior is verified.
- Check product naming in tools, instructions, card resources and CSP origins.
  Verify the widget CSP and upload storage CORS for the new app's sandbox origin.
  In ChatGPT developer mode, exercise the calendar, composer, channel list,
  settings and desktop channel/post picker.

[OpenAI MCP review requirements](https://developers.openai.com/plugins/deploy/app-review)
and [plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)
cover the hosted contract and subscription restrictions.

## Reviewer access and recording

In **Review information → Review details**, enter the dedicated Team account's
email and password in the private fields. Use https://postemi.com/app/login for
the sign-in URL. Specify the exact workspace name and sign-in instructions.
Select a workspace with a saved timezone and connected Facebook Page, Instagram
and YouTube test channels. Keep a sample Instagram post in the workspace that
was published through Postemi within the past 30 days. Confirm the account can
sign in and complete all cases without access to a private inbox or another
account.

All eight cases are in `plugin.json`. Status is **Not run** for all eight.
The public 1024 × 1024 PNG in the first prompt was verified and matches the
listing kit's logo. Rehearse the five positive cases in one ChatGPT conversation
on the review account. Run the three negative cases in fresh conversations and
check that no Postemi tool is invoked.

Record the signed-in ChatGPT workflow, keeping credentials off screen. Show
the Facebook and Instagram preview with the imported image, then confirm the
future schedule. Show the YouTube image validation, the Instagram analytics
requests, and the calendar with UTC and local times. Cancel the two scheduled
posts and show the refreshed calendar. Show the calendar, composer and channel
list in ChatGPT. The listing kit's web-app video is a separate asset.

Host the recording at a URL reviewers can play without signing in. After
verifying playback and access, set `extensions.com.openai.review.demo_recording_url`
in `plugin.json` and rebuild the ZIP, or enter the URL in Review details if the
field is editable.

## Portal setup

1. Upload the ZIP from [PUBLISHING.md](../../PUBLISHING.md#4-chatgpt-app-owner-submits)
   and confirm that the dashboard created a new Postemi draft.
2. Under **MCPs**, verify the domain with the exact token and URL supplied by
   the dashboard, connect over OAuth, and run the tool scan against the deployed
   version. Resolve findings and check the saved metadata and UI references.
3. Check the imported test cases, listing, release notes and 25 countries.
   Supply the demo URL and private reviewer access. Complete the current scan,
   annotation explanations and any frame-domain explanations the portal requires.
4. The owner completes the policy attestations and submits for review. Publish
   manually after approval.

[OpenAI upload and review guide](https://developers.openai.com/plugins/deploy/submission)
