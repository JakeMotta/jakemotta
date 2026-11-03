import React from 'react';
import credits from '../../../common/modpack-credits.json';

export const ModCredits = ({ approvedVersion, latestVersion }: { approvedVersion?: string; latestVersion?: string }) => (
    <section className='modpack__tile modpack__tile--credits' aria-labelledby='modpack-credits'>
        <h3 id='modpack-credits' className='modpack__eyebrow'>Mod credits</h3>
        <p>Progression Survival’s rules and Journal build on these creators’ work. Thank you to the mod authors, contributors and projects that make the pack possible.</p>
        <p className='modpack__aside'>Includes client mods, server-only mods and required libraries. Each project keeps its own license. Author and project links lead to the publishers’ official pages.</p>
        {credits.releases.filter(release => release.version === approvedVersion || release.version === latestVersion).map(release => (
            <details className='modpack__details' key={release.version} open={release.version === approvedVersion || !approvedVersion}>
                <summary>{release.version} · {release.version === approvedVersion ? 'Server-approved pack' : 'Latest manual release'} · {release.mods.length} mods</summary>
                <ul className='modpack__credits-list'>
                    {release.mods.map(mod => <li key={mod.filename}>
                        <h4><a href={mod.project} target='_blank' rel='noreferrer'>{mod.name}</a></h4>
                        <p className='modpack__aside'>{mod.version} · {mod.side}</p>
                        <p><b>By</b> {mod.declaredAuthors.join('; ')}</p>
                        <p className='modpack__aside'>Project team: {mod.authors.map((author, i) => <React.Fragment key={author.url}>{i > 0 && ', '}<a href={author.url} target='_blank' rel='noreferrer'>{author.name}</a>{author.role && <span> ({author.role})</span>}</React.Fragment>)}</p>
                        <p className='modpack__aside'><a href={mod.license.url} target='_blank' rel='noreferrer'>{mod.license.name}</a>{mod.source && <> · <a href={mod.source} target='_blank' rel='noreferrer'>Source</a></>}</p>
                    </li>)}
                </ul>
            </details>
        ))}
        {approvedVersion && !credits.releases.some(release => release.version === approvedVersion) && <p role='status'>Credits for approved pack {approvedVersion} are being refreshed. The latest manual release’s credits are listed here.</p>}
    </section>
);
