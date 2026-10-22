import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiZap } from 'react-icons/fi';
import Logo from '../elements/Logo';
import heroImage from '../assets/bg-login.jpg';

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    <div className="flex flex-col px-6 py-8 sm:px-10">
      <Link to="/" aria-label="Envelo home" className="self-start">
        <Logo />
      </Link>

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 text-center text-sm text-muted">{footer}</div>}
      </div>

      <p className="text-center text-xs text-muted">© {new Date().getFullYear()} Envelo</p>
    </div>

    <div className="relative hidden overflow-hidden lg:block">
      {/* A background (not <img>) so phones, where this panel is hidden, never download it. */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-12 text-white">
        <p className="max-w-md text-3xl font-semibold leading-tight tracking-tight">Know before you spend.</p>
        <ul className="mt-6 max-w-md space-y-3 text-sm text-white/85">
          <li className="flex gap-3">
            <FiZap className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            Describe your month in plain words — Envelo AI builds your envelopes.
          </li>
          <li className="flex gap-3">
            <FiShield className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            Ask “can I afford this?” and get an honest answer from your own budget.
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default AuthLayout;
