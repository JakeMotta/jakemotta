import React from 'react';
import { useAudioStore } from '../../../store/audio';
import Lottie from 'lottie-react';
import { MdPlaylistAdd } from 'react-icons/md';
import * as VolumeLottie from "../../../assets/lottie/volume.json"

export interface MusicItemProps {
    image: string;
    title: string;
    date: string;
    description: string;
    url: string;
}

export interface MusicTileProps {
    item: MusicItemProps;
    onClick: () => void;
}

export const MusicTile = ({ item, onClick }: MusicTileProps) => {
    const audioUrl = useAudioStore((store) => store.audioUrl);
    const queuePosition = useAudioStore((store) => store.queue.indexOf(item.url)) + 1;
    const toggleQueued = useAudioStore((store) => store.toggleQueued);

    return (
        <div
            className='flex flex-col cursor-pointer rounded-lg py-2 hover:bg-primary-dark group'
            key={item.title}
            onClick={onClick}>
            <div className='flex flex-row items-center px-2'>
                <div className='flex w-[50px] h-[50px]'>
                    <img src={item.image} className='w-full h-full object-cover rounded-lg' />
                    {
                        audioUrl === item.url && (
                            <Lottie animationData={VolumeLottie} loop={true} className='flex' />
                        )
                    }
                </div>
                <div className='flex flex-col ml-2'>
                    <div className='flex text-primary-dark text-lg font-bold group-hover:text-primary'>
                        {item.title}
                    </div>
                    <div className='flex text-primary-dark text-sm font-bold group-hover:text-primary'>
                        {item.date}
                    </div>
                </div>

                {/* Queue toggle: plays after the current track instead of interrupting it */}
                <button
                    type='button'
                    className={`flex items-center justify-center ml-auto shrink-0 w-9 h-9 rounded-full font-bold text-primary-dark group-hover:text-primary hover:bg-black/20 focus-visible:opacity-100 transition-opacity ${queuePosition ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}
                    title={queuePosition ? `Queued #${queuePosition}. Click to remove` : 'Add to queue'}
                    aria-label={queuePosition ? `Remove ${item.title} from the queue` : `Add ${item.title} to the queue`}
                    onClick={(event) => {
                        event.stopPropagation();
                        toggleQueued(item.url);
                    }}>
                    {queuePosition ? queuePosition : <MdPlaylistAdd className='text-2xl' />}
                </button>
            </div>
        </div>
    );
}
