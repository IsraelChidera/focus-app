import React from 'react';
import { FiInfo } from 'react-icons/fi';
import { KIND_LABELS, formatMoney, summarizePlan } from '../../utils/plan';

const KIND_STYLES = {
  essential: 'bg-brand',
  flexible: 'bg-brand/50',
  savings: 'bg-success',
  debt: 'bg-warning',
};

const PlanPreview = ({ plan }) => {
  const { allocated, remaining } = summarizePlan(plan);
  const base = plan.income > 0 ? Math.max(plan.income, allocated) : allocated || 1;
  const money = (amount) => formatMoney(amount, plan.currency);

  return (
    <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-base font-semibold text-ink">{plan.title}</h4>
        {plan.income > 0 && (
          <p className="text-sm text-muted">
            Income <span className="font-semibold text-ink">{money(plan.income)}</span>
          </p>
        )}
      </div>

      {plan.envelopes.length > 0 && (
        <>
          {/* Stacked bar: how the month's money is split across envelopes. */}
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-subtle" aria-hidden="true">
            {plan.envelopes.map((envelope, index) => (
              <span
                key={`${envelope.name}-${index}`}
                className={`${KIND_STYLES[envelope.kind]} border-r border-surface last:border-r-0`}
                style={{ width: `${(envelope.amount / base) * 100}%` }}
              />
            ))}
          </div>

          <ul className="mt-4 divide-y divide-line">
            {plan.envelopes.map((envelope, index) => (
              <li key={`${envelope.name}-${index}`} className="flex items-start justify-between gap-4 py-2.5">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium text-ink">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${KIND_STYLES[envelope.kind]}`} aria-hidden="true" />
                    {envelope.name}
                    <span className="text-xs font-normal text-muted">{KIND_LABELS[envelope.kind]}</span>
                  </p>
                  {envelope.note && <p className="mt-0.5 pl-4 text-xs text-muted">{envelope.note}</p>}
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">{money(envelope.amount)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-2 flex flex-wrap justify-between gap-2 border-t border-line pt-3 text-sm">
            <span className="text-muted">
              Allocated <span className="font-semibold text-ink">{money(allocated)}</span>
            </span>
            {plan.income > 0 && (
              <span className={remaining >= 0 ? 'font-semibold text-success' : 'font-semibold text-danger'}>
                {remaining >= 0 ? `${money(remaining)} unassigned` : `Over by ${money(-remaining)}`}
              </span>
            )}
          </div>
        </>
      )}

      {plan.insights.length > 0 && (
        <ul className="mt-4 space-y-2 rounded-lg bg-subtle p-3">
          {plan.insights.map((insight, index) => (
            <li key={index} className="flex gap-2 text-sm text-ink">
              <FiInfo className="mt-0.5 h-4 w-4 shrink-0 text-brand-strong" aria-hidden="true" />
              {insight}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlanPreview;
