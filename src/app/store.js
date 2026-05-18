import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import filtersReducer from '../features/filters/filtersSlice';
import commentsReducer from '../features/comments/commentsSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    filters: filtersReducer,
    comments: commentsReducer,
  },
});