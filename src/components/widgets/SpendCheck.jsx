import React, { useId, useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiHelpCircle, FiShield, FiXCircle } from 'react-icons/fi';
import Button from '../elements/Button';
import Alert from '../elements/Alert';
import { checkSpend } from '../../services/ai';
import { htmlToText } from '../../utils/format';

const MAX_LENGTH = 300;

const VERDICTS = {
  yes: { label: 'Fits your budget', Icon: FiCheckCircle, box: 'bg-success-soft text-success' },
  careful: { label: 'Proceed with care', Icon: FiAlertTriangle, box: 'bg-warning-soft text-warning' },
  no: { label: "Doesn't fit", Icon: FiXCircle, box: 'bg-danger-soft text-danger' },
  unclear: { label: 'Not enough to go on', Icon: FiHelpCircle, box: 'bg-subtle text-muted' },
};

/** "Can I afford it?" — checks a purchase against this budget before the user spends. */
const SpendCheck = ({ budgetHtml }) => {
  const id = useId();
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = question.trim();
    if (text.length < 3) {
      setError('Describe what you want to buy and roughly how much it costs.');
      return;
    }
    const budget = htmlToText(budgetHtml);
    if (!budget) {
      setError('This budget is empty. Add some details first, then ask again.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await checkSpend({ budget, question: text }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const verdict = result && VERDICTS[result.verdict];

  return (
    <section id="spend-check" aria-labelledby={`${id}-heading`} className="scroll-mt-24 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
          <FiShield className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id={`${id}-heading`} className="text-base font-semibold text-ink">
            Spend Check
          </h2>
          <p className="mt-0.5 text-sm text-muted">About to buy something? Ask Envelo if this budget can take it.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-question`} className="sr-only">
          What do you want to buy?
        </label>
        <input
          id={`${id}-question`}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="e.g. Can I afford a ₦40,000 dinner this Saturday?"
          className="field flex-1"
          autoComplete="off"
          disabled={loading}
        />
        <Button type="submit" loading={loading}>
          {loading ? 'Checking…' : 'Check it'}
        </Button>
      </form>

      <Alert className="mt-3" onDismiss={() => setError('')}>
        {error}
      </Alert>

      {result && (
        <div className="mt-5 rounded-xl border border-line p-4 animate-slide-up" role="status">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${verdict.box}`}>
            <verdict.Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {verdict.label}
          </span>
          <p className="mt-3 text-base font-semibold text-ink">{result.headline}</p>
          {result.envelope && (
            <p className="mt-1 text-sm text-muted">
              From your <span className="font-medium text-ink">{result.envelope}</span> envelope
            </p>
          )}
          {result.reasoning && <p className="mt-3 text-sm leading-6 text-ink">{result.reasoning}</p>}
          {result.suggestion && (
            <p className="mt-3 rounded-lg bg-subtle px-3 py-2 text-sm text-ink">
              <span className="font-semibold">Tip: </span>
              {result.suggestion}
            </p>
          )}
        </div>
      )}

      <p className="mt-4 text-xs text-muted">
        Based on this budget only, not your real spending or bank balance. Guidance, not financial advice.
      </p>
    </section>
  );
};

export default SpendCheck;
