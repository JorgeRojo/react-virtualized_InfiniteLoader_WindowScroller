import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ListItemsInfiniteLoader from '../ListItemsInfiniteLoader';
import fetchProducts, { pageSize } from '../fetchProducts';

jest.mock('../fetchProducts');

let mockLoadMoreRows;
let mockIsRowLoaded;

jest.mock('react-virtualized', () => ({
  InfiniteLoader: ({ children, loadMoreRows, isRowLoaded }) => {
    mockLoadMoreRows = loadMoreRows;
    mockIsRowLoaded = isRowLoaded;
    React.useEffect(() => {
      loadMoreRows({ startIndex: 0, stopIndex: 9 });
    }, []);
    return children({ 
      onRowsRendered: jest.fn(), 
      registerChild: jest.fn() 
    });
  },
}));

jest.mock('../ListItemsMasonry', () => {
  return function ListItemsMasonry({ getDataItemByIndex, cellCount }) {
    return (
      <div data-testid="masonry">
        <span data-testid="cell-count">{cellCount}</span>
        <span data-testid="item-0">{getDataItemByIndex({ index: 0 })?.title || 'null'}</span>
      </div>
    );
  };
});

describe('ListItemsInfiniteLoader', () => {
  const defaultProps = {
    height: 600,
    scrollAreaWidth: 800,
    handleOnResize: jest.fn(),
    isScrolling: false,
    scrollTop: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    fetchProducts.pageSize = 25;
  });

  it('renders InfiniteLoader with Masonry', () => {
    fetchProducts.mockResolvedValue({ dataItems: [], total: 0 });
    const { getByTestId } = render(<ListItemsInfiniteLoader {...defaultProps} />);
    expect(getByTestId('masonry')).toBeInTheDocument();
  });

  it('loads data and updates list items count', async () => {
    const mockData = {
      dataItems: [
        { id: 1, title: 'Product 1' },
        { id: 2, title: 'Product 2' },
      ],
      total: 100,
    };
    fetchProducts.mockResolvedValue(mockData);

    const { getByTestId } = render(<ListItemsInfiniteLoader {...defaultProps} />);

    await waitFor(() => {
      expect(fetchProducts).toHaveBeenCalledWith(0, 25);
    });

    await waitFor(() => {
      expect(getByTestId('cell-count')).toHaveTextContent('100');
    });
  });

  it('handles fetch error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    fetchProducts.mockRejectedValue(new Error('Network error'));

    render(<ListItemsInfiniteLoader {...defaultProps} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('does not reload same page twice', async () => {
    fetchProducts.mockResolvedValue({ dataItems: [], total: 50 });

    render(<ListItemsInfiniteLoader {...defaultProps} />);

    await waitFor(() => {
      expect(fetchProducts).toHaveBeenCalledTimes(1);
    });

    // Try to load same page again
    await mockLoadMoreRows({ startIndex: 0, stopIndex: 24 });

    expect(fetchProducts).toHaveBeenCalledTimes(1);
  });

  it('handles invalid data response', async () => {
    fetchProducts.mockResolvedValue({ dataItems: null, total: null });

    const { getByTestId } = render(<ListItemsInfiniteLoader {...defaultProps} />);

    await waitFor(() => {
      expect(getByTestId('cell-count')).toHaveTextContent('25');
    });
  });

  it('returns correct data item by index', async () => {
    const mockData = {
      dataItems: [{ id: 1, title: 'Test Product' }],
      total: 50,
    };
    fetchProducts.mockResolvedValue(mockData);

    const { getByTestId } = render(<ListItemsInfiniteLoader {...defaultProps} />);

    await waitFor(() => {
      expect(getByTestId('item-0')).toHaveTextContent('Test Product');
    });
  });

  it('checks if row is loaded correctly', async () => {
    const mockData = {
      dataItems: [{ id: 1, title: 'Product' }],
      total: 50,
    };
    fetchProducts.mockResolvedValue(mockData);

    render(<ListItemsInfiniteLoader {...defaultProps} />);

    await waitFor(() => {
      expect(fetchProducts).toHaveBeenCalled();
    });

    // Check loaded row
    expect(mockIsRowLoaded({ index: 0 })).toBe(true);
    
    // Check unloaded row
    expect(mockIsRowLoaded({ index: 100 })).toBe(false);
  });
});
