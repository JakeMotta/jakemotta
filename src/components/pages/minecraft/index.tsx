import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiBookOpen, FiDownload, FiHelpCircle, FiServer, FiUsers } from 'react-icons/fi';
import { BentoOverlay, OverlayHeader } from '../../templates';
import { PixelCube } from '../../atoms';
import { Release, useAutoUpdate, useReleases } from '../../../common/modpack';
import { ReleaseChangelog } from './changelog';
import { DownloadOptions } from './download-options';
import { PlayerGuide } from './player-guide';
import { ServerGuide } from './server-guide';
import { ModCredits } from './mod-credits';
import { DetailDialog, StepReader } from './detail-dialog';
import { ReleaseArchive } from './release-archive';
import credits from '../../../common/modpack-credits.json';
import './index.scss';
import './single-screen.scss';

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

type Panel = 'manual' | 'setup' | 'update' | 'playing' | 'hosting' | 'credits' | 'older';
const titles: Record<Panel, string> = { manual: 'Manual client', setup: 'Player setup & updates', update: 'Player setup & updates', playing: 'Playing', hosting: 'Host your own server', credits: 'Mod credits', older: 'Older releases' };

export const Minecraft = () => {
    const navigate = useNavigate();
    const { releases, failed } = useReleases();
    const { approved, failed: autoFailed } = useAutoUpdate();
    const [panel, setPanel] = useState<Panel | null>(null);
    const [changelog, setChangelog] = useState<Release | null>(null);
    const latest = releases?.[0];
    const latestJournal = latest ? journalIn(latest.summary) : null;
    const showNext = !!latest && (!latestJournal || isOlder(latestJournal, NEXT_JOURNAL));
    const creditCount = credits.releases.find(item => item.version === (approved?.version || latest?.version))?.mods.length;
    const playingPages = [
        { title: 'Earn your next tier', body: <><p>Mine, farm, cook and explore to earn better equipment, then take on tougher fights and dungeons. Hard difficulty and scaling mobs keep each new tier meaningful.</p><p><kbd>J</kbd> opens your Progression Journal for current tiers, tasks and unlocks. <kbd>E</kbd> opens your inventory and shows your mob difficulty.</p></> },
        { title: 'Armor, tools & weapons', body: <><p><b>Armor:</b> craft your own matching sets, then complete combat and dungeon goals while wearing them. You can craft armor before unlocking the right to wear it.</p><p><b>Tools:</b> recipes follow your Tools tier. Survival goals need the exact current-tier tool. Bows unlock at Stone Tools; later goals lead into redstone, transport and the End.</p></> },
        { title: 'Bounties & playing together', body: <><p>Village boards offer repeatable bounties. Optional Journal challenges pay one-time XP rewards.</p><p>Share materials and a home while earning personal progression. Nearby eligible players can share dungeon-clear credit. The Journal explains each task’s requirements.</p></> },
        ...(showNext ? [{ title: 'Coming next', body: <><p>Journal {NEXT_JOURNAL} is being tested; it is not in the download yet.</p><ul>{NEXT_HIGHLIGHTS.map(line => <li key={line}>{line}</li>)}</ul></> }] : []),
    ];
    return <BentoOverlay label='Progression Survival modpack' onClose={() => navigate('/')} className='modpack modpack--single-screen'>
        <OverlayHeader title='Progression Survival' subtitle='Earn your next tier. Pick a section to explore.' lead={<PixelCube className='modpack__cube' />} />
        <div className='modpack__overview'>
            <section className='modpack__overview-card modpack__overview-card--download' aria-labelledby='overview-download'>
                <h3 id='overview-download'><FiDownload aria-hidden /> Get the pack</h3>
                <p className='modpack__overview-description'>Pick the client that matches the server you’re joining.</p>
                <div className='modpack__download-paths'>
                    <div className='modpack__download-path'>
                        <h4>Join Jake’s server</h4>
                        <p className='modpack__overview-more'>Use the Prism ZIP. Import it once, then launch the same setup to get server-approved updates.</p>
                        {approved ? <><p className='modpack__overview-version'>Approved · {approved.version}</p><a className='modpack__overview-download' href={approved.starter.url} download aria-label='Download auto-update ZIP'>Auto-update ZIP <FiDownload aria-hidden /></a></> : <p role='status'>{autoFailed ? 'Download unavailable. Try refreshing.' : 'Loading download…'}</p>}
                        <p className='modpack__path-note'>Keep the ZIP zipped. Import it in Prism.</p>
                    </div>
                    <div className='modpack__download-path'>
                        <h4>Other servers / manual</h4>
                        <p className='modpack__overview-more'>Use a matching .mrpack release. You handle updates; the newest release can differ from Jake’s approved version.</p>
                        {latest && <p className='modpack__overview-version'>Latest · {latest.version}</p>}
                        <button className='modpack__overview-secondary' type='button' aria-haspopup='dialog' onClick={() => setPanel('manual')}>Manual client <FiArrowUpRight aria-hidden /></button>
                        <p className='modpack__path-note'>Ask your host which release to use.</p>
                    </div>
                </div>
                <button className='modpack__overview-link' type='button' aria-haspopup='dialog' onClick={() => setPanel('older')}>Older releases & change logs <FiArrowUpRight aria-hidden /></button>
            </section>
            <section className='modpack__overview-card modpack__overview-card--setup' aria-labelledby='overview-setup'>
                <h3 id='overview-setup'><FiHelpCircle aria-hidden /> Setup & updates</h3>
                <p className='modpack__overview-description'><span className='modpack__copy-full'>Own Minecraft Java, install Prism, then import the ZIP without extracting it.</span><span className='modpack__copy-compact'>Minecraft Java + Prism.</span></p>
                <p className='modpack__overview-more'>Already set up? Close Minecraft and launch the same instance. Switching installs? Back up first and bring your personal settings.</p>
                <div className='modpack__overview-actions'><button type='button' aria-haspopup='dialog' onClick={() => setPanel('setup')} aria-label='First-time setup'><span className='modpack__copy-full'>First-time setup</span><span className='modpack__copy-compact'>First time</span></button><button type='button' aria-haspopup='dialog' onClick={() => setPanel('update')} aria-label='Update / switch'><span className='modpack__copy-full'>Update / switch</span><span className='modpack__copy-compact'>Update</span></button></div>
            </section>
            <button type='button' className='modpack__overview-card modpack__overview-card--playing' aria-haspopup='dialog' aria-label='Open playing guide' onClick={() => setPanel('playing')}>
                <span className='modpack__overview-title'><FiBookOpen aria-hidden /> Playing</span>
                <span className='modpack__overview-description'><span className='modpack__copy-full'>Earn Armor and Tools tiers through combat, mining, farming and exploration.</span><span className='modpack__copy-compact'>Personal tiers. Open your Journal with J.</span></span>
                <span className='modpack__overview-more'>Progress is personal; teamwork and shared materials are welcome. Take village bounties and optional quests along the way.</span>
                <span className='modpack__overview-facts'><span>J · Progression Journal</span><span>Hard difficulty</span></span>
                <span className='modpack__overview-hint'>Tiers, goals & rewards <FiArrowUpRight aria-hidden /></span>
            </button>
            <button type='button' className='modpack__overview-card modpack__overview-card--hosting' aria-haspopup='dialog' aria-label='Open self-hosting guide' onClick={() => setPanel('hosting')}>
                <span className='modpack__overview-title'><FiServer aria-hidden /> Host a server</span>
                <span className='modpack__overview-description'><span className='modpack__copy-full'>Create your own Hard survival world. Friends join with the matching manual client.</span><span className='modpack__copy-compact'>Your own world. Matching manual clients.</span></span>
                <span className='modpack__overview-more'>Verified server bundle, fresh-world setup, connection ports, safe stopping and backups — separate from joining Jake’s server.</span>
                <span className='modpack__overview-facts'><span>Windows</span><span>Java 21</span><span>4 GB server heap</span></span>
                <span className='modpack__overview-hint'>Download & server guide <FiArrowUpRight aria-hidden /></span>
            </button>
            <button type='button' className='modpack__overview-card modpack__overview-card--credits' aria-haspopup='dialog' aria-label='Open mod credits' onClick={() => setPanel('credits')}>
                <span className='modpack__overview-title'><FiUsers aria-hidden /> Mod credits</span>
                <span className='modpack__overview-description'><span className='modpack__copy-full'>The creators behind {creditCount ? `${creditCount} included mods and libraries` : 'the included mods and libraries'}, including server-only projects.</span><span className='modpack__copy-compact'>Mod authors, project links and licenses.</span></span>
                <span className='modpack__overview-more'>Original authors and current teams, with official project, source and license links. Credits follow the approved and latest manual releases.</span>
                <span className='modpack__overview-facts'><span>Authors</span><span>Projects</span><span>Licenses</span></span>
                <span className='modpack__overview-hint'>Browse the credits <FiArrowUpRight aria-hidden /></span>
            </button>
        </div>
        {panel && <DetailDialog title={titles[panel]} onClose={() => setPanel(null)}>
            {panel === 'manual' && <DownloadOptions approved={approved} autoFailed={autoFailed} latest={latest} releaseFailed={failed} onChangelog={setChangelog} mode='manual' />}
            {(panel === 'setup' || panel === 'update') && <PlayerGuide initial={panel === 'update' ? 'update' : 'start'} />}
            {panel === 'hosting' && <ServerGuide release={latest} failed={failed} />}
            {panel === 'playing' && <StepReader pages={playingPages} />}
            {panel === 'credits' && <ModCredits approvedVersion={approved?.version} latestVersion={latest?.version} />}
            {panel === 'older' && <ReleaseArchive releases={releases} failed={failed} onChangelog={setChangelog} />}
        </DetailDialog>}
        <ReleaseChangelog release={changelog} onClose={() => setChangelog(null)} />
    </BentoOverlay>;
};
