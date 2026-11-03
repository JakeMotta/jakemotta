import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiBookOpen, FiDownload, FiHelpCircle, FiPackage, FiServer, FiUsers } from 'react-icons/fi';
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

type Panel = 'downloads' | 'setup' | 'update' | 'playing' | 'hosting' | 'credits' | 'older';
const titles: Record<Panel, string> = { downloads: 'All downloads', setup: 'Player setup & updates', update: 'Player setup & updates', playing: 'Playing', hosting: 'Host your own server', credits: 'Mod credits', older: 'Older releases' };

export const Minecraft = () => {
    const navigate = useNavigate();
    const { releases, failed } = useReleases();
    const { approved, failed: autoFailed } = useAutoUpdate();
    const [panel, setPanel] = useState<Panel | null>(null);
    const [downloadMode, setDownloadMode] = useState<'auto' | 'manual'>('auto');
    const [changelog, setChangelog] = useState<Release | null>(null);
    const latest = releases?.[0];
    const latestJournal = latest ? journalIn(latest.summary) : null;
    const showNext = !!latest && (!latestJournal || isOlder(latestJournal, NEXT_JOURNAL));
    const openDownloads = () => { setDownloadMode('auto'); setPanel('downloads'); };
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
                <p className='modpack__overview-description'>An automatic client for Jake’s server. Import once, then launch to update.</p>
                {approved ? <><p className='modpack__overview-version'>Server approved · {approved.version}</p><a className='modpack__overview-download' href={approved.starter.url} download aria-label='Download auto-update ZIP'>Auto-update ZIP <FiDownload aria-hidden /></a></> : <p role='status'>{autoFailed ? 'Download unavailable. Try refreshing.' : 'Loading download…'}</p>}
                <button className='modpack__overview-link' type='button' aria-haspopup='dialog' onClick={openDownloads}>All downloads <FiArrowUpRight aria-hidden /></button>
            </section>
            <section className='modpack__overview-card modpack__overview-card--setup' aria-labelledby='overview-setup'>
                <h3 id='overview-setup'><FiHelpCircle aria-hidden /> Setup & updates</h3>
                <p className='modpack__overview-description'>Short steps for joining, updating or moving your settings.</p>
                <div className='modpack__overview-actions'><button type='button' aria-haspopup='dialog' onClick={() => setPanel('setup')}>First time</button><button type='button' aria-haspopup='dialog' onClick={() => setPanel('update')}>Already playing?</button></div>
            </section>
            <button type='button' className='modpack__overview-card modpack__overview-card--playing' aria-haspopup='dialog' aria-label='Open playing guide' onClick={() => setPanel('playing')}>
                <span className='modpack__overview-title'><FiBookOpen aria-hidden /> Playing</span><span className='modpack__overview-description'>Personal tiers, tougher adventures, village bounties and a Journal to guide you.</span><span className='modpack__overview-hint'>How it plays <FiArrowUpRight aria-hidden /></span>
            </button>
            <button type='button' className='modpack__overview-card modpack__overview-card--hosting' aria-haspopup='dialog' aria-label='Open self-hosting guide' onClick={() => setPanel('hosting')}>
                <span className='modpack__overview-title'><FiServer aria-hidden /> Host a server</span><span className='modpack__overview-description'>Create a world for your friends. Verified server download and step-by-step setup.</span><span className='modpack__overview-hint'>Server guide <FiArrowUpRight aria-hidden /></span>
            </button>
            <button type='button' className='modpack__overview-card modpack__overview-card--credits' aria-haspopup='dialog' aria-label='Open mod credits' onClick={() => setPanel('credits')}>
                <span className='modpack__overview-title'><FiUsers aria-hidden /> Mod credits</span><span className='modpack__overview-description'>Meet the creators behind every bundled mod, with project and license links.</span><span className='modpack__overview-hint'>Browse creators <FiArrowUpRight aria-hidden /></span>
            </button>
            <button type='button' className='modpack__overview-card modpack__overview-card--older' aria-haspopup='dialog' aria-label='Open older releases' onClick={() => setPanel('older')}>
                <span className='modpack__overview-title'><FiPackage aria-hidden /> Older releases</span><span className='modpack__overview-description'>Find a specific client version and read what changed.</span><span className='modpack__overview-hint'>Release archive <FiArrowUpRight aria-hidden /></span>
            </button>
        </div>
        {panel && <DetailDialog title={titles[panel]} onClose={() => setPanel(null)}>
            {panel === 'downloads' && <><nav className='modpack-tabs' aria-label='Download type'><button type='button' aria-pressed={downloadMode === 'auto'} onClick={() => setDownloadMode('auto')}>Automatic</button><button type='button' aria-pressed={downloadMode === 'manual'} onClick={() => setDownloadMode('manual')}>Manual</button></nav><DownloadOptions approved={approved} autoFailed={autoFailed} latest={latest} releaseFailed={failed} onChangelog={setChangelog} mode={downloadMode} /></>}
            {(panel === 'setup' || panel === 'update') && <PlayerGuide initial={panel === 'update' ? 'update' : 'start'} />}
            {panel === 'hosting' && <ServerGuide release={latest} failed={failed} />}
            {panel === 'playing' && <StepReader pages={playingPages} />}
            {panel === 'credits' && <ModCredits approvedVersion={approved?.version} latestVersion={latest?.version} />}
            {panel === 'older' && <ReleaseArchive releases={releases} failed={failed} onChangelog={setChangelog} />}
        </DetailDialog>}
        <ReleaseChangelog release={changelog} onClose={() => setChangelog(null)} />
    </BentoOverlay>;
};
