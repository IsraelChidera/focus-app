import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from '../Button';

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef(null);
  // Kept in refs so the effect below runs once per open, not on every parent render.
  const onCancelRef = useRef(onCancel);
  const loadingRef = useRef(loading);
  onCancelRef.current = onCancel;
  loadingRef.current = loading;

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    // Focus the safe option first so Enter never confirms a destructive action by accident.
    cancelRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !loadingRef.current) onCancelRef.current();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={loading ? undefined : onCancel} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className="relative w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-lift animate-slide-up"
      >
        <h2 id="confirm-title" className="text-base font-semibold text-ink">
          {title}
        </h2>
        <p id="confirm-description" className="mt-2 text-sm text-muted">
          {description}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
