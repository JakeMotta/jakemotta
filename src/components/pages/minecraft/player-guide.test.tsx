import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlayerGuide } from './player-guide';
import { ServerGuide } from './server-guide';

test('beginner setup shows one step at a time and preserves the zipped-import instructions', () => {
    render(<PlayerGuide />);
    expect(screen.getByRole('heading', { name: 'Minecraft & Prism' })).toBeVisible();
    expect(screen.queryByText(/Do not extract the ZIP/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('heading', { name: 'Download — keep the ZIP zipped' })).toBeVisible();
    expect(screen.getByText(/Do not extract the ZIP/)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Update / switch' }));
    expect(screen.getByRole('heading', { name: 'Already using the automatic setup?' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
});

test('existing players can start directly with updating instead of going through setup', () => {
    render(<PlayerGuide initial='update' />);
    expect(screen.getByRole('heading', { name: 'Already using the automatic setup?' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('heading', { name: 'Back up before switching' })).toBeVisible();
});

test('failed server index does not manufacture a server download', () => {
    render(<ServerGuide failed />);
    expect(screen.getByRole('status')).toHaveTextContent('The server release could not load');
    expect(screen.queryByRole('link', { name: /Download server ZIP/ })).not.toBeInTheDocument();
});
