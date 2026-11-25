import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('adds a task and counts it as remaining', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('New task'), 'Write tests');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByRole('checkbox', { name: 'Write tests' })).toBeInTheDocument();
    expect(screen.getByText('1 remaining')).toBeInTheDocument();
  });

  it('filters completed tasks', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('New task'), 'Ship it');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.click(screen.getByRole('checkbox', { name: 'Ship it' }));
    await user.click(screen.getByRole('radio', { name: 'open' }));

    expect(screen.queryByRole('checkbox', { name: 'Ship it' })).not.toBeInTheDocument();
    expect(screen.getByText('0 remaining')).toBeInTheDocument();
  });
});
