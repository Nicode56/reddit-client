import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch posts from Reddit
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ subreddit = 'popular', sort = 'hot' }) => {
    const url = `https://reddit-api-proxy.vercel.app/api/r/${subreddit}/${sort}`;

    console.log("FETCH URL:", url);

    const response = await fetch(url);
    console.log("FETCH STATUS:", response.status);

    const json = await response.json();
    console.log("FETCH JSON RAW:", json);

    if (!json?.data?.children) {
      console.error("Invalid Reddit response:", json);
      return [];
    }

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
        postHint: post.post_hint,
        image: post.url_overridden_by_dest,
        previewImage: post.preview?.images?.[0]?.source?.url,
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