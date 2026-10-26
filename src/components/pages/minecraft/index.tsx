import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiDownload, FiPlus } from 'react-icons/fi';
import { BentoOverlay } from '../../templates';
import { MiniPlayer, PixelCube } from '../../atoms';
import { formatDate, formatSize, PACK_DIR, useReleases } from '../../../common/modpack';
import './index.scss';

const TROUBLESHOOTING = [
    {
        question: 'Missing AStages or channel error',
        answer: 'You launched a plain NeoForge profile. Launch the imported Progression Survival instance.',
    },
    {
        question: 'J does nothing',
        answer: (
            <>
                Check Options → Controls → Key Binds for <i>Open Progression Journal</i> and give it a free key.
            </>
        ),
    },
    {
        question: "Can't mine",
        answer: "You're holding gear you haven't unlocked. Switch to an allowed tool or an empty hand.",
    },
    {
        question: "Can't connect",
        answer: 'Check with Jake that the server is up, and that your pack version matches the one above.',
    },
];

/**
 * The modpack tile opened: the Progression Survival download page, laid out as a board of its own.
 * Everything about the releases comes from releases.json, so shipping a new version never needs
 * this page to change.
 */
export const Minecraft = () => {
    const navigate = useNavigate();
    const { releases, failed } = useReleases();
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
    const [openQuestion, setOpenQuestion] = useState<number | null>(null);
    const latest = releases?.[0];
    const latestLink = `${window.location.origin}${PACK_DIR}/latest.mrpack`;

    const copyLatestLink = () => {
        navigator.clipboard.writeText(latestLink).then(
            () => setCopyState('copied'),
            () => setCopyState('failed'),
        );
    };

    return (
        <BentoOverlay label='Progression Survival modpack' onClose={() => navigate('/')} className='modpack'>
            <header className='modpack__head'>
                <PixelCube className='modpack__cube' />
                <div className='modpack__intro'>
                    <h2>Progression Survival</h2>
                    <p>Our modded Minecraft server. Earn every armor and tool tier yourself, on Hard, with mobs that fight back.</p>
                </div>
                <MiniPlayer className='modpack__player' />
            </header>

            <div className='modpack__grid'>
                <section className='modpack__tile modpack__tile--download' aria-labelledby='modpack-download'>
                    <h3 id='modpack-download' className='modpack__eyebrow'>
                        Download
                    </h3>
                    {!latest && !failed && <p>Loading the latest release…</p>}
                    {failed && <p>The release list didn't load. Refresh the page, or ask Jake for the pack file.</p>}
                    {latest && (
                        <>
                            <div className='modpack__version'>
                                <span>{latest.version}</span>
                                {latest.prerelease && <span className='modpack__tag'>Test build</span>}
                            </div>
                            <p className='modpack__meta'>
                                Released {formatDate(latest.published)}
                                <br />
                                Minecraft Java {latest.minecraft} · NeoForge {latest.neoforge} · Java {latest.java}
                            </p>
                            <p>{latest.summary}</p>
                            <a className='modpack__button modpack__button--solid' href={latest.client.url} download>
                                <FiDownload /> Download the pack ({formatSize(latest.client.bytes)})
                            </a>
                            <a className='modpack__button' href={latest.notes} target='_blank' rel='noreferrer'>
                                Release notes <FiArrowUpRight />
                            </a>
                            <div className='modpack__latest'>
                                <label htmlFor='modpack-latest-link'>Always-latest link</label>
                                <div>
                                    <input id='modpack-latest-link' readOnly value={latestLink} onFocus={(event) => event.target.select()} />
                                    <button type='button' onClick={copyLatestLink}>
                                        {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? "Couldn't copy" : 'Copy'}
                                    </button>
                                </div>
                                <span>This link always downloads the newest pack, so it's the one to bookmark or share.</span>
                            </div>
                        </>
                    )}
                </section>

                <section className='modpack__tile modpack__tile--install' aria-labelledby='modpack-install'>
                    <h3 id='modpack-install' className='modpack__eyebrow'>
                        Install
                    </h3>
                    <ol className='modpack__steps'>
                        <li>
                            Install{' '}
                            <a href='https://prismlauncher.org/' target='_blank' rel='noreferrer'>
                                Prism Launcher
                            </a>{' '}
                            and sign in with your Minecraft Java account.
                        </li>
                        <li>
                            Download the pack. It's a single <code>.mrpack</code> file.
                        </li>
                        <li>
                            In Prism, choose <b>Add Instance → Import</b>, select the file and confirm. Prism downloads Minecraft, NeoForge and every mod for you.
                        </li>
                        <li>
                            Launch <b>Progression Survival</b>. If Prism asks for Java, pick <b>Java 21</b>, and give the instance about <b>4 GB</b> of memory.
                        </li>
                        <li>
                            Choose <b>Multiplayer → Add Server</b> and enter the address Jake sends you.
                        </li>
                    </ol>
                    <p className='modpack__callout'>Launch the imported instance itself. Copying the mods into another Minecraft profile won't work.</p>
                </section>

                <section className='modpack__tile modpack__tile--playing' aria-labelledby='modpack-playing'>
                    <h3 id='modpack-playing' className='modpack__eyebrow'>
                        Playing
                    </h3>
                    <p className='modpack__key'>
                        <kbd>J</kbd> opens your Progression Journal.
                    </p>
                    <p className='modpack__key'>
                        <kbd>E</kbd> opens your inventory and shows your mob difficulty.
                    </p>
                    <p>
                        <b>Armor:</b> craft your own sets and weapons, then complete combat and dungeon goals while wearing them.
                    </p>
                    <p>
                        <b>Tools:</b> craft utility tools and complete mining, farming, food and other survival goals.
                    </p>
                    <p>
                        <b>Quests:</b> optional challenges that pay out XP once.
                    </p>
                    <p>
                        You can craft higher-tier gear early; you can't wear or use it until you unlock it. Sharing materials is fine, but task credit is personal. Players within 32 blocks
                        share credit for clearing a dungeon.
                    </p>
                </section>

                <section className='modpack__tile modpack__tile--updating' aria-labelledby='modpack-updating'>
                    <h3 id='modpack-updating' className='modpack__eyebrow'>
                        Updating
                    </h3>
                    <p>The pack doesn't update itself. When a new version shows up here:</p>
                    <ol className='modpack__steps'>
                        <li>Download it and import it into Prism as a new instance.</li>
                        <li>Play on the new instance. Keep the old one until you've checked the new one works, then delete it.</li>
                    </ol>
                    <p>Your progress lives on the server, so a new instance picks up right where you left off.</p>
                </section>

                <section className='modpack__tile modpack__tile--trouble' aria-labelledby='modpack-trouble'>
                    <h3 id='modpack-trouble' className='modpack__eyebrow'>
                        Troubleshooting
                    </h3>
                    {TROUBLESHOOTING.map(({ question, answer }, i) => {
                        const open = openQuestion === i;
                        return (
                            <div key={question}>
                                <button
                                    type='button'
                                    className={`modpack__question${open ? ' modpack__question--open' : ''}`}
                                    aria-expanded={open}
                                    aria-controls={`modpack-answer-${i}`}
                                    onClick={() => setOpenQuestion(open ? null : i)}>
                                    <span>{question}</span>
                                    <FiPlus aria-hidden />
                                </button>
                                <p id={`modpack-answer-${i}`} className='modpack__answer' hidden={!open}>
                                    {answer}
                                </p>
                            </div>
                        );
                    })}
                </section>

                <section className='modpack__tile modpack__tile--server' aria-labelledby='modpack-server'>
                    <h3 id='modpack-server' className='modpack__eyebrow'>
                        Server files
                    </h3>
                    <p>Only needed if you're hosting your own copy of the server. Players just need the pack.</p>
                    {latest && (
                        <div className='modpack__row'>
                            <a className='modpack__button' href={latest.server.url} download>
                                Server template ({formatSize(latest.server.bytes)})
                            </a>
                            <a className='modpack__button' href={latest.checksums} target='_blank' rel='noreferrer'>
                                SHA-256 checksums
                            </a>
                        </div>
                    )}
                    {releases && releases.length > 1 && (
                        <>
                            <h3 className='modpack__eyebrow modpack__eyebrow--sub'>Older releases</h3>
                            {releases.slice(1).map((release) => (
                                <p key={release.version} className='modpack__older'>
                                    <b>{release.version}</b> <span>{formatDate(release.published)}</span>
                                    <a href={release.client.url} download>
                                        Pack
                                    </a>
                                    <a href={release.server.url} download>
                                        Server
                                    </a>
                                    <a href={release.notes} target='_blank' rel='noreferrer'>
                                        Notes
                                    </a>
                                </p>
                            ))}
                        </>
                    )}
                </section>
            </div>
        </BentoOverlay>
    );
};
