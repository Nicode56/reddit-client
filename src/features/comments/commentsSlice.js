import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ subreddit, postId }) => {
    const url = `/api/comments?subreddit=${encodeURIComponent(subreddit)}&postId=${encodeURIComponent(postId)}`;
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      let message = `Failed to fetch comments: ${response.status} ${response.statusText} (${url})`;
      if (text) {
        try {
          const json = JSON.parse(text);
          if (json.error) message += ` - ${json.error}`;
          if (json.attempts) message += ` | attempts=${JSON.stringify(json.attempts)}`;
          if (json.snippet) message += ` | snippet=${JSON.stringify(json.snippet.slice(0, 256))}`;
        } catch {
          message += ` - ${text.slice(0, 256)}`;
        }
      }
      throw new Error(message);
    }
    const json = await response.json();

    const comments = json[1].data.children
      .filter((child) => child.kind === 't1')
      .map((child) => {
        const c = child.data;
        return {
          id: c.id,
          author: c.author,
          body: c.body,
          createdUtc: c.created_utc,
        };
      });

    return { postId, comments };
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    byPostId: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state, action) => {
        const { postId } = action.meta.arg;
        state.byPostId[postId] = {
          status: 'loading',
          items: [],
          error: null,
        };
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.byPostId[postId] = {
          status: 'succeeded',
          items: comments,
          error: null,
        };
      })
      .addCase(fetchComments.rejected, (state, action) => {
        const { postId } = action.meta.arg;
        state.byPostId[postId] = {
          status: 'failed',
          items: [],
          error: action.error.message,
        };
      });
  },
});

export default commentsSlice.reducer;