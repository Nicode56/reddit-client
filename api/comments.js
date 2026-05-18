export default async function handler(req, res) {
  try {
    const params = req.query || req.url?.split('?')[1]?.split('&').reduce((acc, p) => { const [k,v]=p.split('='); acc[k]=decodeURIComponent(v); return acc; }, {}) || {};
    const { subreddit, postId } = params;
    if (!subreddit || !postId) {
      res.status(400).json({ error: 'Missing subreddit or postId' });
      return;
    }
    const path = `/r/${subreddit}/comments/${postId}.json`;
    const hosts = ['api.reddit.com', 'www.reddit.com', 'old.reddit.com'];

    const headers = {
      'User-Agent': 'reddit-client/1.0 (+https://example.com)',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.reddit.com/'
    };

    let tried = [];
    let lastBody = '';
    let successfulResponse = null;

    for (const host of hosts) {
      const candidateUrl = `https://${host}${path}`;
      const response = await fetch(candidateUrl, { headers });
      tried.push({ url: candidateUrl, status: response.status, ok: response.ok });
      lastBody = await response.text();
      if (response.ok) {
        successfulResponse = { response, body: lastBody };
        break;
      }
    }

    if (successfulResponse) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
      res.status(successfulResponse.response.status).send(successfulResponse.body);
      return;
    }

    const snippet = lastBody ? lastBody.slice(0, 2000) : '';
    console.error('Reddit proxy failed for comments', { tried, snippet });
    res.setHeader('Content-Type', 'application/json');
    res.status(502).json({ error: 'Upstream fetch failed', attempts: tried, snippet });

    const snippet = body ? body.slice(0, 2000) : '';
    res.setHeader('Content-Type', 'application/json');
    res.status(502).json({ error: 'Upstream fetch failed', attempts: tried, snippet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
