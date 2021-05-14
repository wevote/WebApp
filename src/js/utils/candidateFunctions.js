import VoterStore from '../stores/VoterStore';

// eslint-disable-next-line import/prefer-default-export
export function mostLikelyOfficeDictFromList (contestOfficeList) {
  if (!contestOfficeList || contestOfficeList.length === 0) {
    return {};
  }
  // Strategy One: If we have voterElectionId and voterStateCode, and one of the offices is from that, use that office
  let electionIdMatches = false;
  let stateCodeMatches = false;
  // console.log('mostLikelyOfficeDictFromList before Strategy One, electionId:', VoterStore.electionId(), ', getVoterStateCode:', VoterStore.getVoterStateCode());
  if (VoterStore.electionId() && VoterStore.getVoterStateCode()) {
    // TODO in getVoterStateCode we check for normalized_state in the address object. We should be
    //  capturing the state when we call Google address Auto Complete (search for _placeChanged)
    //  and we should also figure out the state_code when we call API server voterAddressSave and put it in the "address"
    //  return data.
    for (let counter = 0; counter < contestOfficeList.length; counter++) {
      electionIdMatches = VoterStore.electionId() === contestOfficeList[counter].google_civic_election_id;
      stateCodeMatches = VoterStore.getVoterStateCode().toLowerCase() === contestOfficeList[counter].state_code.toLowerCase();
      if (electionIdMatches && stateCodeMatches) {
        // console.log('contest_office_we_vote_id returned:', contestOfficeList[counter].contest_office_we_vote_id);
        return contestOfficeList[counter];
      }
    }
  }
  // Strategy Two: If we have voterElectionId, pick the first office from that election
  // console.log('mostLikelyOfficeDictFromList before Strategy Two');
  if (VoterStore.electionId()) {
    for (let counter = 0; counter < contestOfficeList.length; counter++) {
      electionIdMatches = VoterStore.electionId() === contestOfficeList[counter].google_civic_election_id;
      if (electionIdMatches) {
        // console.log('contest_office_we_vote_id returned:', contestOfficeList[counter].contest_office_we_vote_id);
        return contestOfficeList[counter];
      }
    }
  }
  // Strategy Three: find the office in this order of priority:
  // 1) Next in time
  // 2) Most recent previous office
  // Sort descending so the offices are ordered future-to-past
  // console.log('BEFORE contestOfficeList:', contestOfficeList);
  // console.log('mostLikelyOfficeDictFromList before Strategy Three');
  contestOfficeList.sort((a, b) => {
    if (a.election_day_text < b.election_day_text) return 1;
    if (a.election_day_text > b.election_day_text) return -1;
    return 0; // default return value (no sorting)
  });
  // console.log('AFTER contestOfficeList:', contestOfficeList);
  // TODO: This needs to be built out before we start running primaries again
  // const currentDate = moment().format('YYYY-MM-DD');
  for (let counter = 0; counter < contestOfficeList.length; counter++) {
    if (contestOfficeList[counter].election_day_text) {
      // console.log('contest_office_we_vote_id returned:', contestOfficeList[counter].contest_office_we_vote_id);
      return contestOfficeList[counter];
    }
  }

  // Finally, just return the office_we_vote_id from the first entry (farthest in future)
  // console.log('mostLikelyOfficeDictFromList before Strategy Four');
  const firstOffice = contestOfficeList[0];
  // console.log('getMostLikelyOfficeDictFromCandidateWeVoteId firstOffice:', firstOffice)
  return firstOffice;
}
