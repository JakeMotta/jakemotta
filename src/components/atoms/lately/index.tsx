import React, { useEffect, useState } from 'react';
import { TopKind, TopRange } from '../../../api/listenbrainz';
import { LISTENBRAINZ_USER, listenedAgo } from '../../../common/listening';
import { listenUrl, songUrl, streamedTrack } from '../../../common/music';
import { useAudioStore } from '../../../store/audio';
import { useListenAlongStore } from '../../../store/listen-along';
import { topKey, useListeningStore, useLiveListening } from '../../../store/listening';
import { ListenRow } from '../listen-row';
import './index.scss';

type View = 'recent' | TopKind;

type PlayProps = { current?: boolean; playing?: boolean; onPlay?: () => void };

const views: { key: View; label: string }[] = [
    { key: 'recent', label: 'Recent' },
    { key: 'recordings', label: 'Songs' },
    { key: 'release-groups', label: 'Albums' },
    { key: 'artists', label: 'Artists' },
];

const ranges: { key: TopRange; label: string }[] = [
    { key: 'this_month', label: 'This month' },
    { key: 'this_year', label: 'This year' },
    { key: 'all_time', label: 'All time' },
];

/**
 * What Jake has been listening to: his latest plays, and his top songs, albums and artists over a
 * range. Everything comes from ListenBrainz (see docs/listening.md) and links out.
 */
export const Lately = ({ pageSize = 8, className = '' }: { pageSize?: number; className?: string }) => {
    useLiveListening();
    const [view, setView] = useState<View>('recent');
    const [range, setRange] = useState<TopRange>('this_month');
    const [pickedRange, setPickedRange] = useState(false);
    const [shown, setShown] = useState(pageSize);
    const recent = useListeningStore((store) => store.recent);
    const loaded = useListeningStore((store) => store.loaded);
    const top = useListeningStore((store) => (view === 'recent' ? undefined : store.top[topKey(view, range)]));
    const loadTop = useListeningStore((store) => store.loadTop);
    const worker = useListenAlongStore((store) => !!store.available);
    const probe = useListenAlongStore((store) => store.probe);
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const isPlaying = useAudioStore((store) => store.isPlaying);
    const { playTrack, togglePlayback } = useAudioStore.getState();

    useEffect(() => {
        probe();
    }, [probe]);

    // The props that put a play button on a row, for a song that can play here
    const play = (url: string | undefined, title: string, artist: string | undefined, cover: string | undefined): PlayProps => {
        if (!url) return {};
        const track = streamedTrack(url, title, artist, cover);
        const current = url === audioUrl;
        return { current, playing: isPlaying, onPlay: () => (current ? togglePlayback() : playTrack(track)) };
    };

    useEffect(() => {
        if (view !== 'recent') loadTop(view, range);
    }, [view, range, loadTop]);

    useEffect(() => setShown(pageSize), [view, range, pageSize]);

    // ListenBrainz counts the current month and year now and then, so they're often not ready. Until
    // the visitor picks a range, step on to the next one that is.
    useEffect(() => {
        const next = ranges.findIndex(({ key }) => key === range) + 1;
        if (top === null && !pickedRange && next < ranges.length) setRange(ranges[next].key);
    }, [top, range, pickedRange]);

    if (!LISTENBRAINZ_USER) return null;

    const rows =
        view === 'recent'
            ? recent.map((listen, i) => (
                  <ListenRow
                      key={`${listen.listenedAt}-${i}`}
                      title={listen.title}
                      subtitle={listen.artist}
                      meta={listen.listenedAt ? listenedAgo(listen.listenedAt) : undefined}
                      cover={listen.cover}
                      spotifyUrl={listen.spotifyUrl}
                      source={listen.source}
                      href={listen.link}
                      {...play(listenUrl(listen, worker), listen.title, listen.artist, listen.cover)}
                  />
              ))
            : (top ?? []).map((item, i) => (
                  <ListenRow
                      key={`${item.title}-${i}`}
                      rank={i + 1}
                      title={item.title}
                      subtitle={item.subtitle}
                      meta={`${item.count} plays`}
                      cover={item.cover}
                      {...play(view === 'recordings' && worker && item.subtitle ? songUrl(item.subtitle, item.title) : undefined, item.title, item.subtitle, item.cover)}
                  />
              ));

    let empty: string | undefined;
    if (view === 'recent') empty = !loaded ? 'Tuning in…' : rows.length === 0 ? 'No plays yet. Give it a minute.' : undefined;
    else if (top === undefined) empty = 'Counting…';
    else if (top === null) empty = "These numbers aren't ready yet. Try another range.";
    else if (rows.length === 0) empty = 'Nothing here yet.';

    return (
        <section className={`lately ${className}`} aria-label='What Jake has been listening to'>
            <div className='lately__pills' role='group' aria-label='Show'>
                {views.map(({ key, label }) => (
                    <button key={key} type='button' className='lately__pill' aria-pressed={view === key} onClick={() => setView(key)}>
                        {label}
                    </button>
                ))}
            </div>
            {view !== 'recent' && (
                <div className='lately__pills lately__pills--small' role='group' aria-label='Over'>
                    {ranges.map(({ key, label }) => (
                        <button
                            key={key}
                            type='button'
                            className='lately__pill'
                            aria-pressed={range === key}
                            onClick={() => {
                                setPickedRange(true);
                                setRange(key);
                            }}>
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {empty ? <p className='lately__empty'>{empty}</p> : <div className='lately__rows'>{rows.slice(0, shown)}</div>}

            {!empty && rows.length > shown && (
                <button type='button' className='lately__more' onClick={() => setShown(shown + pageSize)}>
                    Show more
                </button>
            )}
        </section>
    );
};
