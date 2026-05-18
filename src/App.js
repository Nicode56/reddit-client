import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './app/pages/HomePage/HomePage';
import PostPage from './app/pages/PostPage/PostPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/r/:subreddit/comments/:postId" element={<PostPage />} />
      </Routes>
    </Router>
  );
}

export default App;