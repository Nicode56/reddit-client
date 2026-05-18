import { useDispatch, useSelector } from 'react-redux';
import { setSubreddit, setSort } from '../../../features/filters/filtersSlice';

function Filters() {
  const dispatch = useDispatch();
  const { subreddit, sort } = useSelector((state) => state.filters);

  const subreddits = ['popular', 'javascript', 'reactjs', 'webdev'];
  const sorts = ['hot', 'new', 'top', 'rising'];

  const handleSubreddit = (sub) => {
    dispatch(setSubreddit(sub));
  };

  const handleSort = (s) => {
    dispatch(setSort(s));
  };

  return (
    <div>
      <h3>Subreddits</h3>
      {subreddits.map((sub) => (
        <button
          key={sub}
          onClick={() => handleSubreddit(sub)}
          style={{ fontWeight: subreddit === sub ? 'bold' : 'normal' }}
        >
          {sub}
        </button>
      ))}

      <h3>Sort</h3>
      {sorts.map((s) => (
        <button
          key={s}
          onClick={() => handleSort(s)}
          style={{ fontWeight: sort === s ? 'bold' : 'normal' }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export default Filters;