export default async function handler(req, res) {
  try {
    const params = req.query || req.url?.split('?')[1]?.split('&').reduce((acc, p) => { const [k,v]=p.split('='); acc[k]=decodeURIComponent(v); return acc; }, {}) || {};
    const { subreddit, postId } = params;
    if (!subreddit || !postId) {
      res.status(400).json({ error: 'Missing subreddit or postId' });
      return;
    }
    const url = `https://www.reddit.com/r/${subreddit}/comments/${postId}.json`;

    const headers = {
      'User-Agent': 'reddit-client/1.0 (+https://example.com)',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.reddit.com/'
    };

    let response = await fetch(url, { headers });
    if (response.status === 403) {
      const fallback = url.replace('www.reddit.com', 'old.reddit.com');
      const fallbackResp = await fetch(fallback, { headers });
      if (fallbackResp.ok) {
        const body = await fallbackResp.text();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
        res.status(fallbackResp.status).send(body);
        return;
      }
    }

    const body = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    res.status(response.status).send(body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
