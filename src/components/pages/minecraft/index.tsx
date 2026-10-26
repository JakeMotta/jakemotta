import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { ColorShiftingBackground } from '../../templates';
import { StickySectionTitle } from '../../atoms';
import './index.scss';

/**
 * Download page for the Progression Survival modpack. Everything about the
 * releases comes from releases.json, which scripts/release-modpack.mjs writes,
 * so shipping a new version never needs this page to change.
 */

const PACK_DIR = '/downloads/progression-survival';

interface ReleaseFile {
    name: string;
    url: string;
    bytes: number;
    sha256: string;
}

interface Release {
    version: string;
    prerelease: boolean;
    published: string;
    minecraft: string;
    neoforge: string;
    java: number;
    summary: string;
    notes: string;
    checksums: string;
    client: ReleaseFile;
    server: ReleaseFile;
}

const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

export const Minecraft = () => {
    const [releases, setReleases] = useState<Release[] | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        // no-cache so a page left open in a tab still finds a release shipped since.
        fetch(`${PACK_DIR}/releases.json`, { cache: 'no-cache' })
            .then((response) => {
                if (!response.ok) throw new Error(`${response.status}`);
                return response.json();
            })
            .then((index) => setReleases(index.releases))
            .catch(() => setFailed(true));
    }, []);

    const latest = releases?.[0];
    const latestLink = `${window.location.origin}${PACK_DIR}/latest.mrpack`;

    const copyLatestLink = () => {
        navigator.clipboard.writeText(latestLink).then(
            () => message.success('Link copied'),
            () => message.error('Could not copy the link'),
        );
    };

    return (
        <ColorShiftingBackground>
            <div className='minecraft-page flex flex-col items-center gap-4 min-h-screen'>
                <div className='flex flex-col w-full max-w-4xl gap-2 px-4 sm:px-16 pb-16'>
                    <header className='flex flex-col pt-8 pb-2 text-primary-dark'>
                        <h1 className='text-4xl font-bold'>Progression Survival</h1>
                        <p className='text-lg'>Our modded Minecraft server. Earn every armor and tool tier yourself, on Hard, with mobs that fight back.</p>
                    </header>

                    <section className='flex w-full flex-col'>
                        <StickySectionTitle>Download</StickySectionTitle>
                        <div className='panel'>
                            {!latest && !failed && <p>Loading the latest release…</p>}
                            {failed && <p>The release list didn't load. Refresh the page, or ask Jake for the pack file.</p>}
                            {latest && (
                                <>
                                    <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
                                        <span className='text-2xl font-bold'>{latest.version}</span>
                                        {latest.prerelease && <span className='tag'>Test build</span>}
                                        <span className='text-sm opacity-80'>Released {formatDate(latest.published)}</span>
                                    </div>
                                    <p className='text-sm opacity-80'>
                                        Minecraft Java {latest.minecraft} · NeoForge {latest.neoforge} · Java {latest.java}
                                    </p>
                                    <p>{latest.summary}</p>

                                    <div className='flex flex-wrap gap-3 pt-2'>
                                        <Button type='primary' size='large' href={latest.client.url} download>
                                            Download the pack ({formatSize(latest.client.bytes)})
                                        </Button>
                                        <Button size='large' href={latest.notes} target='_blank'>
                                            Release notes
                                        </Button>
                                    </div>

                                    <div className='flex flex-col gap-1 pt-3'>
                                        <span className='text-sm font-bold'>Always-latest link</span>
                                        <div className='flex flex-wrap items-center gap-2'>
                                            <code className='link-box'>{latestLink}</code>
                                            <Button size='small' onClick={copyLatestLink}>
                                                Copy
                                            </Button>
                                        </div>
                                        <span className='text-sm opacity-80'>This link always downloads the newest pack, so it's the one to bookmark or share.</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    <section className='flex w-full flex-col'>
                        <StickySectionTitle>Install</StickySectionTitle>
                        <div className='panel'>
                            <ol className='steps'>
                                <li>
                                    Install{' '}
                                    <a href='https://prismlauncher.org/' target='_blank' rel='noreferrer'>
                                        Prism Launcher
                                    </a>{' '}
                                    and sign in with your Minecraft Java account.
                                </li>
                                <li>Download the pack above. It's a single <code>.mrpack</code> file.</li>
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
                            <p className='text-sm opacity-80'>Launch the imported instance itself. Copying the mods into another Minecraft profile won't work.</p>
                        </div>
                    </section>

                    <section className='flex w-full flex-col'>
                        <StickySectionTitle>Updating</StickySectionTitle>
                        <div className='panel'>
                            <p>The pack doesn't update itself. When a new version shows up here:</p>
                            <ol className='steps'>
                                <li>Download it and import it into Prism as a new instance.</li>
                                <li>Play on the new instance. Keep the old one until you've checked the new one works, then delete it.</li>
                            </ol>
                            <p className='text-sm opacity-80'>Your progress lives on the server, so a new instance picks up right where you left off.</p>
                        </div>
                    </section>

                    <section className='flex w-full flex-col'>
                        <StickySectionTitle>Playing</StickySectionTitle>
                        <div className='panel'>
                            <ul className='steps'>
                                <li>
                                    <b>J</b> opens your Progression Journal. <b>E</b> opens your inventory and shows your mob difficulty.
                                </li>
                                <li>
                                    <b>Armor</b>: craft your own sets and weapons, then complete combat and dungeon goals while wearing them.
                                </li>
                                <li>
                                    <b>Tools</b>: craft utility tools and complete mining, farming, food and other survival goals.
                                </li>
                                <li>
                                    <b>Quests</b>: optional challenges that pay out XP once.
                                </li>
                            </ul>
                            <p>
                                You can craft higher-tier gear early; you can't wear or use it until you unlock it. Sharing materials is fine, but task credit is personal. Players within 32
                                blocks share credit for clearing a dungeon.
                            </p>
                        </div>
                    </section>

                    <section className='flex w-full flex-col'>
                        <StickySectionTitle>Troubleshooting</StickySectionTitle>
                        <div className='panel'>
                            <ul className='steps'>
                                <li>
                                    <b>Missing AStages or channel error:</b> you launched a plain NeoForge profile. Launch the imported Progression Survival instance.
                                </li>
                                <li>
                                    <b>J does nothing:</b> check Options → Controls → Key Binds for <i>Open Progression Journal</i> and give it a free key.
                                </li>
                                <li>
                                    <b>Can't mine:</b> you're holding gear you haven't unlocked. Switch to an allowed tool or an empty hand.
                                </li>
                                <li>
                                    <b>Can't connect:</b> check with Jake that the server is up, and that your pack version matches the one above.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {latest && (
                        <section className='flex w-full flex-col'>
                            <StickySectionTitle>Server files</StickySectionTitle>
                            <div className='panel'>
                                <p>Only needed if you're hosting your own copy of the server. Players just need the pack above.</p>
                                <div className='flex flex-wrap gap-3'>
                                    <Button href={latest.server.url} download>
                                        Server template ({formatSize(latest.server.bytes)})
                                    </Button>
                                    <Button href={latest.checksums} target='_blank'>
                                        SHA-256 checksums
                                    </Button>
                                </div>
                            </div>
                        </section>
                    )}

                    {releases && releases.length > 1 && (
                        <section className='flex w-full flex-col'>
                            <StickySectionTitle>Older releases</StickySectionTitle>
                            <div className='panel'>
                                {releases.slice(1).map((release) => (
                                    <div key={release.version} className='flex flex-wrap items-baseline gap-x-4 gap-y-1'>
                                        <span className='font-bold'>{release.version}</span>
                                        <span className='text-sm opacity-80'>{formatDate(release.published)}</span>
                                        <a href={release.client.url} download>
                                            Pack
                                        </a>
                                        <a href={release.server.url} download>
                                            Server
                                        </a>
                                        <a href={release.notes} target='_blank' rel='noreferrer'>
                                            Notes
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </ColorShiftingBackground>
    );
};
