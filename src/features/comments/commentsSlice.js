import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ subreddit, postId }) => {
    const url = `https://www.reddit.com/r/${subreddit}/comments/${postId}.json`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status}`);
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