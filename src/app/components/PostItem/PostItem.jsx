import React from 'react';
import { Link } from 'react-router-dom';
//import './PostItem.css'; // optional 

function PostItem({ post }) {

  const preview = post.previewImage
  ? post.previewImage.replace(/&amp;/g, '&')
  : null;

const fullImage = post.image
  ? post.image.replace(/&amp;/g, '&')
  : null;

const isImagePost =
  post.postHint === 'image' &&
  (fullImage && (
  fullImage.endsWith('.jpg') ||
  fullImage.endsWith('.png') ||
  fullImage.endsWith('.jpeg')
));
  return (
    
    <div className="post-item" style={styles.container}>
      <Link
        to={`/r/${post.subreddit}/comments/${post.id}`}
        style={styles.link}
      >
        <h3 style={styles.title}>{post.title}</h3>

        {/* IMAGE POST */}
        {isImagePost && (
          <img
            src={fullImage || preview}
            alt={post.title || 'post image'}
            style={styles.image}
          />
        )}

        {/* THUMBNAIL (if not an image post) */}
        {!isImagePost && 
        typeof post.thumbnail === 'string' && 
        post.thumbnail.startsWith('http') && (
          <img
            src={post.thumbnail}
            alt="thumbnail"
            style={styles.thumbnail}
          />
        )}

        {/* BASIC POST INFO */}
        <div style={styles.meta}>
          <span>Posted by u/{post.author}</span>
          <span>•</span>
          <span>{post.numComments} comments</span>
        </div>
      </Link>
    </div>
  );
}

const styles = {
  container: {
    padding: '12px 16px',
    borderBottom: '1px solid #ddd',
    cursor: 'pointer',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  image: {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'contain',
    borderRadius: '8px',
    marginTop: '8px',
  },
  thumbnail: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginTop: '8px',
  },
  meta: {
    marginTop: '8px',
    fontSize: '0.85rem',
    color: '#555',
    display: 'flex',
    gap: '6px',
  },
};

export default PostItem;