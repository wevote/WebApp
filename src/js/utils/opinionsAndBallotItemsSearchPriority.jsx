import React from 'react';

const { arrayContains } = React.lazy(() => import('./textFormat'));

export default function opinionsAndBallotItemsSearchPriority (originalString, item, ignoreDescriptionFields = false) {
  // console.log('opinionsAndBallotItemsSearchPriority, originalString: ', originalString);
  if (originalString === undefined) {
    return 0;
  }
  let searchNeedleString = '';
  const candidatesToShowForSearchResults = [];
  const foundInArray = [];
  let foundInItemsAlreadyShown;
  let foundInThisVoterGuideOrBallotItem = false;
  let positionDetailsString = '';
  let positionElement;
  let oneWordScore = 0;
  const voterGuideOrBallotItemDetailsArray = [];
  let searchPriority = 0;
  const wordsArray = originalString.split(' ');
  for (let i = 0; i < wordsArray.length; i++) {
    searchNeedleString = wordsArray[i].toString();
    oneWordScore = 0;
    // Ballot Item
    if ((item.ballot_item_display_name && item.ballot_item_display_name.numberOfNeedlesFoundInString(searchNeedleString))) {
      oneWordScore += item.ballot_item_display_name.numberOfNeedlesFoundInString(searchNeedleString) * 10;
      foundInThisVoterGuideOrBallotItem = true;
      if (!arrayContains('Name', voterGuideOrBallotItemDetailsArray)) voterGuideOrBallotItemDetailsArray.push('Name');
    }
    // Voter Guide (or Organization Mapped to Voter Guide)
    if ((item.voter_guide_display_name && item.voter_guide_display_name.numberOfNeedlesFoundInString(searchNeedleString))) {
      oneWordScore += item.voter_guide_display_name.numberOfNeedlesFoundInString(searchNeedleString) * 10;
      foundInThisVoterGuideOrBallotItem = true;
      if (!arrayContains('Name', voterGuideOrBallotItemDetailsArray)) voterGuideOrBallotItemDetailsArray.push('Name');
    }
    if (item.twitter_handle && item.twitter_handle.numberOfNeedlesFoundInString(searchNeedleString)) {
      oneWordScore += item.twitter_handle.numberOfNeedlesFoundInString(searchNeedleString) * 10;
      foundInThisVoterGuideOrBallotItem = true;
      if (!arrayContains('Twitter handle', voterGuideOrBallotItemDetailsArray)) voterGuideOrBallotItemDetailsArray.push('Twitter handle');
    }
    if (item.twitter_description && item.twitter_description.numberOfNeedlesFoundInString(searchNeedleString)) {
      oneWordScore += item.twitter_description.numberOfNeedlesFoundInString(searchNeedleString) * 1;
      foundInThisVoterGuideOrBallotItem = true;
      if (!arrayContains('Twitter description', voterGuideOrBallotItemDetailsArray)) voterGuideOrBallotItemDetailsArray.push('Twitter description');
    }
    searchPriority += oneWordScore;
  }
  if (foundInThisVoterGuideOrBallotItem) {
    if (voterGuideOrBallotItemDetailsArray.length) {
      foundInItemsAlreadyShown = 0;
      positionDetailsString += ' (';
      for (let counter = 0; counter < voterGuideOrBallotItemDetailsArray.length; counter++) {
        positionDetailsString += `${foundInItemsAlreadyShown ? ', ' : ''}${voterGuideOrBallotItemDetailsArray[counter]}`;
        foundInItemsAlreadyShown += 1;
      }
      positionDetailsString += ')';
    }
    positionElement = (
      <span>
        <strong>{item.voter_guide_display_name || item.ballot_item_display_name}</strong>
        {voterGuideOrBallotItemDetailsArray.length ? <span>{positionDetailsString}</span> : null}
      </span>
    );
    foundInArray.push(positionElement);
  }
  let candidateDetailsArray = [];
  let candidateDetailsString = '';
  let candidateElement;
  let foundInThisCandidate = false;
  if (item.candidate_list) {
    // eslint-disable-next-line no-loop-func
    item.candidate_list.forEach((candidate) => {
      foundInThisCandidate = false;
      candidateDetailsArray = [];
      candidateDetailsString = '';
      for (let i = 0; i < wordsArray.length; i++) {
        searchNeedleString = wordsArray[i].toString();
        oneWordScore = 0;
        if (!ignoreDescriptionFields && candidate.ballotpedia_candidate_summary && candidate.ballotpedia_candidate_summary.numberOfNeedlesFoundInString(searchNeedleString)) {
          oneWordScore += candidate.ballotpedia_candidate_summary.numberOfNeedlesFoundInString(searchNeedleString);
          foundInThisCandidate = true;
          if (!arrayContains('Candidate summary', candidateDetailsArray)) candidateDetailsArray.push('Candidate summary');
        }
        if (candidate.ballot_item_display_name && candidate.ballot_item_display_name.numberOfNeedlesFoundInString(searchNeedleString)) {
          oneWordScore += candidate.ballot_item_display_name.numberOfNeedlesFoundInString(searchNeedleString) * 5;
          foundInThisCandidate = true;
          if (!arrayContains('Candidate name', candidateDetailsArray)) candidateDetailsArray.push('Candidate name');
        }
        if (!ignoreDescriptionFields && candidate.twitter_description && candidate.twitter_description.numberOfNeedlesFoundInString(searchNeedleString)) {
          oneWordScore += candidate.twitter_description.numberOfNeedlesFoundInString(searchNeedleString);
          foundInThisCandidate = true;
          if (!arrayContains('Twitter description', candidateDetailsArray)) candidateDetailsArray.push('Twitter description');
        }
        if (candidate.twitter_handle && candidate.twitter_handle.numberOfNeedlesFoundInString(searchNeedleString)) {
          oneWordScore += candidate.twitter_handle.numberOfNeedlesFoundInString(searchNeedleString) * 10;
          foundInThisCandidate = true;
          if (!arrayContains('Twitter handle', candidateDetailsArray)) candidateDetailsArray.push('Twitter handle');
        }
        if (candidate.party && candidate.party.numberOfNeedlesFoundInString(searchNeedleString)) {
          oneWordScore += candidate.party.numberOfNeedlesFoundInString(searchNeedleString) * 2;
          foundInThisCandidate = true;
          if (!arrayContains('Political party', candidateDetailsArray)) candidateDetailsArray.push('Political party');
        }
        searchPriority += oneWordScore;
      }
      if (foundInThisCandidate) {
        if (candidateDetailsArray.length) {
          foundInItemsAlreadyShown = 0;
          candidateDetailsString += ' (';
          for (let counter = 0; counter < candidateDetailsArray.length; counter++) {
            candidateDetailsString += `${foundInItemsAlreadyShown ? ', ' : ''}${candidateDetailsArray[counter]}`;
            foundInItemsAlreadyShown += 1;
          }
          candidateDetailsString += ')';
        }
        candidateElement = (
          <span>
            <strong>{candidate.ballot_item_display_name}</strong>
            {candidateDetailsArray.length ? <span>{candidateDetailsString}</span> : null}
          </span>
        );
        foundInArray.push(candidateElement);
        candidatesToShowForSearchResults.push(candidate.we_vote_id);
      }
    });
  }
  // if (searchPriority) {
  //   console.log('opinionsAndBallotItemsSearchPriority item:', item);
  //   console.log('searchPriority:', searchPriority);
  // }
  return {
    searchPriority,
    foundInArray,
    candidatesToShowForSearchResults,
  };
}
