import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 w-full max-w-sm">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;