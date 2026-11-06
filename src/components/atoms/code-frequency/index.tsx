import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DevlogWeek, formatCount, formatDay } from '../../../common/devlog';
import './index.scss';

interface CodeFrequencyProps {
    weeks: DevlogWeek[];
    // The board's small one: just the shape, with no dates or hover numbers
    compact?: boolean;
    className?: string;
}

// Over the week, but kept inside the chart at either end
const tipPosition = (at: number) => ({ left: `${at * 100}%`, transform: `translateX(${at < 0.25 ? -at * 200 : at > 0.75 ? -100 + (1 - at) * 200 : -50}%)` });

// The axis can span a new year, so its ends name the year too
const formatMonth = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

const weekSummary = (week: DevlogWeek) =>
    week.commits ? `${week.commits} commit${week.commits === 1 ? '' : 's'}, ${formatCount(week.additions)} lines added, ${formatCount(week.deletions)} removed` : 'No commits';

// The same drawing as the full chart's bars (2px gaps, a 1px line under what was added, 3px rounded ends,
// bars at least 2px), as an SVG for a mask, at the plot's size in pixels so the corners stay round
const maskFor = (weeks: DevlogWeek[], peakUp: number, peakDown: number, width: number, height: number) => {
    const gap = 2;
    const bar = (width - gap * (weeks.length - 1)) / weeks.length;
    const line = (((height - 1) * peakUp) / (peakUp + peakDown)).toFixed(2);
    const upRoom = Number(line);
    const downRoom = height - 1 - upRoom;
    const r = Math.min(3, bar / 2).toFixed(2);
    const up: string[] = [];
    const rule: string[] = [];
    const down: string[] = [];
    weeks.forEach((week, i) => {
        const x = (i * (bar + gap)).toFixed(2);
        const w = bar.toFixed(2);
        rule.push(`<rect x="${x}" y="${line}" width="${w}" height="1"/>`);
        if (week.additions > 0) {
            const h = Math.min(upRoom, Math.max(2, (upRoom * week.additions) / peakUp));
            // Taller by the radius, so only the top corners show above the line
            up.push(`<rect x="${x}" y="${(upRoom - h).toFixed(2)}" width="${w}" height="${(h + 3).toFixed(2)}" rx="${r}"/>`);
        }
        if (week.deletions > 0) {
            const h = Math.min(downRoom, Math.max(2, (downRoom * week.deletions) / peakDown));
            down.push(`<rect x="${x}" y="${(upRoom + 1 - 3).toFixed(2)}" width="${w}" height="${(h + 3).toFixed(2)}" rx="${r}"/>`);
        }
    });
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
        `<clipPath id="u"><rect width="${width}" height="${line}"/></clipPath>` +
        `<clipPath id="d"><rect y="${(upRoom + 1).toFixed(2)}" width="${width}" height="${height}"/></clipPath>` +
        `<g fill="#fff" clip-path="url(#u)">${up.join('')}</g>` +
        `<g fill="#fff" fill-opacity=".4">${rule.join('')}</g>` +
        `<g fill="#fff" fill-opacity=".45" clip-path="url(#d)">${down.join('')}</g>` +
        `</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/**
 * The board's small chart: one element in the text colour, cut to the bars' shape by a mask. The full
 * chart is about 150 elements, and every element on the board is restyled each time the hue moves
 * (docs/performance.md), so this one is drawn once for its size instead.
 */
const CompactPlot = ({ weeks, peakUp, peakDown }: { weeks: DevlogWeek[]; peakUp: number; peakDown: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<{ width: number; height: number }>();

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new ResizeObserver(([entry]) => {
            const width = Math.round(entry.contentRect.width);
            const height = Math.round(entry.contentRect.height);
            setSize((old) => (old?.width === width && old?.height === height ? old : { width, height }));
        });
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    const mask = useMemo(() => (size && size.width > 0 && size.height > 0 ? maskFor(weeks, peakUp, peakDown, size.width, size.height) : undefined), [weeks, peakUp, peakDown, size]);

    return <div ref={ref} className='code-frequency__plot code-frequency__mask' style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined} aria-hidden />;
};

/**
 * Lines added and removed each week, like GitHub's code frequency graph: what was added rises from
 * the line and what was removed hangs under it, both to the same scale. Colours come from the text
 * colour, so it fits any surface.
 */
export const CodeFrequency = ({ weeks, compact, className }: CodeFrequencyProps) => {
    const [active, setActive] = useState<number | null>(null);
    const peakUp = Math.max(1, ...weeks.map((week) => week.additions));
    const peakDown = Math.max(1, ...weeks.map((week) => week.deletions));
    const shown = active === null ? null : weeks[active];

    if (!weeks.length) return null;

    if (compact)
        return (
            <div className={`code-frequency code-frequency--compact${className ? ` ${className}` : ''}`}>
                <CompactPlot weeks={weeks} peakUp={peakUp} peakDown={peakDown} />
            </div>
        );

    return (
        <div className={`code-frequency${compact ? ' code-frequency--compact' : ''}${className ? ` ${className}` : ''}`}>
            {!compact && (
                <div className='code-frequency__legend' aria-hidden>
                    <span>
                        <i className='code-frequency__key' /> Added
                    </span>
                    <span>
                        <i className='code-frequency__key code-frequency__key--down' /> Removed
                    </span>
                </div>
            )}
            <div className='code-frequency__plot' onMouseLeave={() => setActive(null)}>
                <ol className='code-frequency__weeks' aria-label={compact ? undefined : 'Lines added and removed each week'} aria-hidden={compact || undefined}>
                    {weeks.map((week, i) => (
                        <li
                            key={week.week}
                            className={active === i ? 'is-active' : undefined}
                            tabIndex={compact || !week.commits ? undefined : 0}
                            aria-label={compact ? undefined : `Week of ${formatDay(week.week)}: ${weekSummary(week)}`}
                            onMouseEnter={compact ? undefined : () => setActive(i)}
                            onFocus={compact ? undefined : () => setActive(i)}
                            onBlur={compact ? undefined : () => setActive(null)}>
                            <span className='code-frequency__up' style={{ flexGrow: peakUp }}>
                                {week.additions > 0 && <span style={{ height: `${(week.additions / peakUp) * 100}%` }} />}
                            </span>
                            <span className='code-frequency__down' style={{ flexGrow: peakDown }}>
                                {week.deletions > 0 && <span style={{ height: `${(week.deletions / peakDown) * 100}%` }} />}
                            </span>
                        </li>
                    ))}
                </ol>
                {shown && (
                    <div className='code-frequency__tip' style={tipPosition((active! + 0.5) / weeks.length)} aria-hidden>
                        <strong>Week of {formatDay(shown.week)}</strong>
                        {shown.commits ? (
                            <>
                                <span>
                                    {shown.commits} commit{shown.commits === 1 ? '' : 's'}
                                </span>
                                <span>
                                    +{formatCount(shown.additions)} / −{formatCount(shown.deletions)} lines
                                </span>
                            </>
                        ) : (
                            <span>Time off</span>
                        )}
                    </div>
                )}
            </div>
            {!compact && (
                <div className='code-frequency__axis' aria-hidden>
                    <span>{formatMonth(weeks[0].week)}</span>
                    <span>{formatMonth(weeks[weeks.length - 1].week)}</span>
                </div>
            )}
        </div>
    );
};
