/**
 * Smart Typography & Typographic Quotes Utility (UK English Convention)
 * 
 * Converts straight quotes and apostrophes to premium curly ones:
 * - Primary quotation marks: single curly - ‘ ’
 * - Nested quotation marks: double curly - “ ”
 * - Apostrophes: curly - ’ (e.g. Can’t, won’t)
 * 
 * Code blocks and inline code are exempted to maintain valid syntax.
 */

/**
 * Transforms a raw string into one with elegant smart quotes and apostrophes.
 * 
 * @param {string} str The input string to format
 * @returns {string} The formatted string with smart quotes
 */
export function toSmartQuotes(str) {
  if (typeof str !== 'string') return str;

  let result = str;

  // 1. Replace double quotes (Nested quotes in UK convention, but also maps straight double quotes to double curly)
  // Opening double quotes: preceded by whitespace, opening brackets/punctuation, or start of string
  result = result.replace(/(^|[-\u2014/\[(\u2018\s])"/g, '$1“');
  // Closing double quotes: anything else followed by double quote
  result = result.replace(/"/g, '”');

  // 2. Replace single quotes / apostrophes (Primary quotes & apostrophes in UK convention)
  // Apostrophes inside words: e.g. "don't", "she's", "O'Connor"
  result = result.replace(/([a-zA-Z0-9])'([a-zA-Z0-9])/g, '$1’$2');
  
  // Decades/Contractions starting with apostrophe: e.g. 'tis, '90s, 'cause, 'em, 'twas
  result = result.replace(/(^|\s)'(90s|80s|70s|twas|tis|em|cause|til)\b/gi, '$1’$2');
  result = result.replace(/(^|\s)'n'(?=\s|$)/gi, '$1’n’');

  // Opening single quotes: preceded by whitespace, opening brackets/punctuation, or start of string
  result = result.replace(/(^|[-\u2014/\[(\u201C\s])'/g, '$1‘');
  
  // Closing single quotes/apostrophes: remaining single quotes
  result = result.replace(/'/g, '’');

  return result;
}

/**
 * Recursively traverses PortableText (Sanity) or Blocks (Strapi) JSON trees and applies
 * toSmartQuotes to all text leaves. Exempts block code and inline code elements.
 * 
 * @param {any} content The block tree or array to process
 * @returns {any} The processed content block tree
 */
export function applySmartQuotes(content) {
  if (!content) return content;

  // Handle arrays
  if (Array.isArray(content)) {
    return content.map(item => applySmartQuotes(item));
  }

  // Handle objects
  if (typeof content === 'object') {
    // 1. Exempt block code nodes (PortableText: _type === 'code', Strapi: type === 'code')
    if (content._type === 'code' || content.type === 'code') {
      return content;
    }

    // 2. Process text leaf nodes (PortableText: _type === 'span', Strapi: type === 'text' or just key 'text')
    if (typeof content.text === 'string') {
      // Exempt inline code formatted spans
      const isInlineCode = content.code === true || (Array.isArray(content.marks) && content.marks.includes('code'));
      if (isInlineCode) {
        return content;
      }
      return {
        ...content,
        text: toSmartQuotes(content.text)
      };
    }

    // 3. Recursively map other object properties
    const result = {};
    for (const [key, value] of Object.entries(content)) {
      result[key] = applySmartQuotes(value);
    }
    return result;
  }

  return content;
}
