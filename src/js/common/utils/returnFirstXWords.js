/**
 * @param originalString
 * @param numberOfWordsToReturn
 * @param includeEllipses
 * @returns {string}
 */
export default function returnFirstXWords (originalString, numberOfWordsToReturn, includeEllipses = false) {
  // See also return_first_x_words in WeVoteServer
  if (!originalString) return '';

  let needForEllipses = false;
  const wordsArray = originalString.split(' ');
  let xWords = '';
  for (let i = 0; i < wordsArray.length; i++) {
    if (i >= numberOfWordsToReturn) {
      needForEllipses = true;
      break;
    }
    xWords += `${wordsArray[i]} `;
  }
  // Finally remove leading or trailing spaces
  xWords = xWords.trim();
  if (needForEllipses && includeEllipses) {
    xWords += '...';
  }
  return xWords;
}
