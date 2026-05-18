import React from 'react';
import PostList from '../../components/PostList/PostList';
import SearchBar from '../../components/SearchBar/SearchBar';
import Filters from '../../components/Filters/Filters';

function HomePage() {
  return (
    <main className="container">
      <h1>SayWWWhatNow</h1>
      <h2>A Reddit-Client App</h2>
      <SearchBar />
      <Filters /> 
      <PostList />
    </main>
  );
}

export default HomePage;