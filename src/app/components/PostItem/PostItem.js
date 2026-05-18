import React from 'react';
import { Link } from 'react-router-dom';
import './PostItem.css'; // optional 

function PostItem({ post }) {
  return (
    
    <Link
      to={`/r/${post.subreddit}/comments/${post.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
    <div className="post-item">
        <h3>{post.title}</h3>
        <p>Posted by {post.author}</p>
      </div>
    </Link>

  );
}

export default PostItem;