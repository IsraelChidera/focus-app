import React, { useState } from 'react';
import { useField } from 'formik';
import { FiEye, FiEyeOff } from 'react-icons/fi';

/** Labelled Formik input with inline validation and an optional show/hide toggle for passwords. */
const TextField = ({ label, hint, type = 'text', className = '', ...props }) => {
  const [field, meta] = useField(props);
  const [revealed, setRevealed] = useState(false);
  const id = props.id || props.name;
  const hasError = Boolean(meta.touched && meta.error);
  const isPassword = type === 'password';
  const describedBy = hasError ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          {...field}
          {...props}
          id={id}
          type={isPassword && revealed ? 'text' : type}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          className={`field ${isPassword ? 'pr-11' : ''} ${hasError ? 'field-error' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted hover:text-ink"
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
          >
            {revealed ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {hasError ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger">
          {meta.error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
};

export default TextField;
