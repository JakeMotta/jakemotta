import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BentoOverlay, OverlayHeader } from '../../templates';
import { PixelCube } from '../../atoms';
import { formatDate, formatShortDate, Release, useAutoUpdate, useReleases } from '../../../common/modpack';
import './index.scss';
import { ReleaseChangelog } from './changelog';
import { DownloadOptions } from './download-options';
import { PlayerGuide } from './player-guide';
import { ServerGuide } from './server-guide';
import { ModCredits } from './mod-credits';

/**
 * The Progression Journal build being tested for the next release, and what it brings, taken from the
 * pack repository's companion-mod/CHANGELOG.md. The Coming next tile hides itself once the latest
 * release's summary names this journal or a newer one, so it never outlives the release that ships it.
 */
const NEXT_JOURNAL = '0.9.8';
const NEXT_HIGHLIGHTS = [
    "Village Bounties' original wooden board and bottom-left tracker are back, and a bounty's rewards list just what you'll get.",
    'A pop-up for every bounty you complete, like the ones for progression tasks.',
    "Quest categories sit centered in their headers, stay open or closed the way you left them, and show how many of their quests you've finished.",
    "Bounty boards and their signs can't be broken or blown up in survival.",
    'Hard and Elite bounties give gear 25% and 35% of the time instead of always. Bounties you already have keep their rewards.',
];

/** The journal version a release's summary names ("…with Journal 0.9.0…"), or null if it names none */
const journalIn = (summary: string) => summary.match(/Journal (\d+(?:\.\d+)*)/)?.[1] ?? null;

/** Whether dotted version a comes before b */
const isOlder = (a: string, b: string) => {
    const [x, y] = [a.split('.').map(Number), b.split('.').map(Number)];
    for (let i = 0; i < Math.max(x.length, y.length); i++) {
        if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) < (y[i] ?? 0);
    }
    return false;
};

/**
 * The modpack tile opened: the Progression Survival download page, laid out as a board of its own.
 * Everything about the releases comes from releases.json, so shipping a new version never needs
 * this page to change.
 */
export const Minecraft = () => {
    const navigate = useNavigate();
    const { releases, failed } = useReleases();
    const { approved: autoUpdate, failed: autoFailed } = useAutoUpdate();
    const [changelog, setChangelog] = useState<Release | null>(null);
    const latest = releases?.[0];
    const latestJournal = latest ? journalIn(latest.summary) : null;
    // Shown only once the releases have loaded, and only while the latest one carries an older journal
    const showNext = !!latest && (!latestJournal || isOlder(latestJournal, NEXT_JOURNAL));

    return (
        <BentoOverlay label='Progression Survival modpack' onClose={() => navigate('/')} className='modpack'>
            <OverlayHeader
                title='Progression Survival'
                subtitle='A survival modpack built around earning your next tier. Join our server or host a world of your own.'
                lead={<PixelCube className='modpack__cube' />}
            />

            <div className={`modpack__grid${showNext ? ' modpack__grid--next' : ''}`}>
                <section className='modpack__tile modpack__tile--download' aria-labelledby='modpack-download'>
                    <h3 id='modpack-download' className='modpack__eyebrow'>
                        Download
                    </h3>
                    <DownloadOptions approved={autoUpdate} autoFailed={autoFailed} latest={latest} releaseFailed={failed} onChangelog={setChangelog} />
                </section>

                <PlayerGuide />
                <ServerGuide release={latest} failed={failed} />

                <section className='modpack__tile modpack__tile--playing' aria-labelledby='modpack-playing'>
                    <h3 id='modpack-playing' className='modpack__eyebrow'>
                        Playing
                    </h3>
                    <p>Build a life between expeditions: mine, farm, cook and explore to earn better equipment, then take on tougher fights and dungeons. Hard difficulty and scaling mobs keep new tiers meaningful.</p>
                    <p className='modpack__key'><kbd>J</kbd> opens your Progression Journal: your current tier, tasks, progress and unlocks.</p>
                    <p><b>Armor:</b> craft your own matching sets, then finish combat and dungeon goals while wearing them. You can craft armor before unlocking the right to wear it.</p>
                    <p><b>Tools & weapons:</b> recipes follow your Tools tier. Mine, farm, cook and complete survival goals with the exact current-tier tool. Bows unlock at Stone Tools; later goals lead into redstone, transport and the End.</p>
                    <p><b>Village bounties & quests:</b> pick up repeatable jobs at village boards, or take optional journal challenges for one-time XP rewards.</p>
                    <p><b>Play together:</b> share materials and a home while earning personal progression. Nearby eligible players can share dungeon-clear credit. Your journal explains the requirements for each task.</p>
                    <p className='modpack__key'><kbd>E</kbd> opens your inventory, including your mob difficulty.</p>
                </section>

                {/* What's being tested for the next release; never a download, since it isn't in a pack yet */}
                {showNext && latest && (
                    <section className='modpack__tile modpack__tile--next' aria-labelledby='modpack-next'>
                        <h3 id='modpack-next' className='modpack__eyebrow'>
                            Coming next
                        </h3>
                        <p>
                            Progression Journal {NEXT_JOURNAL} is being tested for the next release. It isn't in the download yet
                            {latestJournal ? `: ${latest.version} has Journal ${latestJournal}.` : '.'}
                        </p>
                        <ul className='modpack__next'>
                            {NEXT_HIGHLIGHTS.map((line) => (
                                <li key={line}>{line}</li>
                            ))}
                        </ul>
                        <p className='modpack__aside'>When it ships, the server and everyone's pack update together.</p>
                    </section>
                )}

                <section className='modpack__tile modpack__tile--older' aria-labelledby='modpack-older'>
                    <h3 id='modpack-older' className='modpack__eyebrow'>
                        Older releases
                    </h3>
                    {releases && releases.length > 1 ? (
                        releases.slice(1).map((release) => (
                            <p key={release.version} className='modpack__older'>
                                <a href={release.client.url} download aria-label={`Download Progression Survival ${release.version}`}>
                                    {release.version}
                                </a>
                                <time dateTime={release.published} title={formatDate(release.published)} aria-label={`Released ${formatDate(release.published)}`}>
                                    {formatShortDate(release.published)}
                                </time>
                                <button type='button' aria-haspopup='dialog' onClick={() => setChangelog(release)} aria-label={`Read change log for ${release.version}`}>
                                    Change log
                                </button>
                            </p>
                        ))
                    ) : (
                        <p>{failed ? "The release list couldn’t load. Try refreshing." : releases ? "No older releases yet." : 'Loading…'}</p>
                    )}
                </section>
                <ModCredits approvedVersion={autoUpdate?.version} latestVersion={latest?.version} />
            </div>
            <ReleaseChangelog release={changelog} onClose={() => setChangelog(null)} />
        </BentoOverlay>
    );
};
