function formatVoterBallotList (electionsList) {
  return electionsList.map((election) => {
    let ballotReturnedWeVoteId = "";
    let ballotLocationShortcut = "";
    if (election.ballot_location_list && election.ballot_location_list.length) {
      // We want to add the shortcut and we_vote_id for the first ballot location option
      const oneBallotLocation = election.ballot_location_list[0];
      ballotLocationShortcut = (oneBallotLocation.ballot_location_shortcut || "").trim();
      ballotReturnedWeVoteId = (oneBallotLocation.ballot_returned_we_vote_id || "").trim();
    }
    return {
      google_civic_election_id: election.google_civic_election_id,
      election_description_text: election.election_name,
      election_day_text: election.election_day_text,
      original_text_for_map_search: "",
      ballot_location_shortcut: ballotLocationShortcut,
      ballot_returned_we_vote_id: ballotReturnedWeVoteId,
    };
  });
}

function checkShouldUpdate (state, nextState) {
  if (state.componentDidMountFinished === false) {
    // console.log("shouldComponentUpdate: componentDidMountFinished === false");
    return true;
  }
  if (state.raceLevelFilterType !== nextState.raceLevelFilterType) {
    // console.log("shouldComponentUpdate: state.raceLevelFilterType", state.raceLevelFilterType, ", nextState.raceLevelFilterType", nextState.raceLevelFilterType);
    return true;
  }
  if (state.ballotItemUnfurledTracker !== nextState.ballotItemUnfurledTracker) {
    // console.log("shouldComponentUpdate: state.ballotItemUnfurledTracker", state.ballotItemUnfurledTracker, ", nextState.ballotItemUnfurledTracker", nextState.ballotItemUnfurledTracker);
    return true;
  }
  if (state.ballotLength !== nextState.ballotLength) {
    // console.log("shouldComponentUpdate: state.ballotLength", state.ballotLength, ", nextState.ballotLength", nextState.ballotLength);
    return true;
  }
  if (state.ballotRemainingChoicesLength !== nextState.ballotRemainingChoicesLength) {
    // console.log("shouldComponentUpdate: state.ballotRemainingChoicesLength", state.ballotRemainingChoicesLength, ", nextState.ballotRemainingChoicesLength", nextState.ballotRemainingChoicesLength);
    return true;
  }
  if (state.ballotLocationShortcut !== nextState.ballotLocationShortcut) {
    // console.log("shouldComponentUpdate: state.ballotLocationShortcut", state.ballotLocationShortcut, ", nextState.ballotLocationShortcut", nextState.ballotLocationShortcut);
    return true;
  }
  if (state.ballotReturnedWeVoteId !== nextState.ballotReturnedWeVoteId) {
    // console.log("shouldComponentUpdate: state.ballotReturnedWeVoteId", state.ballotReturnedWeVoteId, ", nextState.ballotReturnedWeVoteId", nextState.ballotReturnedWeVoteId);
    return true;
  }
  if (state.completionLevelFilterType !== nextState.completionLevelFilterType) {
    // console.log("shouldComponentUpdate: state.completionLevelFilterType", state.completionLevelFilterType, ", nextState.completionLevelFilterType", nextState.completionLevelFilterType);
    return true;
  }
  if (state.googleCivicElectionId !== nextState.googleCivicElectionId) {
    // console.log("shouldComponentUpdate: state.googleCivicElectionId", state.googleCivicElectionId, ", nextState.googleCivicElectionId", nextState.googleCivicElectionId);
    return true;
  }
  if (state.lastHashUsedInLinkScroll !== nextState.lastHashUsedInLinkScroll) {
    // console.log("shouldComponentUpdate: state.lastHashUsedInLinkScroll", state.lastHashUsedInLinkScroll, ", nextState.lastHashUsedInLinkScroll", nextState.lastHashUsedInLinkScroll);
    return true;
  }
  if (state.location !== nextState.location) {
    // console.log("shouldComponentUpdate: state.location", state.location, ", nextState.location", nextState.location);
    return true;
  }
  if (state.pathname !== nextState.pathname) {
    // console.log("shouldComponentUpdate: state.pathname", state.pathname, ", nextState.pathname", nextState.pathname);
    return true;
  }
  if (state.showBallotIntroModal !== nextState.showBallotIntroModal) {
    // console.log("shouldComponentUpdate: state.showBallotIntroModal", state.showBallotIntroModal, ", nextState.showBallotIntroModal", nextState.showBallotIntroModal);
    return true;
  }
  if (state.showBallotSummaryModal !== nextState.showBallotSummaryModal) {
    // console.log("shouldComponentUpdate: state.showBallotSummaryModal", state.showBallotSummaryModal, ", nextState.showBallotSummaryModal", nextState.showBallotSummaryModal);
    return true;
  }
  if (state.showSelectBallotModal !== nextState.showSelectBallotModal) {
    // console.log("shouldComponentUpdate: state.showSelectBallotModal", state.showSelectBallotModal, ", nextState.showSelectBallotModal", nextState.showSelectBallotModal);
    return true;
  }
  if (state.showFilterTabs !== nextState.showFilterTabs) {
    return true;
  }

  return false;
}

export { formatVoterBallotList, checkShouldUpdate };
