import React from 'react';

/**
 * The Envelo logo (public/envelo.png). In dark mode the browser swaps in
 * public/envelo-dark.png, the same artwork with a cream wordmark so it stays legible.
 * Size it with a height class (default h-8); the width follows the aspect ratio.
 */
const Logo = ({ className = 'h-8' }) => (
  <picture className="inline-flex shrink-0">
    <source srcSet="/envelo-dark.png" media="(prefers-color-scheme: dark)" />
    <img src="/envelo.png" alt="Envelo" width="1200" height="336" className={`w-auto ${className}`} />
  </picture>
);

export default Logo;
