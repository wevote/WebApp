import React from 'react';
import { HighlightSpan } from './electionFinderStyles';

// Wraps each occurrence of any word in `query` found within `text` in a
// <HighlightSpan>, so matched search terms render highlighted. Returns the
// original text unchanged when there is no query.
export default function highlightMatch (text, query) {
  if (!query) return text;
  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return text;
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const lowerWords = words.map((w) => w.toLowerCase());
  return text.split(regex).map((part, idx) => {
    if (lowerWords.includes(part.toLowerCase())) {
      return <HighlightSpan key={`hl-${idx}-${part}`}>{part}</HighlightSpan>; // eslint-disable-line react/no-array-index-key
    }
    return part;
  });
}
