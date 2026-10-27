#!/usr/bin/env node
// Writes src/devlog/stats.json, the numbers behind the dev log (/devlog):
// how much Jake has worked with Claude Code, by day and by project, and the
// recent commits of the projects whose repositories are public.
//
// It runs on Jake's machine, by hand (`yarn devlog:stats`), because it reads
// two things CI doesn't have: Claude Code's session transcripts in
// ~/.claude/projects/ and the sibling repositories beside this one. The
// output is committed like any other source file.
//
// Only totals leave the transcripts: token counts, timestamps, session ids
// (counted, never written) and which project folder a session ran in. Nothing
// anyone typed, and nothing Claude wrote, is read past its usage numbers.
// Sessions in a folder that isn't in PROJECTS are counted under "Other",
// so a folder's name is never published unless it's listed here.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'devlog', 'stats.json');
const TRANSCRIPTS = join(homedir(), '.claude', 'projects');

// The repositories' folders under ~/Documents/Github, as the dev log names them.
// `commits` publishes the repository's commit subjects, so it's only on for
// public repositories; TapSlayDie, asteroids and farming-game are private.
const PROJECTS = {
    jakemotta: { name: 'jakemotta.com', commits: true, url: 'https://github.com/JakeMotta/jakemotta' },
    TapSlayDie: { name: 'TapSlayDie', commits: false },
    asteroids: { name: 'Asteroids', commits: false },
    farming: { name: 'Farming game', commits: false },
};
const OTHER = 'Other';

// A pause longer than this between two messages ends a stretch of work, and isn't counted
const IDLE_MINUTES = 15;
const COMMITS_PER_PROJECT = 20;

if (!existsSync(TRANSCRIPTS)) {
    console.error(`devlog-stats: no Claude Code transcripts at ${TRANSCRIPTS}`);
    process.exit(1);
}

const transcripts = [];
const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) walk(path);
        else if (entry.name.endsWith('.jsonl')) transcripts.push(path);
    }
};
walk(TRANSCRIPTS);

// The repository a session ran in: the folder under Github\, which a worktree
// (TapSlayDie\.claude\worktrees\…) shares with its repository
const projectOf = (cwd) => {
    const match = cwd && /[\\/]Github[\\/]([^\\/]+)/i.exec(cwd);
    return match && PROJECTS[match[1]] ? PROJECTS[match[1]].name : OTHER;
};

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
    if (!rows.has(key)) rows.set(key, { date: day, project, minutes: 0, replies: 0, sessions: 0, tokens: emptyTokens() });
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
const models = {};
const totalTokens = emptyTokens();
for (const reply of replies.values()) {
    const row = rowFor(reply.day, reply.project);
    row.replies += 1;
    addTokens(row.tokens, reply.tokens);
    addTokens(totalTokens, reply.tokens);
    // Named as people say them: claude-opus-5-5 is Opus 5.5, claude-opus-5 is Opus 5
    const name = reply.model
        .replace(/^claude-/, '')
        .replace(/-(\d+)(?:-(\d{1,2}))?(?:-\d{8})?$/, (_, major, minor) => ` ${major}${minor ? `.${minor}` : ''}`)
        .replace(/^\w/, (c) => c.toUpperCase());
    models[name] = (models[name] || 0) + Object.values(reply.tokens).reduce((a, b) => a + b, 0);
}

// The headline hours count every project's moments together, so two sessions at once aren't counted twice
const allMoments = [...moments.values()].flat();
const days = [...rows.values()]
    .map((row) => ({ ...row, minutes: Math.round(row.minutes) }))
    .filter((row) => row.minutes || row.replies)
    .sort((a, b) => a.date.localeCompare(b.date) || a.project.localeCompare(b.project));
const allSessions = new Set([...sessions.values()].flatMap((ids) => [...ids]));

// Commits: the first sentence of each subject, since some repositories write whole paragraphs there
const firstSentence = (subject) => {
    const sentence = subject.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? subject;
    return sentence.length > 140 ? `${sentence.slice(0, 139).trimEnd()}…` : sentence;
};
const commits = [];
for (const [folder, project] of Object.entries(PROJECTS)) {
    if (!project.commits) continue;
    const repo = folder === basename(ROOT) ? ROOT : join(dirname(ROOT), folder);
    if (!existsSync(join(repo, '.git'))) {
        console.warn(`devlog-stats: no repository at ${repo}, so no commits for ${project.name}`);
        continue;
    }
    const log = execFileSync('git', ['-C', repo, 'log', '--no-merges', `-n${COMMITS_PER_PROJECT}`, '--format=%h%x1f%H%x1f%aI%x1f%s'], { encoding: 'utf8' });
    for (const line of log.split('\n').filter(Boolean)) {
        const [short, hash, date, subject] = line.split('\x1f');
        commits.push({ project: project.name, hash: short, date, subject: firstSentence(subject), url: project.url ? `${project.url}/commit/${hash}` : undefined });
    }
}
commits.sort((a, b) => b.date.localeCompare(a.date));

const stats = {
    generatedAt: new Date().toISOString(),
    since: days[0]?.date ?? null,
    totals: {
        minutes: Math.round(activeMinutes(allMoments)),
        sessions: allSessions.size,
        replies: replies.size,
        tokens: totalTokens,
    },
    models: Object.entries(models)
        .sort((a, b) => b[1] - a[1])
        .map(([name, tokens]) => ({ name, tokens })),
    days,
    commits,
};
writeFileSync(OUT, `${JSON.stringify(stats, null, 2)}\n`);

const total = Object.values(totalTokens).reduce((a, b) => a + b, 0);
console.log(
    `devlog-stats: ${transcripts.length} transcripts, ${allSessions.size} sessions, ${(stats.totals.minutes / 60).toFixed(1)} hours, ${(total / 1e6).toFixed(1)}M tokens, ${commits.length} commits → ${OUT}`,
);
