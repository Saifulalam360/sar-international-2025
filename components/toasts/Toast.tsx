import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Toast as ToastType } from '../../contexts/ToastContext';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: number) => void;
}

const TOAST_CONFIG = {
  success: {
    icon: faCheckCircle,
    barClass: 'bg-green-500',
    iconClass: 'text-green-500',
  },
  error: {
    icon: faTimesCircle,
    barClass: 'bg-red-500',
    iconClass: 'text-red-500',
  },
  info: {
    icon: faInfoCircle,
    barClass: 'bg-blue-500',
    iconClass: 'text-blue-500',
  },
};

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [exiting, setExiting] = useState(false);
  const config = TOAST_CONFIG[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300); // Wait for animation
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const handleRemove = () => {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`relative w-full max-w-sm bg-[#161B22] border border-gray-700 rounded-lg shadow-2xl p-4 overflow-hidden flex items-start gap-4 transition-all duration-300 ease-in-out ${exiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`flex-shrink-0 mt-0.5 ${config.iconClass}`}>
        <FontAwesomeIcon icon={config.icon} size="lg" />
      </div>
      <div className="flex-1 text-sm text-gray-200">{toast.message}</div>
      <button
        onClick={handleRemove}
        className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
        aria-label="Close"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <div className="absolute bottom-0 left-0 h-1 bg-gray-700/50 w-full">
        <div
          className={`${config.barClass} h-full`}
          style={{ animation: `shrink ${toast.duration}ms linear forwards` }}
        />
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;