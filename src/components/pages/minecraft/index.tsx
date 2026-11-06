import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiRepeat, FiServer } from 'react-icons/fi';
import { BentoOverlay, OverlayHeader } from '../../templates';
import { PixelCube } from '../../atoms';
import { Release, useAutoUpdate, useReleases } from '../../../common/modpack';
import { ReleaseChangelog } from './changelog';
import { DownloadOptions } from './download-options';
import { PlayerGuide } from './player-guide';
import { ServerGuide, ServerDownloads } from './server-guide';
import { ModCredits } from './mod-credits';
import { StepReader } from './detail-dialog';
import { ReleaseArchive } from './release-archive';
import './index.scss';
import './single-screen.scss';

type Panel = 'manual' | 'playing' | 'hosting' | 'credits';
const titles: Record<Panel, string> = { manual: 'Manual releases', playing: 'Playing guide', hosting: 'Server guide', credits: 'Mod credits' };

export const Minecraft = () => {
    const navigate = useNavigate();
    const { releases, failed } = useReleases();
    const { approved, failed: autoFailed } = useAutoUpdate();
    const [route, setRoute] = useState<'start' | 'host'>('start');
    const [panel, setPanel] = useState<Panel | null>(null);
    const [changelog, setChangelog] = useState<Release | null>(null);
    const content = useRef<HTMLDivElement>(null);
    const heading = useRef<HTMLHeadingElement>(null);
    const returnTo = useRef<Panel | null>(null);
    const latest = releases?.[0];
    const openPanel = (next: Panel) => {
        returnTo.current = next;
        setPanel(next);
    };
    useEffect(() => {
        content.current?.scrollTo?.(0, 0);
        if (panel) heading.current?.focus();
        else if (returnTo.current) {
            content.current?.querySelector<HTMLButtonElement>('button[data-open-panel="' + returnTo.current + '"]')?.focus();
            returnTo.current = null;
        }
    }, [panel, route]);
    const playingPages = [
        { title: 'Earn your next tier', body: <><p>Mine, farm, cook and explore to earn better equipment, then take on tougher fights and dungeons. Hard difficulty and scaling mobs keep each new tier meaningful.</p><p><kbd>J</kbd> opens your Progression Journal for current tiers, tasks and unlocks. <kbd>E</kbd> opens your inventory and shows your mob difficulty.</p></> },
        { title: 'Armor, tools & weapons', body: <><p><b>Armor:</b> craft your own matching sets, then complete combat and dungeon goals while wearing them. You can craft armor before unlocking the right to wear it.</p><p><b>Tools:</b> recipes follow your Tools tier. Survival goals need the exact current-tier tool. Later goals lead into redstone, transport and the End.</p></> },
        { title: 'Bounties & playing together', body: <><p>Village boards offer repeatable bounties. Optional Journal challenges pay one-time XP rewards.</p><p>Share materials and a home while earning personal progression. Nearby eligible players can share dungeon-clear credit. The Journal explains each task’s requirements.</p></> },
    ];

    return <BentoOverlay label='Progression Survival modpack' onClose={() => navigate('/')} className='modpack modpack--single-screen'>
        <OverlayHeader title='Progression Survival' subtitle='Get set up to play, or host your own world.' lead={<PixelCube className='modpack__cube' />} />
        <div className='modpack__route-content' ref={content}>
            {panel ? <section className='modpack__section modpack-detail__body'>
                <button type='button' className='modpack__route-link' onClick={() => setPanel(null)}><FiArrowLeft aria-hidden /> Back to {route === 'start' ? 'Start playing' : 'Host a server'}</button>
                <h3 ref={heading} tabIndex={-1}>{titles[panel]}</h3>
                {panel === 'manual' && <><DownloadOptions approved={approved} autoFailed={autoFailed} latest={latest} releaseFailed={failed} onChangelog={setChangelog} mode='manual' /><ReleaseArchive releases={releases} failed={failed} onChangelog={setChangelog} /></>}
                {panel === 'hosting' && <ServerGuide release={latest} failed={failed} />}
                {panel === 'playing' && <StepReader pages={playingPages} />}
                {panel === 'credits' && <ModCredits approvedVersion={approved?.version} latestVersion={latest?.version} />}
            </section> : <div className='modpack__routes'>
                <nav className='modpack__route-tabs' aria-label='Choose your route'>
                    <button type='button' aria-pressed={route === 'start'} aria-controls='modpack-route-panel' onClick={() => setRoute('start')}><FiDownload aria-hidden /><strong>Start playing</strong><span>Install Prism and add the pack</span></button>
                    <button type='button' aria-pressed={route === 'host'} aria-controls='modpack-route-panel' onClick={() => setRoute('host')}><FiServer aria-hidden /><strong>Host a server</strong><span>Set up a world for your players</span></button>
                </nav>
                <section id='modpack-route-panel' className='modpack__route-panel' aria-label={route === 'start' ? 'Start playing' : 'Host a server'}>
                    {route === 'start' ? <PlayerGuide approved={approved} failed={autoFailed} /> : <>
                        <div className='modpack__route-heading'><h3>Host your own world</h3><span className='modpack__route-chip'>Windows server</span></div>
                        <p>Download the server and matching client. Give players the <b>.mrpack</b> below and your connection details.</p>
                        <ServerDownloads release={latest} failed={failed} />
                        <p className='modpack__route-note'>The automatic client follows this site’s approved release, which can differ from the latest manual release. Use the matching manual client for a server you manage.</p>
                        <button type='button' className='modpack__button' data-open-panel='hosting' onClick={() => openPanel('hosting')}>Open server guide →</button>
                    </>}
                </section>
                <nav className='modpack__route-links' aria-label='More about the modpack'>
                    {([['playing', 'Playing guide'], ['manual', 'Manual releases & change logs'], ['credits', 'Mod credits']] as [Panel, string][]).map(([key, label]) => <button type='button' className='modpack__route-link' key={key} data-open-panel={key} onClick={() => openPanel(key)}>{label} →</button>)}
                </nav>
            </div>}
        </div>
        <footer className='modpack__every-time'><FiRepeat aria-hidden /><div><strong>Every time you play</strong><span>Open Prism → select your imported Progression Survival instance → Launch.</span></div></footer>
        <ReleaseChangelog release={changelog} onClose={() => setChangelog(null)} />
    </BentoOverlay>;
};
