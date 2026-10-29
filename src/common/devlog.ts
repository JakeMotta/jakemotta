import { useEffect, useState } from 'react';
import stats from '../devlog/stats.json';

export interface DevlogTokens {
    input: number;
    output: number;
    cacheWrite: number;
    cacheRead: number;
}

export interface DevlogDay {
    date: string;
    project: string;
    minutes: number;
    replies: number;
    sessions: number;
    tokens: DevlogTokens;
}

export interface DevlogCommit {
    project: string;
    hash: string;
    date: string;
    subject: string;
    url?: string;
}

/** A week of code (Monday on), like a bar of GitHub's code frequency graph */
export interface DevlogWeek {
    week: string;
    commits: number;
    additions: number;
    deletions: number;
}

export interface DevlogGithub {
    user: string;
    url: string;
    // GitHub's own count for the last year, from Jake's profile, and the day it was read
    contributions: { total: number; date: string } | null;
    commits: number;
    additions: number;
    deletions: number;
    projects: { name: string; commits: number; additions: number; deletions: number }[];
    weeks: DevlogWeek[];
}

export interface DevlogStats {
    generatedAt: string;
    since: string | null;
    totals: { minutes: number; sessions: number; replies: number; tokens: DevlogTokens };
    models: { name: string; tokens: number }[];
    days: DevlogDay[];
    commits: DevlogCommit[];
    github: DevlogGithub;
}

export interface DevlogPost {
    slug: string;
    date: string;
    title: string;
    project?: string;
    body: string;
}

/** Written by `yarn devlog:stats` on Jake's machine, from his Claude Code sessions and his public repositories */
export const devlogStats = stats as DevlogStats;

export const tokenTotal = (tokens: DevlogTokens) => tokens.input + tokens.output + tokens.cacheWrite + tokens.cacheRead;

export const formatHours = (minutes: number) => (minutes < 60 ? `${minutes}m` : `${(minutes / 60).toFixed(minutes < 600 ? 1 : 0)}h`);

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
export const formatCount = (count: number) => compact.format(count);

/** A moment's date in the visitor's time zone, as YYYY-MM-DD like the stats' days */
export const localDay = (time: string | Date) => {
    const date = new Date(time);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/** The weeks of code from the first one with a commit in it, so the chart doesn't open on empty months */
export const codeWeeks = (weeks: DevlogWeek[]) => weeks.slice(Math.max(0, weeks.findIndex((week) => week.commits > 0)));

export const formatDay = (date: string) => new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

// Each post is a Markdown file in src/devlog/posts/, named YYYY-MM-DD-slug.md. webpack copies them
// into the build under hashed names, so a new post needs nothing but its file.
const postFiles = require.context('../devlog/posts', false, /\.md$/);
const postSources = postFiles.keys().map((key) => {
    const module = postFiles(key) as string | { default: string };
    return { file: key.replace(/^\.\//, ''), url: typeof module === 'string' ? module : module.default };
});

// The --- block at the top: title, and optionally project and date
const parsePost = (file: string, source: string): DevlogPost => {
    const slug = file.replace(/\.md$/, '');
    const meta: Record<string, string> = {};
    let body = source.replace(/\r\n/g, '\n');
    const front = /^---\n([\s\S]*?)\n---\n?/.exec(body);
    if (front) {
        for (const line of front[1].split('\n')) {
            const match = /^(\w+):\s*(.*)$/.exec(line);
            if (match) meta[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, '$2');
        }
        body = body.slice(front[0].length);
    }
    return {
        slug,
        date: meta.date || slug.slice(0, 10),
        title: meta.title || slug.slice(11).replace(/-/g, ' '),
        project: meta.project || undefined,
        body: body.trim(),
    };
};

let postsRequest: Promise<DevlogPost[]> | null = null;
const loadPosts = () =>
    (postsRequest ??= Promise.all(postSources.map(({ file, url }) => fetch(url).then((response) => response.text()).then((text) => parsePost(file, text)))).then((posts) =>
        posts.sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug)),
    ));

/** The posts, newest first; `null` while they load, and `failed` if they didn't */
export const useDevlogPosts = () => {
    const [posts, setPosts] = useState<DevlogPost[] | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let live = true;
        loadPosts().then(
            (loaded) => live && setPosts(loaded),
            () => {
                postsRequest = null;
                if (live) setFailed(true);
            },
        );
        return () => {
            live = false;
        };
    }, []);

    return { posts, failed };
};
