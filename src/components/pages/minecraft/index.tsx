import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import { BentoOverlay, OverlayHeader } from '../../templates';
import { PixelCube } from '../../atoms';
import { formatDate, formatShortDate, PACK_DIR, Release, useAutoUpdate, useReleases } from '../../../common/modpack';
import './index.scss';
import { ReleaseChangelog } from './changelog';
import { DownloadOptions } from './download-options';

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

            <div className={`modpack__grid${showNext ? ' modpack__grid--next' : ''}`}>
                <section className='modpack__tile modpack__tile--download' aria-labelledby='modpack-download'>
                    <h3 id='modpack-download' className='modpack__eyebrow'>
                        Download
                    </h3>
                    <DownloadOptions approved={autoUpdate} autoFailed={autoFailed} latest={latest} releaseFailed={failed} onChangelog={setChangelog} />
                </section>

                <section className='modpack__tile modpack__tile--install' aria-labelledby='modpack-install'>
                    <h3 id='modpack-install' className='modpack__eyebrow'>
                        Install once
                    </h3>
                    <p className='modpack__aside'>
                        Already playing?{' '}
                        <a href='#modpack-update' onClick={jumpToUpdate}>
                            Updating or switching installs
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
                            Click <b>Download auto-update ZIP</b> in the recommended download above.
                        </li>
                        <li>
                            In Prism, choose <b>Add Instance → Import</b> and select the ZIP. Give it a name and confirm. If a command warning appears, review the update command for <b>jakemotta.com</b> before accepting.
                        </li>
                        <li>
                            Launch <b>Progression Survival</b>. If Prism asks for Java, pick <b>Java 21</b>, and give the instance about <b>4 GB</b> of memory.
                        </li>
                        <li>
                            Choose <b>Multiplayer → Add Server</b> and enter the address Jake sends you.
                        </li>
                    </ol>
                    <p className='modpack__callout'>Setup is one time. Keep launching this same instance; you do not need to import every new release.</p>
                    <p className='modpack__hosting'>
                        <b>Hosting your own server?</b> The same <code>.mrpack</code> works with server tools that can install from one. Set <code>difficulty=hard</code> in{' '}
                        <code>server.properties</code> to play it as intended.
                    </p>
                </section>

                <section className='modpack__tile modpack__tile--updating' aria-labelledby='modpack-update'>
                    <h3 id='modpack-update' className='modpack__eyebrow' tabIndex={-1}>After setup</h3>
                    <p className='modpack__callout'><b>Already using the auto-update instance?</b><br />Close Minecraft, then press <b>Play</b> in Prism. That is all you need to do.</p>
                    <ol className='modpack__steps'>
                        <li>Prism checks for an approved update before opening Minecraft.</li>
                        <li>If one is available, it downloads the matching pack files, then starts the game.</li>
                        <li>The approved version moves forward after the server is updated and verified, so your client stays compatible.</li>
                    </ol>
                    <p className='modpack__aside'>Stay online for the update check. If it fails, Prism stops before launch. A game or loader upgrade may need a replacement starter; we will provide instructions when that happens.</p>
                    <details className='modpack__details'>
                        <summary>Switching from an older manual install?</summary>
                        <div className='modpack__details-body'>
                            <div className='modpack__warning' role='note'><FiAlertTriangle aria-hidden /><p><b>Keep your old instance as a backup</b> until the new one works and your settings are copied.</p></div>
                            <ol className='modpack__steps'>
                                <li>Close Minecraft and back up your old instance with <b>Copy… → Select all</b>.</li>
                                <li>Import the recommended auto-update ZIP as a separate instance.</li>
                                <li>Open each instance’s <b>Folder</b>, then its <code>minecraft</code> or <code>.minecraft</code> game folder. Copy <code>options.txt</code> and <code>servers.dat</code> across, backing up any existing copies first.</li>
                                <li>If wanted, also bring <code>saves</code>, <code>resourcepacks</code>, <code>shaderpacks</code> and <code>screenshots</code>. Leave old <code>mods</code>, pack-owned <code>config</code> folders and updater state behind.</li>
                                <li>Launch the new instance, check your settings, then join the server. Your multiplayer progression stays on the server.</li>
                            </ol>
                        </div>
                    </details>
                    <p className='modpack__aside'>Manual <code>.mrpack</code> installs do not become automatic. Use the ZIP once to switch. Updates may replace edits to pack-owned configs.</p>
                    <a className='modpack__button' href={`${PACK_DIR}/packwiz/Install-and-Update.md`}>Full setup and update guide</a>
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
                        <b>Armor:</b> craft your own matching armor sets, then complete combat and dungeon goals while wearing them.
                    </p>
                    <p>
                        <b>Tools:</b> craft utility tools and weapons, then complete mining, farming, food and other survival goals.
                    </p>
                    <p>
                        <b>Quests:</b> optional challenges that pay out XP once.
                    </p>
                    <p>
                        You can craft armor before its wear unlock; tool recipes follow your Tools tier. Tool work needs the exact current-tier tool. Bows unlock at Stone Tools.
                        Sharing materials is fine, but progress is personal. Nearby eligible players can share dungeon-clear credit.
                    </p>
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
            </div>
            <ReleaseChangelog release={changelog} onClose={() => setChangelog(null)} />
        </BentoOverlay>
    );
};
