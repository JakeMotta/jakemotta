import React, { useMemo, useState } from 'react';
import { DevlogDay, formatCount, formatDay, formatHours, localDay, tokenTotal } from '../../../common/devlog';

type Measure = 'minutes' | 'tokens';
type Span = 'day' | 'week' | 'month';

const SPANS: { key: Span; label: string }[] = [
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
];

// The most days the chart shows, counting back from the last update
const MAX_DAYS = 90;

// A bar: one day, one week (Monday on) or one month, with each project's work in it added up
interface Column {
    key: string;
    label: string;
    entries: { project: string; minutes: number; tokens: number }[];
}

const amount = (entry: Column['entries'][number], measure: Measure) => (measure === 'minutes' ? entry.minutes : entry.tokens);
const format = (value: number, measure: Measure) => (measure === 'minutes' ? formatHours(value) : formatCount(value));

// The bar a day falls in, and what to call it
const bucket = (date: Date, span: Span) => {
    if (span === 'day') return { key: localDay(date), label: formatDay(localDay(date)) };
    if (span === 'month') return { key: localDay(date).slice(0, 7), label: date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) };
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return { key: localDay(monday), label: `Week of ${formatDay(localDay(monday))}` };
};

// Over the day, but kept inside the tile at either end
const tipPosition = (at: number) => ({ left: `${at * 100}%`, transform: `translateX(${at < 0.25 ? -at * 200 : at > 0.75 ? -100 + (1 - at) * 200 : -50}%)` });

interface UsageChartProps {
    days: DevlogDay[];
    // In the order their colours are given out, which never changes as the numbers do
    projects: string[];
    since: string;
    until: string;
}

/**
 * Every day since the first session, stacked by project, one bar a day, a week or a month. Hours or
 * tokens, one at a time; hovering or focusing a bar names its numbers.
 */
export const UsageChart = ({ days, projects, since, until }: UsageChartProps) => {
    const [measure, setMeasure] = useState<Measure>('minutes');
    const [span, setSpan] = useState<Span>('day');
    const [active, setActive] = useState<number | null>(null);

    const columns = useMemo(() => {
        const end = new Date(`${until}T00:00:00`);
        const start = new Date(Math.max(new Date(`${since}T00:00:00`).getTime(), end.getTime() - (MAX_DAYS - 1) * 86400000));
        const list: Column[] = [];
        for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const { key, label } = bucket(date, span);
            let column = list[list.length - 1];
            if (column?.key !== key) list.push((column = { key, label, entries: [] }));
            days.filter((day) => day.date === localDay(date)).forEach((day) => {
                let entry = column.entries.find((item) => item.project === day.project);
                if (!entry) column.entries.push((entry = { project: day.project, minutes: 0, tokens: 0 }));
                entry.minutes += day.minutes;
                entry.tokens += tokenTotal(day.tokens);
            });
        }
        return list;
    }, [days, since, until, span]);

    const total = (column: Column) => column.entries.reduce((sum, entry) => sum + amount(entry, measure), 0);
    const peak = Math.max(1, ...columns.map(total));
    const shown = active === null ? null : columns[active];

    return (
        <div className='devlog-chart'>
            <div className='devlog-chart__bar'>
                <div className='devlog-chart__toggle' role='group' aria-label='Show'>
                    {(['minutes', 'tokens'] as Measure[]).map((option) => (
                        <button key={option} type='button' aria-pressed={measure === option} onClick={() => setMeasure(option)}>
                            {option === 'minutes' ? 'Hours' : 'Tokens'}
                        </button>
                    ))}
                </div>
                <div className='devlog-chart__toggle' role='group' aria-label='Each bar is a'>
                    {SPANS.map(({ key, label }) => (
                        <button
                            key={key}
                            type='button'
                            aria-pressed={span === key}
                            onClick={() => {
                                setSpan(key);
                                setActive(null);
                            }}>
                            {label}
                        </button>
                    ))}
                </div>
                <span className='devlog-chart__peak'>
                    Busiest {span}: {format(peak, measure)}
                </span>
            </div>

            <div className='devlog-chart__plot' onMouseLeave={() => setActive(null)}>
                <ol className={`devlog-chart__columns devlog-chart__columns--${span}`} aria-label={`${measure === 'minutes' ? 'Hours' : 'Tokens'} each ${span}`}>
                    {columns.map((column, i) => {
                        const sum = total(column);
                        return (
                            <li
                                key={column.key}
                                className={active === i ? 'is-active' : undefined}
                                tabIndex={sum ? 0 : -1}
                                aria-label={`${column.label}: ${sum ? format(sum, measure) : 'nothing'}`}
                                onMouseEnter={() => setActive(i)}
                                onFocus={() => setActive(i)}
                                onBlur={() => setActive(null)}>
                                <span className='devlog-chart__stack' style={{ height: `${(sum / peak) * 100}%` }}>
                                    {projects.map((project, p) => {
                                        const entry = column.entries.find((item) => item.project === project);
                                        const value = entry ? amount(entry, measure) : 0;
                                        return value ? <span key={project} className={`devlog-swatch--${p}`} style={{ flexGrow: value }} /> : null;
                                    })}
                                </span>
                            </li>
                        );
                    })}
                </ol>
                {shown && (
                    <div className='devlog-chart__tip' style={tipPosition((active! + 0.5) / columns.length)} aria-hidden>
                        <strong>{shown.label}</strong>
                        {shown.entries.length ? (
                            shown.entries.map((entry) => (
                                <span key={entry.project}>
                                    {entry.project}: {formatHours(entry.minutes)}, {formatCount(entry.tokens)} tokens
                                </span>
                            ))
                        ) : (
                            <span>Time off</span>
                        )}
                    </div>
                )}
            </div>

            <div className='devlog-chart__axis' aria-hidden>
                <span>{columns[0].label.replace(/^Week of /, '')}</span>
                <span>{columns[columns.length - 1].label.replace(/^Week of /, '')}</span>
            </div>
        </div>
    );
};
