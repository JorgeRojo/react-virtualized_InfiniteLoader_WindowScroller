import React from 'react';
import { render } from '@testing-library/react';
import PageWindowScroller from '../PageWindowScroller';

jest.mock('react-virtualized', () => ({
  WindowScroller: ({ children }) => children({ height: 600, isScrolling: false, scrollTop: 0, registerChild: jest.fn() }),
}));

jest.mock('../ListItemsAutoSizer', () => {
  return function ListItemsAutoSizer() {
    return <div data-testid="auto-sizer">AutoSizer</div>;
  };
});

describe('PageWindowScroller', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    delete window.history.scrollRestoration;
  });

  it('renders WindowScroller with AutoSizer', () => {
    const { getByTestId } = render(<PageWindowScroller />);
    expect(getByTestId('auto-sizer')).toBeInTheDocument();
  });

  it('scrolls to top on mount', () => {
    render(<PageWindowScroller />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('sets scrollRestoration to manual when supported', () => {
    window.history.scrollRestoration = 'auto';
    render(<PageWindowScroller />);
    expect(window.history.scrollRestoration).toBe('manual');
  });

  it('handles missing scrollRestoration support', () => {
    delete window.history.scrollRestoration;
    expect(() => {
      render(<PageWindowScroller />);
    }).not.toThrow();
  });
});
