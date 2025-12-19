import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./Layout', () => {
  return function Layout() {
    return <div data-testid="layout">Layout Component</div>;
  };
});

describe('App', () => {
  it('renders Layout component', () => {
    render(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});
