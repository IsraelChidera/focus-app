import React, { forwardRef } from 'react';
import Spinner from '../Spinner';

const VARIANTS = {
  primary: 'bg-brand text-brand-ink hover:bg-brand-strong shadow-sm',
  secondary: 'bg-surface text-ink border border-line hover:bg-subtle shadow-sm',
  ghost: 'text-muted hover:bg-subtle hover:text-ink',
  danger: 'bg-danger text-white hover:bg-danger/90 shadow-sm',
  'danger-ghost': 'text-danger hover:bg-danger-soft',
};

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'h-9 w-9 justify-center',
};

/** Button styling, also used to make router <Link>s look like buttons. */
export const buttonClass = ({ variant = 'primary', size = 'md', className = '' } = {}) =>
  `inline-flex shrink-0 items-center justify-center rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

const Button = forwardRef(function Button(
  { children, className = '', variant = 'primary', size = 'md', loading = false, disabled, type = 'button', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      // Default to "button" so buttons inside forms never submit by accident.
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass({ variant, size, className })}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
});

export default Button;
