import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar } from 'react-icons/fi';
import { formatNoteDate, getNoteTitle, htmlToText } from '../../utils/format';

const NoteCard = ({ note }) => {
  const title = getNoteTitle(note);
  const preview = useMemo(() => htmlToText(note.notes), [note.notes]);
  // Untitled legacy entries already use their text as the title; don't repeat it.
  const showPreview = Boolean(note.title?.trim()) && preview;

  return (
    <Link
      to={`/notes/${note.id}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lift"
    >
      <h3 className="line-clamp-2 text-[15px] font-semibold leading-6 text-ink group-hover:text-brand-strong">{title}</h3>
      {showPreview && <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{preview}</p>}
      <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-medium text-muted">
        <FiCalendar className="h-3.5 w-3.5" aria-hidden="true" />
        {formatNoteDate(note) || 'No date'}
      </p>
    </Link>
  );
};

export const NoteCardSkeleton = () => (
  <div className="rounded-2xl border border-line bg-surface p-5 shadow-card" aria-hidden="true">
    <div className="skeleton h-4 w-3/4" />
    <div className="skeleton mt-4 h-3 w-full" />
    <div className="skeleton mt-2 h-3 w-5/6" />
    <div className="skeleton mt-6 h-3 w-24" />
  </div>
);

export default NoteCard;
