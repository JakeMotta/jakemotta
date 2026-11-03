import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Minecraft } from './index';
import credits from '../../../common/modpack-credits.json';
import { Release, useAutoUpdate, useReleases } from '../../../common/modpack';

jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn() }), { virtual: true });
jest.mock('../../templates', () => ({
    BentoOverlay: ({ children, className }: any) => <section className={className}>{children}</section>,
    OverlayHeader: ({ title }: any) => <h2>{title}</h2>,
}));
jest.mock('../../atoms', () => ({ PixelCube: () => null, Markdown: ({text}: any) => text }));
jest.mock('../../../common/modpack', () => ({ ...jest.requireActual('../../../common/modpack'), useReleases: jest.fn(), useAutoUpdate: jest.fn() }));
const file = { name: 'pack', url: '/immutable/client.mrpack', bytes: 1000, sha256: '' };
const snapshot = credits.releases[0];
const latest: Release = { version: snapshot.version, minecraft:'1.21.1',neoforge:'21.1.264',java:21,prerelease:true,published:'2026-11-03',summary:'Journal 0.9.11',notes:'/notes',checksums:'/sums',client:file,server:{...file,url:'/immutable/server.zip'} };
beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open',''); };
    HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
});
beforeEach(() => {
    window.matchMedia = jest.fn().mockReturnValue({matches:true});
    (useReleases as jest.Mock).mockReturnValue({ releases:[latest,{...latest,version:'old'}],failed:false });
    (useAutoUpdate as jest.Mock).mockReturnValue({ approved:{version:latest.version,starter:{...file,url:'/immutable/auto.zip'}},failed:false });
});

test('overview keeps long content out of the page and has a direct immutable automatic download', () => {
    render(<Minecraft />);
    expect(document.querySelectorAll('.modpack__overview-card')).toHaveLength(5);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'All downloads'})).not.toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Older releases & change logs'}).closest('.modpack__overview-card--download')).not.toBeNull();
    expect(screen.queryByText(/Microsoft account that owns/)).not.toBeInTheDocument();
    expect(screen.getByRole('link',{name:'Download auto-update ZIP'})).toHaveAttribute('href','/immutable/auto.zip');
    fireEvent.click(screen.getByRole('button',{name:'Update / switch'}));
    expect(screen.getByRole('dialog',{name:'Player setup & updates'})).toHaveAttribute('open');
    expect(screen.getByRole('heading',{name:'Already using the automatic setup?'})).toBeVisible();
    fireEvent.click(screen.getByRole('button',{name:'Close player setup & updates'}));
    expect(screen.queryByRole('dialog',{name:'Player setup & updates'})).not.toBeInTheDocument();
});

test('credits browse all pinned mods one at a time', () => {
    render(<Minecraft />);
    fireEvent.click(screen.getByRole('button',{name:'Open mod credits'}));
    expect(screen.getByRole('dialog',{name:'Mod credits'})).toHaveAttribute('open');
    expect(document.querySelectorAll('.modpack-credit-reader__mod')).toHaveLength(1);
    expect(screen.getByText(`Mod 1 of ${snapshot.mods.length}`)).toBeVisible();
    for(let i=1;i<snapshot.mods.length;i++) fireEvent.click(screen.getByRole('button',{name:'Next'}));
    expect(screen.getByText(`Mod ${snapshot.mods.length} of ${snapshot.mods.length}`)).toBeVisible();
    expect(screen.getByRole('button',{name:'Next'})).toBeDisabled();
    expect(screen.getByRole('link',{name:snapshot.mods[snapshot.mods.length - 1].name})).toBeVisible();
});

test('manual download and historical dates remain available through their pop-ups', () => {
    render(<Minecraft />);
    fireEvent.click(screen.getByRole('button',{name:'Manual client'}));
    expect(screen.getByRole('link',{name:'Download .mrpack'})).toHaveAttribute('href',file.url);
    expect(screen.getAllByRole('link',{name:'Download auto-update ZIP'})).toHaveLength(1);
    fireEvent.click(screen.getByRole('button',{name:'Close manual client'}));
    fireEvent.click(screen.getByRole('button',{name:'Older releases & change logs'}));
    expect(screen.getByRole('link',{name:'Download Progression Survival old'})).toHaveAttribute('href',file.url);
    expect(screen.getByLabelText('Released November 3, 2026')).toHaveAttribute('dateTime','2026-11-03');
});
