// orderByPositionFunctions.js

export function limitToOnePositionPerSpeaker (filteredPositionList) {
  const organizationWeVoteIdListAlreadySeen = [];
  const updatedFilteredPositionList = [];
  for (let i = 0; i < filteredPositionList.length; i++) {
    const position = filteredPositionList[i];
    if (position.speaker_we_vote_id && !organizationWeVoteIdListAlreadySeen.includes(position.speaker_we_vote_id)) {
      organizationWeVoteIdListAlreadySeen.push(position.speaker_we_vote_id);
      updatedFilteredPositionList.push(position);
    }
  }
  return updatedFilteredPositionList;
}

export function limitToShowInfoOnly (filteredPositionList) {
  return filteredPositionList.filter((item) => (item && item.is_information_only));
}

export function limitToShowOppose (filteredPositionList) {
  return filteredPositionList.filter((item) => (item && item.is_oppose_or_negative_rating));
}

export function limitToShowSupport (filteredPositionList) {
  return filteredPositionList.filter((item) => (item && item.is_support_or_positive_rating));
}

export function orderPositionByUltimateDate (firstEntry, secondEntry) {
  return secondEntry.position_ultimate_election_date - firstEntry.position_ultimate_election_date;
}

export function orderByTwitterFollowers (firstGuide, secondGuide) {
  return secondGuide.twitter_followers_count - firstGuide.twitter_followers_count;
}

export function orderByWrittenComment (firstGuide, secondGuide) {
  const secondGuideHasStatement = secondGuide && secondGuide.statement_text && secondGuide.statement_text.length ? 1 : 0;
  const firstGuideHasStatement = firstGuide && firstGuide.statement_text && firstGuide.statement_text.length ? 1 : 0;
  return secondGuideHasStatement - firstGuideHasStatement;
}
