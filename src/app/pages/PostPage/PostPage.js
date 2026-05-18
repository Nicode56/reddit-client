import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments } from '../../../features/comments/commentsSlice';
import Comment from '../../components/Comment/Comment';


function PostPage() {
  const { subreddit, postId } = useParams();
  const dispatch = useDispatch();

  const post = useSelector((state) =>
    state.posts.items.find((p) => p.id === postId)
  );

  const commentsState = useSelector((state) => state.comments.byPostId[postId]);
  const comments = commentsState?.items || [];
  const status = commentsState?.status;

  useEffect(() => {
    dispatch(fetchComments({ subreddit, postId }));
  }, [dispatch, subreddit, postId]);

  if (!post) {
    return <p>Loading post…</p>;
  }

  return (
    <main>
      <h2>{post.title}</h2>
      <p>Posted by {post.author} in r/{post.subreddit}</p>

      <h3>Comments</h3>

      {status === 'loading' && <p>Loading comments…</p>}
      {status === 'failed' && <p>Error loading comments.</p>}

      {comments.map((c) => (
        <Comment key={c.id} comment={c} />
      ))}
    </main>
  );
}

export default PostPage;