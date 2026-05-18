import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './features/posts/postsSlice';
import filtersReducer from './features/filters/filtersSlice';
import commentsReducer from './features/comments/commentsSlice';

test('renders homepage', () => {
  const store = configureStore({
    reducer: {
      posts: postsReducer,
      filters: filtersReducer,
      comments: commentsReducer,
    },
  });

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(screen.getByText(/reddit client/i)).toBeInTheDocument();
});
