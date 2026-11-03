import React from 'react';
import { formatSize, Release } from '../../../common/modpack';
import { StepReader } from './detail-dialog';

export const ServerGuide = ({ release, failed }: { release?: Release; failed: boolean }) => {
    if (!release) return <p role='status'>{failed ? 'The server release could not load. Refresh to try again.' : 'Loading server download…'}</p>;
    return <StepReader pages={[
        { title: 'Download & requirements', body: <><p>Create your own world with the verified server bundle. Players need the matching <b>{release.version}</b> manual client.</p><a className='modpack__button' href={release.server.url} download>Download server ZIP · {release.version}</a><p className='modpack__aside'>{formatSize(release.server.bytes)} · <a href={release.checksums}>SHA-256 checksums</a></p><p><b>Requirements:</b> Windows PowerShell, Java {release.java} on PATH, internet access and room for a 4 GB server heap plus your operating system. Minecraft {release.minecraft} / NeoForge {release.neoforge}.</p></> },
        { title: 'Extract & read', body: <><p>Extract the <b>entire server ZIP</b> to a permanent folder. Read its <b>README.md</b> and the <a href='https://aka.ms/MinecraftEULA' target='_blank' rel='noreferrer'>Minecraft EULA</a>.</p><p>The scripts download pinned, checksum-verified mods and NeoForge. The bundle includes the pack’s custom rules, without a world or private administration settings.</p></> },
        { title: 'Create a fresh server', body: <><p>Open PowerShell in the extracted folder. <b>If you agree to the EULA</b>, run:</p><code className='modpack__command'>powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\Create-Server-Instance.ps1 -Name My-Server -AcceptEula</code><p>This creates Hard survival with account verification and no whitelist. Choose a new name: the creator refuses existing names.</p></> },
        { title: 'Start & join locally', body: <><p>Open <code>instances\My-Server</code> and run <code>.\Start-Server.ps1 -Background</code> in PowerShell there.</p><p>Wait for <b>Done</b> in <code>logs\latest.log</code>. On the host computer, join <code>127.0.0.1:25568</code> with the matching client.</p></> },
        { title: 'Invite friends', body: <><p>Configure a whitelist if you want one. Allow the game through Windows Firewall and forward <b>TCP 25568</b> to the host for internet play.</p><p>Friends use your public address plus <code>:25568</code>; verify an outside connection. Keep administration port <b>25578</b> private.</p><p>Coordinate matching manual client releases with friends. Jake’s auto-update ZIP follows Jake’s server.</p></> },
        { title: 'Save, back up & update', body: <><p>Use <code>.\Stop-Server.ps1</code> to save and stop. Back up the entire stopped instance before changing it.</p><p>The server bundle does <b>not</b> auto-update. Follow its README and preserve your world. Never run the fresh-instance creator over an existing world.</p></> },
    ]} />;
};
