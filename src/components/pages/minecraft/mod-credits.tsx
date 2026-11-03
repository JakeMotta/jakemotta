import React, { useState } from 'react';
import credits from '../../../common/modpack-credits.json';
import { PageControls } from './detail-dialog';

export const ModCredits = ({ approvedVersion, latestVersion }: { approvedVersion?: string; latestVersion?: string }) => {
    const releases = credits.releases.filter(release => release.version === approvedVersion || release.version === latestVersion);
    const [version, setVersion] = useState('');
    const [index, setIndex] = useState(0);
    const release = releases.find(item => item.version === version) || releases[0];
    const mod = release?.mods[index];
    return <div className='modpack-credit-reader'>
        <p>Thank you to the creators behind the pack’s mods and libraries. Each project keeps its own license.</p>
        {releases.length > 1 && <label>Release <select value={release?.version} onChange={event => { setVersion(event.target.value); setIndex(0); }}>{releases.map(item => <option key={item.version} value={item.version}>{item.version}{item.version === approvedVersion ? ' · Server approved' : ' · Manual'}</option>)}</select></label>}
        {release && <p className='modpack__aside'>{release.version} · {release.version === approvedVersion ? 'Server-approved pack' : 'Latest manual release'} · {release.mods.length} mods</p>}
        {mod && <>
                    <article className='modpack-credit-reader__mod' aria-live='polite'>
                        <h4><a href={mod.project} target='_blank' rel='noreferrer'>{mod.name}</a></h4>
                        <p className='modpack__aside'>{mod.version} · {mod.side}</p>
                        <p><b>By</b> {mod.declaredAuthors.join('; ')}</p>
                        <p className='modpack__aside'>Project team: {mod.authors.map((author, i) => <React.Fragment key={author.url}>{i > 0 && ', '}<a href={author.url} target='_blank' rel='noreferrer'>{author.name}</a>{author.role && <span> ({author.role})</span>}</React.Fragment>)}</p>
                        <p className='modpack__aside'><a href={mod.license.url} target='_blank' rel='noreferrer'>{mod.license.name}</a>{mod.source && <> · <a href={mod.source} target='_blank' rel='noreferrer'>Source</a></>}</p>
                    </article>
                    <PageControls index={index} count={release.mods.length} onChange={setIndex} label='Mod' />
        </>}
        {!release && <p role='status'>Credits could not be matched to the loaded releases. Refresh to try again.</p>}
        {approvedVersion && !credits.releases.some(release => release.version === approvedVersion) && <p role='status'>Credits for approved pack {approvedVersion} are being refreshed. The latest manual release’s credits are listed here.</p>}
    </div>;
};
