import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../../../features/posts/postsSlice';
import PostItem from '../PostItem/PostItem';

function PostList() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.items);
  const { subreddit, sort, searchTerm } = useSelector((state) => state.filters);

useEffect(() => {
  dispatch(fetchPosts({ subreddit, sort, term: searchTerm }));
}, [subreddit, sort, searchTerm, dispatch]); 

  //* Fetch posts on initial load
  
  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostList;