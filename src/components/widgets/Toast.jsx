import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

const DURATION_MS = 4000;

const TONES = {
  success: { Icon: FiCheckCircle, iconClass: 'text-success' },
  error: { Icon: FiAlertCircle, iconClass: 'text-danger' },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message, tone = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      // Keep at most three on screen.
      setToasts((list) => [...list.slice(-2), { id, message, tone }]);
      timers.current.set(id, setTimeout(() => dismiss(id), DURATION_MS));
    },
    [dismiss]
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const api = useMemo(
    () => ({
      success: (message) => show(message, 'success'),
      error: (message) => show(message, 'error'),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      >
        {toasts.map(({ id, message, tone }) => {
          const { Icon, iconClass } = TONES[tone];
          return (
            <div
              key={id}
              role={tone === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink shadow-lift animate-slide-up"
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`} aria-hidden="true" />
              <p className="flex-1 font-medium">{message}</p>
              <button
                type="button"
                onClick={() => dismiss(id)}
                className="rounded p-0.5 text-muted hover:text-ink"
                aria-label="Dismiss notification"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
};
