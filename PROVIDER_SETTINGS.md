# Provider-specific settings

Every channel Postemi supports, and every field its `--settings` payload accepts.

**The channels below are the whole list.** Postemi's server carries inherited
code for many other providers: Reddit, Medium, Hashnode, Lemmy, Nostr, VK,
Dribbble, Farcaster and others. None of them are enabled or supported. Do not
build a settings payload for one.

| Channel | `__type` | Has settings? | Status |
|---|---|---|---|
| X (Twitter) | `x` | yes | Publishing verified |
| Facebook | `facebook` | yes, all optional | Publishing verified |
| Instagram | `instagram` | yes | Publishing verified |
| Instagram (no Facebook Page) | `instagram-standalone` | yes, same as Instagram | Live |
| Threads | `threads` | **no** | Publishing verified |
| Bluesky | `bluesky` | **no** | Publishing verified |
| LinkedIn | `linkedin` | yes, all optional | Publishing verified |
| Telegram | `telegram` | **no** | Publishing verified |
| Discord | `discord` | yes, `channel` required | Publishing verified |
| Slack | `slack` | yes, `channel` required | Publishing verified |
| YouTube | `youtube` | yes | Publishing verified |
| TikTok | `tiktok` | yes | Publishing verified |
| Pinterest | `pinterest` | yes, `board` required | Coming soon: cannot be connected until Pinterest approves Postemi's app |
| Mastodon (mastodon.social) | `mastodon` | **no** | BETA |
| Mastodon (any other server) | `mastodon-custom` | **no** | BETA |
| Pixelfed | `pixelfed` | **no** | BETA |
| WordPress | `wordpress` | yes, `title` and `type` required | BETA |
| Tumblr | `tumblr` | yes, all optional | BETA |
| Dev.to | `devto` | yes, `title` required | BETA |
| Ghost | `ghost` | yes, `title` required | BETA |
| Google Chat | `google-chat` | **no** | BETA |
| Microsoft Teams | `microsoft-teams` | **no** | BETA |
| Google Business Profile | `gmb` | yes, all optional | Coming soon, not schedulable yet |
| LinkedIn Pages | `linkedin-page` | yes, same as LinkedIn | Coming soon, not schedulable yet |

Source of truth for everything on this page:
`libraries/nestjs-libraries/src/dtos/posts/providers-settings/*.ts` in the Postemi
server. If this file and a DTO disagree, the DTO is right — and the
`integrations:settings` route serves those DTOs as live JSON schema, so you can
always ask instead of trusting a document:

```bash
postemi integrations:settings <integration-id> | jq '.output.settings'
```

---

## How to pass settings

### Command line

```bash
postemi posts:create \
  -c "Your content" \
  -s "2026-12-31T12:00:00Z" \
  --settings '<json>' \
  -i "<integration-id>"
```

The backend fills in `__type` from the integration's provider. You do not send
it on the command line.

### JSON file

```bash
postemi posts:create --json post.json
```

```json
{
  "type": "schedule",
  "date": "2026-12-31T12:00:00Z",
  "shortLink": false,
  "tags": [],
  "posts": [{
    "integration": { "id": "<youtube-integration-id>" },
    "value": [{ "content": "Video description", "image": [{ "id": "…", "path": "https://…" }] }],
    "settings": {
      "__type": "youtube",
      "title": "Video title",
      "type": "public",
      "tags": [{ "value": "tech", "label": "Tech" }]
    }
  }]
}
```

You do not have to write `__type` even here: the server stamps it from the
integration's provider before validating, overwriting whatever you sent. Write
it for readability if you like — a stale or wrong value cannot break the
request, because it is replaced, not checked.

**Two behaviours worth knowing before you publish:**

- **A key without the `posts:publish` scope produces a draft, not a refusal.**
  `posts:create` needs only `posts:draft`; without `posts:publish` the server
  coerces `type` to `draft` and creates one. Read back the `type` in the
  response rather than assuming the one you sent.
- **One X channel per post.** A single post may not target two X channels,
  whatever the content — X's Developer Policy forbids it and the developer
  account at risk is Postemi's, shared by every customer. Any other combination
  of channels is fine.

---

## X (Twitter) — `x`

| Field | Required | Values |
|---|---|---|
| `who_can_reply_post` | **yes** | `everyone`, `following`, `mentionedUsers`, `subscribers`, `verified` |
| `community` | no | A community URL matching `https://x.com/i/communities/<digits>`, or empty string |
| `made_with_ai` | no | boolean |
| `paid_partnership` | no | boolean |

```bash
postemi posts:create \
  -c "Announcement" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{"who_can_reply_post":"everyone"}' \
  -i "$X_ID"
```

A malformed `community` fails validation with the expected format in the
message. Anything other than the five reply values is a `400`.

---

## Facebook — `facebook`

All fields optional.

| Field | Values |
|---|---|
| `post_type` | `post`, `story` |
| `url` | A URL to attach |
| `text_format_preset_id` | A Facebook background preset id |

`text_format_preset_id` applies to **text-only posts on Pages** and caps at
about 130 characters. Facebook exposes no API to enumerate the presets, so the
server carries a hardcoded catalogue; the ids are opaque strings.

```bash
IMG=$(postemi upload photo.jpg | jq -r '.path')
postemi posts:create -c "Post text" -s "2026-12-31T12:00:00Z" \
  --settings '{"post_type":"post"}' -m "$IMG" -i "$FB_ID"
```

---

## Instagram — `instagram`

| Field | Required | Values |
|---|---|---|
| `post_type` | **yes** | `post`, `story` |
| `collaborators` | no | array of `{ "label": "<username>" }` |
| `audio` | no | `{ id, title?, artist?, image?, audio_volume?, video_volume? }` — volumes 0–100 |
| `is_trial_reel` | no | boolean |
| `graduation_strategy` | no | `MANUAL`, `SS_PERFORMANCE` |

`audio.id` comes from the `audioSearch` tool:

```bash
postemi integrations:trigger "$IG_ID" audioSearch -d '{"q":"lofi","type":"music"}'
# type is "music" (default) or "original_sound"; an empty q returns trending audio
```

```bash
STORY=$(postemi upload story.jpg | jq -r '.path')
postemi posts:create -c "" -s "2026-12-31T12:00:00Z" \
  --settings '{"post_type":"story"}' -m "$STORY" -i "$IG_ID"
```

---

## Threads — `threads`

**No settings.** Omit `--settings`. There are no fields to send and inventing
one is a `400`.

```bash
postemi posts:create -c "Post text" -s "2026-12-31T12:00:00Z" -i "$THREADS_ID"
```

---

## Bluesky — `bluesky`

**No settings.** Same as Threads.

---

## YouTube — `youtube`

| Field | Required | Values |
|---|---|---|
| `title` | **yes** | 2–100 characters |
| `type` | **yes** | `public`, `private`, `unlisted` |
| `selfDeclaredMadeForKids` | no | `yes`, `no` |
| `thumbnail` | no | A media object from `postemi upload` |
| `tags` | no | array of `{ value, label }` |

The post's `-c` content becomes the **video description**. `title` is separate
and is the video's title.

**The tag budget is 500 characters in total across every tag**, not per tag.
A tag containing whitespace costs two extra characters against that budget,
because YouTube wraps it in quotes. Over the budget is a `400` naming the
limit.

There is **no `playlistId` field** and no way to add a video to a playlist
through the API. Earlier documentation claimed otherwise.

```bash
VIDEO=$(postemi upload video.mp4 | jq -r '.path')
postemi posts:create \
  -c "Full video description…" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{"title":"How to build a CLI","type":"public","selfDeclaredMadeForKids":"no","tags":[{"value":"tech","label":"Tech"},{"value":"tutorial","label":"Tutorial"}]}' \
  -m "$VIDEO" \
  -i "$YT_ID"
```

Only MP4 uploads. See [SUPPORTED_FILE_TYPES.md](./SUPPORTED_FILE_TYPES.md).

---

## LinkedIn — `linkedin`

Both fields optional.

| Field | Values |
|---|---|
| `post_as_images_carousel` | boolean |
| `carousel_name` | string |

There is **no `companyId`**. Posting as a company page is a separate connected
channel with identifier `linkedin-page`, chosen at connect time — not a setting
on a personal post.

```bash
postemi posts:create -c "Content" -s "2026-12-31T12:00:00Z" \
  --settings '{"post_as_images_carousel":true,"carousel_name":"Product launch"}' \
  -m "$A,$B,$C" -i "$LI_ID"
```

---

## TikTok — `tiktok`

| Field | Required | Values |
|---|---|---|
| `title` | no | ≤ 90 characters |
| `privacy_level` | **yes for `DIRECT_POST`** | `PUBLIC_TO_EVERYONE`, `MUTUAL_FOLLOW_FRIENDS`, `FOLLOWER_OF_CREATOR`, `SELF_ONLY` |
| `content_posting_method` | **yes** | `DIRECT_POST`, `UPLOAD` |
| `duet` | yes | boolean — video only, `DIRECT_POST` only |
| `stitch` | yes | boolean — video only, `DIRECT_POST` only |
| `comment` | yes | boolean — `DIRECT_POST` only |
| `autoAddMusic` | yes | `yes`, `no` — photo posts only, `DIRECT_POST` only |
| `brand_content_toggle` | yes | boolean — `DIRECT_POST` only |
| `brand_organic_toggle` | yes | boolean — `DIRECT_POST` only |
| `video_made_with_ai` | no | boolean — video only, `DIRECT_POST` only |

The field is `privacy_level`. Earlier documentation called it `privacy`; that
name is silently ignored, which is worse than an error.

**`UPLOAD` does not publish.** It sends the media to the user's TikTok app
inbox as a draft, which they must finish and publish by hand within 24 hours or
it is discarded — and TikTok ignores every setting above except `title`. Only
use it when the user explicitly asks to finish the post inside the TikTok app.

**`privacy_level` deliberately has no default.** TikTok's Content Sharing
Guidelines require the person posting to choose it. Ask the user; do not pick
one on their behalf.

```bash
VIDEO=$(postemi upload video.mp4 | jq -r '.path')
postemi posts:create \
  -c "Caption #fyp" \
  -s "2026-12-31T12:00:00Z" \
  --settings '{"title":"Caption","privacy_level":"PUBLIC_TO_EVERYONE","duet":true,"stitch":true,"comment":true,"autoAddMusic":"no","brand_content_toggle":false,"brand_organic_toggle":false,"content_posting_method":"DIRECT_POST"}' \
  -m "$VIDEO" \
  -i "$TT_ID"
```

---

## Telegram — `telegram`

**No settings.** Same as Threads. The channel is fixed when the user connects
it in Postemi (one shared bot posts into the channel or group they chose).

---

## Discord — `discord`

| Field | Values |
|---|---|
| `channel` | **required** — a channel id from the `channels` tool |

Get the id first; a channel name is a `400`:

```bash
postemi integrations:trigger "$DISCORD_ID" channels -d '{}' | jq '.output'
postemi posts:create -c "Release notes are out" -s "2026-12-31T12:00:00Z" \
  --settings '{"channel":"123456789012345678"}' -i "$DISCORD_ID"
```

---

## Slack — `slack`

| Field | Values |
|---|---|
| `channel` | **required** — a channel id from the `channels` tool |

Same shape as Discord:

```bash
postemi integrations:trigger "$SLACK_ID" channels -d '{}' | jq '.output'
postemi posts:create -c "Release notes are out" -s "2026-12-31T12:00:00Z" \
  --settings '{"channel":"C0123456789"}' -i "$SLACK_ID"
```

---

## Pinterest — `pinterest`

**Coming soon.** Postemi customers cannot connect Pinterest until Pinterest
approves Postemi's app. The settings below apply once it opens.

| Field | Values |
|---|---|
| `board` | **required** — a board id from the `boards` tool |
| `title` | optional, up to 100 characters |
| `link` | optional, a URL the pin opens |

A pin needs media: one image (up to 5 images in one pin), or a video with a
cover picture as the second attachment. Get the board id first; a board name is
refused:

```bash
postemi integrations:trigger "$PINTEREST_ID" boards | jq '.output'
IMG=$(postemi upload ./pin.jpg | jq -r '.path')
postemi posts:create -c "Autumn recipes" -m "$IMG" -s "2026-12-31T12:00:00Z" \
  --settings '{"board":"1234567890123456789","title":"Autumn recipes","link":"https://example.com/recipes"}' \
  -i "$PINTEREST_ID"
```

---

## Instagram without a Facebook Page: `instagram-standalone`

The same settings as `instagram` (`post_type` required, the rest optional).
The `audioSearch` tool is not available on this channel: it exists only on
`instagram`.

```bash
IMG=$(postemi upload photo.jpg | jq -r '.path')
postemi posts:create -c "New menu" -s "2026-12-31T12:00:00Z" \
  --settings '{"post_type":"post"}' -m "$IMG" -i "$IGS_ID"
```

---

## Mastodon: `mastodon` and `mastodon-custom`

**No settings.** Same as Threads. `mastodon` is an account on mastodon.social;
`mastodon-custom` is an account on any other Mastodon server, chosen when the
user connects it. A post is at most 500 characters on mastodon.social (other
servers can set their own limit).

```bash
postemi posts:create -c "Post text" -s "2026-12-31T12:00:00Z" -i "$MASTODON_ID"
```

---

## Pixelfed: `pixelfed`

**No settings.** Pixelfed is a photo network on any server, chosen when the
user connects it. Every post needs at least one picture and takes at most 4
(JPEG, PNG or GIF; no video). The caption is at most 500 characters.

```bash
IMG=$(postemi upload photo.jpg | jq -r '.path')
postemi posts:create -c "Morning light" -s "2026-12-31T12:00:00Z" -m "$IMG" -i "$PIXELFED_ID"
```

---

## WordPress: `wordpress`

The post's `-c` content becomes the article body (HTML).

| Field | Required | Values |
|---|---|---|
| `title` | **yes** | at least 2 characters |
| `type` | **yes** | a post type id from the `postTypes` tool, e.g. `posts` or `pages` |
| `main_image` | no | A media object from `postemi upload` (the featured image) |
| `categories` | no | array of category ids (numbers) from the `categoriesList` tool |
| `tags` | no | array of tag ids (numbers) from the `tagsList` tool |
| `status` | no | `publish` (default), `draft`, `pending`, `private` |

```bash
postemi integrations:trigger "$WP_ID" postTypes | jq '.output'
postemi integrations:trigger "$WP_ID" categoriesList | jq '.output'
postemi integrations:trigger "$WP_ID" tagsList | jq '.output'
postemi posts:create -c "<p>Our autumn menu is here.</p>" -s "2026-12-31T12:00:00Z" \
  --settings '{"title":"Autumn menu","type":"posts","categories":[3],"tags":[12,14]}' \
  -i "$WP_ID"
```

---

## Tumblr: `tumblr`

All fields optional. The blog is chosen when the user connects the channel.

| Field | Values |
|---|---|
| `title` | 1 to 4096 characters, shown as the heading of the post |
| `link` | A URL, added to the post as a link block |
| `sourceUrl` | A URL, the post's source |
| `tags` | comma separated tags, at most 4096 characters |

```bash
postemi posts:create -c "Post text" -s "2026-12-31T12:00:00Z" \
  --settings '{"title":"Autumn menu","tags":"food,autumn"}' -i "$TUMBLR_ID"
```

---

## Dev.to: `devto`

The post's `-c` content becomes the article body (Markdown). The article is
published at the scheduled time.

| Field | Required | Values |
|---|---|---|
| `title` | **yes** | at least 2 characters |
| `main_image` | no | A media object from `postemi upload` (the cover image) |
| `canonical` | no | A URL, the original of the article |
| `organization` | no | an organization id from the `organizations` tool, as a string |
| `tags` | no | up to 4 items of `{ "value": <number>, "label": "<name>" }` from the `tags` tool |

```bash
postemi integrations:trigger "$DEVTO_ID" tags | jq '.output[:5]'
postemi integrations:trigger "$DEVTO_ID" organizations | jq '.output'
postemi posts:create -c "## Why we built it..." -s "2026-12-31T12:00:00Z" \
  --settings '{"title":"Shipping a CLI","tags":[{"value":8,"label":"javascript"}]}' \
  -i "$DEVTO_ID"
```

---

## Ghost: `ghost`

The post's `-c` content becomes the article body (HTML).

| Field | Required | Values |
|---|---|---|
| `title` | **yes** | 1 to 255 characters |
| `status` | no | `published` (default, at the scheduled time) or `draft` (a Ghost draft) |
| `tags` | no | comma separated tag names, at most 1000 characters |
| `excerpt` | no | at most 300 characters |
| `main_image` | no | A media object from `postemi upload` (the feature image) |

```bash
postemi posts:create -c "<p>Our autumn menu is here.</p>" -s "2026-12-31T12:00:00Z" \
  --settings '{"title":"Autumn menu","tags":"menu,autumn","excerpt":"What is new this season."}' \
  -i "$GHOST_ID"
```

---

## Google Chat and Microsoft Teams: `google-chat`, `microsoft-teams`

**No settings.** Same as Threads. The space (Google Chat) or the channel
(Teams) is fixed by the webhook the user gives when connecting. A message is
at most 4096 characters on Google Chat and 10000 on Teams.

```bash
postemi posts:create -c "Release notes are out" -s "2026-12-31T12:00:00Z" -i "$GCHAT_ID"
```

---

## Google Business Profile: `gmb` (coming soon)

**Not schedulable yet:** Google has not approved Postemi, so the user cannot
connect it. For reference, the settings the server accepts, all optional:

| Field | Values |
|---|---|
| `topicType` | `STANDARD`, `EVENT`, `OFFER` |
| `callToActionType` | `NONE`, `BOOK`, `ORDER`, `SHOP`, `LEARN_MORE`, `SIGN_UP`, `GET_OFFER`, `CALL` |
| `callToActionUrl` | A URL, checked when `callToActionType` is set |
| `eventTitle` | string, for `EVENT` |
| `eventStartDate`, `eventEndDate`, `eventStartTime`, `eventEndTime` | strings |
| `offerCouponCode`, `offerTerms` | strings, for `OFFER` |
| `offerRedeemUrl` | A URL |

A post takes at most one image and no video.

---

## LinkedIn Pages: `linkedin-page` (coming soon)

**Not schedulable yet:** LinkedIn has not approved Postemi for company pages.
When it does, the settings are the same as `linkedin`.

---

## Finding your integration ids

```bash
postemi integrations:list
# [{ "id": "…", "name": "…", "identifier": "instagram", … }]

X_ID=$(postemi integrations:list  | jq -r '.[] | select(.identifier=="x")        | .id')
IG_ID=$(postemi integrations:list | jq -r '.[] | select(.identifier=="instagram")| .id')
YT_ID=$(postemi integrations:list | jq -r '.[] | select(.identifier=="youtube")  | .id')
```

`identifier` is the provider; `__type` in JSON mode is the same string.

If a channel is not in `integrations:list`, the user cannot post to it. For
Google Business Profile and LinkedIn company pages that is the expected state
until those platforms approve the app (personal LinkedIn profiles work).
The BETA channels are live. Say so rather than scheduling
a post that will fail.

---

## Validating before you publish

Post as a draft first. A draft goes through the same validation as a scheduled
post, so a bad settings payload fails immediately instead of at publish time:

```bash
postemi posts:create -c "…" -s "2026-12-31T12:00:00Z" -t draft --settings '…' -i "$ID"
```

Then promote it, or delete it:

```bash
postemi posts:status <post-id> --status schedule
postemi posts:delete <post-id>
```
