import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlayerGuide } from './player-guide';
import { ServerDownloads, ServerGuide } from './server-guide';

test('setup remains readable while the automatic download is loading', () => {
    render(<PlayerGuide approved={null} failed={false} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading modpack download');
    expect(screen.getByText('Add Instance → Import → select the ZIP')).toBeVisible();
    expect(screen.getByRole('heading',{name:'Launch from Prism'})).toBeVisible();
    expect(screen.queryByRole('button',{name:/Update|switch/})).not.toBeInTheDocument();
});

test.each([ServerGuide, ServerDownloads])('failed server index does not manufacture downloads', Component => {
    render(<Component failed />);
    expect(screen.getByRole('status')).toHaveTextContent('The server release could not load');
    expect(screen.queryByRole('link', { name: /Download server ZIP/ })).not.toBeInTheDocument();
});
