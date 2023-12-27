import { RefObject, createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

type ToastContextType = RefObject<Toast> | null;

const ToastContext = createContext<ToastContextType>(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toastRef = useRef(null);

  return (
    <ToastContext.Provider value={toastRef}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  );
};
