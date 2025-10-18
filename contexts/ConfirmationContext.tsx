import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/ui/Button';

type ConfirmationOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'danger' | 'ghost';
};

type ConfirmationContextType = (options: ConfirmationOptions) => Promise<boolean>;

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const ConfirmationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => {});

  const confirm = useCallback((options: ConfirmationOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions(options);
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleClose = (value: boolean) => {
    resolvePromise(value);
    setOptions(null);
  };

  const ConfirmationModal: React.FC = () => {
    if (!options) return null;

    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
        <div className="bg-[#161B22] p-8 rounded-xl border border-gray-800 w-full max-w-md relative flex flex-col items-center text-center">
            <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${options.confirmVariant === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{options.title}</h2>
            <p className="text-sm text-gray-400 mb-8">{options.message}</p>
            <div className="flex justify-center gap-4 w-full">
                <Button onClick={() => handleClose(false)} variant="secondary" className="flex-1">
                {options.cancelText || 'Cancel'}
                </Button>
                <Button onClick={() => handleClose(true)} variant={options.confirmVariant || 'primary'} className="flex-1">
                {options.confirmText || 'Confirm'}
                </Button>
            </div>
        </div>
      </div>
    );
  };

  return (
    <ConfirmationContext.Provider value={confirm}>
      {children}
      <ConfirmationModal />
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (context === undefined) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};
