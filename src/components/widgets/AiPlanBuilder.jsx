import React, { useId, useState } from 'react';
import { FiCheck, FiRefreshCw, FiZap } from 'react-icons/fi';
import Button from '../elements/Button';
import Alert from '../elements/Alert';
import PlanPreview from './PlanPreview';
import { buildPlan } from '../../services/ai';

const MAX_LENGTH = 2000;

const EXAMPLES = [
  'I earn ₦450,000 a month. Rent is ₦150,000, I spend about ₦60,000 on food and ₦35,000 on transport. I want to save for a trip in December.',
  'Take-home $3,200. Rent $1,250, car loan $310, phone $45. I eat out a lot and want an emergency fund.',
  '£2,100 after tax, £800 rent, £120 bills. Trying to pay off a £1,500 credit card in six months.',
];

/** Describe your money in plain words; Envelo drafts an envelope budget you can apply to the editor. */
const AiPlanBuilder = ({ onApply }) => {
  const id = useId();
  const [description, setDescription] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = description.trim();
    if (text.length < 10) {
      setError('Tell Envelo a little more — your income and a few regular costs is a great start.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      setPlan(await buildPlan(text));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const canApply = plan && plan.envelopes.length > 0;

  return (
    <div className="rounded-xl border border-brand/25 bg-brand-soft/50 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <FiZap className="h-4 w-4 text-brand-strong" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-ink">Draft with Envelo AI</h3>
      </div>
      <p className="mt-1 text-sm text-muted">Describe your month in your own words. Envelo turns it into envelopes you can edit.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3">
        <label htmlFor={`${id}-description`} className="sr-only">
          Describe your income, costs and goals
        </label>
        <textarea
          id={`${id}-description`}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          maxLength={MAX_LENGTH}
          placeholder="e.g. I earn ₦450,000 a month, rent is ₦150,000, and I want to save for a trip…"
          className="field resize-y"
          disabled={loading}
        />

        {!description && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted">Try:</span>
            {EXAMPLES.map((example, index) => (
              <button
                key={example}
                type="button"
                onClick={() => setDescription(example)}
                className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink hover:border-brand/40 hover:text-brand-strong"
              >
                Example {index + 1}
              </button>
            ))}
          </div>
        )}

        <Alert onDismiss={() => setError('')}>{error}</Alert>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-muted">
            {description.length > MAX_LENGTH * 0.8 && `${description.length}/${MAX_LENGTH}`}
          </span>
          <Button type="submit" variant={plan ? 'secondary' : 'primary'} loading={loading}>
            {!loading && (plan ? <FiRefreshCw className="h-4 w-4" aria-hidden="true" /> : <FiZap className="h-4 w-4" aria-hidden="true" />)}
            {loading ? 'Building your plan…' : plan ? 'Rebuild plan' : 'Build my plan'}
          </Button>
        </div>
      </form>

      {plan && !loading && (
        <div className="mt-5 animate-slide-up">
          <PlanPreview plan={plan} />
          {canApply && (
            <div className="mt-4 flex justify-end">
              <Button onClick={() => onApply(plan)}>
                <FiCheck className="h-4 w-4" aria-hidden="true" />
                Use this plan
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiPlanBuilder;
