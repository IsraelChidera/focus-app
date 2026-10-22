import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';
import Logo from '../elements/Logo';

const AppShell = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setDrawerOpen(false), [pathname]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-surface lg:block">
        <Sidebar />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div className="relative h-full w-72 max-w-[85%] bg-surface shadow-lift animate-slide-in-left">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-2 text-muted hover:bg-subtle hover:text-ink"
              aria-label="Close navigation"
            >
              <FiX className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-canvas/80 px-4 backdrop-blur sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="-ml-2 rounded-lg p-2 text-muted hover:bg-subtle hover:text-ink"
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <Logo />
          </div>
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
