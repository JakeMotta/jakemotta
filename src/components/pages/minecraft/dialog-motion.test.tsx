import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DetailDialog } from './detail-dialog';

const Example = () => {
    const [open, setOpen] = useState(true);
    return open ? <DetailDialog title='Example' onClose={() => setOpen(false)}><p>Modal content</p></DetailDialog> : <p>Closed</p>;
};
beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
    HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
});
beforeEach(() => { jest.useFakeTimers(); window.matchMedia = jest.fn().mockReturnValue({matches:false}); });
afterEach(() => { jest.runOnlyPendingTimers(); jest.useRealTimers(); });

test('closing retains the native modal for the exit animation before unmounting', () => {
    render(<Example />);
    fireEvent.click(screen.getByRole('button', {name:'Close example'}));
    expect(screen.getByRole('dialog', {name:'Example'})).toHaveAttribute('data-closing','true');
    act(() => { jest.advanceTimersByTime(179); });
    expect(screen.getByRole('dialog', {name:'Example'})).toHaveAttribute('open');
    act(() => { jest.advanceTimersByTime(1); });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
test('Escape uses the same animated close instead of immediately removing the modal', () => {
    render(<Example />);
    const event = new Event('cancel', {cancelable:true});
    fireEvent(screen.getByRole('dialog', {name:'Example'}), event);
    expect(event.defaultPrevented).toBe(true);
    expect(screen.getByRole('dialog', {name:'Example'})).toHaveAttribute('open');
    act(() => { jest.advanceTimersByTime(180); });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
test('reduced motion closes immediately', () => {
    window.matchMedia = jest.fn().mockReturnValue({matches:true});
    render(<Example />);
    fireEvent.click(screen.getByRole('button', {name:'Close example'}));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
