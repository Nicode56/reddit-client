export default async function handler(req, res) {
  try {
    const { subreddit = 'popular', sort = 'hot' } = req.query || req.url?.split('?')[1]?.split('&').reduce((acc, p) => { const [k,v]=p.split('='); acc[k]=decodeURIComponent(v); return acc; }, {}) || {};
    const url = `https://www.reddit.com/r/${subreddit}/${sort}.json`;

    const response = await fetch(url);
    const body = await response.text();

    // Pass through status and JSON body
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    res.status(response.status).send(body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
