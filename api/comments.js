export default async function handler(req, res) {
  try {
    const params = req.query || req.url?.split('?')[1]?.split('&').reduce((acc, p) => { const [k,v]=p.split('='); acc[k]=decodeURIComponent(v); return acc; }, {}) || {};
    const { subreddit, postId } = params;
    if (!subreddit || !postId) {
      res.status(400).json({ error: 'Missing subreddit or postId' });
      return;
    }

    const url = `https://www.reddit.com/r/${subreddit}/comments/${postId}.json`;
    const response = await fetch(url);
    const body = await response.text();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    res.status(response.status).send(body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
