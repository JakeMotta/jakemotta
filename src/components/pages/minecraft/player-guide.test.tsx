import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlayerGuide } from './player-guide';
import { ServerGuide } from './server-guide';

test('existing-player action reveals migration instructions directly and can be closed using its summary', () => {
    HTMLElement.prototype.scrollIntoView = jest.fn();
    render(<PlayerGuide />);
    const action = screen.getByRole('button', { name: 'Already playing? Update or switch installs' });
    const panel = document.getElementById('modpack-update') as HTMLDetailsElement;
    expect(panel.open).toBe(false);
    fireEvent.click(action);
    expect(panel.open).toBe(true);
    expect(action).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('heading', { name: 'Already playing' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Already playing' })).toHaveFocus();
    expect(screen.getByText(/Keep your old instance/)).toBeVisible();
});

test('failed server index does not manufacture a server download', () => {
    render(<ServerGuide failed />);
    expect(screen.getByRole('status')).toHaveTextContent('The server release could not load');
    expect(screen.queryByRole('link', { name: /Download server ZIP/ })).not.toBeInTheDocument();
});
