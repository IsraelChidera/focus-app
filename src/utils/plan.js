export const KIND_LABELS = {
  essential: "Essential",
  flexible: "Flexible",
  savings: "Savings",
  debt: "Debt",
};

export function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toLocaleString()}`;
  }
}

export function summarizePlan(plan) {
  const allocated = plan.envelopes.reduce((sum, envelope) => sum + envelope.amount, 0);
  return { allocated, remaining: plan.income - allocated };
}

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

/** Renders an AI plan as editor HTML, so the user can tweak it like any other entry. */
export function planToHtml(plan) {
  const money = (amount) => escapeHtml(formatMoney(amount, plan.currency));
  const { allocated, remaining } = summarizePlan(plan);

  const rows = plan.envelopes
    .map(
      (envelope) =>
        `<tr><td>${escapeHtml(envelope.name)}</td><td>${money(envelope.amount)}</td><td>${KIND_LABELS[envelope.kind]}</td><td>${escapeHtml(envelope.note || "")}</td></tr>`
    )
    .join("");

  const parts = [];
  if (plan.income > 0) parts.push(`<h2>Income</h2><p>${money(plan.income)} per month</p>`);
  if (rows) {
    parts.push(
      `<h2>Envelopes</h2><figure class="table"><table><thead><tr><th>Envelope</th><th>Amount</th><th>Type</th><th>Note</th></tr></thead><tbody>${rows}</tbody></table></figure>`
    );
    const balance =
      plan.income > 0
        ? remaining >= 0
          ? ` · <strong>Unassigned:</strong> ${money(remaining)}`
          : ` · <strong>Over by:</strong> ${money(-remaining)}`
        : "";
    parts.push(`<p><strong>Allocated:</strong> ${money(allocated)}${balance}</p>`);
  }
  if (plan.insights.length) {
    parts.push(`<h2>Envelo's notes</h2><ul>${plan.insights.map((insight) => `<li>${escapeHtml(insight)}</li>`).join("")}</ul>`);
  }
  return parts.join("");
}
