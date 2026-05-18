import React from 'react';
import PostList from '../../components/PostList/PostList';
import SearchBar from '../../components/SearchBar/SearchBar';
import Filters from '../../components/Filters/Filters';

function HomePage() {
  return (
    <main className="container">
      <h1>Reddit Client</h1>
      <SearchBar />
      <Filters /> 
      <PostList />
    </main>
  );
}

export default HomePage;