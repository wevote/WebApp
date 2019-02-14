import { ReduceStore } from 'flux/utils';
import assign from 'object-assign';
import Dispatcher from '../dispatcher/Dispatcher';
import BallotActions from '../actions/BallotActions';
import SupportStore from './SupportStore';
import VoterStore from './VoterStore';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-param-reassign: 0 */

class BallotStore extends ReduceStore {
  getInitialState () {
    return {
      ballotItemSearchResultsList: [],
      ballotItemUnfurledTracker: {},
      ballotItemListCandidatesDict: {}, // Dictionary with ballot_item_we_vote_id as key and list of candidate we_vote_ids as value
      positionListHasBeenRetrievedOnceByBallotItem: {}, // Dictionary with ballot_item_we_vote_id as key and true/false as value
    };
  }

  resetState () {
    return this.getInitialState();
  }

  isLoaded () {
    const civicId = VoterStore.electionId();
    return !!(this.getState().ballots && this.getState().ballots[civicId] && SupportStore.supportList);
  }

  get ballotProperties () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.electionId();
    const props = assign({}, this.getState().ballots[civicId]);
    props.ballot_item_list = null;
    return props;
  }

  get ballotFound () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.electionId();
    return this.getState().ballots[civicId].ballot_found;
  }

  get ballot () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.electionId();
    return this.getState().ballots[civicId].ballot_item_list;
  }

  ballotElectionList () {
    return this.getState().ballotElectionList || [];
  }

  ballotItemSearchResultsList () {
    return this.getState().ballotItemSearchResultsList || [];
  }

  get ballotLength () {
    const ballot = this.ballot || [];
    return ballot.length || 0;
  }

  get currentBallotElectionName () {
    if (!this.isLoaded()) { return 'Election'; }
    const civicId = VoterStore.electionId();
    return this.getState().ballots[civicId].election_name;
  }

  get currentBallotElectionDate () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.electionId();
    return this.getState().ballots[civicId].election_day_text;
  }

  get currentBallotGoogleCivicElectionId () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.electionId();
    return this.getState().ballots[civicId].google_civic_election_id;
  }

  get currentBallotPollingLocationSource () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.electionId();
    return this.getState().ballots[civicId].polling_location_we_vote_id_source;
  }

  getBallotCaveat () {
    return this.getState().ballotCaveat || '';
  }

  get ballotRemainingChoices () {
    if (!this.isLoaded()) { return undefined; }
    return this.ballot.filter((item) => {
      const { kind_of_ballot_item: kindOfBallot, we_vote_id: weVoteId, candidate_list: candidateList } = item;
      // console.log("BallotStore ballotRemainingChoices, kindOfBallot: ", kindOfBallot);
      if (kindOfBallot === 'OFFICE') { // OFFICE - you are undecided if you haven't supported anyone
        return candidateList.filter(candidate => SupportStore.supportList[candidate.we_vote_id]).length === 0;
      } else { // MEASURES - you haven't decided if you neither support nor oppose
        return !SupportStore.supportList[weVoteId] && !SupportStore.opposeList[weVoteId];
      }
    });
  }

  get ballotRemainingChoicesLength () {
    const ballotRemainingChoices = this.ballotRemainingChoices || [];
    return ballotRemainingChoices.length || 0;
  }

  get ballotDecided () {
    if (!this.isLoaded()) { return undefined; }

    return this.ballotFilteredUnsupportedCandidates().filter((item) => {
      if (item.kind_of_ballot_item === 'OFFICE') { // Offices
        return item.candidate_list.length > 0;
      } else { // MEASURES
        return SupportStore.supportList[item.we_vote_id] || SupportStore.opposeList[item.we_vote_id];
      }
    });
  }

  get currentBallotItemUnfurledTracker () {
    return this.getState().ballotItemUnfurledTracker;
  }

  getBallotItemUnfurledStatus (weVoteId) {
    if (weVoteId) {
      // note: this method is made to always returns a Boolean
      // console.log(getBallotItemUnfurledStatus, this.getState())
      return !!this.getState().ballotItemUnfurledTracker[weVoteId];
    } else {
      return false;
    }
  }

  // Filters the ballot items which are type OFFICE
  ballotFilteredUnsupportedCandidates () {
    return this.ballot.map((item) => {
      const isOffice = item.kind_of_ballot_item === 'OFFICE';
      return isOffice ? this.filteredBallotItem(item) : item;
    });
  }

  // Filters out the unsupported candidates if the user has either not decided or does not support
  // all the candidates in the ballot_item.
  filteredBallotItem (ballotItem) { // eslint-disable-line
    for (let i = 0; i < ballotItem.candidate_list.length; i++) {
      const candidate = ballotItem.candidate_list[i];
      // If the user supports one candidate in the ballotItem then return all ballotItem candidates
      if (SupportStore.supportList[candidate.we_vote_id]) {
        return ballotItem;
      }
    }
    // Code will reach this point if the user has either not decided or does not support all the candidates in the ballotItem.
    return assign({}, ballotItem, { candidate_list: []});
  }

  getBallotByCompletionLevelFilterType (completionLevelFilterType) {
    switch (completionLevelFilterType) {
      case 'filterRemaining':
        return this.ballotRemainingChoices;
      case 'filterDecided':
        return this.ballotDecided;
      case 'filterReadyToVote':
        return this.ballot;
      default:
        return this.ballot;
    }
  }

  cleanCompletionLevelFilterType (completionLevelFilterType) { // eslint-disable-line
    switch (completionLevelFilterType) {
      case 'filterRemaining':
        return 'filterRemaining';
      case 'filterDecided':
        return 'filterDecided';
      case 'filterReadyToVote':
        return 'filterReadyToVote';
      default:
        return 'filterAllBallotItems';
    }
  }

  getCompletionLevelFilterTypeSaved () {
    // console.log("getCompletionLevelFilterTypeSaved:", this.getState().completionLevelFilterTypeSaved);
    return this.getState().completionLevelFilterTypeSaved || '';
  }

  getRaceLevelFilterTypeSaved () {
    // console.log("getRaceLevelFilterTypeSaved:", this.getState().raceLevelFilterTypeSaved);
    return this.getState().raceLevelFilterTypeSaved || '';
  }

  getTopLevelBallotItemWeVoteIds () {
    if (this.getState().ballotItemListCandidatesDict) {
      return Object.keys(this.getState().ballotItemListCandidatesDict);
    }
    return [];
  }

  getCandidateWeVoteIdsForOfficeWeVoteId (officeWeVoteId) {
    if (this.getState().ballotItemListCandidatesDict) {
      return this.getState().ballotItemListCandidatesDict[officeWeVoteId] || [];
    }
    return [];
  }

  positionListHasBeenRetrievedOnce (ballotItemWeVoteId) {
    return this.getState().positionListHasBeenRetrievedOnceByBallotItem[ballotItemWeVoteId] || false;
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    let ballotCaveat = '';
    let googleCivicElectionId;
    let newBallots = {};
    let revisedState;
    let tempBallotItemList = [];
    let voterBallotList = [];
    const { ballotItemListCandidatesDict, ballotItemUnfurledTracker: newBallotItemUnfurledTracker } = state;

    switch (action.type) {
      case 'ballotItemOptionsClear':
        // console.log("action.res", action.res)
        return {
          ...state,
          ballotItemSearchResultsList: [],
        };

      case 'ballotItemOptionsRetrieve':
        return {
          ...state,
          ballotItemSearchResultsList: action.res.ballot_item_list,
        };

      case 'positionListForBallotItem':
        // console.log("BallotStore, positionListForBallotItem response received.");
        state.positionListHasBeenRetrievedOnceByBallotItem[action.res.ballot_item_we_vote_id] = true;

        return {
          ...state,
          positionListHasBeenRetrievedOnceByBallotItem: state.positionListHasBeenRetrievedOnceByBallotItem,
        };

      case 'raceLevelFilterTypeSave':
        // console.log("raceLevelFilterTypeSave action.res", action.res);
        return {
          ...state,
          raceLevelFilterTypeSaved: action.res.race_level_filter_type_saved,
        };


      case 'completionLevelFilterTypeSave':
        // console.log("completionLevelFilterTypeSave action.res", action.res);
        return {
          ...state,
          completionLevelFilterTypeSaved: action.res.completion_level_filter_type_saved,
        };

      case 'voterAddressRetrieve':
        // console.log("BallotStore, voterAddressRetrieve response received, calling voterBallotItemsRetrieve now.");
        BallotActions.voterBallotItemsRetrieve();
        return state;

      case 'voterBallotItemsRetrieve':
        // console.log("BallotStore, voterBallotItemsRetrieve response received.");
        tempBallotItemList = action.res.ballot_item_list;
        // console.log("BallotStore, voterBallotItemsRetrieve, action.res.ballot_item_list: ", action.res.ballot_item_list);
        newBallots = {};
        if (state.ballots) {
          newBallots = state.ballots;
        }
        googleCivicElectionId = action.res.google_civic_election_id || 0;
        googleCivicElectionId = parseInt(googleCivicElectionId, 10);
        revisedState = state;
        if (googleCivicElectionId !== 0) {
          newBallots[googleCivicElectionId] = action.res;

          // Remove duplicate offices in ballot_item_list
          const weVoteIdAlreadySeen = [];
          const filteredBallotItems = [];
          newBallots[googleCivicElectionId].ballot_item_list.forEach((ballotItem) => {
            if (!weVoteIdAlreadySeen.includes(ballotItem.we_vote_id)) {
              weVoteIdAlreadySeen.push(ballotItem.we_vote_id);
              filteredBallotItems.push(ballotItem);
            }
            if (ballotItem.kind_of_ballot_item === 'OFFICE') {
              newBallotItemUnfurledTracker[ballotItem.we_vote_id] = false;
            }
          });

          // Sort measures alphabetically
          const alphanumericFilteredItems = [];
          const unfilteredItems = [];
          for (let i = 0; i < filteredBallotItems.length; i++) {
            if (filteredBallotItems[i].kind_of_ballot_item === 'MEASURE') {
              alphanumericFilteredItems.push(filteredBallotItems[i]);
            } else {
              unfilteredItems.push(filteredBallotItems[i]);
            }
          }
          alphanumericFilteredItems.sort((a, b) => a.ballot_item_display_name.localeCompare(b.ballot_item_display_name, undefined, { numeric: true, sensitivity: 'base' }));
          newBallots[googleCivicElectionId].ballot_item_list = alphanumericFilteredItems.concat(unfilteredItems);

          // tracking displaying raccoon flags for offices
          newBallots[googleCivicElectionId].ballot_item_list.forEach((ballotItem) => {
            if (ballotItem.kind_of_ballot_item === 'OFFICE') {
              newBallotItemUnfurledTracker[ballotItem.we_vote_id] = false;
            }
          });
          revisedState = Object.assign({}, revisedState, {
            ballots: newBallots,
            ballotItemUnfurledTracker: newBallotItemUnfurledTracker,
          });
        }
        // Now capture the candidate we vote ids under each office
        // let officeWeVoteId;
        if (ballotItemListCandidatesDict === undefined) {
          // Do not remove the following line
          console.log('ERROR: undefined ballotItemListCandidatesDict in BallotStore reduce');
        }

        if (tempBallotItemList && ballotItemListCandidatesDict) {
          tempBallotItemList.forEach((oneBallotItem) => {
            if (oneBallotItem.kind_of_ballot_item === 'OFFICE' && oneBallotItem.candidate_list) {
              const officeWeVoteId = oneBallotItem.we_vote_id;
              if (!ballotItemListCandidatesDict[officeWeVoteId]) {
                ballotItemListCandidatesDict[officeWeVoteId] = [];
              }
              oneBallotItem.candidate_list.forEach((oneCandidate) => {
                ballotItemListCandidatesDict[officeWeVoteId].push(oneCandidate.we_vote_id);
              });
            }
          });
          revisedState = Object.assign({}, revisedState, {
            ballotItemListCandidatesDict,
          });
        }
        return revisedState;

      case 'voterBallotListRetrieve':
        voterBallotList = action.res.voter_ballot_list;
        // console.log("BallotStore, voterBallotListRetrieve response received, voterBallotList: ", voterBallotList);
        return {
          ...state,
          ballotElectionList: voterBallotList,
        };

      case 'voterAddressSave':
        // console.log("BallotStore, voterAddressSave response received.");
        if (action.res.status === 'SIMPLE_ADDRESS_SAVE') {
          return state;
        } else {
          newBallots = state.ballots || {};
          googleCivicElectionId = action.res.google_civic_election_id || 0;
          googleCivicElectionId = parseInt(googleCivicElectionId, 10);
          if (googleCivicElectionId !== 0) {
            newBallots[googleCivicElectionId] = action.res;
            if (newBallots[googleCivicElectionId].ballot_found === false) {
              ballotCaveat = newBallots[googleCivicElectionId].ballot_caveat;
            }

            return {
              ...state,
              ballots: newBallots,
              ballotCaveat,
            };
          }
        }
        return state;

      case 'voterBallotItemOpenOrClosedSave':
        // console.log("action.res", action.res)
        return {
          ...state,
          ballotItemUnfurledTracker: action.res.ballot_item_unfurled_tracker,
        };

      case 'voterSignOut':
        // console.log("resetting BallotStore");
        BallotActions.voterBallotItemsRetrieve();
        return this.resetState();

      case 'error-voterBallotItemsRetrieve':
      default:
        return state;
    }
  }
}

export default new BallotStore(Dispatcher);
