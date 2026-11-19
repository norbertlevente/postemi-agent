import { PostemiAPI } from '../api';
import { getConfig } from '../config';
import { result, fail } from '../output';

/**
 * `notifications:list [--page N]`: the workspace's notification feed, newest
 * first, 100 a page: `{notifications:[{id, content, link, createdAt}], total,
 * page, limit, hasMore}`. Failed posts, channels that need a reconnect and
 * other workspace events land here.
 */
export async function listNotifications(args: any) {
  const page = Number(args.page ?? 0);
  if (!Number.isInteger(page) || page < 0) {
    console.error('❌ --page must be a whole number, 0 or more (0 is the newest page)');
    process.exit(1);
  }
  const api = new PostemiAPI(getConfig());
  try {
    const res = await api.listNotifications(page);
    result(res);
    return res;
  } catch (error: any) {
    fail('Failed to list notifications', error);
  }
}
