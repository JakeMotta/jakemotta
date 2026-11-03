import React, { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { AutoUpdate, formatDate, formatSize, PACK_DIR, Release } from '../../../common/modpack';

interface Props {
    approved: AutoUpdate | null;
    autoFailed: boolean;
    latest?: Release;
    releaseFailed: boolean;
    onChangelog: (release: Release) => void;
    mode?: 'auto' | 'manual';
}

export const DownloadOptions = ({ approved, autoFailed, latest, releaseFailed, onChangelog, mode }: Props) => {
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
    const latestLink = `${window.location.origin}${PACK_DIR}/latest.mrpack`;
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(latestLink);
            setCopyState('copied');
        } catch {
            setCopyState('failed');
        }
    };

    return (
        <>
            {mode !== 'manual' && <section className='modpack__choice modpack__choice--auto' aria-labelledby='modpack-auto-title'>
                <span className='modpack__recommended'>Join Jake’s server</span>
                <h4 id='modpack-auto-title'>Automatic updates</h4>
                <p>Import once. After setup, press <b>Play</b> in Prism to update and launch.</p>
                {approved ? (
                    <>
                        <a className='modpack__button modpack__button--solid' href={approved.starter.url} download>
                            <FiDownload aria-hidden /> <span>Download auto-update ZIP</span>
                        </a>
                        <p className='modpack__aside'>Prism instance · {formatSize(approved.starter.bytes)}</p>
                        <p className='modpack__aside'>Server-compatible client: <b>{approved.version}</b></p>
                    </>
                ) : (
                    <p role='status'>{autoFailed ? 'The server download could not load. Refresh this page, or ask Jake for the auto-update ZIP.' : 'Loading the server-compatible download…'}</p>
                )}
            </section>}

            {mode !== 'auto' && <section className='modpack__choice modpack__choice--manual' aria-labelledby='modpack-manual-title'>
                <h4 id='modpack-manual-title'>Manual download</h4>
                <p>Latest published client for manual installs and self-hosted servers. You manage updates and match the server’s release.</p>
                {latest ? (
                    <>
                        <div className='modpack__release-line'>
                            <strong>{latest.version}</strong>
                            <button type='button' className='modpack__text-action' aria-haspopup='dialog' aria-label={`Read change log for manual release ${latest.version}`} onClick={() => onChangelog(latest)}>Change log</button>
                        </div>
                        <p className='modpack__aside'>Latest published · {formatDate(latest.published)}</p>
                        <a className='modpack__button' href={latest.client.url} download>
                            <FiDownload aria-hidden /> Download .mrpack
                        </a>
                        <p className='modpack__aside'>{formatSize(latest.client.bytes)} · Choose a release matching your server.</p>
                        {approved && approved.version !== latest.version && <p className='modpack__aside'>Joining Jake’s server? Choose Automatic instead; the latest manual release can be ahead of the approved server.</p>}
                        <details className='modpack__details'>
                            <summary>Copy the latest manual link</summary>
                            <div className='modpack__latest'>
                                <label htmlFor='modpack-latest-link'>Latest manual .mrpack</label>
                                <div>
                                    <input id='modpack-latest-link' readOnly value={latestLink} onFocus={event => event.target.select()} />
                                    <button type='button' onClick={copyLink} aria-label='Copy latest manual download link'>{copyState === 'copied' ? 'Copied' : 'Copy'}</button>
                                </div>
                                <span role='status'>{copyState === 'failed' ? 'Select the link and copy it manually.' : 'This follows the latest published release, not the server-approved auto-update feed.'}</span>
                            </div>
                        </details>
                    </>
                ) : (
                    <p role='status'>{releaseFailed ? 'The manual release list could not load. Refresh to try again.' : 'Loading manual releases…'}</p>
                )}
            </section>}
        </>
    );
};
