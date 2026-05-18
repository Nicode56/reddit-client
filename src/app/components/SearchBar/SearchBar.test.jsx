import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from '../../../features/filters/filtersSlice';

function renderWithStore(ui) {
  const store = configureStore({
    reducer: { filters: filtersReducer },
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

test('SearchBar updates input value', async () => {
  renderWithStore(<SearchBar />);
  const input = screen.getByPlaceholderText(/search reddit/i);

  await userEvent.type(input, 'react testing');
  expect(input.value).toBe('react testing');
});