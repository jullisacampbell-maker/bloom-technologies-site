/**
 * Shared content safety and formatting for generated UI text.
 */

export const SETUP_CTA = 'Complete this part of your Family Setup for a personalized recommendation.';
export const SETUP_LINK = '/family-tech/setup';

const EMPTY_MARKERS = new Set(['undefined', 'null', 'n/a', 'na', 'none', '—', '-', '']);

export function isPresent(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'number') return !Number.isNaN(value);
  if (Array.isArray(value)) return value.some(isPresent);
  const s = String(value).trim();
  if (!s) return false;
  return !EMPTY_MARKERS.has(s.toLowerCase());
}

export function displayText(value, fallback = SETUP_CTA) {
  if (!isPresent(value)) return fallback;
  return cleanPunctuation(String(value).trim());
}

export function cleanPunctuation(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/\.\s*\./g, '.')
    .replace(/,\s*,/g, ',')
    .replace(/\s+([,.!?])/g, '$1')
    .replace(/([,.!?])([^\s])/g, '$1 $2')
    .replace(/\s+\./g, '.')
    .trim();
}

export function joinSentences(...parts) {
  return dedupeList(
    parts
      .flat()
      .filter(isPresent)
      .map((p) => cleanPunctuation(String(p)))
  ).join(' ');
}

export function dedupeList(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!isPresent(item)) return false;
    const key = String(item).trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const INVALID_TEXT_PATTERN = /\b(undefined|null|NaN)\b/i;

export function isValidGeneratedText(text) {
  if (!isPresent(text)) return false;
  return !INVALID_TEXT_PATTERN.test(String(text));
}

/** Sanitize generated UI text — returns empty string if invalid. */
export function sanitizeGeneratedText(text) {
  if (!isPresent(text)) return '';
  const cleaned = cleanPunctuation(stripInternalPhrases(String(text)));
  if (!isValidGeneratedText(cleaned)) return '';
  return cleaned;
}

export function filterValidInsights(insights = []) {
  const seen = new Set();
  return insights.filter((insight) => {
    const title = sanitizeGeneratedText(insight?.title);
    const body = sanitizeGeneratedText(insight?.body);
    if (!title || !body || seen.has(title)) return false;
    seen.add(title);
    insight.title = title;
    insight.body = body;
    return true;
  });
}

export function formatDuration(minutes) {
  if (!minutes || Number.isNaN(minutes)) return null;
  const m = Math.round(minutes);
  if (m <= 0) return null;
  if (m === 1) return '1 minute';
  if (m < 60) return `${m} minutes`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (r === 0) return h === 1 ? '1 hour' : `${h} hours`;
  return `${h} hour${h > 1 ? 's' : ''} ${r} minutes`;
}

/**
 * Parse duration only when reliable. Returns null for ambiguous free-text.
 */
export function parseDurationMinutes(text, structuredMinutes) {
  if (structuredMinutes != null && !Number.isNaN(structuredMinutes) && structuredMinutes > 0) {
    return Math.round(structuredMinutes);
  }
  if (!isPresent(text)) return null;

  const s = String(text).trim().toLowerCase();

  if (/if i|when i|unless|maybe|sometimes|stay up|after .* leaves/.test(s)) {
    return null;
  }

  if (/hour/.test(s)) {
    const hourMatch = s.match(/(\d+)\s*hour/);
    if (hourMatch) return parseInt(hourMatch[1], 10) * 60;
    if (/\ban hour\b/.test(s)) return 60;
    return null;
  }

  const range = s.match(/(\d+)\s*[–-]\s*(\d+)\s*min/);
  if (range) return parseInt(range[1], 10);

  const minMatch = s.match(/(\d+)\s*min/);
  if (minMatch) return parseInt(minMatch[1], 10);

  const lone = s.match(/^(\d+)$/);
  if (lone && parseInt(lone[1], 10) >= 5) return parseInt(lone[1], 10);

  return null;
}

export function stripInternalPhrases(text) {
  if (!text) return '';
  return text
    .replace(/\s*— not yoga-by-default[^.]*\.?/gi, '.')
    .replace(/\s*not yoga-by-default[^.]*\.?/gi, '.')
    .replace(/\s+/g, ' ')
    .trim();
}

export function mealSafeFoodPrompt(childName) {
  const name = isPresent(childName) ? childName : 'this child';
  return `Add ${name}'s reliable foods in Family Setup`;
}

export function resourceAssignmentLabel(resource) {
  if (resource.memberIds?.length === 1) return 'Assigned to one child';
  if (resource.memberIds?.length > 1) return 'Assigned to multiple children';
  return 'Shared household resource';
}
