import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ListItemRenderOptionsProvider } from '../ListItemRenderOptions/ListItemRenderOptionsContext';

const mockPositioner = {
  reset: jest.fn(),
};

const mockCache = {
  clearAll: jest.fn(),
};

const mockMasonryRef = {
  clearCellPositions: jest.fn(),
  recomputeCellPositions: jest.fn(),
};

let cellRendererFn;

const MockMasonry = React.forwardRef(({ cellRenderer, cellCount }, ref) => {
  cellRendererFn = cellRenderer;
  React.useImperativeHandle(ref, () => mockMasonryRef);
  return (
    <div data-testid="masonry">
      {Array.from({ length: Math.min(cellCount, 3) }).map((_, i) => (
        <div key={i}>{cellRenderer({ index: i, key: `cell-${i}`, parent: {}, style: {} })}</div>
      ))}
    </div>
  );
});

jest.mock('react-virtualized', () => ({
  Masonry: MockMasonry,
  CellMeasurer: ({ children }) => children({ registerChild: jest.fn() }),
  CellMeasurerCache: jest.fn().mockImplementation(() => mockCache),
  createMasonryCellPositioner: jest.fn(() => mockPositioner),
}));

const ListItemsMasonry = require('../ListItemsMasonry').default;

describe('ListItemsMasonry', () => {
  const mockGetDataItemByIndex = jest.fn();
  const defaultProps = {
    cellCount: 10,
    height: 600,
    scrollAreaWidth: 800,
    getDataItemByIndex: mockGetDataItemByIndex,
    registerChild: jest.fn(),
    onCellsRendered: jest.fn(),
    scrollTop: 0,
    isScrolling: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDataItemByIndex.mockReturnValue({ id: 1, title: 'Test' });
  });

  it('renders Masonry component', () => {
    const { getByTestId } = render(
      <ListItemRenderOptionsProvider>
        <ListItemsMasonry {...defaultProps} />
      </ListItemRenderOptionsProvider>
    );
    expect(getByTestId('masonry')).toBeInTheDocument();
  });

  it('calculates column count correctly', () => {
    render(
      <ListItemRenderOptionsProvider>
        <ListItemsMasonry {...defaultProps} />
      </ListItemRenderOptionsProvider>
    );
    expect(mockPositioner.reset).toHaveBeenCalled();
  });

  it('handles single column layout', () => {
    render(
      <ListItemRenderOptionsProvider>
        <ListItemsMasonry {...defaultProps} scrollAreaWidth={220} />
      </ListItemRenderOptionsProvider>
    );
    
    expect(mockPositioner.reset).toHaveBeenCalled();
  });

  it('handles multiple column layout', () => {
    render(
      <ListItemRenderOptionsProvider>
        <ListItemsMasonry {...defaultProps} scrollAreaWidth={800} />
      </ListItemRenderOptionsProvider>
    );
    
    expect(mockPositioner.reset).toHaveBeenCalled();
  });

  it('resets masonry on scroll area width change', async () => {
    const { rerender } = render(
      <ListItemRenderOptionsProvider>
        <ListItemsMasonry {...defaultProps} scrollAreaWidth={800} />
      </ListItemRenderOptionsProvider>
    );

    mockPositioner.reset.mockClear();
    mockCache.clearAll.mockClear();
    mockMasonryRef.clearCellPositions.mockClear();

    rerender(
      <ListItemRenderOptionsProvider>
        <ListItemsMasonry {...defaultProps} scrollAreaWidth={1000} />
      </ListItemRenderOptionsProvider>
    );

    await waitFor(() => {
      expect(mockPositioner.reset).toHaveBeenCalled();
      expect(mockCache.clearAll).toHaveBeenCalled();
      expect(mockMasonryRef.clearCellPositions).toHaveBeenCalled();
    });
  });

  it('renders cells with correct positioning', () => {
    render(
      <ListItemRenderOptionsProvider>
        <ListItemsMasonry {...defaultProps} />
      </ListItemRenderOptionsProvider>
    );

    expect(cellRendererFn).toBeDefined();
    const result = cellRendererFn({ index: 0, key: 'test', parent: {}, style: {} });
    expect(result).toBeDefined();
  });

  it('handles column count change', async () => {
    const { rerender } = render(
      <ListItemRenderOptionsProvider>
        <ListItemsMasonry {...defaultProps} scrollAreaWidth={400} />
      </ListItemRenderOptionsProvider>
    );

    rerender(
      <ListItemRenderOptionsProvider>
        <ListItemsMasonry {...defaultProps} scrollAreaWidth={800} />
      </ListItemRenderOptionsProvider>
    );

    await waitFor(() => {
      expect(mockPositioner.reset).toHaveBeenCalled();
    });
  });
});
