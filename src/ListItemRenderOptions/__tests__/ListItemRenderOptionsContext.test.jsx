import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListItemRenderOptionsProvider, useListItemRenderOptions } from '../ListItemRenderOptionsContext';

const TestComponent = () => {
  const { options, toggleOption } = useListItemRenderOptions();
  return (
    <div>
      <span data-testid="title">{options.title.toString()}</span>
      <button onClick={() => toggleOption('title')}>Toggle</button>
    </div>
  );
};

describe('ListItemRenderOptionsContext', () => {
  it('provides default options', () => {
    render(
      <ListItemRenderOptionsProvider>
        <TestComponent />
      </ListItemRenderOptionsProvider>
    );
    expect(screen.getByTestId('title')).toHaveTextContent('true');
  });

  it('toggles option', () => {
    render(
      <ListItemRenderOptionsProvider>
        <TestComponent />
      </ListItemRenderOptionsProvider>
    );
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('title')).toHaveTextContent('false');
  });

  it('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useListItemRenderOptions must be used within ListItemRenderOptionsProvider');
    
    consoleError.mockRestore();
  });
});
