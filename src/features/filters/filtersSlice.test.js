import filtersReducer, { setSubreddit, setSort, setSearchTerm } from './filtersSlice';

describe('filtersSlice', () => {
  it('should handle initial state', () => {
    const state = filtersReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({
      subreddit: 'popular',
      sort: 'hot',
      searchTerm: '',
    });
  });

  it('should set subreddit', () => {
    const state = filtersReducer(undefined, setSubreddit('reactjs'));
    expect(state.subreddit).toBe('reactjs');
  });

  it('should set sort', () => {
    const state = filtersReducer(undefined, setSort('new'));
    expect(state.sort).toBe('new');
  });

  it('should set searchTerm', () => {
    const state = filtersReducer(undefined, setSearchTerm('redux'));
    expect(state.searchTerm).toBe('redux');
  });
});