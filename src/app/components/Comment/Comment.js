import React from 'react';
import './Comment.css';

function Comment({ comment }) {
  return (
    <div className="comment">
      <div className="comment-author">{comment.author}</div>
      <div className="comment-body">{comment.body}</div>
    </div>
  );
}

export default Comment;