import 'dotenv/config';
import express from 'express';
import postsHandler from '../api/posts.js';
import commentsHandler from '../api/comments.js';

const app = express();
app.use(express.json());

app.get('/api/posts', (req, res) => {
  return postsHandler(req, res);
});

app.get('/api/comments', (req, res) => {
  return commentsHandler(req, res);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Dev API server listening on http://localhost:${port}`);
});

export default app;
