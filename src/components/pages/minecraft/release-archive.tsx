import React, { useState } from 'react';
import { formatDate, formatShortDate, Release } from '../../../common/modpack';
import { PageControls } from './detail-dialog';

export const ReleaseArchive = ({ releases, failed, onChangelog }: { releases: Release[] | null; failed: boolean; onChangelog: (release: Release) => void }) => {
    const [index, setIndex] = useState(0);
    const older = releases?.slice(1);
    if (!older?.length) return <p role='status'>{failed ? 'The release list couldn’t load. Try refreshing.' : older ? 'No older releases yet.' : 'Loading…'}</p>;
    return <>
        <p>Choose the client release that matches your server. Dates and change logs are preserved for each release.</p>
        <div className='modpack-archive'>
            {older.slice(index * 3, index * 3 + 3).map(release => <p key={release.version} className='modpack__older'>
                <a href={release.client.url} download aria-label={`Download Progression Survival ${release.version}`}>{release.version}</a>
                <time dateTime={release.published} title={formatDate(release.published)} aria-label={`Released ${formatDate(release.published)}`}>{formatShortDate(release.published)}</time>
                <button type='button' aria-haspopup='dialog' onClick={() => onChangelog(release)} aria-label={`Read change log for ${release.version}`}>Change log</button>
            </p>)}
        </div>
        <PageControls index={index} count={Math.ceil(older.length / 3)} onChange={setIndex} />
    </>;
};
