import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReleaseChangelog } from './changelog';
import { Release } from '../../../common/modpack';
import changelogs from '../../../common/modpack-changelogs.json';

jest.mock('../../atoms', () => ({ Markdown: ({ text }: { text: string }) => text }));
const release = (version: string): Release => ({
  version,
  prerelease: true,
  published: '2026-10-31',
  minecraft: '1.21.1',
  neoforge: '21.1.264',
  java: 21,
  summary: '',
  notes: `/notes/${version}.md`,
  checksums: '/sums',
  client: { name: `${version}.mrpack`, url: `/releases/${version}.mrpack`, bytes: 1234, sha256: '' },
  server: { name: `${version}.zip`, url: `/releases/${version}.zip`, bytes: 1234, sha256: '' },
});

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});
beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({matches:true});
  global.fetch = jest.fn();
});
afterEach(() => {
  jest.restoreAllMocks();
});

test.each(Object.entries(changelogs))('readable historical changes for %s with the matching download', (version, entry) => {
  const item = release(version);
  render(<ReleaseChangelog release={item} onClose={() => {}} />);
  expect(screen.getByRole('dialog')).toHaveAttribute('open');
  expect(screen.getByText(entry.comparison)).toBeVisible();
  for (const text of [...entry.added, ...entry.changed, ...entry.removed]) expect(screen.getByText(text)).toBeVisible();
  expect(screen.getByRole('link', { name: `Download ${version}` })).toHaveAttribute('href', item.client.url);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('close button and backdrop report closure rather than navigating to a file', () => {
  const onClose = jest.fn();
  const view = render(<ReleaseChangelog release={release('1.0.0-rc.14')} onClose={onClose} />);
  fireEvent.click(screen.getByRole('button', { name: 'Close change log' }));
  expect(onClose).toHaveBeenCalledTimes(1);
  view.rerender(<ReleaseChangelog release={null} onClose={onClose} />);
  view.rerender(<ReleaseChangelog release={release('1.0.0-rc.10')} onClose={onClose} />);
  fireEvent.click(screen.getByRole('dialog'));
  expect(onClose).toHaveBeenCalledTimes(2);
});

test('future releases load Markdown into the reader without a file navigation', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({ ok: true, text: async () => 'Future release changes' });
  render(<ReleaseChangelog release={release('2.0.0')} onClose={() => {}} />);
  expect(await screen.findByText('Future release changes')).toBeVisible();
  expect(global.fetch).toHaveBeenCalledWith('/notes/2.0.0.md', expect.objectContaining({ signal: expect.any(AbortSignal) }));
});

test('failed notes can be retried by reopening the reader', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce({ ok: true, text: async () => 'Recovered changes' });
  const item = release('2.0.0');
  const view = render(<ReleaseChangelog release={item} onClose={() => {}} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('couldn’t load');
  view.rerender(<ReleaseChangelog release={null} onClose={() => {}} />);
  view.rerender(<ReleaseChangelog release={item} onClose={() => {}} />);
  expect(await screen.findByText('Recovered changes')).toBeVisible();
});

test('a slower previous request cannot overwrite the currently selected release', async () => {
  let finishFirst: (value: unknown) => void = () => {};
  (global.fetch as jest.Mock)
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishFirst = resolve;
        }),
    )
    .mockResolvedValueOnce({ ok: true, text: async () => 'Current changes' });
  const view = render(<ReleaseChangelog release={release('2.0.0')} onClose={() => {}} />);
  view.rerender(<ReleaseChangelog release={release('3.0.0')} onClose={() => {}} />);
  expect(await screen.findByText('Current changes')).toBeVisible();
  await act(async () => {
    finishFirst({ ok: true, text: async () => 'Stale changes' });
  });
  await waitFor(() => expect(screen.queryByText('Stale changes')).not.toBeInTheDocument());
  expect(screen.getByText('Current changes')).toBeVisible();
});
