import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { FiFileText, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import useNotes from '../hooks/useNotes';
import { selectUser } from '../store/features/userSlice';
import { noteCreate } from '../store/features/noteSlice';
import Card from '../components/elements/Card';
import Button from '../components/elements/Button';
import Alert from '../components/elements/Alert';
import EmptyState from '../components/elements/EmptyState';
import NoteCard, { NoteCardSkeleton } from '../components/widgets/NoteCard';
import NoteEditor from '../components/widgets/NoteEditor';
import AiPlanBuilder from '../components/widgets/AiPlanBuilder';
import { planToHtml } from '../utils/plan';
import { useToast } from '../components/widgets/Toast';
import { getNoteTitle, htmlToText } from '../utils/format';

// Compare functions receive the indexed items built below. Undated legacy entries sort last.
const SORTS = {
  newest: { label: 'Newest first', compare: (a, b) => (b.note.createdAt || 0) - (a.note.createdAt || 0) },
  oldest: { label: 'Oldest first', compare: (a, b) => (a.note.createdAt || Infinity) - (b.note.createdAt || Infinity) },
  title: { label: 'Title A–Z', compare: (a, b) => a.displayTitle.localeCompare(b.displayTitle) },
};

const Notes = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector(selectUser);
  const { notes, isLoading, isError, error, retry } = useNotes();
  const [searchParams, setSearchParams] = useSearchParams();

  const [composerOpen, setComposerOpen] = useState(searchParams.get('new') === '1');
  const [saving, setSaving] = useState(false);
  // An AI plan the user chose to apply; NoteEditor loads it into the form.
  const [draft, setDraft] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const deferredSearch = useDeferredValue(search);
  const composerRef = useRef(null);

  // "New entry" links elsewhere point at ?new=1; open the composer and clean up the URL.
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setComposerOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (composerOpen) composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [composerOpen]);

  const indexed = useMemo(
    () =>
      notes.map((note) => {
        const displayTitle = getNoteTitle(note);
        return { note, displayTitle, haystack: `${displayTitle} ${htmlToText(note.notes)}`.toLowerCase() };
      }),
    [notes]
  );

  const visible = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();
    const matches = term ? indexed.filter((item) => item.haystack.includes(term)) : [...indexed];
    return matches.sort(SORTS[sort].compare);
  }, [indexed, deferredSearch, sort]);

  const handleCreate = async ({ title, notes: content }) => {
    setSaving(true);
    try {
      await dispatch(noteCreate({ uid: user.uid, title, notes: content })).unwrap();
      toast.success('Budget saved.');
      closeComposer();
      return undefined;
    } catch (message) {
      return { error: typeof message === 'string' ? message : 'Could not save this budget. Please try again.' };
    } finally {
      setSaving(false);
    }
  };

  const handleApplyPlan = (plan) => {
    setDraft({ title: plan.title, content: planToHtml(plan) });
    toast.success('Plan added below. Tweak anything, then save.');
  };

  const closeComposer = () => {
    setComposerOpen(false);
    setDraft(null);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Budgets</h1>
          <p className="mt-1 text-sm text-muted">Every plan you've made, in one place.</p>
        </div>
        {!composerOpen && (
          <Button onClick={() => setComposerOpen(true)} className="self-start sm:self-auto">
            <FiPlus className="h-4 w-4" aria-hidden="true" />
            New budget
          </Button>
        )}
      </header>

      {composerOpen && (
        <Card as="section" ref={composerRef} aria-labelledby="composer-heading" className="scroll-mt-24 p-5 sm:p-6 animate-slide-up">
          <h2 id="composer-heading" className="mb-4 text-base font-semibold text-ink">
            New budget
          </h2>
          <AiPlanBuilder onApply={handleApplyPlan} />
          <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted">
            <span className="h-px flex-1 bg-line" />
            {draft ? 'Review and save' : 'Or write it yourself'}
            <span className="h-px flex-1 bg-line" />
          </div>
          <NoteEditor
            draft={draft}
            submitLabel="Save budget"
            saving={saving}
            onSubmit={handleCreate}
            onCancel={closeComposer}
          />
        </Card>
      )}

      {isError && (
        <Alert>
          <span>{error} </span>
          <button type="button" onClick={retry} className="font-semibold underline underline-offset-2">
            Try again
          </button>
        </Alert>
      )}

      {(isLoading || notes.length > 0) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="note-search" className="sr-only">
              Search budgets
            </label>
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="note-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or content"
              className="field pl-10 pr-10"
              disabled={isLoading}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted hover:text-ink"
                aria-label="Clear search"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>
          <label htmlFor="note-sort" className="sr-only">
            Sort budgets
          </label>
          <select
            id="note-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="field sm:w-44"
            disabled={isLoading}
          >
            {Object.entries(SORTS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <NoteCardSkeleton key={index} />
          ))}
        </div>
      ) : notes.length === 0 ? (
        !isError &&
        !composerOpen && (
          <Card>
            <EmptyState
              icon={FiFileText}
              title="No budgets yet"
              description="Describe your month to Envelo AI, or write a budget yourself. It takes about a minute."
              action={
                <Button onClick={() => setComposerOpen(true)}>
                  <FiPlus className="h-4 w-4" aria-hidden="true" />
                  Create your first budget
                </Button>
              }
            />
          </Card>
        )
      ) : visible.length === 0 ? (
        <Card>
          <EmptyState
            icon={FiSearch}
            title="No matching budgets"
            description={`Nothing matches “${deferredSearch.trim()}”. Try a different word.`}
            action={
              <Button variant="secondary" onClick={() => setSearch('')}>
                Clear search
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted" aria-live="polite">
            {visible.length === notes.length
              ? `${notes.length} ${notes.length === 1 ? 'budget' : 'budgets'}`
              : `${visible.length} of ${notes.length} budgets`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map(({ note }) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Notes;
