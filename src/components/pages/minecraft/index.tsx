import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiArrowUpRight, FiDownload } from 'react-icons/fi';
import { BentoOverlay, OverlayHeader } from '../../templates';
import { PixelCube } from '../../atoms';
import { formatDate, formatSize, PACK_DIR, useReleases } from '../../../common/modpack';
import './index.scss';

/** The install and update steps as a file to keep, matching the two tiles below */
const GUIDE = `${PACK_DIR}/Install-and-Update.md`;

/**
 * The modpack tile opened: the Progression Survival download page, laid out as a board of its own.
 * Everything about the releases comes from releases.json, so shipping a new version never needs
 * this page to change.
 */
export const Minecraft = () => {
    const navigate = useNavigate();
    const { releases, failed } = useReleases();
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
    const latest = releases?.[0];
    const latestLink = `${window.location.origin}${PACK_DIR}/latest.mrpack`;

    const copyLatestLink = () => {
        navigator.clipboard.writeText(latestLink).then(
            () => setCopyState('copied'),
            () => setCopyState('failed'),
        );
    };

    // Scrolls to the update steps without putting a hash in the address, which would add a history entry for Back to undo
    const jumpToUpdate = (event: React.MouseEvent) => {
        event.preventDefault();
        const heading = document.getElementById('modpack-update');
        heading?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        heading?.focus({ preventScroll: true });
    };

    return (
        <BentoOverlay label='Progression Survival modpack' onClose={() => navigate('/')} className='modpack'>
            <OverlayHeader
                title='Progression Survival'
                subtitle='Our modded Minecraft server. Earn every armor and tool tier yourself, on Hard, with mobs that fight back.'
                lead={<PixelCube className='modpack__cube' />}
            />

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
                            </div>
                            <p className='modpack__meta'>
                                Released {formatDate(latest.published)}
                            </p>
                            {/* What the pack is, in plain words; the release's own `summary` is a changelog, kept for the release notes */}
                            <p>Survival the slow way: earn every armor and tool tier yourself, with tougher mobs and dungeons worth the trip.</p>
                            <a className='modpack__button' href={latest.notes} target='_blank' rel='noreferrer'>
                                Release notes <FiArrowUpRight />
                            </a>
                            <a className='modpack__button modpack__button--solid' href={latest.client.url} download>
                                <FiDownload /> Download the pack ({formatSize(latest.client.bytes)})
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
                        First-time install
                    </h3>
                    <p className='modpack__aside'>
                        Already playing?{' '}
                        <a href='#modpack-update' onClick={jumpToUpdate}>
                            Update an existing pack
                        </a>{' '}
                        instead.
                    </p>
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
                    <a className='modpack__file' href={GUIDE} download>
                        <FiDownload /> Save these steps
                    </a>
                    <p className='modpack__hosting'>
                        <b>Hosting your own server?</b> The same <code>.mrpack</code> works with server tools that can install from one. Set <code>difficulty=hard</code> in{' '}
                        <code>server.properties</code> to play it as intended.
                    </p>
                </section>

                {/* Its warning comes before any step, since deleting the old instance is what loses a player's settings */}
                <section className='modpack__tile modpack__tile--updating' aria-labelledby='modpack-update'>
                    <h3 id='modpack-update' className='modpack__eyebrow' tabIndex={-1}>
                        Update an existing pack
                    </h3>
                    <div className='modpack__warning' role='note'>
                        <FiAlertTriangle aria-hidden />
                        <p>
                            <b>Keep your old Prism instance.</b> Don't uninstall or delete it until the new version works and your settings have been transferred.
                        </p>
                    </div>
                    <p>
                        The pack doesn't update itself. A new version is a separate instance that starts on Minecraft's default settings until you bring yours across. Your progress
                        on the server stays there.
                    </p>
                    <ol className='modpack__steps'>
                        <li>Close Minecraft completely.</li>
                        <li>
                            Back up the old instance: select it in Prism, choose <b>Copy…</b>, tick <b>Select all</b> and confirm.
                        </li>
                        <li>
                            Download the new version and import it with <b>Add Instance → Import</b>, as its own instance. Leave the old one as it is.
                        </li>
                        <li>
                            For each instance, select it and click <b>Folder</b>, then open its game folder, called <code>minecraft</code> or <code>.minecraft</code>.
                        </li>
                        <li>
                            Copy <code>options.txt</code> from the old game folder into the new one. If the new one already has one, rename that to <code>options.txt.bak</code> first.
                            This brings your FOV, GUI scale, sound, mouse sensitivity and key binds.
                        </li>
                        <li>Launch the new instance, check your settings, join the server and make sure your progress is there. New or changed mods can still need a tweak.</li>
                        <li>Once it all works, you can remove the old instance, or keep it as a backup.</li>
                    </ol>
                    <p className='modpack__aside'>
                        <b>Worth bringing too:</b> <code>servers.dat</code> keeps your saved servers. If you have single-player worlds, resource packs, shaders or screenshots, copy{' '}
                        <code>saves</code>, <code>resourcepacks</code>, <code>shaderpacks</code> or <code>screenshots</code> across as well. Don't copy the old <code>config</code> or{' '}
                        <code>mods</code> folders: they can undo the new version's settings or bring back mods it replaced. And leave the instance's Minecraft and NeoForge versions
                        alone; the pack sets them.
                    </p>
                    <p className='modpack__callout'>
                        <b>Settings reset already?</b> If the old instance is still there, close Minecraft and copy its <code>options.txt</code> across as above. If it's been deleted,
                        look in your Recycle Bin and any backups for it. Reinstalling the pack won't bring your settings back.
                    </p>
                    <a className='modpack__file' href={GUIDE} download>
                        <FiDownload /> Save these steps
                    </a>
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

                <section className='modpack__tile modpack__tile--older' aria-labelledby='modpack-older'>
                    <h3 id='modpack-older' className='modpack__eyebrow'>
                        Older releases
                    </h3>
                    {releases && releases.length > 1 ? (
                        releases.slice(1).map((release) => (
                            <p key={release.version} className='modpack__older'>
                                <b>{release.version}</b>
                                <a href={release.client.url} download>
                                    Pack
                                </a>
                                <a href={release.notes} target='_blank' rel='noreferrer'>
                                    Notes
                                </a>
                            </p>
                        ))
                    ) : (
                        <p>{releases ? "Nothing older yet. This is the first release." : 'Loading…'}</p>
                    )}
                </section>
            </div>
        </BentoOverlay>
    );
};
