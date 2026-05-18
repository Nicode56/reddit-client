import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../../features/posts/postsSlice';
import PostItem from '../PostItem/PostItem';

function PostList() {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts.items);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  // Fetch posts on initial load
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts({ subreddit: 'popular', sort: 'hot' }));
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <p>Loading posts…</p>;
  }

  if (status === 'failed') {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => dispatch(fetchPosts({ subreddit: 'popular', sort: 'hot' }))}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostList;