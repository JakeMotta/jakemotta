import React, { createContext, useContext, useState } from 'react';
import { ConfirmDialog, confirmDialog, ConfirmDialogProps } from 'primereact/confirmdialog';
import { Dialog, DialogProps } from 'primereact/dialog';

interface ExtendedDialogProps extends DialogProps {
  content: React.ReactNode;
}

// Creating a combined context
const OverlayContext = createContext({
  // eslint-disable-next-line
  showConfirmDialog: (options: ConfirmDialogProps) => {},
  // eslint-disable-next-line
  showDialog: (options: ExtendedDialogProps) => {},
});

export const useOverlay = () => useContext(OverlayContext);

export const OverlayProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialogProps, setDialogProps] = useState<ExtendedDialogProps | null>(null);

  const showConfirmDialog = (options: ConfirmDialogProps) => {
    confirmDialog(options);
  };

  const showDialog = (options: ExtendedDialogProps) => {
    setDialogProps({ ...options, visible: true });
  };

  const onHide = () => {
    setDialogProps(null);
  };

  return (
    <OverlayContext.Provider value={{ showConfirmDialog, showDialog }}>
      <ConfirmDialog />
      {dialogProps && (
        <Dialog {...dialogProps} onHide={onHide}>
          {dialogProps.content}
        </Dialog>
      )}
      {children}
    </OverlayContext.Provider>
  );
};
