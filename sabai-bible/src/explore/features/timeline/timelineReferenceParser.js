/**
 * @param {string} [referenceText]
 * @returns {string[]}
 */
export function parseReferenceText(referenceText) {
  if (!referenceText) return [];
  return String(referenceText)
    .split(/[;,]|(?:\s+and\s+)/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * @param {{ referenceText?: string; references?: string[] }} event
 * @returns {string[]}
 */
export function getReferencesForEvent(event) {
  const fromArr = Array.isArray(event.references) ? [...event.references] : [];
  const fromText = parseReferenceText(event.referenceText);
  const out = [];
  const seen = new Set();
  for (const r of [...fromArr, ...fromText]) {
    const k = r.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }
  return out;
}
