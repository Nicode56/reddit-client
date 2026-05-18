import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch posts from Reddit
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ subreddit = 'popular', sort = 'hot' }) => {
    const url = `/api/posts?subreddit=${encodeURIComponent(subreddit)}&sort=${encodeURIComponent(sort)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText} (${url})`);
    }
    const json = await response.json();

    // Normalize the data into a clean array of posts
    const posts = json.data.children.map((child) => {
      const post = child.data;
      return {
        id: post.id,
        title: post.title,
        author: post.author,
        subreddit: post.subreddit,
        numComments: post.num_comments,
        createdUtc: post.created_utc,
        thumbnail: post.thumbnail,
        url: post.url,
        permalink: post.permalink,
        score: post.score,
      };
    });

    return posts;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    status: 'idle', 
    error: null,
  },
  reducers: {
    // add non-async reducers later 
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;