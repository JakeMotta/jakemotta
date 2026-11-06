import React from 'react';
import { AutoUpdate } from '../../../common/modpack';

export const PlayerGuide = ({ approved, failed }: { approved: AutoUpdate | null; failed: boolean }) => <>
    <div className='modpack__route-heading'><h3>Set up in three steps</h3><span className='modpack__route-chip'>Minecraft Java Edition</span></div>
    <p>Prism Launcher is the app. The modpack ZIP adds Progression Survival to it.</p>
    <ol className='modpack__route-steps'>
        <li><h4>Install Prism Launcher</h4><p>Open Prism and sign in with the account that owns Minecraft Java Edition.</p><a className='modpack__button' href='https://prismlauncher.org/download/' target='_blank' rel='noopener noreferrer'>Download Prism Launcher ↗</a></li>
        <li><h4>Import the modpack ZIP</h4><p>Download the ZIP and leave it zipped. In Prism: <b>Add Instance → Import → select the ZIP</b>.</p>{approved ? <><a className='modpack__button modpack__button--solid' href={approved.starter.url} download>Download modpack ZIP ↓</a><span className='modpack__route-note'>Automatic updates · {approved.version}</span></> : <p role='status'>{failed ? 'The modpack download could not load. Refresh to try again.' : 'Loading modpack download…'}</p>}</li>
        <li><h4>Launch from Prism</h4><p>Select the imported <b>Progression Survival</b> instance and press <b>Launch</b>.</p><span className='modpack__route-note'>Use this same instance each time you play. Updates run before the game starts.</span></li>
    </ol>
</>;
