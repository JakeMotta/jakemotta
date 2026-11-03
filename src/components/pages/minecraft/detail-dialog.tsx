import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

export const DetailDialog = ({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) => {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const opener = document.activeElement as HTMLElement | null;
        const dialog = ref.current;
        dialog?.showModal();
        return () => { dialog?.close(); opener?.focus({ preventScroll: true }); };
    }, []);
    return <dialog ref={ref} className='modpack-changelog modpack-detail' aria-labelledby='modpack-detail-title' onClose={onClose} onClick={event => { if (event.target === event.currentTarget) ref.current?.close(); }}>
        <div className='modpack-changelog__content'>
            <header className='modpack-changelog__header'>
                <h3 id='modpack-detail-title'>{title}</h3>
                <button type='button' onClick={() => ref.current?.close()} aria-label={`Close ${title.toLowerCase()}`} autoFocus><FiX /></button>
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
