import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';

const TONES = {
  error: { box: 'bg-danger-soft text-danger border-danger/20', Icon: FiAlertCircle },
  success: { box: 'bg-success-soft text-success border-success/20', Icon: FiCheckCircle },
};

const Alert = ({ tone = 'error', children, onDismiss, className = '' }) => {
  if (!children) return null;
  const { box, Icon } = TONES[tone];

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-lg border px-3.5 py-3 text-sm animate-fade-in ${box} ${className}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex-1 font-medium">{children}</div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="rounded p-0.5 opacity-70 hover:opacity-100" aria-label="Dismiss">
          <FiX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
