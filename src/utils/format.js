import DOMPurify from "dompurify";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

const RELATIVE_STEPS = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

/** Absolute date for a note: prefers the timestamp, falls back to the legacy string. */
export function formatNoteDate(note) {
  if (note?.createdAt) return dateFormatter.format(new Date(note.createdAt));
  return note?.dateCreated || "";
}

export function formatRelative(millis) {
  if (!millis) return "";
  const seconds = Math.round((millis - Date.now()) / 1000);
  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(seconds) >= size) {
      return relativeFormatter.format(Math.round(seconds / size), unit);
    }
  }
  return "just now";
}

export function sanitizeHtml(html) {
  return DOMPurify.sanitize(html || "", { USE_PROFILES: { html: true } });
}

/** Plain-text version of stored HTML, used for previews and search. */
export function htmlToText(html) {
  if (!html) return "";
  // DOMParser documents are inert: scripts don't run and images don't load.
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("p, div, li, h1, h2, h3, h4, br, tr, th, td").forEach((el) => {
    el.append(" ");
  });
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

/** Older entries have no title; derive one from their first words. */
export function getNoteTitle(note) {
  if (note?.title?.trim()) return note.title.trim();
  const text = htmlToText(note?.notes);
  if (!text) return "Untitled entry";
  return text.length > 60 ? `${text.slice(0, 60).trimEnd()}…` : text;
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function getFirstName(displayName) {
  return displayName?.trim().split(/\s+/)[0] || "";
}

export function getInitials(displayName, email) {
  const source = displayName?.trim() || email || "";
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return (parts[0]?.[0] || "?").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
}
