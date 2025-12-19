import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListItemRenderOptions from '../ListItemRenderOptions';
import { useListItemRenderOptions } from '../ListItemRenderOptionsContext';

jest.mock('../ListItemRenderOptionsContext');

describe('ListItemRenderOptions', () => {
  const mockToggleOption = jest.fn();

  beforeEach(() => {
    useListItemRenderOptions.mockReturnValue({
      options: {
        title: true,
        thumbnail: false,
      },
      toggleOption: mockToggleOption,
    });
  });

  it('renders checkboxes for all options', () => {
    render(<ListItemRenderOptions />);
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('thumbnail')).toBeInTheDocument();
  });

  it('calls toggleOption on checkbox change', () => {
    render(<ListItemRenderOptions />);
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    expect(mockToggleOption).toHaveBeenCalledWith('title');
  });
});
