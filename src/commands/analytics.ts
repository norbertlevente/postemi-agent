import { PostemiAPI } from '../api';
import { getConfig } from '../config';
import { result, status, fail } from '../output';
import { BRAND } from '../brand';

/*
  ANALYTICS: the platform's own numbers, as the network reports them.

  - `analytics:platform <integration-id>` (alias `analytics:channel`): one
    channel over the last N days. Each network reports a different set, so
    every entry is `{label, data:[{total, date}], percentageChange}`; read
    `label` rather than expecting fixed keys. The server caches a channel's
    answer for an hour.
  - `analytics:post <post-id>`: one published post. `{"missing": true}` means
    the platform never gave back the post's id; `posts:missing` and
    `posts:connect` repair it.

  An empty list is a real answer, not an error: the network gives no numbers
  for that channel or post, the post has not been published, or the channel
  waits for a reconnect. The hint goes to stderr; stdout stays the JSON.
  Both routes allow 30 calls an hour per key.
*/

function daysArg(args: any): string {
  const days = String(args.days ?? '7');
  if (!/^\d+$/.test(days) || Number(days) < 1) {
    console.error('❌ --days must be a positive whole number of days, e.g. --days 30');
    process.exit(1);
  }
  return days;
}

export async function getAnalytics(args: any) {
  const config = getConfig();
  const api = new PostemiAPI(config);

  try {
    const res: any = await api.getAnalytics(args.id, daysArg(args));
    if (Array.isArray(res) && res.length === 0) {
      status(
        `ℹ️  No numbers for this channel: the network reports none here, or the channel needs a reconnect (see "${BRAND.cli} integrations:list").`
      );
    }
    result(res);
    return res;
  } catch (error: any) {
    fail('Failed to get analytics', error);
  }
}

export async function getPostAnalytics(args: any) {
  const config = getConfig();
  const api = new PostemiAPI(config);

  try {
    const res: any = await api.getPostAnalytics(args.id, daysArg(args));
    if (res && !Array.isArray(res) && res.missing === true) {
      status(
        `ℹ️  The platform did not give back this post's id. Find it with "${BRAND.cli} posts:missing ${args.id}", then "${BRAND.cli} posts:connect ${args.id} --release-id <id>".`
      );
    } else if (Array.isArray(res) && res.length === 0) {
      status(
        'ℹ️  No numbers for this post: it has not been published yet, or the network reports none for single posts.'
      );
    }
    result(res);
    return res;
  } catch (error: any) {
    fail('Failed to get post analytics', error);
  }
}
