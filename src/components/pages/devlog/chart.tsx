import React, { useMemo, useState } from 'react';
import { DevlogDay, formatCount, formatDay, formatHours, localDay, tokenTotal } from '../../../common/devlog';

type Measure = 'minutes' | 'tokens';

// The most days the chart shows, counting back from the last update
const MAX_DAYS = 90;

const amount = (day: DevlogDay, measure: Measure) => (measure === 'minutes' ? day.minutes : tokenTotal(day.tokens));
const format = (value: number, measure: Measure) => (measure === 'minutes' ? formatHours(value) : formatCount(value));

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
 * Every day since the first session, one bar each, stacked by project. Hours or tokens, one at a
 * time; hovering or focusing a day names its numbers.
 */
export const UsageChart = ({ days, projects, since, until }: UsageChartProps) => {
    const [measure, setMeasure] = useState<Measure>('minutes');
    const [active, setActive] = useState<number | null>(null);

    const columns = useMemo(() => {
        const end = new Date(`${until}T00:00:00`);
        const start = new Date(Math.max(new Date(`${since}T00:00:00`).getTime(), end.getTime() - (MAX_DAYS - 1) * 86400000));
        const list: { date: string; days: DevlogDay[] }[] = [];
        for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const key = localDay(date);
            list.push({ date: key, days: days.filter((day) => day.date === key) });
        }
        return list;
    }, [days, since, until]);

    const peak = Math.max(1, ...columns.map((column) => column.days.reduce((sum, day) => sum + amount(day, measure), 0)));
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
                <span className='devlog-chart__peak'>Busiest day: {format(peak, measure)}</span>
            </div>

            <div className='devlog-chart__plot' onMouseLeave={() => setActive(null)}>
                <ol className='devlog-chart__columns' aria-label={measure === 'minutes' ? 'Hours each day' : 'Tokens each day'}>
                    {columns.map((column, i) => {
                        const total = column.days.reduce((sum, day) => sum + amount(day, measure), 0);
                        return (
                            <li
                                key={column.date}
                                className={active === i ? 'is-active' : undefined}
                                tabIndex={total ? 0 : -1}
                                aria-label={`${formatDay(column.date)}: ${total ? format(total, measure) : 'nothing'}`}
                                onMouseEnter={() => setActive(i)}
                                onFocus={() => setActive(i)}
                                onBlur={() => setActive(null)}
                            >
                                <span className='devlog-chart__stack' style={{ height: `${(total / peak) * 100}%` }}>
                                    {projects.map((project, p) => {
                                        const day = column.days.find((item) => item.project === project);
                                        const value = day ? amount(day, measure) : 0;
                                        return value ? <span key={project} className={`devlog-swatch--${p}`} style={{ flexGrow: value }} /> : null;
                                    })}
                                </span>
                            </li>
                        );
                    })}
                </ol>
                {shown && (
                    <div className='devlog-chart__tip' style={tipPosition((active! + 0.5) / columns.length)} aria-hidden>
                        <strong>{formatDay(shown.date)}</strong>
                        {shown.days.length ? (
                            shown.days.map((day) => (
                                <span key={day.project}>
                                    {day.project}: {formatHours(day.minutes)}, {formatCount(tokenTotal(day.tokens))} tokens
                                </span>
                            ))
                        ) : (
                            <span>Day off</span>
                        )}
                    </div>
                )}
            </div>

            <div className='devlog-chart__axis' aria-hidden>
                <span>{formatDay(columns[0].date)}</span>
                <span>{formatDay(columns[columns.length - 1].date)}</span>
            </div>
        </div>
    );
};
