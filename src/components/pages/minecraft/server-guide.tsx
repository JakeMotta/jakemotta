import React from 'react';
import { formatSize, Release } from '../../../common/modpack';

export const ServerGuide = ({ release, failed }: { release?: Release; failed: boolean }) => (
    <section className='modpack__tile modpack__tile--hosting' aria-labelledby='modpack-hosting'>
        <h3 id='modpack-hosting' className='modpack__eyebrow'>Host your own server</h3>
        <p>Run a separate Progression Survival world for your friends. The verified server bundle includes setup scripts, the pack’s rules and a manifest of pinned mods downloaded from their publishers.</p>
        {release ? <>
            <a className='modpack__button' href={release.server.url} download>Download server ZIP · {release.version}</a>
            <p className='modpack__aside'>{formatSize(release.server.bytes)} · <a href={release.checksums}>SHA-256 checksums</a></p>
            <p><b>Requirements:</b> Windows PowerShell, Java {release.java} on PATH, an internet connection and memory for the server’s 4 GB heap plus your operating system. The scripts install Minecraft {release.minecraft} / NeoForge {release.neoforge}. Players need the <b>{release.version}</b> manual client.</p>
        </> : <p role='status'>{failed ? 'The server release could not load. Refresh to try again.' : 'Loading server download…'}</p>}
        <ol className='modpack__steps'>
            <li>Extract the entire ZIP to a permanent folder and read its <b>README.md</b> and the <a href='https://aka.ms/MinecraftEULA' target='_blank' rel='noreferrer'>Minecraft EULA</a>.</li>
            <li>Open PowerShell there. If you agree to the EULA, create a fresh instance:<code className='modpack__command'>powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\Create-Server-Instance.ps1 -Name My-Server -AcceptEula</code></li>
            <li>Open <code>instances\My-Server</code>. Run <code>.\Start-Server.ps1 -Background</code> in PowerShell and wait for <b>Done</b> in <code>logs\latest.log</code>. On the host, join <code>127.0.0.1:25568</code>.</li>
        </ol>
        <details className='modpack__details'><summary>Invite friends & keep your world</summary><div className='modpack__details-body'>
            <p>The template creates Hard survival with account verification and no whitelist. Configure your whitelist before inviting players if you want one. Allow the game through Windows Firewall and forward <b>TCP 25568</b> to your host for internet play. Friends join your public address with <code>:25568</code>; verify an outside connection. Keep administration port <b>25578</b> private.</p>
            <p>Use <code>.\Stop-Server.ps1</code> to save and stop. Back up the entire stopped instance before updating; the server bundle does <b>not</b> auto-update. Follow the bundled README. The creator refuses an existing instance name: never use it to update a world.</p>
            <p>Jake’s auto-update client follows Jake’s server. For your own server, coordinate matching manual releases with your players.</p>
        </div></details>
    </section>
);
