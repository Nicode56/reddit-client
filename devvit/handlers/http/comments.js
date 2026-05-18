export default async function handler(event, context) {
  try {
    const query = event.query || {};
    const subreddit = query.subreddit;
    const postId = query.postId;
    const limit = query.limit || '50';

    if (!subreddit || !postId) {
      return { status: 400, body: { error: 'Missing subreddit or postId' } };
    }

    const path = `/r/${encodeURIComponent(subreddit)}/comments/${encodeURIComponent(postId)}.json?limit=${encodeURIComponent(limit)}`;
    const resp = await context.reddit.request({ method: 'GET', path });
    const json = await resp.json();

    return { status: 200, body: json };
  } catch (err) {
    console.error('Devvit comments handler error', err);
    return { status: 500, body: { error: err.message } };
  }
}
