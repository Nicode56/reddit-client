const USER_AGENT = process.env.REDDIT_USER_AGENT || 'Mozilla/5.0 (compatible; reddit-client/1.0; +https://example.com)';
const TOKEN_ENDPOINT = process.env.REDDIT_TOKEN_ENDPOINT || 'https://www.reddit.com/api/v1/access_token';
const OAUTH_HOST = 'oauth.reddit.com';

let accessToken = null;
let tokenExpiresAt = 0;

async function getFetch() {
  if (typeof globalThis.fetch === 'function') {
    return globalThis.fetch;
  }
  const nodeFetch = await import('node-fetch');
  return nodeFetch.default;
}

async function getAccessToken() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  const now = Date.now();
  if (accessToken && now < tokenExpiresAt - 10_000) {
    return accessToken;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const fetchFn = await getFetch();
  const response = await fetchFn(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
    body: 'grant_type=client_credentials',
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Reddit auth failed ${response.status} ${response.statusText}: ${text}`);
  }

  const json = JSON.parse(text);
  accessToken = json.access_token;
  tokenExpiresAt = now + ((json.expires_in || 3600) * 1000);
  return accessToken;
}

export async function fetchReddit(path) {
  const authToken = await getAccessToken();
  const hosts = authToken
    ? [OAUTH_HOST]
    : ['api.reddit.com', 'www.reddit.com', 'reddit.com', 'old.reddit.com'];
  const headers = {
    'User-Agent': USER_AGENT,
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: 'https://www.reddit.com/',
  };

  const fetchFn = await getFetch();
  const tried = [];
  let lastBody = '';
  const pathWithRawJson = path.includes('?') ? `${path}&raw_json=1` : `${path}?raw_json=1`;

  for (const host of hosts) {
    const url = `https://${host}${pathWithRawJson}`;
    const requestHeaders = { ...headers };
    if (host === OAUTH_HOST && authToken) {
      requestHeaders.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetchFn(url, { headers: requestHeaders });
    const body = await response.text();
    tried.push({ url, status: response.status, ok: response.ok });
    lastBody = body;

    if (response.ok) {
      return { response, body, tried };
    }
  }

  return { response: null, body: lastBody, tried };
}
