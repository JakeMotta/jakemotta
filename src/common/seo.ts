import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { homeProjectList } from './constants';

export const SITE_NAME = 'Jake Motta';
export const SITE_URL = 'https://jakemotta.com';
// Keep in step with the description in public/index.html, which is what's there before the app runs
const SITE_DESCRIPTION = "Jake Motta's corner of the web: websites, games and songs he's made over the years, with his own music playing while you look around.";

interface PageMeta {
    title: string;
    description: string;
    // The page's own address, so search engines don't treat every overlay as the board
    path: string;
}

const OVERLAYS: Record<string, Omit<PageMeta, 'path'>> = {
    '/library': { title: 'Music', description: "Songs by Jake Motta, and a few favorite artists. Pick one and it plays while you look around the rest of the site." },
    '/project': { title: 'Projects', description: `${homeProjectList.length} projects by Jake Motta: websites, apps, games, art and animation.` },
    '/devlog': { title: 'Dev log', description: "What Jake Motta is building right now, how many hours and tokens he's spent on it with Claude, and his commits on GitHub." },
    '/minecraft': { title: 'Progression Survival', description: 'Progression Survival, the modpack for our modded Minecraft server: earn every armor and tool tier yourself, on Hard. Download the latest release.' },
};

export const pageMeta = (pathname: string): PageMeta => {
    const path = pathname.replace(/(.)\/+$/, '$1');
    const [, id, slug] = path.match(/^\/project\/([^/]+)\/([^/]+)$/) || [];
    const hub = id && homeProjectList.find((item) => item.id === id);
    const page = hub && hub.pages?.find((item) => item.slug === slug);
    if (hub && page) {
        return { title: `${page.title} · ${hub.title} (${hub.date})`, description: `${page.title}, from ${hub.title}: ${hub.description || `a project by Jake Motta from ${hub.date}.`}`, path };
    }
    const project = path.startsWith('/project/') && homeProjectList.find((item) => `/project/${item.id}` === path);
    if (project) {
        return {
            title: `${project.title} (${project.date})`,
            description: project.description || `${project.title}, a project by Jake Motta from ${project.date}.`,
            path,
        };
    }
    if (OVERLAYS[path]) return { ...OVERLAYS[path], path };
    return { title: '', description: SITE_DESCRIPTION, path: '/' };
};

const setHead = (selector: string, create: () => HTMLElement, attribute: string, value: string) => {
    let element = document.head.querySelector<HTMLElement>(selector);
    if (!element) {
        element = create();
        document.head.appendChild(element);
    }
    element.setAttribute(attribute, value);
};

/** Names the open page in the tab title, the meta description and the canonical link. */
export const usePageMeta = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        const { title, description, path } = pageMeta(pathname);
        document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
        setHead('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }), 'content', description);
        setHead('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', `${SITE_URL}${path}`);
    }, [pathname]);
};
