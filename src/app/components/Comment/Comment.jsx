import React from 'react';
import './Comment.css';

function extractImageUrls(text) {
  if (typeof text !== 'string') return [];
  const urlRegex = /(https?:\/\/\S+\.(jpg|jpeg|png|gif))/gi;
  return text.match(urlRegex) || [];
}

function Comment({ comment }) {
  console.log("COMMENT RENDER", comment);

  const imageUrls = extractImageUrls(comment.body);
  
  return (
    <div className="comment">
      <div className="comment-author">
        {comment.author}
      </div>

      <div className="comment-body">
        {comment.body}
      </div>

      {/* Render any detected images */}
      {imageUrls.length > 0 && (
        <div className="comment-images">
          {imageUrls.map((url) => (
            <img
              key={url}
              src={url}
              alt="comment attachment"
              className="comment-image"
            />
          ))}
        </div>
      )}
    </div>
  );
}


export default Comment;