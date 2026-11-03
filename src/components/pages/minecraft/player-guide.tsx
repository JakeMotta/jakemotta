import React, { useState } from 'react';
import { PACK_DIR } from '../../../common/modpack';
import { StepReader } from './detail-dialog';

type Guide = 'start' | 'update' | 'manual' | 'help';
const pages = {
    start: [
        { title: 'Minecraft & Prism', body: <><p>You need to own <b>Minecraft: Java Edition</b>. Install <a href='https://prismlauncher.org/' target='_blank' rel='noreferrer'>Prism Launcher</a> and sign in to the Microsoft account that owns Minecraft.</p><p>Prism keeps this pack in a separate Minecraft setup, called an <b>instance</b>. You’ll reuse it whenever you play.</p></> },
        { title: 'Download — keep the ZIP zipped', body: <><p>Use <b>Download auto-update ZIP</b> on the overview to join Jake’s server.</p><p><b>Do not extract the ZIP or run files inside it.</b> Prism imports the ZIP for you.</p></> },
        { title: 'Import into Prism', body: <><p>In Prism, choose <b>Add Instance → Import</b> and select the ZIP you downloaded.</p><p>Give this Minecraft setup a name and confirm. Keep any old setup until the new one works.</p></> },
        { title: 'Review the updater', body: <><p>If Prism shows a custom-command warning, review it before accepting.</p><p>The expected command uses the <b>bundled Packwiz installer</b> and the <b>HTTPS feed on jakemotta.com</b>. Accept only that expected command from the ZIP downloaded here.</p></> },
        { title: 'Launch your new setup', body: <><p>Select your new setup in Prism and launch it. Prism fetches the required game and mod files.</p><p>If asked, choose <b>Java 21</b> and about <b>4 GB</b> of memory. Stay online for the download and update check.</p></> },
        { title: 'Join your host’s server', body: <><p>In Minecraft, use <b>Multiplayer → Add Server</b>. Enter the host’s address and get permission to join. The ZIP provides neither.</p><p>Next time, close Minecraft and launch this same setup in Prism. <b>Do not re-import every release.</b></p></> },
    ],
    update: [
        { title: 'Already using the automatic setup?', body: <><p>Close Minecraft, then launch the <b>same setup in Prism</b> while online. The approved update downloads before the game opens. No new ZIP import is needed.</p><p>Manual installs stay manual. To switch, import the automatic ZIP as a separate setup, then follow the backup and settings steps here.</p></> },
        { title: 'Back up before switching', body: <><p>Close Minecraft. In Prism, back up your old setup with <b>Copy… → Select all</b>. Keep it until the new one works.</p><p>Import the new ZIP or the host’s matching manual <code>.mrpack</code> as a <b>separate</b> setup.</p></> },
        { title: 'Bring your settings', body: <><p>Use each setup’s <b>Folder</b> button, then open <code>minecraft</code> or <code>.minecraft</code>.</p><p>Copy <code>options.txt</code> and <code>servers.dat</code> from the old game folder to the new one. Back up any existing copies first.</p></> },
        { title: 'Bring personal files, then check', body: <><p>If wanted, also copy <code>saves</code>, <code>resourcepacks</code>, <code>shaderpacks</code> and <code>screenshots</code>.</p><p>Leave old mods, pack-owned configs, launcher accounts and updater state behind. Updates can replace pack-owned config edits.</p><p>Launch, check settings and join before retiring the old setup. Multiplayer progression stays on the server.</p></> },
    ],
    manual: [
        { title: 'Match your server', body: <><p>Ask the host which release to use. The automatic ZIP follows Jake’s server; another server may need a different release.</p><p>Open <b>Get the pack → Manual client</b>, or choose <b>Older releases</b>, and download the matching <code>.mrpack</code>. Keep it packaged.</p></> },
        { title: 'Import & launch', body: <><p>In Prism, use <b>Add Instance → Import</b>, select the <code>.mrpack</code>, name the new setup and confirm.</p><p>Launch with Java 21 and about 4 GB of memory, then add your host’s address in Multiplayer.</p></> },
        { title: 'Updating a manual setup', body: <><p>Manual installs do <b>not</b> auto-update. Follow your host’s release instructions.</p><p>Use the <b>Update / switch</b> guide to back up your old setup, import separately and move personal settings without copying old mods or pack-owned configs.</p></> },
    ],
    help: [
        { title: 'ZIP opened as a folder?', body: <p>Leave the ZIP zipped. In Prism, use <b>Add Instance → Import</b> and select the ZIP itself. Do not extract it or run its contents.</p> },
        { title: 'Update check failed?', body: <><p>Check your internet connection and try launching again. Keep your existing setup and personal files.</p><p>If it fails again, share the error with your server host. A game or loader upgrade may require a replacement starter; wait for the host’s instructions.</p></> },
        { title: 'Missing address or cannot join?', body: <p>Ask the server host for the address, permission and required release. Installing the client does not create a server or grant access.</p> },
    ],
};

export const PlayerGuide = ({ initial = 'start' }: { initial?: Guide }) => {
    const [guide, setGuide] = useState<Guide>(initial);
    return <>
        <nav className='modpack-tabs' aria-label='Player guide topics'>
            {([['start', 'First time'], ['update', 'Update / switch'], ['manual', 'Manual'], ['help', 'Help']] as [Guide, string][]).map(([key, label]) => <button type='button' key={key} aria-pressed={guide === key} onClick={() => setGuide(key)}>{label}</button>)}
        </nav>
        <StepReader key={guide} pages={pages[guide]} />
        <a className='modpack-reader__reference' href={`${PACK_DIR}/packwiz/Install-and-Update.md`}>Full setup and update guide</a>
    </>;
};
