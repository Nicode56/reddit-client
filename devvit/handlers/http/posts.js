export default async function handler(event, context) {
  try {
    const query = event.query || {};
    const subreddit = query.subreddit || 'popular';
    const sort = query.sort || 'hot';
    const limit = query.limit || '25';

    // Use the Devvit Reddit API (context.reddit.request)
    const path = `/r/${encodeURIComponent(subreddit)}/${encodeURIComponent(sort)}.json?limit=${encodeURIComponent(limit)}`;
    const resp = await context.reddit.request({ method: 'GET', path });
    const json = await resp.json();

    return {
      status: 200,
      body: json,
    };
  } catch (err) {
    console.error('Devvit posts handler error', err);
    return { status: 500, body: { error: err.message } };
  }
}
