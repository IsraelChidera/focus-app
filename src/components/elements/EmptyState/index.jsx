import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => (
  <div className={`flex flex-col items-center px-6 py-14 text-center ${className}`}>
    {Icon && (
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
    )}
    <h3 className="text-base font-semibold text-ink">{title}</h3>
    {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
