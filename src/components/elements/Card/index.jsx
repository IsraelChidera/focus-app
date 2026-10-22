import React, { forwardRef } from 'react';

const Card = forwardRef(function Card({ children, className = '', as: Component = 'div', ...rest }, ref) {
  return (
    <Component ref={ref} className={`rounded-2xl border border-line bg-surface shadow-card ${className}`} {...rest}>
      {children}
    </Component>
  );
});

export default Card;
