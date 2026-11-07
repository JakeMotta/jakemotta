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

test('two routes explain the separate downloads and preserve the approved automatic link', () => {
    render(<Minecraft />);
    expect(screen.getByRole('navigation', {name:'Choose your route'}).children).toHaveLength(2);
    expect(screen.getByRole('button', {name:/Start playing/})).toHaveAttribute('aria-pressed','true');
    expect(screen.getByRole('link', {name:'Download Prism Launcher ↗'})).toHaveAttribute('href','https://prismlauncher.org/download/');
    expect(screen.getByRole('link', {name:'Download modpack ZIP ↓'})).toHaveAttribute('href','/immutable/auto.zip');
    expect(screen.getByText(/Download the ZIP and leave it zipped/)).toBeVisible();
    expect(screen.getByText(/Open Prism → select your imported/)).toBeVisible();
    expect(screen.queryByText(/Jake|switch|migration|returning/i)).not.toBeInTheDocument();
});

test('host route replaces setup and gives both downloads from one manual release', () => {
    (useAutoUpdate as jest.Mock).mockReturnValue({approved:{version:'separate-approved-version',starter:file},failed:false});
    render(<Minecraft />);
    fireEvent.click(screen.getByRole('button',{name:/Host a server/}));
    expect(screen.queryByRole('heading',{name:'Set up in three steps'})).not.toBeInTheDocument();
    expect(screen.getByRole('link',{name:'Download server ZIP'})).toHaveAttribute('href',latest.server.url);
    expect(screen.getByRole('link',{name:'Download matching client .mrpack'})).toHaveAttribute('href',latest.client.url);
    expect(screen.getByRole('link',{name:'Get Java 21 for Windows ↗'})).toHaveAttribute('href',expect.stringContaining('version=21'));
    fireEvent.click(screen.getByRole('button',{name:'Open server guide →'}));
    expect(screen.getByRole('heading',{name:'Server guide'})).toHaveFocus();
    fireEvent.click(screen.getByRole('button',{name:'Next'}));
    expect(screen.getByRole('heading',{name:'Extract & read'})).toBeVisible();
    fireEvent.click(screen.getByRole('button',{name:'Back to Host a server'}));
    expect(screen.getByRole('button',{name:'Open server guide →'})).toHaveFocus();
    expect(screen.getByRole('button',{name:/Host a server/})).toHaveAttribute('aria-pressed','true');
});

test('secondary sections replace the routes within the popup and preserve credits and archive', () => {
    render(<Minecraft />);
    fireEvent.click(screen.getByRole('button',{name:/^Mod credits/}));
    expect(screen.queryByRole('navigation',{name:'Choose your route'})).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(`Mod 1 of ${snapshot.mods.length}`)).toBeVisible();
    for(let i=1;i<snapshot.mods.length;i++) fireEvent.click(screen.getByRole('button',{name:'Next'}));
    expect(screen.getByRole('link',{name:snapshot.mods[snapshot.mods.length - 1].name})).toBeVisible();
    fireEvent.click(screen.getByRole('button',{name:'Back to Start playing'}));
    fireEvent.click(screen.getByRole('button',{name:/^Manual releases & change logs/}));
    expect(screen.getByRole('link',{name:'Download .mrpack'})).toHaveAttribute('href',file.url);
    expect(screen.getByRole('link',{name:'Download Progression Survival old'})).toHaveAttribute('href',file.url);
    expect(screen.getByLabelText('Released November 3, 2026')).toHaveAttribute('dateTime','2026-11-03');
});

test('feed and release failures stay independent without offering the wrong file', () => {
    (useAutoUpdate as jest.Mock).mockReturnValue({approved:null,failed:true});
    render(<Minecraft />);
    expect(screen.getByRole('status')).toHaveTextContent('modpack download could not load');
    expect(screen.queryByRole('link',{name:'Download modpack ZIP ↓'})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:/Host a server/}));
    expect(screen.getByRole('link',{name:'Download matching client .mrpack'})).toHaveAttribute('href',file.url);
});

test('playing guide remains paged inside the popup', () => {
    render(<Minecraft />);
    fireEvent.click(screen.getByRole('button',{name:/^Playing guide/}));
    expect(screen.getByRole('heading',{name:'Earn your next tier'})).toBeVisible();
    fireEvent.click(screen.getByRole('button',{name:'Next'}));
    expect(screen.getByRole('heading',{name:'Armor, tools & weapons'})).toBeVisible();
});

test("what's new shows the latest release beside the route, with its change log and download", () => {
    render(<Minecraft />);
    const tile = screen.getByRole('region', {name: latest.version.replace(/^\d+\.\d+\.\d+-/, '')});
    expect(tile).toHaveTextContent('What’s new');
    expect(screen.getByRole('link',{name:'Download .mrpack ↓'})).toHaveAttribute('href',latest.client.url);
    fireEvent.click(screen.getByRole('button',{name:'Full change log'}));
    expect(screen.getByRole('heading',{name:latest.version})).toBeVisible();
    expect(screen.getByRole('button',{name:/^Mod credits/})).toHaveTextContent(`The ${snapshot.mods.length} mods in the pack`);
});

test("what's new falls back to the release summary when no highlights are written for it", () => {
    (useReleases as jest.Mock).mockReturnValue({ releases:[{...latest,version:'9.9.9-rc.99',summary:'A summary straight from the release notes.'}],failed:false });
    render(<Minecraft />);
    expect(screen.getByRole('heading',{name:'rc.99'})).toBeVisible();
    expect(screen.getByText('A summary straight from the release notes.')).toBeVisible();
});
