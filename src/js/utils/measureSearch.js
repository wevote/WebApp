const measureCategoryDefinitions = [
  { canonicalName: 'amendment', tokens: ['proposed', 'amendment']},
  { canonicalName: 'proposition', tokens: ['proposition']},
  { canonicalName: 'proposition', tokens: ['prop']},
  { canonicalName: 'referendum', tokens: ['referendum']},
  { canonicalName: 'initiative', tokens: ['initiative']},
  { canonicalName: 'amendment', tokens: ['amendment']},
  { canonicalName: 'proposal', tokens: ['proposal']},
  { canonicalName: 'measure', tokens: ['measure']},
];

export function normalizedSearchTokens (text = '') {
  return text.toLowerCase().match(/\b([a-z0-9]+)\b/g) || [];
}

function categoryAndIdentifierFromTokens (tokens) {
  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    for (let categoryIndex = 0; categoryIndex < measureCategoryDefinitions.length; categoryIndex++) {
      const categoryDefinition = measureCategoryDefinitions[categoryIndex];
      const categoryMatches = categoryDefinition.tokens.every(
        (categoryToken, offset) => tokens[tokenIndex + offset] === categoryToken,
      );
      const identifierIndex = tokenIndex + categoryDefinition.tokens.length;
      if (categoryMatches && tokens[identifierIndex]) {
        return {
          canonicalCategory: categoryDefinition.canonicalName,
          categoryStartIndex: tokenIndex,
          identifier: tokens[identifierIndex],
          identifierIndex,
        };
      }
    }
  }
  return undefined;
}

function measureTextMatchesSearch (search, measureText = '') {
  const searchTokens = normalizedSearchTokens(search);
  const structuredSearch = categoryAndIdentifierFromTokens(searchTokens);
  if (!structuredSearch) {
    return searchTokens.every((searchWord) => measureText.toLowerCase().includes(searchWord));
  }

  const measureTextTokens = normalizedSearchTokens(measureText);
  const structuredMeasureText = categoryAndIdentifierFromTokens(measureTextTokens);
  if (!structuredMeasureText ||
      structuredMeasureText.canonicalCategory !== structuredSearch.canonicalCategory ||
      structuredMeasureText.identifier !== structuredSearch.identifier) {
    return false;
  }

  const remainingSearchTokens = searchTokens.filter((searchToken, index) => index < structuredSearch.categoryStartIndex || index > structuredSearch.identifierIndex);
  return remainingSearchTokens.every((searchWord) => measureText.toLowerCase().includes(searchWord));
}

export function measureMatchesSearch (search, measure) {
  if (measureTextMatchesSearch(search, measure.ballot_item_display_name)) {
    return true;
  }
  return measureTextMatchesSearch(search, measure.measure_subtitle);
}
