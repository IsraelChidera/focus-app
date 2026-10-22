import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/features/userSlice';
import { buttonClass } from '../components/elements/Button';
import Logo from '../components/elements/Logo';

const NotFound = () => {
  const user = useSelector(selectUser);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo className="mb-10 h-10" />
      <p className="text-sm font-semibold text-brand-strong">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm text-muted">The page you're looking for doesn't exist or has moved.</p>
      <Link to={user ? '/home' : '/'} className={buttonClass({ className: 'mt-8' })}>
        {user ? 'Go to dashboard' : 'Go to homepage'}
      </Link>
    </main>
  );
};

export default NotFound;
