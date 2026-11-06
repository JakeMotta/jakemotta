#!/usr/bin/env node
// Writes src/devlog/stats.json, the numbers behind the dev log (/devlog):
// how much Jake has worked with Claude Code, by day and by project, his
// commits and lines everywhere he contributes, and the recent commits of the
// projects whose repositories are public.
//
// It runs on Jake's machine, by hand (`yarn devlog:stats`), because it reads
// what CI doesn't have: Claude Code's session transcripts in
// ~/.claude/projects/ (and any other machine's, copied here and named in
// DEVLOG_TRANSCRIPTS), the repositories beside this one, and, through the
// GitHub CLI's sign-in, the private repositories Jake works in but hasn't
// cloned here. The output is committed like any other source file.
//
// Only totals leave the transcripts: token counts, timestamps, session ids
// (counted, never written) and which project folder a session ran in. Nothing
// anyone typed, and nothing Claude wrote, is read past its usage numbers.
// Sessions in a folder that isn't in PROJECTS are counted under "Other",
// so a folder's name is never published unless it's listed here.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'devlog', 'stats.json');
// This machine's transcripts, and any other machine's copied here (folders separated by ; on Windows, : elsewhere)
const TRANSCRIPTS = [join(homedir(), '.claude', 'projects'), ...(process.env.DEVLOG_TRANSCRIPTS || '').split(delimiter).filter(Boolean)];

// The projects, as the dev log names them.
// `folders` are the folder names that mean the project, wherever they turn up in
// a session's working folder (so a worktree, Friday's `<folder>-task-N`
// worktrees and another machine's checkout all count) and beside this
// repository, where a clone's commits are read with git.
// `repos` are its GitHub repositories (`owner/name`, or `owner/*` for a whole
// organisation); one that isn't cloned here is read from GitHub's own numbers.
// `commits` publishes the repository's commit subjects, so it's only on for
// public repositories; every other one here is private.
// `notCode` lists the folders and files left out of the lines added and
// removed (the code frequency): archives, art and generated files, which
// would bury the code under them. Their commits still count.
const PROJECTS = [
    {
        name: 'jakemotta.com',
        folders: ['jakemotta'],
        repos: ['JakeMotta/jakemotta'],
        commits: true,
        url: 'https://github.com/JakeMotta/jakemotta',
        notCode: ['public/projects/', 'public/vendor/', 'public/downloads/', 'src/devlog/stats.json'],
    },
    { name: 'TYB', folders: ['tyb-app', 'tyb-personal-assistant', '.momo'], repos: ['TYB-U/*'] },
    { name: 'TapSlayDie', folders: ['TapSlayDie'], repos: ['JakeMotta/TapSlayDie', 'JakeMotta/tapslaydie-ascension'], notCode: ['assets/', 'mobile-game/assets/'] },
    // The modpack: outputs/ and output/ are built releases, work/ is scratch
    { name: 'Progression Survival', folders: ['minecraft-progression'], repos: ['JakeMotta/minecraft-progression'], notCode: ['outputs/', 'output/', 'work/'] },
    { name: 'Friday', folders: ['personal-voice-agent'], repos: ['AustinZurbuchen/personal-voice-agent'] },
    { name: 'Black Box', folders: ['blackbox'], repos: ['JakeMotta/blackbox'] },
    { name: 'Ambii', folders: [], repos: ['*/ambii*'] },
    { name: 'Asteroids', folders: ['asteroids'], repos: ['JakeMotta/asteroids'] },
    { name: 'Farming game', folders: ['farming'], repos: ['JakeMotta/farming-game'] },
];
const OTHER = 'Other';
const LOCKFILES = ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml'];
// Whose contributions to count, on GitHub and in git (other people's commits in a shared repository aren't Jake's)
const GITHUB_USER = 'JakeMotta';
const AUTHOR_NAMES = ['jacob motta', 'jake motta', 'jakemotta'];

// A pause longer than this between two messages ends a stretch of work, and isn't counted
const IDLE_MINUTES = 15;
const COMMITS_PER_PROJECT = 20;
// The code frequency's weeks, counting back from this one
const CODE_WEEKS = 52;

const transcripts = [];
const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) walk(path);
        else if (entry.name.endsWith('.jsonl')) transcripts.push(path);
    }
};
for (const dir of TRANSCRIPTS) {
    if (existsSync(dir)) walk(dir);
    else console.warn(`devlog-stats: no Claude Code transcripts at ${dir}`);
}
if (!transcripts.length) {
    console.error('devlog-stats: no Claude Code transcripts found');
    process.exit(1);
}

// The project a folder belongs to: the first part of its path that's one of a project's folders.
// A worktree (TapSlayDie\.claude\worktrees\…) shares its repository's folder, and Friday's worktrees
// (~/.personal-voice-agent/worktrees/jakemotta-task-35) are named for theirs.
const byFolder = new Map(PROJECTS.flatMap((project) => project.folders.map((folder) => [folder.toLowerCase(), project])));
const projectOfPath = (path) => {
    for (const part of (path || '').split(/[\\/]/)) {
        const project = byFolder.get(part.toLowerCase().replace(/-task-\d+$/, ''));
        if (project) return project;
    }
    return null;
};
const projectOf = (cwd) => projectOfPath(cwd)?.name ?? OTHER;

// The day as Jake lived it, in this machine's time zone
const dayOf = (time) => {
    const date = new Date(time);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// A reply is written to its transcript once per content block, each copy with
// the usage so far, so replies are counted once each, by id, at their largest
const replies = new Map();
// Every moment someone was working: each message sent or received, by project
const moments = new Map();
const sessions = new Map();

for (const file of transcripts) {
    // A subagent's transcript sits in its session's folder; the session's own cwd says where it ran
    let cwd = null;
    for (const line of readFileSync(file, 'utf8').split('\n')) {
        if (!line) continue;
        let entry;
        try {
            entry = JSON.parse(line);
        } catch {
            continue;
        }
        if (entry.cwd) cwd = entry.cwd;
        if (entry.type !== 'user' && entry.type !== 'assistant') continue;
        if (!entry.timestamp) continue;
        const time = Date.parse(entry.timestamp);
        if (Number.isNaN(time)) continue;
        const project = projectOf(entry.cwd || cwd);

        if (!moments.has(project)) moments.set(project, []);
        moments.get(project).push(time);
        const day = dayOf(time);
        const key = `${day}|${project}`;
        if (!sessions.has(key)) sessions.set(key, new Set());
        if (entry.sessionId) sessions.get(key).add(entry.sessionId);

        const usage = entry.type === 'assistant' && entry.message?.usage;
        const model = entry.message?.model;
        if (!usage || !entry.message.id || !model || model.startsWith('<')) continue;
        const previous = replies.get(entry.message.id);
        const tokens = {
            input: usage.input_tokens || 0,
            output: usage.output_tokens || 0,
            cacheWrite: usage.cache_creation_input_tokens || 0,
            cacheRead: usage.cache_read_input_tokens || 0,
        };
        if (previous) for (const field of Object.keys(tokens)) tokens[field] = Math.max(tokens[field], previous.tokens[field]);
        replies.set(entry.message.id, { day: previous?.day ?? day, project, model, tokens });
    }
}

const emptyTokens = () => ({ input: 0, output: 0, cacheWrite: 0, cacheRead: 0 });
const addTokens = (into, tokens) => {
    for (const field of Object.keys(into)) into[field] += tokens[field];
};
const rows = new Map();
const rowFor = (day, project) => {
    const key = `${day}|${project}`;
    if (!rows.has(key)) rows.set(key, { date: day, project, minutes: 0, replies: 0, sessions: 0, tokens: emptyTokens(), models: {} });
    return rows.get(key);
};

// Active time: the gaps between one moment and the next, when they're close enough to be one stretch.
// A gap counts on the day it ends.
const activeMinutes = (times, onGap) => {
    const sorted = [...times].sort((a, b) => a - b);
    let total = 0;
    for (let i = 1; i < sorted.length; i++) {
        const gap = (sorted[i] - sorted[i - 1]) / 60000;
        if (gap > IDLE_MINUTES) continue;
        total += gap;
        onGap?.(sorted[i], gap);
    }
    return total;
};

for (const [project, times] of moments) {
    activeMinutes(times, (time, gap) => {
        rowFor(dayOf(time), project).minutes += gap;
    });
}
for (const [key, ids] of sessions) {
    const [day, project] = key.split('|');
    rowFor(day, project).sessions = ids.size;
}
const sumTokens = (tokens) => Object.values(tokens).reduce((a, b) => a + b, 0);
for (const reply of replies.values()) {
    const row = rowFor(reply.day, reply.project);
    row.replies += 1;
    addTokens(row.tokens, reply.tokens);
    // Named as people say them: claude-opus-5-5 is Opus 5.5, claude-opus-5 is Opus 5
    const name = reply.model
        .replace(/^claude-/, '')
        .replace(/-(\d+)(?:-(\d{1,2}))?(?:-\d{8})?$/, (_, major, minor) => ` ${major}${minor ? `.${minor}` : ''}`)
        .replace(/^\w/, (c) => c.toUpperCase());
    row.models[name] = (row.models[name] || 0) + sumTokens(reply.tokens);
}

// The last run's numbers, which this run adds to rather than replaces (see below)
const previousStats = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};

// The headline hours count every project's moments together, so two sessions at once aren't counted twice
const allMoments = [...moments.values()].flat();
const freshDays = [...rows.values()]
    .map((row) => ({ ...row, minutes: Math.round(row.minutes) }))
    .filter((row) => row.minutes || row.replies);
const allSessions = new Set([...sessions.values()].flatMap((ids) => [...ids]));

// Claude Code deletes a transcript a month after it was last used (cleanupPeriodDays), so a day counted
// before may have lost some or all of its transcripts since. A day the transcripts now show less of
// keeps, row by row, whichever count is larger, and whatever is kept that way is added to the totals.
// A day they show at least as much of is counted fresh, so a project renamed in PROJECTS moves its rows.
const kept = { minutes: 0, sessions: 0, replies: 0, tokens: emptyTokens(), models: {} };
const repliesOn = (list, date) => list.filter((row) => row.date === date).reduce((sum, row) => sum + row.replies, 0);
const oldDays = previousStats.days ?? [];
// Rows written before the rows carried their models: what they keep goes to the models in the old proportions
const oldModels = previousStats.models ?? [];
const oldModelTotal = oldModels.reduce((sum, model) => sum + model.tokens, 0);
const modelsOf = (row) =>
    row.models ?? Object.fromEntries(oldModelTotal ? oldModels.map((model) => [model.name, (sumTokens(row.tokens) * model.tokens) / oldModelTotal]) : [['Claude', sumTokens(row.tokens)]]);
const days = [...freshDays];
for (const date of new Set(oldDays.map((row) => row.date))) {
    if (repliesOn(freshDays, date) >= repliesOn(oldDays, date)) continue;
    for (const old of oldDays.filter((row) => row.date === date)) {
        const index = days.findIndex((row) => row.date === date && row.project === old.project);
        const fresh = days[index];
        if (fresh && fresh.replies >= old.replies) continue;
        if (fresh) days.splice(index, 1);
        days.push(old);
        kept.minutes += Math.max(0, old.minutes - (fresh?.minutes ?? 0));
        kept.sessions += Math.max(0, old.sessions - (fresh?.sessions ?? 0));
        kept.replies += old.replies - (fresh?.replies ?? 0);
        for (const field of Object.keys(kept.tokens)) kept.tokens[field] += Math.max(0, old.tokens[field] - (fresh?.tokens[field] ?? 0));
        const oldByModel = modelsOf(old);
        for (const [name, tokens] of Object.entries(oldByModel)) {
            kept.models[name] = (kept.models[name] || 0) + Math.max(0, tokens - (fresh?.models[name] ?? 0));
        }
    }
}
days.sort((a, b) => a.date.localeCompare(b.date) || a.project.localeCompare(b.project));
const totalTokens = emptyTokens();
const models = {};
for (const row of freshDays) {
    addTokens(totalTokens, row.tokens);
    for (const [name, tokens] of Object.entries(row.models)) models[name] = (models[name] || 0) + tokens;
}
addTokens(totalTokens, kept.tokens);
for (const [name, tokens] of Object.entries(kept.models)) models[name] = (models[name] || 0) + tokens;
const keptDays = new Set(days.filter((row) => !freshDays.includes(row)).map((row) => row.date));

// Commits: the first sentence of each subject, since some repositories write whole paragraphs there
const firstSentence = (subject) => {
    const sentence = subject.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? subject;
    return sentence.length > 140 ? `${sentence.slice(0, 139).trimEnd()}…` : sentence;
};
// This repository may be a worktree under .claude\worktrees\, so its siblings are found from the main checkout
const mainCheckout = resolve(execFileSync('git', ['-C', ROOT, 'rev-parse', '--path-format=absolute', '--git-common-dir'], { encoding: 'utf8' }).trim(), '..');
const repoOf = (folder) => {
    const repo = folder === basename(mainCheckout) ? ROOT : join(dirname(mainCheckout), folder);
    return existsSync(join(repo, '.git')) ? repo : null;
};
// The GitHub repository a clone pushes to, as owner/name
const remoteOf = (repo) => {
    try {
        const url = execFileSync('git', ['-C', repo, 'remote', 'get-url', 'origin'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
        return /github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?\/?$/i.exec(url)?.[1] ?? null;
    } catch {
        return null;
    }
};
const repoMatches = (pattern, fullName) => {
    const [owner, name] = pattern.toLowerCase().split('/');
    const [repoOwner, repoName] = fullName.toLowerCase().split('/');
    return (owner === '*' || owner === repoOwner) && (name.endsWith('*') ? repoName.startsWith(name.slice(0, -1)) : name === repoName);
};
const projectOfRepo = (fullName) => PROJECTS.find((project) => project.repos.some((pattern) => repoMatches(pattern, fullName))) ?? null;
const isJake = (author) => AUTHOR_NAMES.includes(author.trim().toLowerCase());

// Every clone beside this repository, and the project it belongs to (none means Other)
const clones = readdirSync(dirname(mainCheckout), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
        const repo = repoOf(entry.name);
        if (!repo) return null;
        const remote = remoteOf(repo);
        return { repo, remote, project: byFolder.get(entry.name.toLowerCase()) ?? (remote && projectOfRepo(remote)) ?? null };
    })
    .filter(Boolean);

const commits = [];
for (const { repo, project } of clones) {
    if (!project?.commits) continue;
    const log = execFileSync('git', ['-C', repo, 'log', '--no-merges', `-n${COMMITS_PER_PROJECT * 3}`, '--format=%h%x1f%H%x1f%aI%x1f%an%x1f%s'], { encoding: 'utf8' });
    const lines = log
        .split('\n')
        .filter(Boolean)
        .map((line) => line.split('\x1f'))
        .filter(([, , , author]) => isJake(author));
    for (const [short, hash, date, , subject] of lines.slice(0, COMMITS_PER_PROJECT)) {
        commits.push({ project: project.name, hash: short, date, subject: firstSentence(subject), url: project.url ? `${project.url}/commit/${hash}` : undefined });
    }
}
commits.sort((a, b) => b.date.localeCompare(a.date));

// GitHub: Jake's commits everywhere he contributes and the lines they added and removed, a week (Monday on) at a
// time, like GitHub's code frequency graph. Private repositories count too, but only as totals.
const mondayOf = (time) => {
    const date = new Date(time);
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return dayOf(date);
};
const thisWeek = mondayOf(Date.now());
const firstWeek = (() => {
    const date = new Date(`${thisWeek}T00:00:00`);
    date.setDate(date.getDate() - 7 * (CODE_WEEKS - 1));
    return dayOf(date);
})();
const weeks = new Map();
for (const date = new Date(`${firstWeek}T00:00:00`); dayOf(date) <= thisWeek; date.setDate(date.getDate() + 7)) {
    weeks.set(dayOf(date), { week: dayOf(date), commits: 0, additions: 0, deletions: 0 });
}
const projectTotals = new Map();
const count = (name, monday, commitCount, additions, deletions) => {
    if (!projectTotals.has(name)) projectTotals.set(name, { name, commits: 0, additions: 0, deletions: 0 });
    const totals = projectTotals.get(name);
    totals.commits += commitCount;
    totals.additions += additions;
    totals.deletions += deletions;
    const week = weeks.get(monday);
    if (!week) return;
    week.commits += commitCount;
    week.additions += additions;
    week.deletions += deletions;
};

// A commit is counted once wherever it turns up: in two clones, in a fork, in a repository started from a copy of
// another's history (TapSlayDie Ascension began as TapSlayDie). Its author time and subject survive a rebase, a
// cherry-pick and a re-import, where its hash wouldn't.
const counted = new Set();
const commitKey = (date, subject) => `${Date.parse(date) / 1000}|${subject.trim()}`;

// The clones here, on their default branch and the branch checked out: only Jake's commits (a shared repository has
// other people's, and bots'). Branches that were never merged are left out, as GitHub leaves them out.
const branchesOf = (repo) => {
    const git = (...args) => {
        try {
            return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
        } catch {
            return '';
        }
    };
    const fallback = ['main', 'master'].find((branch) => git('rev-parse', '--verify', '--quiet', `refs/heads/${branch}`));
    return ['HEAD', git('symbolic-ref', '--quiet', 'refs/remotes/origin/HEAD') || fallback].filter(Boolean);
};
for (const { repo, project } of clones) {
    const notCode = [...(project?.notCode ?? []), ...LOCKFILES];
    const isCode = (path) => !notCode.some((skip) => (skip.endsWith('/') ? path.startsWith(skip) : path === skip || path.endsWith(`/${skip}`)));
    const log = execFileSync('git', ['-C', repo, 'log', ...branchesOf(repo), '--no-merges', '--numstat', '--format=%x1e%aI%x1f%an%x1f%s'], {
        encoding: 'utf8',
        maxBuffer: 512 * 1024 * 1024,
    });
    for (const block of log.split('\x1e').filter(Boolean)) {
        const [head, ...files] = block.split('\n');
        const [date, author, subject] = head.split('\x1f');
        const key = commitKey(date, subject);
        if (!isJake(author) || counted.has(key)) continue;
        counted.add(key);
        let additions = 0;
        let deletions = 0;
        for (const line of files) {
            const [added, removed, path] = line.split('\t');
            // Binary files show as "-"
            if (!path || added === '-' || !isCode(path)) continue;
            additions += Number(added);
            deletions += Number(removed);
        }
        count(project?.name ?? OTHER, mondayOf(date), 1, additions, deletions);
    }
}

// Every other repository Jake works in (TYB's app, old teams' repositories), from GitHub, signed in as the GitHub CLI
// is: his commits on each one's default branch, and GitHub's own count of his lines a week. That count can't leave
// out lockfiles or art, and it covers a whole week, so a week whose commits were already counted elsewhere only
// keeps the share of its lines that its new commits make up.
const token =
    process.env.GITHUB_TOKEN ||
    (() => {
        try {
            return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
        } catch {
            return null;
        }
    })();
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
const githubApi = async (path, init = {}) => {
    const response = await fetch(`https://api.github.com/${path}`, {
        ...init,
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'jakemotta.com devlog-stats', ...init.headers },
    });
    if (!response.ok && response.status !== 202 && response.status !== 204) throw new Error(`HTTP ${response.status}`);
    return response;
};
const cloned = new Set(clones.map((clone) => clone.remote?.toLowerCase()).filter(Boolean));
const fromGithub = [];
if (!token) {
    console.warn('devlog-stats: no GitHub sign-in (gh auth login, or GITHUB_TOKEN), so only the clones here count toward the commits');
} else {
    try {
        // Every repository Jake can reach, with when it was made, so an original is counted before its copies
        const repos = new Map();
        for (let page = 1; ; page++) {
            const list = await (await githubApi(`user/repos?affiliation=owner,collaborator,organization_member&per_page=100&page=${page}`)).json();
            for (const repo of list) repos.set(repo.full_name, repo.created_at);
            if (list.length < 100) break;
        }
        // And any he has committed to without being a member, like a pull request to someone else's
        const contributed = await githubApi('graphql', {
            method: 'POST',
            body: JSON.stringify({
                query: '{ viewer { repositoriesContributedTo(first: 100, includeUserRepositories: true, contributionTypes: [COMMIT, PULL_REQUEST]) { nodes { nameWithOwner createdAt } } } }',
            }),
        })
            .then((response) => response.json())
            .catch(() => null);
        for (const node of contributed?.data?.viewer?.repositoriesContributedTo?.nodes ?? []) if (!repos.has(node.nameWithOwner)) repos.set(node.nameWithOwner, node.createdAt);

        // GitHub works a repository's numbers out when they're first asked for (202), and has them a little later
        const statsOf = async (fullName) => {
            for (let attempt = 0; attempt < 10; attempt++) {
                const response = await githubApi(`repos/${fullName}/stats/contributors`);
                if (response.status === 202) {
                    await sleep(3000);
                    continue;
                }
                return response.status === 204 ? [] : response.json();
            }
            throw new Error('GitHub was still counting it');
        };
        const commitsOf = async (fullName) => {
            const all = [];
            for (let page = 1; ; page++) {
                const response = await githubApi(`repos/${fullName}/commits?author=${GITHUB_USER}&per_page=100&page=${page}`);
                const list = response.status === 204 ? [] : await response.json();
                all.push(...list.filter((commit) => commit.parents.length < 2));
                if (list.length < 100) return all;
            }
        };
        const queue = [...repos.keys()].filter((fullName) => !cloned.has(fullName.toLowerCase()));
        const found = [];
        const work = async () => {
            for (let fullName = queue.shift(); fullName; fullName = queue.shift()) {
                try {
                    const mine = (await statsOf(fullName)).find((contributor) => contributor.author?.login?.toLowerCase() === GITHUB_USER.toLowerCase());
                    if (mine?.total) found.push({ fullName, created: repos.get(fullName) ?? '', weeks: mine.weeks, commits: await commitsOf(fullName) });
                } catch (error) {
                    console.warn(`devlog-stats: couldn't read ${fullName} from GitHub (${error.message})`);
                }
            }
        };
        await Promise.all(Array.from({ length: 6 }, work));

        // GitHub's weeks start on Sunday, UTC
        const sundayOf = (date) => {
            const day = new Date(date);
            day.setUTCHours(0, 0, 0, 0);
            day.setUTCDate(day.getUTCDate() - day.getUTCDay());
            return day.getTime() / 1000;
        };
        for (const { fullName, weeks: repoWeeks, commits: repoCommits } of found.sort((a, b) => a.created.localeCompare(b.created))) {
            const name = projectOfRepo(fullName)?.name ?? OTHER;
            const fresh = new Map();
            for (const { commit } of repoCommits) {
                const key = commitKey(commit.author.date, commit.message.split('\n\n')[0].replace(/\s*\n\s*/g, ' '));
                if (counted.has(key)) continue;
                counted.add(key);
                const sunday = sundayOf(commit.author.date);
                fresh.set(sunday, (fresh.get(sunday) ?? 0) + 1);
            }
            let total = 0;
            for (const [sunday, newCommits] of fresh) {
                const week = repoWeeks.find((entry) => entry.w === sunday);
                const share = week?.c ? Math.min(1, newCommits / week.c) : 0;
                // Two days on from a Sunday, UTC, is that week's Monday anywhere
                count(name, mondayOf((sunday + 2 * 86400) * 1000), newCommits, Math.round((week?.a ?? 0) * share), Math.round((week?.d ?? 0) * share));
                total += newCommits;
            }
            if (total) fromGithub.push(`${fullName} (${name}, ${total})`);
        }
    } catch (error) {
        console.warn(`devlog-stats: couldn't read GitHub (${error.message}), so only the clones here count toward the commits`);
    }
}
const githubProjects = [...projectTotals.values()].filter((project) => project.commits).sort((a, b) => (a.name === OTHER) - (b.name === OTHER) || b.commits - a.commits);

// GitHub's own count from Jake's profile: commits, pull requests, issues and reviews in the last year, private
// ones included when the profile shows them. It's read from the public page, and kept from the last run if that fails.
let contributions = previousStats.github?.contributions ?? null;
try {
    const page = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, { headers: { 'User-Agent': 'jakemotta.com devlog-stats' } }).then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
    });
    const total = /([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/.exec(page.replace(/\s+/g, ' '));
    if (!total) throw new Error('no total on the page');
    contributions = { total: Number(total[1].replace(/,/g, '')), date: dayOf(Date.now()) };
} catch (error) {
    console.warn(`devlog-stats: couldn't read GitHub's contribution count (${error.message}), so the last one stays`);
}

const github = {
    user: GITHUB_USER,
    url: `https://github.com/${GITHUB_USER}`,
    contributions,
    commits: githubProjects.reduce((sum, project) => sum + project.commits, 0),
    additions: githubProjects.reduce((sum, project) => sum + project.additions, 0),
    deletions: githubProjects.reduce((sum, project) => sum + project.deletions, 0),
    projects: githubProjects,
    weeks: [...weeks.values()],
};

const stats = {
    generatedAt: new Date().toISOString(),
    since: days[0]?.date ?? null,
    totals: {
        minutes: Math.round(activeMinutes(allMoments)) + kept.minutes,
        sessions: allSessions.size + kept.sessions,
        replies: replies.size + kept.replies,
        tokens: totalTokens,
    },
    models: Object.entries(models)
        .map(([name, tokens]) => ({ name, tokens: Math.round(tokens) }))
        .sort((a, b) => b.tokens - a.tokens),
    days,
    commits,
    github,
};
writeFileSync(OUT, `${JSON.stringify(stats, null, 2)}\n`);

if (keptDays.size) console.log(`devlog-stats: kept the last run's numbers for ${keptDays.size} day(s) whose transcripts are gone: ${[...keptDays].sort().join(', ')}`);
if (fromGithub.length) console.log(`devlog-stats: from GitHub: ${fromGithub.sort().join(', ')}`);
const total = Object.values(totalTokens).reduce((a, b) => a + b, 0);
console.log(
    `devlog-stats: ${transcripts.length} transcripts, ${allSessions.size} sessions, ${(stats.totals.minutes / 60).toFixed(1)} hours, ${(total / 1e6).toFixed(1)}M tokens, ${commits.length} commits; ` +
        `GitHub: ${github.commits} commits, +${github.additions} −${github.deletions} lines, ${contributions?.total ?? '?'} contributions → ${OUT}`,
);
