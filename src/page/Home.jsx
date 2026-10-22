import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowRight, FiClock, FiFileText, FiPlus, FiShield, FiTrendingUp, FiZap } from 'react-icons/fi';
import { selectUser } from '../store/features/userSlice';
import useNotes from '../hooks/useNotes';
import Card from '../components/elements/Card';
import { buttonClass } from '../components/elements/Button';
import Alert from '../components/elements/Alert';
import EmptyState from '../components/elements/EmptyState';
import NoteCard, { NoteCardSkeleton } from '../components/widgets/NoteCard';
import { formatRelative, getFirstName, getGreeting, getNoteTitle } from '../utils/format';

const RECENT_COUNT = 6;

const todayLabel = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

const StatCard = ({ icon: Icon, label, value, loading }) => (
  <Card className="flex items-center gap-4 p-5">
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      {loading ? (
        <div className="skeleton mt-1.5 h-6 w-16" />
      ) : (
        <p className="mt-0.5 truncate text-2xl font-semibold tracking-tight text-ink">{value}</p>
      )}
    </div>
  </Card>
);

const AiCard = ({ icon: Icon, title, description, to, cta }) => (
  <Link
    to={to}
    className="group flex items-start gap-4 rounded-2xl border border-brand/25 bg-brand-soft/60 p-5 transition hover:border-brand/50 hover:shadow-card"
  >
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-ink">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
    <span className="min-w-0">
      <span className="block text-base font-semibold text-ink">{title}</span>
      <span className="mt-1 block text-sm text-muted">{description}</span>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-strong">
        {cta}
        <FiArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </span>
  </Link>
);

const Home = () => {
  const user = useSelector(selectUser);
  const { notes, isLoading, isError, error, retry } = useNotes();
  const firstName = getFirstName(user?.displayName);
  const latest = notes[0];

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const lastActivity = notes.reduce((latestTime, note) => Math.max(latestTime, note.updatedAt || note.createdAt || 0), 0);
    return {
      total: notes.length,
      thisMonth: notes.filter((note) => note.createdAt && note.createdAt >= monthStart).length,
      lastActivity: lastActivity ? formatRelative(lastActivity) : '—',
    };
  }, [notes]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{todayLabel.format(new Date())}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {getGreeting()}
            {firstName ? `, ${firstName}` : ''}
          </h1>
        </div>
        <Link to="/notes?new=1" className={buttonClass({ className: 'self-start sm:self-auto' })}>
          <FiPlus className="h-4 w-4" aria-hidden="true" />
          New budget
        </Link>
      </header>

      {isError && (
        <Alert>
          <span>{error} </span>
          <button type="button" onClick={retry} className="font-semibold underline underline-offset-2">
            Try again
          </button>
        </Alert>
      )}

      <section aria-label="Envelo AI" className="grid gap-4 md:grid-cols-2">
        <AiCard
          icon={FiZap}
          title="Plan in plain words"
          description="Tell Envelo about your income, bills and goals. It builds the envelopes for you."
          to="/notes?new=1"
          cta="Draft with AI"
        />
        <AiCard
          icon={FiShield}
          title="Spend Check"
          description={
            latest
              ? `About to buy something? Check it against “${getNoteTitle(latest)}” first.`
              : 'Once you have a budget, ask “can I afford this?” before you spend.'
          }
          to={latest ? `/notes/${latest.id}#spend-check` : '/notes?new=1'}
          cta={latest ? 'Ask before you spend' : 'Create a budget first'}
        />
      </section>

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={FiFileText} label="Budgets" value={stats.total} loading={isLoading} />
        <StatCard icon={FiTrendingUp} label="Added this month" value={stats.thisMonth} loading={isLoading} />
        <StatCard icon={FiClock} label="Last activity" value={stats.lastActivity} loading={isLoading} />
      </section>

      <section aria-labelledby="recent-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recent-heading" className="text-lg font-semibold text-ink">
            Recent budgets
          </h2>
          {notes.length > 0 && (
            <Link to="/notes" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-strong hover:underline">
              View all
              <FiArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <NoteCardSkeleton key={index} />
            ))}
          </div>
        ) : notes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {notes.slice(0, RECENT_COUNT).map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          !isError && (
            <Card>
              <EmptyState
                icon={FiFileText}
                title="What's your budget like?"
                description="Describe your month in a sentence or two and Envelo AI will turn it into envelopes."
                action={
                  <Link to="/notes?new=1" className={buttonClass()}>
                    <FiZap className="h-4 w-4" aria-hidden="true" />
                    Create your first budget
                  </Link>
                }
              />
            </Card>
          )
        )}
      </section>
    </div>
  );
};

export default Home;
