import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiList, FiZap } from 'react-icons/fi';
import Logo from '../elements/Logo';

const NAV_ITEMS = [
  { to: '/home', label: 'Dashboard', Icon: FiGrid },
  { to: '/notes', label: 'Budgets', Icon: FiList },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-soft text-brand-strong' : 'text-muted hover:bg-subtle hover:text-ink'
  }`;

const Sidebar = ({ onNavigate }) => (
  <div className="flex h-full flex-col">
    <div className="flex h-16 items-center px-5">
      <NavLink to="/home" onClick={onNavigate} aria-label="Envelo dashboard">
        <Logo />
      </NavLink>
    </div>

    <nav aria-label="Main" className="flex-1 space-y-1 px-3 py-4">
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} className={linkClass} onClick={onNavigate}>
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>

    <div className="p-4">
      <div className="rounded-xl bg-subtle p-4">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          <FiZap className="h-4 w-4 text-brand-strong" aria-hidden="true" />
          Plan in plain words
        </p>
        <p className="mt-1 text-xs leading-5 text-muted">Describe your month and Envelo AI builds the envelopes.</p>
        <NavLink
          to="/notes?new=1"
          onClick={onNavigate}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-strong hover:underline"
        >
          Draft a budget →
        </NavLink>
      </div>
    </div>
  </div>
);

export default Sidebar;
