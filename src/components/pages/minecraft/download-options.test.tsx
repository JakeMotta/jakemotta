import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DownloadOptions } from './download-options';
import { AutoUpdate, Release } from '../../../common/modpack';

const file = { name: 'manual.mrpack', url: '/manual/latest.mrpack', bytes: 2048, sha256: '' };
const latest: Release = { version: '1.0.0-rc.15', prerelease: true, published: '2026-11-01', minecraft: '1.21.1', neoforge: '21.1.264', java: 21, summary: '', notes: '/notes', checksums: '/sums', client: file, server: file };
const approved: AutoUpdate = { version: '1.0.0-rc.12', journal: '0.9.8', minecraft: '1.21.1', neoforge: '21.1.264', java: 21, starter: { ...file, name: 'auto.zip', url: '/downloads/progression-survival/packwiz/releases/1.0.0-rc.12/auto.zip' }, guide: '/guide', feed: '/feed' };

test('automatic and manual choices show their own version and download; changelog belongs to the manual release', () => {
    const onChangelog = jest.fn();
    render(<DownloadOptions approved={approved} latest={latest} autoFailed={false} releaseFailed={false} onChangelog={onChangelog} />);
    const automatic = within(screen.getByRole('region', { name: 'Automatic updates' }));
    const manual = within(screen.getByRole('region', { name: 'Manual download' }));
    expect(automatic.getByRole('link', { name: 'Download auto-update ZIP' })).toHaveAttribute('href', approved.starter.url);
    expect(automatic.getByText(approved.version)).toBeVisible();
    expect(manual.getByRole('link', { name: 'Download .mrpack' })).toHaveAttribute('href', file.url);
    expect(manual.getByText(latest.version)).toBeVisible();
    fireEvent.click(manual.getByRole('button', { name: `Read change log for manual release ${latest.version}` }));
    expect(onChangelog).toHaveBeenCalledWith(latest);
});

test('unavailable automatic feed gives a clear recovery message without relabeling the manual file as automatic', () => {
    render(<DownloadOptions approved={null} latest={latest} autoFailed releaseFailed={false} onChangelog={() => {}} />);
    expect(screen.getByText(/modpack download could not load/i)).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Download auto-update ZIP' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Download .mrpack' })).toHaveAttribute('href', file.url);
});

test('server-compatible automatic download remains available if the independent manual list fails', () => {
    render(<DownloadOptions approved={approved} autoFailed={false} releaseFailed onChangelog={() => {}} />);
    expect(screen.getByRole('link', { name: 'Download auto-update ZIP' })).toBeVisible();
    expect(screen.getByText(/manual release list could not load/i)).toBeVisible();
});
