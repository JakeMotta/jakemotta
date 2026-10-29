import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { BentoOverlay, OverlayHeader } from '../../templates';
import { CodeFrequency, Markdown } from '../../atoms';
import { codeWeeks, devlogStats, formatCount, formatDay, formatHours, localDay, tokenTotal, useDevlogPosts } from '../../../common/devlog';
import { UsageChart } from './chart';
import './index.scss';

/**
 * The dev log: Jake's posts about what he's working on, how much he's worked on it with Claude, and
 * his code on GitHub (commits, code frequency and the latest commits). The posts are Markdown files
 * in src/devlog/posts/; the numbers come from `yarn devlog:stats` (docs/devlog.md).
 */
export const Devlog = () => {
    const navigate = useNavigate();
    const { posts, failed } = useDevlogPosts();
    const { totals, days, commits, models, since, generatedAt, github } = devlogStats;

    // Each project's colour goes by when it first shows up, so it keeps it as the numbers change; Other is always last
    const projects = useMemo(() => {
        const names = [...new Set(days.map((day) => day.project))];
        return [...names.filter((name) => name !== 'Other'), ...names.filter((name) => name === 'Other')];
    }, [days]);
    const byProject = projects.map((project) => {
        const rows = days.filter((day) => day.project === project);
        return {
            project,
            minutes: rows.reduce((sum, day) => sum + day.minutes, 0),
            tokens: rows.reduce((sum, day) => sum + tokenTotal(day.tokens), 0),
        };
    });
    const allTokens = tokenTotal(totals.tokens);

    return (
        <BentoOverlay label='Dev log' onClose={() => navigate('/')} className='devlog'>
            <OverlayHeader title='Dev log' subtitle="What I'm building right now, and how much Claude has been helping me build it." />

            <div className='devlog__grid'>
                <section className='devlog__tile devlog__tile--posts' aria-labelledby='devlog-posts'>
                    <h3 id='devlog-posts' className='devlog__eyebrow'>
                        Updates
                    </h3>
                    {!posts && !failed && <p>Loading…</p>}
                    {failed && <p>The posts didn't load. Give it a refresh.</p>}
                    {posts?.length === 0 && <p>Nothing posted yet. Soon!</p>}
                    {posts?.map((post) => (
                        <article key={post.slug} className='devlog-post' aria-labelledby={`post-${post.slug}`}>
                            <div className='devlog-post__meta'>
                                <time dateTime={post.date}>{new Date(`${post.date}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                                {post.project && <span className='devlog__pill'>{post.project}</span>}
                            </div>
                            <h4 id={`post-${post.slug}`} className='devlog-post__title'>
                                {post.title}
                            </h4>
                            <Markdown className='devlog-post__body' text={post.body} />
                        </article>
                    ))}
                </section>

                <section className='devlog__tile devlog__tile--claude' aria-labelledby='devlog-claude'>
                    <h3 id='devlog-claude' className='devlog__eyebrow'>
                        Me &amp; Claude
                    </h3>
                    <dl className='devlog__numbers'>
                        <div>
                            <dt>Hours together</dt>
                            <dd>{(totals.minutes / 60).toFixed(1)}</dd>
                        </div>
                        <div>
                            <dt>Tokens</dt>
                            <dd>{formatCount(allTokens)}</dd>
                        </div>
                        <div>
                            <dt>Sessions</dt>
                            <dd>{totals.sessions}</dd>
                        </div>
                    </dl>
                    <p className='devlog__note'>
                        Most of those tokens are Claude rereading my code. It wrote {formatCount(totals.tokens.output)} of them itself
                        {models.length > 0 && <>, mostly on {models[0].name}</>}.
                    </p>

                    {since && <UsageChart days={days} projects={projects} since={since} until={localDay(generatedAt)} />}

                    <ul className='devlog__projects' aria-label='By project'>
                        {byProject.map((row, i) => (
                            <li key={row.project}>
                                <span className={`devlog__swatch devlog-swatch--${i}`} aria-hidden />
                                <strong>{row.project}</strong>
                                <span>
                                    {formatHours(row.minutes)} · {formatCount(row.tokens)} tokens
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className='devlog__updated'>
                        Since {since ? formatDay(since) : 'the start'} · updated {formatDay(localDay(generatedAt))}
                    </p>
                </section>

                <section className='devlog__tile devlog__tile--github' aria-labelledby='devlog-github'>
                    <div className='devlog__head'>
                        <h3 id='devlog-github' className='devlog__eyebrow'>
                            On GitHub
                        </h3>
                        <a className='devlog__out' href={github.url} target='_blank' rel='noreferrer'>
                            {github.user}
                            <FiArrowUpRight aria-hidden />
                        </a>
                    </div>
                    <dl className='devlog__numbers'>
                        {github.contributions && (
                            <div>
                                <dt>Contributions this year</dt>
                                <dd>{github.contributions.total.toLocaleString()}</dd>
                            </div>
                        )}
                        <div>
                            <dt>Commits</dt>
                            <dd>{github.commits.toLocaleString()}</dd>
                        </div>
                        <div>
                            <dt>Lines written</dt>
                            <dd>{formatCount(github.additions)}</dd>
                        </div>
                    </dl>
                    <CodeFrequency weeks={codeWeeks(github.weeks)} />
                    <ul className='devlog__projects' aria-label='Commits by project'>
                        {github.projects.map((project) => (
                            <li key={project.name}>
                                <strong>{project.name}</strong>
                                <span>
                                    {project.commits.toLocaleString()} commits · +{formatCount(project.additions)} / −{formatCount(project.deletions)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className='devlog__tile devlog__tile--commits' aria-labelledby='devlog-commits'>
                    <h3 id='devlog-commits' className='devlog__eyebrow'>
                        Latest commits
                    </h3>
                    <ol className='devlog__commits'>
                        {commits.map((commit) => (
                            <li key={`${commit.project}-${commit.hash}`}>
                                {commit.url ? (
                                    <a href={commit.url} target='_blank' rel='noreferrer'>
                                        {commit.subject}
                                        <FiArrowUpRight aria-hidden />
                                    </a>
                                ) : (
                                    <span>{commit.subject}</span>
                                )}
                                <span className='devlog__commit-meta'>
                                    {commit.project} · {formatDay(commit.date)}
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>
        </BentoOverlay>
    );
};
