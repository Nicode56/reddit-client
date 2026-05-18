import { fetchReddit } from './redditClient.js';

export default async function handler(req, res) {
  try {
    const params = req.query || req.url?.split('?')[1]?.split('&').reduce((acc, p) => { const [k,v]=p.split('='); acc[k]=decodeURIComponent(v); return acc; }, {}) || {};
    const { subreddit, postId } = params;
    if (!subreddit || !postId) {
      res.status(400).json({ error: 'Missing subreddit or postId' });
      return;
    }

    const path = `/r/${subreddit}/comments/${postId}.json`;
    const result = await fetchReddit(path);

    if (result.response?.ok) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
      res.status(result.response.status).send(result.body);
      return;
    }

    const snippet = result.body ? result.body.slice(0, 2000) : '';
    console.error('Reddit proxy failed for comments', { tried: result.tried, snippet });
    res.setHeader('Content-Type', 'application/json');
    res.status(502).json({ error: 'Upstream fetch failed', attempts: result.tried, snippet });
  } catch (err) {
    console.error('Reddit proxy unexpected error for comments', err);
    res.status(500).json({ error: err.message });
  }
}
