import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import './index.scss';

interface ProjectCardProps {
    image: string;
    title: string;
    date: string;
    description: string;
    onClick: () => void;
}

export const ProjectCard = ({ image, title, date, description, onClick }: ProjectCardProps) => {
    const { primaryColor } = useTheme();

    return (
        <div className="flex flex-col w-full h-min-[200px] h-max-[200px] bg-primary-dark rounded-lg p-4" onClick={onClick}>
            <div className="flex flex-col w-full aspect-video bg-red-500 rounded-lg">
                <img src={image} className='w-full h-full object-cover rounded-lg' />
            </div>

            <div className="flex text-primary font-bold text-2xl">
                {title}
            </div>

            <div className="flex text-primary text-sm">
                {date}
            </div>

            <div className="flex text-primary text-md">
                {description}
            </div>
        </div>
    );
}