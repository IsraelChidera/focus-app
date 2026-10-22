import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCheck,
  FiEdit3,
  FiLock,
  FiMenu,
  FiMessageCircle,
  FiMoon,
  FiShield,
  FiSmartphone,
  FiX,
  FiZap,
} from 'react-icons/fi';
import Logo from '../components/elements/Logo';
import { buttonClass } from '../components/elements/Button';
import PlanPreview from '../components/widgets/PlanPreview';
import { selectUser } from '../store/features/userSlice';

const NAV_LINKS = [
  { href: '#problem', label: 'Why Envelo' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#faq', label: 'FAQ' },
];

// Illustrative sample shown in the hero; not real user data.
const SAMPLE_PLAN = {
  title: 'November budget',
  currency: 'NGN',
  income: 450000,
  envelopes: [
    { name: 'Rent', amount: 150000, kind: 'essential', note: '' },
    { name: 'Food', amount: 60000, kind: 'essential', note: '' },
    { name: 'Transport', amount: 35000, kind: 'essential', note: '' },
    { name: 'Fun', amount: 45000, kind: 'flexible', note: '' },
    { name: 'December Trip', amount: 90000, kind: 'savings', note: '' },
  ],
  insights: [],
};

const PROBLEMS = [
  {
    title: 'Setting up takes forever',
    body: 'Spreadsheets and category screens ask for structure before you’ve even thought about your month.',
  },
  {
    title: 'Categories don’t fit real life',
    body: 'Your money doesn’t live in “Miscellaneous”. Generic templates never match how you actually spend.',
  },
  {
    title: 'Budgets stay silent',
    body: 'Most apps only tell you that you overspent — after it’s happened. The decision moment goes unhelped.',
  },
];

const STEPS = [
  {
    Icon: FiMessageCircle,
    title: 'Describe your month',
    body: '“I earn ₦450k, rent is ₦150k, and I want to save for December.” That’s enough to start.',
  },
  {
    Icon: FiZap,
    title: 'Envelo builds your envelopes',
    body: 'AI turns your words into envelopes with amounts, flags shortfalls, and leaves room to save.',
  },
  {
    Icon: FiShield,
    title: 'Ask before you spend',
    body: 'Spend Check tells you whether a purchase fits, which envelope it comes from, and what to do if it doesn’t.',
  },
];

const FEATURES = [
  { Icon: FiZap, title: 'AI Plan Builder', body: 'Plain words in, a balanced envelope budget out — in seconds.' },
  { Icon: FiShield, title: 'Spend Check', body: 'An honest yes, careful or no for any purchase, using your own numbers.' },
  { Icon: FiEdit3, title: 'Fully editable', body: 'Every AI plan opens in a rich editor. Change anything; it’s your budget.' },
  { Icon: FiLock, title: 'Private by default', body: 'No bank connection needed. Your budgets are tied to your account only.' },
  { Icon: FiSmartphone, title: 'Works everywhere', body: 'Designed for phones, tablets and desktops from the start.' },
  { Icon: FiMoon, title: 'Easy on the eyes', body: 'Follows your device’s light or dark mode automatically.' },
];

const FAQS = [
  {
    q: 'Do I need to connect my bank account?',
    a: 'No. Envelo works from what you tell it. There’s no bank linking and no access to your accounts.',
  },
  {
    q: 'What does the AI see?',
    a: 'Only the text you send when you use an AI feature: your description when building a plan, or the budget you’re checking against plus your question for Spend Check.',
  },
  {
    q: 'Is Spend Check financial advice?',
    a: 'No. It’s practical guidance based on the budget you wrote. It doesn’t know your real-time balance or what you’ve already spent, so you stay in charge.',
  },
  {
    q: 'Which currencies does it support?',
    a: 'Write in whatever currency you use — ₦, $, £, €, ₹ and more. Envelo picks it up from how you describe your money.',
  },
  {
    q: 'Can I write a budget without AI?',
    a: 'Yes. The editor works on its own, and you can edit any AI-drafted plan line by line.',
  },
];

const SpendCheckMock = () => (
  <div className="rounded-xl border border-line bg-surface p-4 shadow-lift sm:p-5">
    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
      <FiShield className="h-3.5 w-3.5 text-brand-strong" aria-hidden="true" />
      Spend Check
    </p>
    <p className="mt-3 rounded-lg bg-subtle px-3 py-2 text-sm text-ink">Can I afford a ₦40,000 dinner on Saturday?</p>
    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
      <FiAlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
      Proceed with care
    </span>
    <p className="mt-2 text-sm font-semibold text-ink">It fits your Fun envelope, but only just.</p>
    <p className="mt-1 text-sm text-muted">That leaves ₦5,000 of ₦45,000 for the rest of the month.</p>
  </div>
);

const Landing = () => {
  const user = useSelector(selectUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const primaryCta = user
    ? { to: '/home', label: 'Open your dashboard' }
    : { to: '/signup', label: 'Start budgeting free' };

  return (
    <div className="min-h-screen bg-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>

      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <Link to="/" aria-label="Envelo home">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} className="text-sm font-medium text-muted hover:text-ink">
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Link to="/home" className={buttonClass()}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className={buttonClass({ variant: 'ghost' })}>
                  Sign in
                </Link>
                <Link to="/signup" className={buttonClass()}>
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="-mr-2 rounded-lg p-2 text-muted hover:bg-subtle hover:text-ink md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="border-t border-line bg-surface px-4 pb-4 pt-2 animate-fade-in md:hidden">
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-subtle"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-3 grid gap-2">
              {user ? (
                <Link to="/home" className={buttonClass({ className: 'w-full' })}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signup" className={buttonClass({ className: 'w-full' })}>
                    Get started
                  </Link>
                  <Link to="/login" className={buttonClass({ variant: 'secondary', className: 'w-full' })}>
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[520px] bg-gradient-to-b from-brand-soft to-transparent"
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pb-28 lg:pt-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-surface px-3 py-1 text-xs font-semibold text-brand-strong">
                <FiZap className="h-3.5 w-3.5" aria-hidden="true" />
                AI envelope budgeting
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Know before
                <br />
                <span className="relative z-0 inline-block text-brand">
                  you spend.
                  <span className="absolute inset-x-0 bottom-[0.08em] -z-10 h-[0.28em] rounded-sm bg-accent/70" aria-hidden="true" />
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
                Tell Envelo about your money in plain words. It builds your envelope budget in seconds — then gives you an
                honest answer before every purchase, not a warning after it.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to={primaryCta.to} className={buttonClass({ size: 'lg' })}>
                  {primaryCta.label}
                  <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a href="#how-it-works" className={buttonClass({ variant: 'secondary', size: 'lg' })}>
                  See how it works
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                {['No bank linking', 'Any currency', 'Edit everything'].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <FiCheck className="h-4 w-4 text-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-label="Example of Envelo's AI plan and Spend Check" role="img">
              {/* Extra bottom padding on large screens is the space the Spend Check card overlaps. */}
              <div className="rounded-2xl border border-line bg-canvas/60 p-3 shadow-lift sm:p-4 lg:pb-14">
                <div className="mb-3 rounded-xl border border-brand/25 bg-brand-soft/60 px-4 py-3 text-sm text-ink">
                  <span className="font-semibold text-brand-strong">You: </span>
                  I earn ₦450k. Rent ₦150k, food ₦60k, transport ₦35k. Saving for a December trip.
                </div>
                <PlanPreview plan={SAMPLE_PLAN} />
              </div>
              <div className="relative mt-4 w-full sm:ml-auto sm:w-[80%] lg:-mr-6 lg:-mt-12">
                <SpendCheckMock />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Problem ---------- */}
        <section id="problem" className="scroll-mt-20 border-y border-line bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-brand-strong">The problem</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Most budgets are abandoned by week two.</h2>
              <p className="mt-4 text-lg text-muted">
                Not because people don’t care about money — because budgeting tools ask too much up front and say nothing
                when it matters.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PROBLEMS.map(({ title, body }, index) => (
                <div key={title} className="rounded-2xl border border-line bg-canvas p-6">
                  <span className="text-sm font-semibold tabular-nums text-danger">0{index + 1}</span>
                  <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-brand/25 bg-brand-soft/60 p-6 sm:p-8">
              <p className="text-sm font-semibold text-brand-strong">The Envelo fix</p>
              <p className="mt-2 text-xl font-semibold leading-8 text-ink sm:text-2xl">
                Setup becomes a sentence. And your budget finally speaks up at the moment of decision — with Spend Check.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section id="how-it-works" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-brand-strong">How it works</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">From messy thoughts to a plan you trust</h2>
            </div>

            <ol className="mt-14 grid gap-6 md:grid-cols-3">
              {STEPS.map(({ Icon, title, body }, index) => (
                <li key={title} className="relative rounded-2xl border border-line bg-surface p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-brand-ink">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-muted">Step {index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Features ---------- */}
        <section id="features" className="scroll-mt-20 border-y border-line bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-brand-strong">Features</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Everything you need. Nothing you don’t.</h2>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ Icon, title, body }) => (
                <div key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section id="faq" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">Questions, answered</h2>
            <div className="mt-10 divide-y divide-line rounded-2xl border border-line bg-surface shadow-card">
              {FAQS.map(({ q, a }, index) => {
                const open = openFaq === index;
                return (
                  <div key={q}>
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? -1 : index)}
                        aria-expanded={open}
                        aria-controls={`faq-${index}`}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-ink hover:text-brand-strong sm:px-6"
                      >
                        {q}
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-subtle text-muted transition-transform ${open ? 'rotate-45' : ''}`}
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </button>
                    </h3>
                    {open && (
                      <p id={`faq-${index}`} className="px-5 pb-5 text-sm leading-6 text-muted animate-fade-in sm:px-6">
                        {a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className="px-4 pb-20 sm:px-6">
          {/* Forest band with a lime button in both themes, echoing the logo. */}
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-accent-ink px-6 py-14 text-center text-[#f3f6ee] sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your next purchase deserves a second opinion.</h2>
            <p className="mx-auto mt-4 max-w-xl text-base opacity-90">
              Build your first budget in a sentence, then ask Envelo before you spend.
            </p>
            <Link
              to={primaryCta.to}
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-accent-ink shadow-sm transition hover:brightness-95"
            >
              {primaryCta.label}
              <FiArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
          <Logo className="h-7" />
          <p>© {new Date().getFullYear()} Envelo. Guidance, not financial advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
