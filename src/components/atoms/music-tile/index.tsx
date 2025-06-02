import React from 'react';
import { useAudioStore } from '../../../store/audio';
import Lottie from 'lottie-react';
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
                        {item.date} - {item.description}
                    </div>
                </div>
            </div>
        </div>
    );
}