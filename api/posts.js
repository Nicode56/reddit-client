import { fetchReddit } from './redditClient.js';

export default async function handler(req, res) {
  try {
    const qs = req.query || (() => {
      const u = req.url || '';
      const q = u.split('?')[1] || '';
      return q.split('&').reduce((acc, p) => { if (!p) return acc; const [k,v]=p.split('='); acc[k]=decodeURIComponent(v||''); return acc; }, {});
    })();

    const subreddit = qs.subreddit || 'popular';
    const sort = qs.sort || 'hot';
    const path = `/r/${subreddit}/${sort}.json`;

    const result = await fetchReddit(path);
    if (result.response?.ok) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
      res.status(result.response.status).send(result.body);
      return;
    }

    const snippet = result.body ? result.body.slice(0, 2000) : '';
    console.error('Reddit proxy failed for posts', { tried: result.tried, snippet });
    res.setHeader('Content-Type', 'application/json');
    res.status(502).json({
      error: 'Upstream fetch failed',
      attempts: result.tried,
      snippet,
    });
  } catch (err) {
    console.error('Reddit proxy unexpected error for posts', err);
    res.status(500).json({ error: err.message });
  }
}
