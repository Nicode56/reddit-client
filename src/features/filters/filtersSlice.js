import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    subreddit: 'popular',
    sort: 'hot',
    searchTerm: '',
  },
  reducers: {
    setSubreddit(state, action) {
      state.subreddit = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSubreddit, setSort, setSearchTerm } = filtersSlice.actions;
export default filtersSlice.reducer;