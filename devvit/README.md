Devvit HTTP capability handlers

Files:
- `devvit.json` — manifest that enables `redditAPI` and whitelists domains for outbound HTTP.
- `devvit/handlers/http/posts.js` — HTTP capability: GET /posts?subreddit=<>&sort=<>&limit=<> returns subreddit listing.
- `devvit/handlers/http/comments.js` — HTTP capability: GET /comments?subreddit=<> & postId=<> returns comments.

Testing
1. Deploy this Devvit app (follow Devvit platform instructions).
2. The platform will expose the configured HTTP capabilities. Call the posts endpoint with a GET request, for example:

GET https://<your-devvit-host>/posts?subreddit=popular&sort=hot&limit=25

Notes
- These handlers run inside Devvit and use `context.reddit.request` (no client secrets required).
- Ensure `devvit.json`'s `permissions.http.domains` includes any external URLs your frontend will call (your app URL is already added).

Wiring your Vercel app
- Set the `VITE_DEVVIT_URL` environment variable in your Vercel project to your Devvit HTTP base URL (no trailing slash). Example:

	VITE_DEVVIT_URL=https://your-devvit-host

- Then rebuild and redeploy the Vercel app. The frontend will call `${VITE_DEVVIT_URL}/posts` and `${VITE_DEVVIT_URL}/comments` instead of the local `/api` proxy.

Local development
- When `VITE_DEVVIT_URL` is not set, the client falls back to the existing `/api/*` endpoints so local dev with `npm run dev` continues to work.
