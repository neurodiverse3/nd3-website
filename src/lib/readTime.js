/**
 * Calculate estimated reading time from a Portable Text body array or plain string.
 * Assumes ~200 words per minute for neurodivergent-adjusted pacing.
 *
 * @param {Array|string} body - Sanity Portable Text blocks, or a plain string
 * @returns {string} e.g. "4 MIN READ"
 */
export function calculateReadTime(body) {
  if (!body) return '5 MIN READ';

  let text = '';

  if (Array.isArray(body)) {
    // Traverse Portable Text blocks and extract all text spans
    text = body
      .filter(block => block && block._type === 'block')
      .map(block =>
        (block.children || [])
          .map(span => span.text || '')
          .join('')
      )
      .join(' ');
  } else if (typeof body === 'string') {
    text = body;
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} MIN READ`;
}
