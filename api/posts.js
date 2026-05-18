export default async function handler(req, res) {
  try {
    const qs = req.query || (() => {
      const u = req.url || '';
      const q = u.split('?')[1] || '';
      return q.split('&').reduce((acc, p) => { if (!p) return acc; const [k,v]=p.split('='); acc[k]=decodeURIComponent(v||''); return acc; }, {});
    })();

    const subreddit = qs.subreddit || 'popular';
    const sort = qs.sort || 'hot';
    const url = `https://www.reddit.com/r/${subreddit}/${sort}.json`;

    const headers = {
      'User-Agent': 'reddit-client/1.0 (+https://example.com)',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.reddit.com/'
    };

    // try www first
    let response = await fetch(url, { headers });
    let tried = [{ url, status: response.status }];

    // If blocked, try old.reddit.com
    if (!response.ok) {
      const fallback = url.replace('www.reddit.com', 'old.reddit.com');
      const fallbackResp = await fetch(fallback, { headers });
      tried.push({ url: fallback, status: fallbackResp.status });
      if (fallbackResp.ok) {
        const body = await fallbackResp.text();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
        res.status(fallbackResp.status).send(body);
        return;
      }
    }

    const body = await response.text();
    if (response.ok) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
      res.status(response.status).send(body);
      return;
    }

    // If we reach here both attempts failed — return diagnostic info
    const snippet = body ? body.slice(0, 2000) : '';
    res.setHeader('Content-Type', 'application/json');
    res.status(502).json({
      error: 'Upstream fetch failed',
      attempts: tried,
      snippet,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
