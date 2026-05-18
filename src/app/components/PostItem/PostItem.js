import React from 'react';
import './PostItem.css'; // optional 

function PostItem({ post }) {
  return (
    <div className="post-item">
      <h3 className="post-title">{post.title}</h3>

      <div className="post-meta">
        <span>r/{post.subreddit}</span>
        <span>• Posted by {post.author}</span>
        <span>• {post.numComments} comments</span>
      </div>

      {post.thumbnail && post.thumbnail.startsWith('http') && (
        <img
          src={post.thumbnail}
          alt=""
          className="post-thumbnail"
        />
      )}
    </div>
  );
}

export default PostItem;