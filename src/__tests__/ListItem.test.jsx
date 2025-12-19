import React from 'react';
import { render, screen } from '@testing-library/react';
import ListItem from '../ListItem';
import { useListItemRenderOptions } from '../ListItemRenderOptions/ListItemRenderOptionsContext';

jest.mock('../ListItemRenderOptions/ListItemRenderOptionsContext');

describe('ListItem', () => {
  const mockGetDataItemByIndex = jest.fn();
  const defaultProps = {
    index: 0,
    getDataItemByIndex: mockGetDataItemByIndex,
    style: {},
    leftItemPosition: 0,
  };

  beforeEach(() => {
    useListItemRenderOptions.mockReturnValue({
      options: {
        title: true,
        thumbnail: true,
        status: true,
        brand: true,
        description: true,
      },
    });
  });

  it('renders loading skeleton when no data', () => {
    mockGetDataItemByIndex.mockReturnValue(null);
    render(<ListItem {...defaultProps} />);
    expect(screen.getByText('"Loading..."')).toBeInTheDocument();
  });

  it('renders item with data', () => {
    const mockData = {
      id: 1,
      title: 'Test Product',
      thumbnail: 'test.jpg',
      availabilityStatus: 'In Stock',
      brand: 'Test Brand',
      description: 'Test Description',
    };
    mockGetDataItemByIndex.mockReturnValue(mockData);

    render(<ListItem {...defaultProps} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
