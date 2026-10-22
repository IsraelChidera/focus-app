import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiCalendar, FiEdit2, FiFileText, FiTrash2 } from 'react-icons/fi';
import { selectUser } from '../store/features/userSlice';
import { noteDelete, noteFetchById, noteUpdate, selectNoteById } from '../store/features/noteSlice';
import Card from '../components/elements/Card';
import Button, { buttonClass } from '../components/elements/Button';
import Alert from '../components/elements/Alert';
import EmptyState from '../components/elements/EmptyState';
import ConfirmDialog from '../components/elements/ConfirmDialog';
import FullPageLoader from '../components/widgets/FullPageLoader';
import NoteEditor from '../components/widgets/NoteEditor';
import SpendCheck from '../components/widgets/SpendCheck';
import { useToast } from '../components/widgets/Toast';
import { formatNoteDate, formatRelative, getNoteTitle, sanitizeHtml } from '../utils/format';

const BackLink = () => (
  <Link to="/notes" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
    <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
    Budgets
  </Link>
);

const NoteDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const toast = useToast();
  const user = useSelector(selectUser);
  const note = useSelector(selectNoteById(id));

  // Only used when the entry isn't already in the store (e.g. opened from a bookmark).
  const [loadState, setLoadState] = useState(note ? 'ready' : 'loading');
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoadState('loading');
    setLoadError('');
    try {
      await dispatch(noteFetchById({ id, uid: user.uid })).unwrap();
      setLoadState('ready');
    } catch (message) {
      if (message === 'not-found') {
        setLoadState('not-found');
      } else {
        setLoadError(typeof message === 'string' ? message : 'Could not load this budget.');
        setLoadState('error');
      }
    }
  }, [dispatch, id, user.uid]);

  useEffect(() => {
    // `deleting` keeps us from refetching the entry we just removed.
    if (!note && !deleting) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const safeHtml = useMemo(() => sanitizeHtml(note?.notes), [note?.notes]);
  const hasNote = Boolean(note);

  // The router doesn't scroll to hashes, so honour links like /notes/:id#spend-check.
  useEffect(() => {
    if (hasNote && hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hasNote, hash]);

  const handleUpdate = async ({ title, notes }) => {
    setSaving(true);
    try {
      await dispatch(noteUpdate({ id, title, notes })).unwrap();
      toast.success('Changes saved.');
      setEditing(false);
      return undefined;
    } catch (message) {
      return { error: typeof message === 'string' ? message : 'Could not save your changes. Please try again.' };
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(noteDelete(id)).unwrap();
      toast.success('Budget deleted.');
      navigate('/notes', { replace: true });
    } catch (message) {
      toast.error(typeof message === 'string' ? message : 'Could not delete this budget. Please try again.');
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (!note) {
    if (loadState === 'loading' || deleting) return <FullPageLoader label="Loading budget" />;

    return (
      <div className="space-y-6">
        <BackLink />
        <Card>
          {loadState === 'error' ? (
            <div className="p-6">
              <Alert>{loadError}</Alert>
              <div className="mt-4 flex justify-center">
                <Button variant="secondary" onClick={load}>
                  Try again
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={FiFileText}
              title="Budget not found"
              description="It may have been deleted, or the link is incorrect."
              action={
                <Link to="/notes" className={buttonClass({ variant: 'secondary' })}>
                  Back to budgets
                </Link>
              }
            />
          )}
        </Card>
      </div>
    );
  }

  const title = getNoteTitle(note);
  const wasEdited = note.updatedAt && note.createdAt && note.updatedAt - note.createdAt > 60 * 1000;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <BackLink />

      {editing ? (
        <Card as="section" aria-labelledby="edit-heading" className="p-5 sm:p-6 animate-fade-in">
          <h1 id="edit-heading" className="mb-4 text-base font-semibold text-ink">
            Edit budget
          </h1>
          <NoteEditor
            initialTitle={note.title}
            initialContent={note.notes}
            submitLabel="Save changes"
            saving={saving}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        </Card>
      ) : (
        <Card as="article" className="p-6 sm:p-8">
          <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold tracking-tight text-ink">{title}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <FiCalendar className="h-4 w-4" aria-hidden="true" />
                  {formatNoteDate(note) || 'No date'}
                </span>
                {wasEdited && <span>· Edited {formatRelative(note.updatedAt)}</span>}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                <FiEdit2 className="h-3.5 w-3.5" aria-hidden="true" />
                Edit
              </Button>
              <Button variant="danger-ghost" size="sm" onClick={() => setConfirmOpen(true)}>
                <FiTrash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Delete
              </Button>
            </div>
          </header>

          {safeHtml.trim() ? (
            <div className="rich-text pt-6" dangerouslySetInnerHTML={{ __html: safeHtml }} />
          ) : (
            <p className="pt-6 text-sm italic text-muted">This budget has no details yet.</p>
          )}
        </Card>
      )}

      {!editing && safeHtml.trim() && <SpendCheck budgetHtml={note.notes} />}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this budget?"
        description={`“${title}” will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete budget"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default NoteDetail;
