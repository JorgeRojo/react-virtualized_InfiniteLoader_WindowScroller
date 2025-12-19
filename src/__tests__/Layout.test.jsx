import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

jest.mock('../ListItemRenderOptions/ListItemRenderOptions', () => {
  return function ListItemRenderOptions() {
    return <div data-testid="render-options">Options</div>;
  };
});

jest.mock('../PageWindowScroller', () => {
  return function PageWindowScroller() {
    return <div data-testid="page-window-scroller">WindowScroller</div>;
  };
});

describe('Layout', () => {
  it('renders ListItemRenderOptions', () => {
    render(<Layout />);
    expect(screen.getByTestId('render-options')).toBeInTheDocument();
  });

  it('renders PageWindowScroller', () => {
    render(<Layout />);
    expect(screen.getByTestId('page-window-scroller')).toBeInTheDocument();
  });
});
