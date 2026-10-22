const canonicalMeasureCategories = [
  'amendment',
  'measure',
  'proposal',
  'question',
  'referendum',
  'proposition',
  'initiative',
];
const minimumCategoryPrefixLength = 4;

export function normalizedSearchTokens (text = '') {
  return text.toLowerCase().match(/\b([a-z0-9]+)\b/g) || [];
}

function resolveSearchCategory (token) {
  if (canonicalMeasureCategories.includes(token)) {
    return { canonicalCategories: [token]};
  }
  const matchingCategories = canonicalMeasureCategories.filter((category) => category.startsWith(token));
  if (token.length < minimumCategoryPrefixLength) {
    return { categoryPrefixIsInvalid: matchingCategories.length > 0 };
  }

  return { canonicalCategories: matchingCategories };
}

function categoryAndIdentifierFromTokens (tokens, resolveCategory) {
  let categoryPrefixIsInvalid = false;
  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const categoryResolution = resolveCategory(tokens[tokenIndex]);
    if (categoryResolution.categoryPrefixIsInvalid) {
      const possibleIdentifier = tokens[tokenIndex + 1] || '';
      const followedByIdentifier = /^(?:\d+[a-z]*|[a-z]\d*)$/.test(possibleIdentifier);
      if (tokens.length === 1 || followedByIdentifier) {
        categoryPrefixIsInvalid = true;
      }
    } else if (categoryResolution.canonicalCategories && categoryResolution.canonicalCategories.length) {
      const identifierIndex = tokenIndex + 1;
      return {
        canonicalCategories: categoryResolution.canonicalCategories,
        categoryStartIndex: tokenIndex,
        identifier: tokens[identifierIndex],
        identifierIndex: tokens[identifierIndex] ? identifierIndex : undefined,
      };
    }
  }
  return categoryPrefixIsInvalid ? { categoryPrefixIsInvalid: true } : undefined;
}

function resolveMeasureTextCategory (token) {
  return canonicalMeasureCategories.includes(token) ? { canonicalCategories: [token]} : {};
}

function measureTextMatchesSearch (search, measureText = '') {
  const searchTokens = normalizedSearchTokens(search);
  const structuredSearch = categoryAndIdentifierFromTokens(searchTokens, resolveSearchCategory);
  if (structuredSearch && structuredSearch.categoryPrefixIsInvalid) {
    return false;
  }
  if (!structuredSearch) {
    return searchTokens.every((searchWord) => measureText.toLowerCase().includes(searchWord));
  }

  const measureTextTokens = normalizedSearchTokens(measureText);
  const structuredMeasureText = categoryAndIdentifierFromTokens(measureTextTokens, resolveMeasureTextCategory);
  if (!structuredMeasureText ||
      !structuredSearch.canonicalCategories.includes(structuredMeasureText.canonicalCategories[0]) ||
      (structuredSearch.identifier && structuredMeasureText.identifier !== structuredSearch.identifier)) {
    return false;
  }

  const remainingSearchTokens = searchTokens.filter((searchToken, index) => index !== structuredSearch.categoryStartIndex && index !== structuredSearch.identifierIndex);
  return remainingSearchTokens.every((searchWord) => measureText.toLowerCase().includes(searchWord));
}

export function measureMatchesSearch (search, measure) {
  if (measureTextMatchesSearch(search, measure.ballot_item_display_name)) {
    return true;
  }
  return measureTextMatchesSearch(search, measure.measure_subtitle);
}
