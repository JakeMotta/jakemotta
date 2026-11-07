import React from 'react';
import { Release } from '../../../common/modpack';
import highlights from '../../../common/modpack-highlights.json';

interface Highlight {
    blurb: string;
    lines: string[];
}
const notes: Record<string, Highlight> = highlights;

const shortVersion = (version: string) => version.replace(/^\d+\.\d+\.\d+-/, '');
const monthDay = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/**
 * The newest release at a glance: its version, a line about it and a few highlights from
 * modpack-highlights.json (the release's own summary when it has none), with its change log and download.
 */
export const WhatsNew = ({ release, failed, onChangelog }: { release?: Release; failed: boolean; onChangelog: (release: Release) => void }) => {
    if (!release) {
        return (
            <section className='modpack__whats-new' aria-label='What’s new'>
                <p className='modpack__eyebrow'>What’s new</p>
                <p role='status'>{failed ? 'The latest release couldn’t load. Try refreshing.' : 'Loading the latest release…'}</p>
            </section>
        );
    }
    const note = notes[release.version];
    return (
        <section className='modpack__whats-new' aria-labelledby='modpack-new-version'>
            <p className='modpack__eyebrow'>
                What’s new · <time dateTime={release.published}>{monthDay(release.published)}</time>
            </p>
            <h3 id='modpack-new-version' className='modpack__whats-new-version'>
                {shortVersion(release.version)}
            </h3>
            <p>{note?.blurb ?? release.summary}</p>
            {note && note.lines.length > 0 && (
                <ul className='modpack__whats-new-lines'>
                    {note.lines.map((line) => (
                        <li key={line}>{line}</li>
                    ))}
                </ul>
            )}
            <div className='modpack__whats-new-actions'>
                <button type='button' className='modpack__button' aria-haspopup='dialog' onClick={() => onChangelog(release)}>
                    Full change log
                </button>
                <a className='modpack__button' href={release.client.url} download>
                    Download .mrpack ↓
                </a>
            </div>
        </section>
    );
};
