/**
 * @param politicianList
 * @returns {string}
 */
export default function politicianListToSentenceString (politicianList) {
  // Parallel to fetch_politician_list_to_sentence_string in WeVoteServer
  let sentenceString = '';
  if (!politicianList || politicianList.length === 0) return sentenceString;
  if (politicianList.length === 1) {
    sentenceString += ` ${politicianList[0].politician_name}`;
    return sentenceString;
  }
  let commaOrNot;
  let politicianNumber = 0;
  for (let i = 0; i < politicianList.length; ++i) {
    politicianNumber += 1;
    if (politicianNumber >= politicianList.length) {
      sentenceString += ` and ${politicianList[i].politician_name}`;
    } else {
      commaOrNot = (politicianNumber === politicianList.length - 1) ? '' : ',';
      sentenceString += ` ${politicianList[i].politician_name}${commaOrNot}`;
    }
  }
  return sentenceString;
}
