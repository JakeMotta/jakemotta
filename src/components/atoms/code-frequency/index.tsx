import React, { useState } from 'react';
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
