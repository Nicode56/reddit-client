import { fetchPosts } from './postsSlice';
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';
import { vi } from 'vitest';

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        data: {
          children: [
            {
              data: {
                id: 'abc123',
                title: 'Test Post',
                author: 'tester',
                subreddit: 'reactjs',
              },
            },
          ],
        },
      }),
  })
);

describe('fetchPosts thunk', () => {
  it('fetches posts and updates state', async () => {
    const store = configureStore({ reducer: postsReducer });

    await store.dispatch(fetchPosts({ subreddit: 'reactjs', sort: 'hot' }));

    const state = store.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].title).toBe('Test Post');
  });
});