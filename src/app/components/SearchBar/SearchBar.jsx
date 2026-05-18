import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchTerm } from '../../../features/filters/filtersSlice';
import { fetchPosts } from '../../../features/posts/postsSlice';

function SearchBar() {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(setSearchTerm(input));
    dispatch(fetchPosts({ subreddit: 'popular', sort: 'hot', term: input }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search Reddit"
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;