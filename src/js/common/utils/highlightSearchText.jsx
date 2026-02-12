import React from 'react';

/**
 * Highlights matching search text in a given string
 * @param {string} text - The text to search in
 * @param {string} searchText - The search term(s) to highlight
 * @returns {JSX | string} - Text with highlighted portions or plain text
 */
function highlightSearchText (text, searchText) {
  if (!text || !searchText || searchText.length === 0) {
    return text;
  }

  const textStr = String(text);
  const searchTextLowercase = searchText.toLowerCase();

  // Extract individual search words
  const searchWords = searchTextLowercase.match(/\b(\w+)\b/g) || [];

  if (searchWords.length === 0) {
    return text;
  }

  // Create a regex that matches any of the search words
  const pattern = searchWords.join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');

  // Split text by matches and create JSX with highlights
  const parts = textStr.split(regex);

  return parts.map((part, index) => {
    if (part && regex.test(part)) {
      // Reset the regex lastIndex after test
      regex.lastIndex = 0;
      return (
        <mark key={index} style={{ backgroundColor: '#FFEB3B' }}>
          {part}
        </mark>
      );
    }
    return part;
  });
}

export default highlightSearchText;
