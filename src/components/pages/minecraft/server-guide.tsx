import React from 'react';
import { formatSize, Release } from '../../../common/modpack';
import { StepReader } from './detail-dialog';

export const ServerDownloads = ({ release, failed }: { release?: Release; failed: boolean }) => {
    if (!release) return <p role='status'>{failed ? 'The server release could not load. Refresh to try again.' : 'Loading server downloads…'}</p>;
    return <>
        <p className='modpack__route-note'>Both downloads: {release.version} · Minecraft {release.minecraft} · NeoForge {release.neoforge}</p>
        <div className='modpack__host-downloads'>
            <a className='modpack__button modpack__button--solid' href={release.server.url} download>Download server ZIP</a>
            <a className='modpack__button' href={release.client.url} download>Download matching client .mrpack</a>
        </div>
        <p><b>Requirements:</b> Windows PowerShell, Java {release.java} on PATH, internet access and memory for a 4 GB server heap plus Windows.</p>
        <p className='modpack__route-note'><a href={`https://adoptium.net/temurin/releases/?version=${release.java}&os=windows&arch=x64`} target='_blank' rel='noopener noreferrer'>Get Java {release.java} for Windows ↗</a> · <a href={release.checksums}>Download checksums</a></p>
    </>;
};

export const ServerGuide = ({ release, failed }: { release?: Release; failed: boolean }) => {
    if (!release) return <p role='status'>{failed ? 'The server release could not load. Refresh to try again.' : 'Loading server download…'}</p>;
    return <StepReader pages={[
        { title: 'Download & requirements', body: <><ServerDownloads release={release} failed={failed} /><p className='modpack__aside'>Server ZIP: {formatSize(release.server.bytes)}. Extract it and read the included README.md before setup.</p></> },
        { title: 'Extract & read', body: <><p>Extract the <b>entire server ZIP</b> to a permanent folder. Read its <b>README.md</b> and the <a href='https://aka.ms/MinecraftEULA' target='_blank' rel='noreferrer'>Minecraft EULA</a>.</p><p>The scripts download pinned, checksum-verified mods and NeoForge. The bundle includes the pack’s custom rules, without a world or private administration settings.</p></> },
        { title: 'Create a fresh server', body: <><p>Open PowerShell in the extracted folder. <b>If you agree to the EULA</b>, run:</p><code className='modpack__command'>powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\Create-Server-Instance.ps1 -Name My-Server -AcceptEula</code><p>This creates Hard survival with account verification and no whitelist. Choose a new name: the creator refuses existing names.</p></> },
        { title: 'Start & join locally', body: <><p>Open <code>instances\My-Server</code> and run <code>.\Start-Server.ps1 -Background</code> in PowerShell there.</p><p>Wait for <b>Done</b> in <code>logs\latest.log</code>. On the host computer, join <code>127.0.0.1:25568</code> with the matching client.</p></> },
        { title: 'Invite friends', body: <><p>Configure a whitelist if you want one. Allow the game through Windows Firewall and forward <b>TCP 25568</b> to the host for internet play.</p><p>Friends use your public address plus <code>:25568</code>; verify an outside connection. Keep administration port <b>25578</b> private.</p><p>Coordinate matching manual client releases with friends. The automatic client follows this site’s approved release; use the matching manual client for your server.</p></> },
        { title: 'Save & back up', body: <><p>Use <code>.\Stop-Server.ps1</code> to save and stop. Back up the entire stopped instance before changing it.</p><p>The server bundle does <b>not</b> auto-update. Follow its README and preserve your world. Never run the fresh-instance creator over an existing world.</p></> },
    ]} />;
};
