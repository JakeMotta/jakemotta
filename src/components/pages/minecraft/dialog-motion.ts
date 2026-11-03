import { useEffect, useRef, useState } from 'react';

/** Keep the native modal/focus trap open until its exit animation finishes. */
export const useDialogMotion = (open: boolean, onClose: () => void) => {
    const dialog = useRef<HTMLDialogElement>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pending = useRef(false);
    const [closing, setClosing] = useState(false);
    useEffect(() => {
        if (open && !dialog.current?.open) {
            pending.current = false;
            setClosing(false);
            dialog.current?.showModal();
        } else if (!open && dialog.current?.open) dialog.current.close();
    }, [open]);
    useEffect(() => {
        const node = dialog.current;
        return () => {
            if (timer.current) clearTimeout(timer.current);
            if (node?.open) node.close();
        };
    }, []);
    const close = () => {
        if (!dialog.current?.open || pending.current) return;
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            dialog.current.close();
            return;
        }
        pending.current = true;
        setClosing(true);
        timer.current = setTimeout(() => dialog.current?.close(), 180);
    };
    const closed = () => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        pending.current = false;
        setClosing(false);
        onClose();
    };
    const cancel = (event: { preventDefault: () => void }) => { event.preventDefault(); close(); };
    return { dialog, closing, close, closed, cancel };
};
