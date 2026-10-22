import React from 'react';
import { FiSettings } from 'react-icons/fi';
import Logo from '../components/elements/Logo';

/** Shown instead of the app when Firebase environment variables are missing. */
const SetupRequired = ({ missing }) => (
  <main className="flex min-h-screen items-center justify-center px-6">
    <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-card">
      <Logo />
      <div className="mt-8 flex items-center gap-2 text-ink">
        <FiSettings className="h-5 w-5 text-brand" aria-hidden="true" />
        <h1 className="text-lg font-semibold">Finish setting up Firebase</h1>
      </div>
      <p className="mt-2 text-sm text-muted">
        Add these variables to a <code className="rounded bg-subtle px-1 py-0.5 text-ink">.env</code> file in the project
        root, then restart the dev server:
      </p>
      <ul className="mt-4 space-y-1.5 rounded-lg bg-subtle p-4 font-mono text-xs text-ink">
        {missing.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  </main>
);

export default SetupRequired;
