const USER_AGENT = 'reddit-client/1.0 (+https://example.com)';
const TOKEN_ENDPOINT = 'https://www.reddit.com/api/v1/access_token';
const OAUTH_HOST = 'oauth.reddit.com';

let accessToken = null;
let tokenExpiresAt = 0;

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
  const response = await fetch(TOKEN_ENDPOINT, {
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
  const hosts = authToken ? [OAUTH_HOST] : ['api.reddit.com', 'www.reddit.com', 'old.reddit.com'];
  const headers = {
    'User-Agent': USER_AGENT,
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: 'https://www.reddit.com/',
  };

  const tried = [];
  let lastBody = '';

  for (const host of hosts) {
    const url = `https://${host}${path}`;
    const requestHeaders = { ...headers };
    if (host === OAUTH_HOST && authToken) {
      requestHeaders.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(url, { headers: requestHeaders });
    const body = await response.text();
    tried.push({ url, status: response.status, ok: response.ok });
    lastBody = body;

    if (response.ok) {
      return { response, body, tried };
    }
  }

  return { response: null, body: lastBody, tried };
}
