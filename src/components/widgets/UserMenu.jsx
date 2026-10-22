import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { FiChevronDown, FiLogOut } from 'react-icons/fi';
import { auth } from '../../firebase';
import { selectUser } from '../../store/features/userSlice';
import { getInitials } from '../../utils/format';
import { getAuthErrorMessage } from '../../utils/errors';
import { useToast } from './Toast';
import Spinner from '../elements/Spinner';

const UserMenu = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await signOut(auth);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out failed:', error);
      toast.error(getAuthErrorMessage(error));
      setSigningOut(false);
    }
  };

  const name = user?.displayName || 'Your account';

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-subtle"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-brand-ink">
          {getInitials(user?.displayName, user?.email)}
        </span>
        <span className="hidden max-w-[10rem] truncate text-sm font-medium text-ink sm:block">{name}</span>
        <FiChevronDown className="h-4 w-4 text-muted" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-surface shadow-lift animate-fade-in"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            {user?.email && <p className="truncate text-xs text-muted">{user.email}</p>}
          </div>
          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={signingOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-danger hover:bg-danger-soft disabled:opacity-60"
            >
              {signingOut ? <Spinner /> : <FiLogOut className="h-4 w-4" aria-hidden="true" />}
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
