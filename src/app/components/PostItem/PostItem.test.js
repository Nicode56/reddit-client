import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostItem from './PostItem';

test('PostItem renders title and author', () => {
  const post = {
    id: 'abc123',
    title: 'Test Post',
    author: 'tester',
    subreddit: 'reactjs',
  };

  render(
    <MemoryRouter>
      <PostItem post={post} />
    </MemoryRouter>
  );

  expect(screen.getByText('Test Post')).toBeInTheDocument();
  expect(screen.getByText(/tester/i)).toBeInTheDocument();
});