import React, { ReactNode, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { useDialogMotion } from './dialog-motion';

export const DetailDialog = ({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) => {
    const motion = useDialogMotion(true, onClose);
    return <dialog ref={motion.dialog} className='modpack-changelog modpack-detail' data-closing={motion.closing || undefined} aria-labelledby='modpack-detail-title' onClose={motion.closed} onCancel={motion.cancel} onClick={event => { if (event.target === event.currentTarget) motion.close(); }}>
        <div className='modpack-changelog__content'>
            <header className='modpack-changelog__header'>
                <h3 id='modpack-detail-title'>{title}</h3>
                <button type='button' onClick={motion.close} aria-label={`Close ${title.toLowerCase()}`} autoFocus><FiX /></button>
            </header>
            <div className='modpack-detail__body'>{children}</div>
        </div>
    </dialog>;
};

export const PageControls = ({ index, count, onChange, label = 'Page' }: { index: number; count: number; onChange: (index: number) => void; label?: string }) => <nav className='modpack-pager' aria-label={`${label} navigation`}>
    <button type='button' disabled={index === 0} onClick={() => onChange(index - 1)}><FiChevronLeft aria-hidden /> Back</button>
    <span aria-live='polite'>{label} {index + 1} of {count}</span>
    <button type='button' disabled={index >= count - 1} onClick={() => onChange(index + 1)}>Next <FiChevronRight aria-hidden /></button>
</nav>;

export const StepReader = ({ pages }: { pages: { title: string; body: ReactNode }[] }) => {
    const [index, setIndex] = useState(0);
    return <div className='modpack-reader'>
        <section className='modpack-reader__page' aria-live='polite' aria-atomic='true'>
            <p className='modpack__eyebrow'>Step {index + 1} of {pages.length}</p>
            <h4>{pages[index].title}</h4>
            {pages[index].body}
        </section>
        <PageControls index={index} count={pages.length} onChange={setIndex} label='Step' />
    </div>;
};
