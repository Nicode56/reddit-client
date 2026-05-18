import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../../../features/posts/postsSlice';
import PostItem from '../PostItem/PostItem';

function PostList() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.items);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const { subreddit, sort, searchTerm } = useSelector((state) => state.filters);

useEffect(() => {
  dispatch(fetchPosts({ subreddit, sort }));
}, [subreddit, sort, dispatch]); 

  //* Fetch posts on initial load
  
  if (status === 'loading') {
    return <p>Loading posts…</p>;
  }

  if (status === 'failed') {
    return <p>Error loading posts: {error}</p>;
  }

  if (!posts || posts.length === 0) {
    return <p>No posts found for r/{subreddit}.</p>;
  }

  return (
    <div className="post-list">
      <p>{posts.length} posts</p>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostList;