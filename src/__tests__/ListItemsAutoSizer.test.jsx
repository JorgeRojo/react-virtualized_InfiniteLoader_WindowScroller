import React from 'react';
import { render } from '@testing-library/react';
import ListItemsAutoSizer from '../ListItemsAutoSizer';

jest.mock('react-virtualized', () => ({
  AutoSizer: ({ children }) => children({ width: 800 }),
}));

jest.mock('../ListItemsInfiniteLoader', () => {
  return function ListItemsInfiniteLoader({ scrollAreaWidth, height }) {
    return <div data-testid="infinite-loader">{`${scrollAreaWidth}x${height}`}</div>;
  };
});

describe('ListItemsAutoSizer', () => {
  it('renders AutoSizer with InfiniteLoader', () => {
    const { getByTestId } = render(<ListItemsAutoSizer height={600} />);
    expect(getByTestId('infinite-loader')).toHaveTextContent('800x600');
  });
});
