import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { PACK_DIR } from '../../../common/modpack';

export const PlayerGuide = () => {
    const [updating, setUpdating] = useState(false);
    const updateHeading = useRef<HTMLHeadingElement>(null);
    const showUpdate = () => {
        // Open before measuring: a frame callback can run before React commits
        // the expanded disclosure, especially during keyboard scrolling on mobile.
        flushSync(() => setUpdating(true));
        updateHeading.current?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
        updateHeading.current?.focus({ preventScroll: true });
    };
    return <section className='modpack__tile modpack__tile--install' aria-labelledby='modpack-install'>
        <h3 id='modpack-install' className='modpack__eyebrow'>Player setup & updates</h3>
        <p><b>Joining Jake’s server?</b> Start here. This creates a separate Minecraft setup on your computer — Prism calls it an <b>instance</b>. Ask the server host for its address and access; the ZIP does not provide either.</p>
        <button type='button' className='modpack__button' aria-expanded={updating} aria-controls='modpack-update' onClick={showUpdate}>Already playing? Update or switch installs</button>
        <div className='modpack__guide-section'>
            <h4>First time playing</h4>
            <ol className='modpack__steps'>
                <li>You need to own <b>Minecraft: Java Edition</b>. Install <a href='https://prismlauncher.org/' target='_blank' rel='noreferrer'>Prism Launcher</a>, then sign in to the <b>Microsoft account that owns Minecraft</b>.</li>
                <li>Click <b>Download auto-update ZIP</b> in Download. <b>Keep the ZIP zipped:</b> do not extract it or run files inside it.</li>
                <li>In Prism, choose <b>Add Instance → Import</b>, select the ZIP, give your setup a name and confirm.</li>
                <li>If Prism shows a custom-command warning, review it before accepting. The expected updater uses the <b>bundled Packwiz installer</b> and the <b>HTTPS feed on jakemotta.com</b>. Accept only that expected command from the ZIP downloaded here.</li>
                <li>Select your new setup and <b>launch it</b>. Prism downloads the required game and mod files. If asked, choose <b>Java 21</b> and about <b>4 GB</b> of memory.</li>
                <li>In Minecraft, choose <b>Multiplayer → Add Server</b> and enter the address supplied by your server host. You need the host’s permission to join.</li>
            </ol>
        </div>
        <p className='modpack__callout'>Next time: close Minecraft, then launch this same setup in Prism. It checks for the server-approved update before opening the game. <b>Do not re-import each release.</b></p>
        <details id='modpack-update' className='modpack__details' open={updating} onToggle={event => setUpdating(event.currentTarget.open)}>
            <summary>Update an existing instance or move your settings</summary>
            <div className='modpack__details-body'>
                <h4 ref={updateHeading} tabIndex={-1}>Already playing</h4>
                <p><b>Auto-update instance:</b> close Minecraft and launch this same setup in Prism while online. No new import is needed. A failed update check stops launch; a game or loader upgrade may need a replacement starter.</p>
                <p><b>Manual instance:</b> it stays manual. Import the matching new <code>.mrpack</code> as a separate instance, or import the auto-update ZIP once to follow Jake’s server.</p>
                <ol className='modpack__steps'>
                    <li>Close Minecraft. Keep your old instance and back it up with <b>Copy… → Select all</b> before switching.</li>
                    <li>Open each instance’s <b>Folder</b>, then <code>minecraft</code> or <code>.minecraft</code>. Copy <code>options.txt</code> and <code>servers.dat</code> across, backing up existing copies first.</li>
                    <li>If wanted, copy your <code>saves</code>, <code>resourcepacks</code>, <code>shaderpacks</code> and <code>screenshots</code>. Leave old mods, pack-owned configs, launcher accounts and updater state behind.</li>
                    <li>Launch, check your settings and join before retiring the old instance. Multiplayer progression stays on the server.</li>
                </ol>
                <p className='modpack__aside'>Pack updates can replace edits to pack-owned configs. Personal options, server lists and worlds are outside the auto-updater’s managed files.</p>
            </div>
        </details>
        <details className='modpack__details'>
            <summary>Joining another server with a manual release?</summary>
            <div className='modpack__details-body'>
                <p>Ask its host which release to use. The auto-update ZIP follows Jake’s server; your host may need a different version.</p>
                <ol className='modpack__steps'>
                    <li>Download the matching manual <code>.mrpack</code> from Download or Older releases. Keep it packaged.</li>
                    <li>In Prism, use <b>Add Instance → Import</b>, select that file, name the new setup and confirm. Launch with Java 21 and about 4 GB of memory.</li>
                    <li>Add your host’s server address in Multiplayer. For future updates, follow the host’s release instructions and the settings/backups guide above.</li>
                </ol>
            </div>
        </details>
        <details className='modpack__details'>
            <summary>If setup or launching gets stuck</summary>
            <div className='modpack__details-body'>
                <p><b>ZIP opened as a folder?</b> Leave it zipped and select the ZIP from Prism’s <b>Add Instance → Import</b> screen.</p>
                <p><b>Update check failed?</b> Check your internet connection and try launching again. Keep your existing setup and personal files. If it fails again, share the error with the server host.</p>
                <p><b>No server address, or cannot join?</b> Ask the host for the address, permission and required release. Installing the client does not create a server or grant access.</p>
            </div>
        </details>
        <a href={`${PACK_DIR}/packwiz/Install-and-Update.md`}>Full setup and update guide</a>
    </section>;
};
