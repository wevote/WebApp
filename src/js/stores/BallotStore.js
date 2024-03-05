import { ReduceStore } from 'flux/utils';
import assign from 'object-assign';
import AppObservableStore from '../common/stores/AppObservableStore'; // eslint-disable-line import/no-cycle
import BallotActions from '../actions/BallotActions';
import CandidateActions from '../actions/CandidateActions';
import MeasureActions from '../actions/MeasureActions'; // eslint-disable-line import/no-cycle
import Dispatcher from '../common/dispatcher/Dispatcher';
import { formatStateName } from '../common/utils/formatStateName';
import stringContains from '../common/utils/stringContains';
import toTitleCase from '../common/utils/toTitleCase';
import convertVoterGuideToElection from '../utils/voterGuideFunctions';
import SupportStore from './SupportStore'; // eslint-disable-line import/no-cycle
import VoterStore from './VoterStore';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-param-reassign: 0 */

class BallotStore extends ReduceStore {
  getInitialState () {
    return {
      allBallotItemsByOfficeOrMeasure: [],
      allBallotItemsByOfficeOrMeasureDict: {},
      allBallotItemsFlattened: [],
      allBallotItemsFlattenedDict: {},
      allBallotItemsHaveBeenRetrievedForElection: {},
      allBallotItemsRetrieveCalled: false,
      ballots: {},
      ballotItemSearchResultsList: [],
      ballotItemUnfurledTracker: {},
      ballotItemListCandidatesDict: {}, // Dictionary with ballot_item_we_vote_id as key and list of candidate we_vote_ids as value
      nextNationalElectionDayText: '',
      positionListHasBeenRetrievedOnceByBallotItem: {}, // Dictionary with ballot_item_we_vote_id as key and true/false as value
      positionListFromFriendsHasBeenRetrievedOnceByBallotItem: {}, // Dictionary with ballot_item_we_vote_id as key and true/false as value
      voterGuideElectionListByElectionId: {}, // Dictionary with google_civic_election_id as key and list of voter guides for this voter for this election as value
      voterBallotItemsRetrieveHasReturned: false,
    };
  }

  resetState () {
    return this.getInitialState();
  }

  isLoaded () {
    const civicId = VoterStore.electionId();
    return !!(this.getState().ballots && this.getState().ballots[civicId] && SupportStore.voterSupportsList);
  }

  allBallotItemsRetrieveCalled () {
    return this.getState().allBallotItemsRetrieveCalled;
  }

  allBallotItemsHaveBeenRetrievedForElection (googleCivicElectionId, stateCode) {
    let stateCodeLowerCase;
    if (stateCode) {
      stateCodeLowerCase = stateCode.toLowerCase();
    }
    if (this.getState().allBallotItemsHaveBeenRetrievedForElection[googleCivicElectionId]) {
      return this.getState().allBallotItemsHaveBeenRetrievedForElection[googleCivicElectionId][stateCodeLowerCase] || false;
    } else {
      return false;
    }
  }

  getAllBallotItemsByOfficeOrMeasure () {
    return this.getState().allBallotItemsByOfficeOrMeasure || [];
  }

  getAllBallotItemsFlattened (googleCivicElectionId = 0) {
    if (googleCivicElectionId) {
      const allBallotItemsSnapshot = this.getState().allBallotItemsFlattened || [];
      return allBallotItemsSnapshot.filter((item) => item.google_civic_election_id === googleCivicElectionId);
    } else {
      return this.getState().allBallotItemsFlattened || [];
    }
  }

  get getAllBallotItemsLastStateCodeReceived () {
    return this.getState().allBallotItemsLastStateCodeReceived;
  }

  get ballotProperties () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.electionId();
    const ballotProperties = assign({}, this.getState().ballots[civicId]);
    // console.log('ballotProperties:', ballotProperties);
    ballotProperties.ballot_item_list = null;
    return ballotProperties;
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
    if (!this.isLoaded()) { return ''; }
    const civicId = VoterStore.electionId();
    // console.log('ballots:', this.getState().ballots[civicId]);
    // console.log('currentBallotElectionName:', this.getState().voterGuideElectionListByElectionId[civicId]);
    if (this.getState().ballots[civicId] && this.getState().ballots[civicId].election_name) {
      return this.getState().ballots[civicId].election_name;
    } else if (this.getState().voterGuideElectionListByElectionId[civicId] && this.getState().voterGuideElectionListByElectionId[civicId].election_name) {
      return this.getState().voterGuideElectionListByElectionId[civicId].election_name;
    }
    return '';
  }

  get currentBallotElectionDate () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.electionId();
    if (this.getState().ballots[civicId] && this.getState().ballots[civicId].election_day_text) {
      return this.getState().ballots[civicId].election_day_text;
    } else if (this.getState().voterGuideElectionListByElectionId[civicId] && this.getState().voterGuideElectionListByElectionId[civicId].election_day_text) {
      return this.getState().voterGuideElectionListByElectionId[civicId].election_day_text;
    }
    return '';
  }

  get nextNationalElectionDayText () {
    return this.getState().nextNationalElectionDayText || '2024-11-05';
  }

  get currentBallotGoogleCivicElectionId () {
    if (!this.isLoaded()) { return undefined; }
    return VoterStore.electionId();
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
      // console.log('BallotStore ballotRemainingChoices, kindOfBallot: ', kindOfBallot, ', weVoteId:', weVoteId);
      if (kindOfBallot === 'OFFICE') { // OFFICE - you are undecided if you haven't supported anyone
        return candidateList.filter((candidate) => SupportStore.voterSupportsList[candidate.we_vote_id]).length === 0;
      } else { // MEASURES - you haven't decided if you neither support nor oppose
        return !SupportStore.voterSupportsList[weVoteId] && !SupportStore.voterOpposesList[weVoteId];
      }
    });
  }

  getBallotItemsStatusCounts () {
    const ballotItemsStatusCounts = {
      allCandidatesAllCompleted: false,
      allCandidatesNumberCompleted: 0,
      allCandidatesButtonNeeded: false,
      allCandidatesTotalNumber: 0,
      federalAllCompleted: false,
      federalNumberCompleted: 0,
      federalButtonNeeded: false,
      federalTotalNumber: 0,
      localAllCompleted: false,
      localNumberCompleted: 0,
      localButtonNeeded: false,
      localTotalNumber: 0,
      measureAllCompleted: false,
      measureNumberCompleted: 0,
      measureButtonNeeded: false,
      measureTotalNumber: 0,
      stateAllCompleted: false,
      stateNumberCompleted: 0,
      stateButtonNeeded: false,
      stateTotalNumber: 0,
    };
    if (!this.isLoaded()) { return ballotItemsStatusCounts; }
    let allCandidatesNumberCompleted = 0;
    let allCandidatesTotalNumber = 0;
    let ballotItem;
    let candidateIndex;
    let candidateWeVote;
    let choicesMadeForThisOffice = 0;
    let federalNumberCompleted = 0;
    let federalTotalNumber = 0;
    let index;
    let localNumberCompleted = 0;
    let localTotalNumber = 0;
    let measureNumberCompleted = 0;
    let measureTotalNumber = 0;
    let stateNumberCompleted = 0;
    let stateTotalNumber = 0;
    for (index = 0; index < this.ballot.length; index++) {
      ballotItem = this.ballot[index];
      const {
        candidate_list: candidateList, kind_of_ballot_item: kindOfBallot,
        race_office_level: raceOfficeLevel, we_vote_id: weVoteId,
      } = ballotItem;
      // console.log('BallotStore getBallotItemStatusCounts, ballotItem: ', ballotItem);
      if (kindOfBallot === 'OFFICE') { // OFFICE - you are undecided if you haven't supported anyone
        // return candidateList.filter(candidate => SupportStore.voterSupportsList[candidate.we_vote_id]).length === 0;
        // console.log('BallotStore getBallotItemStatusCounts, ballotItem: ', ballotItem);
        // TODO ADD number_to_choose to the ballot item return from API server
        // For now we assume one candidate to choose per race
        allCandidatesTotalNumber += 1;
        federalTotalNumber += (raceOfficeLevel === 'Federal') ? 1 : 0;
        localTotalNumber += (raceOfficeLevel === 'Local') ? 1 : 0;
        stateTotalNumber += (raceOfficeLevel === 'State') ? 1 : 0;
        choicesMadeForThisOffice = 0;
        for (candidateIndex = 0; candidateIndex < candidateList.length; candidateIndex++) {
          candidateWeVote = candidateList[candidateIndex].we_vote_id;
          if (SupportStore.voterSupportsList[candidateWeVote] && SupportStore.voterSupportsList[candidateWeVote].length !== 0) {
            choicesMadeForThisOffice += 1;
          }
        }
        if (choicesMadeForThisOffice) {
          allCandidatesNumberCompleted += 1;
          federalNumberCompleted += (raceOfficeLevel === 'Federal') ? 1 : 0;
          localNumberCompleted += (raceOfficeLevel === 'Local') ? 1 : 0;
          stateNumberCompleted += (raceOfficeLevel === 'State') ? 1 : 0;
        }
      } else { // MEASURES - you haven't decided if you neither support nor oppose
        // return ! && !SupportStore.voterOpposesList[weVoteId];
        measureTotalNumber += 1;
        if ((SupportStore.voterSupportsList[weVoteId] && SupportStore.voterSupportsList[weVoteId].length !== 0) ||
            (SupportStore.voterOpposesList[weVoteId] && SupportStore.voterOpposesList[weVoteId].length !== 0)) {
          measureNumberCompleted += 1;
        }
      }
    }
    // console.log('measureNumberCompleted:', measureNumberCompleted, ', measureTotalNumber:', measureTotalNumber);
    if (allCandidatesTotalNumber > 0) {
      ballotItemsStatusCounts.allCandidatesButtonNeeded = true;
      ballotItemsStatusCounts.allCandidatesAllCompleted = (allCandidatesNumberCompleted >= allCandidatesTotalNumber);
      ballotItemsStatusCounts.allCandidatesNumberCompleted = allCandidatesNumberCompleted;
      ballotItemsStatusCounts.allCandidatesTotalNumber = allCandidatesTotalNumber;
    }
    if (federalTotalNumber > 0) {
      ballotItemsStatusCounts.federalButtonNeeded = true;
      ballotItemsStatusCounts.federalAllCompleted = (federalNumberCompleted >= federalTotalNumber);
      ballotItemsStatusCounts.federalNumberCompleted = federalNumberCompleted;
      ballotItemsStatusCounts.federalTotalNumber = federalTotalNumber;
    }
    if (localTotalNumber > 0) {
      ballotItemsStatusCounts.localButtonNeeded = true;
      ballotItemsStatusCounts.localAllCompleted = (localNumberCompleted >= localTotalNumber);
      ballotItemsStatusCounts.localNumberCompleted = localNumberCompleted;
      ballotItemsStatusCounts.localTotalNumber = localTotalNumber;
    }
    if (measureTotalNumber > 0) {
      ballotItemsStatusCounts.measureButtonNeeded = true;
      ballotItemsStatusCounts.measureAllCompleted = (measureNumberCompleted >= measureTotalNumber);
      ballotItemsStatusCounts.measureNumberCompleted = measureNumberCompleted;
      ballotItemsStatusCounts.measureTotalNumber = measureTotalNumber;
    }
    if (stateTotalNumber > 0) {
      ballotItemsStatusCounts.stateButtonNeeded = true;
      ballotItemsStatusCounts.stateAllCompleted = (stateNumberCompleted >= stateTotalNumber);
      ballotItemsStatusCounts.stateNumberCompleted = stateNumberCompleted;
      ballotItemsStatusCounts.stateTotalNumber = stateTotalNumber;
    }
    return ballotItemsStatusCounts;
  }

  get ballotRemainingChoicesLength () {
    const ballotRemainingChoices = this.ballotRemainingChoices || [];
    return ballotRemainingChoices.length || 0;
  }

  get ballotDecided () {
    // console.log('BallotStore, ballotDecided');
    if (!this.isLoaded()) { return undefined; }

    return this.ballotFilteredUnsupportedCandidates().filter((item) => {
      if (item.kind_of_ballot_item === 'OFFICE') { // Offices
        return item.candidate_list.length > 0;
      } else { // MEASURES
        return SupportStore.voterSupportsList[item.we_vote_id] || SupportStore.voterOpposesList[item.we_vote_id];
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
      if (SupportStore.voterSupportsList[candidate.we_vote_id]) {
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
    // console.log('getCompletionLevelFilterTypeSaved:', this.getState().completionLevelFilterTypeSaved);
    return this.getState().completionLevelFilterTypeSaved || '';
  }

  getRaceLevelFilterTypeSaved () {
    // console.log('getRaceLevelFilterTypeSaved:', this.getState().raceLevelFilterTypeSaved);
    return this.getState().raceLevelFilterTypeSaved || 'All';
  }

  getOriginalTextAddress (simple = true) {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.electionId();
    if (simple) {
      let originalTextAddressSimple = '';
      if (this.getState().ballots[civicId]) {
        if (this.getState().ballots[civicId].original_text_city) {
          let adjustedCity = this.getState().ballots[civicId].original_text_city;
          if (adjustedCity.toUpperCase() === adjustedCity) {
            adjustedCity = toTitleCase(adjustedCity);
          }
          originalTextAddressSimple += adjustedCity;
          if (this.getState().ballots[civicId].original_text_state || this.getState().ballots[civicId].original_text_zip) {
            originalTextAddressSimple += ', ';
          }
        }
        if (this.getState().ballots[civicId].original_text_state) {
          originalTextAddressSimple += formatStateName(this.getState().ballots[civicId].original_text_state);
          originalTextAddressSimple += ' ';
        }
        if (this.getState().ballots[civicId].original_text_zip) {
          originalTextAddressSimple += this.getState().ballots[civicId].original_text_zip;
        }
      }
      return originalTextAddressSimple;
    }
    return '';
  }

  getOriginalTextState () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.electionId();
    let originalTextState = '';
    if (this.getState().ballots[civicId]) {
      if (this.getState().ballots[civicId].original_text_state) {
        originalTextState += formatStateName(this.getState().ballots[civicId].original_text_state);
      }
    }
    return originalTextState;
  }

  getSubstitutedAddress (simple = true) {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.electionId();
    if (simple) {
      let substitutedAddressSimple = '';
      if (this.getState().ballots[civicId]) {
        if (this.getState().ballots[civicId].substituted_address_city) {
          let adjustedCity = this.getState().ballots[civicId].substituted_address_city;
          if (adjustedCity.toUpperCase() === adjustedCity) {
            adjustedCity = toTitleCase(adjustedCity);
          }
          substitutedAddressSimple += adjustedCity;
          if (this.getState().ballots[civicId].substituted_address_state || this.getState().ballots[civicId].substituted_address_zip) {
            substitutedAddressSimple += ', ';
          }
        }
        if (this.getState().ballots[civicId].substituted_address_state) {
          substitutedAddressSimple += formatStateName(this.getState().ballots[civicId].substituted_address_state);
          substitutedAddressSimple += ' ';
        }
        if (this.getState().ballots[civicId].substituted_address_zip) {
          substitutedAddressSimple += this.getState().ballots[civicId].substituted_address_zip;
        }
      }
      return substitutedAddressSimple;
    }
    return '';
  }

  getSubstitutedState () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.electionId();
    let substitutedState = '';
    if (this.getState().ballots[civicId]) {
      if (this.getState().ballots[civicId].substituted_address_state) {
        substitutedState += formatStateName(this.getState().ballots[civicId].substituted_address_state);
      }
    }
    return substitutedState;
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

  getTextForMapSearch () {
    return this.getState().textForMapSearch || '';
  }

  positionListHasBeenRetrievedOnce (ballotItemWeVoteId) {
    return this.getState().positionListHasBeenRetrievedOnceByBallotItem[ballotItemWeVoteId] || false;
  }

  positionListFromFriendsHasBeenRetrievedOnce (ballotItemWeVoteId) {
    return this.getState().positionListFromFriendsHasBeenRetrievedOnceByBallotItem[ballotItemWeVoteId] || false;
  }

  voterBallotItemsRetrieveHasReturned () {
    return this.getState().voterBallotItemsRetrieveHasReturned;
  }

  reduce (state, action) {
    let allBallotItemsByOfficeOrMeasureDict = {}; // Key is office or measure weVoteId
    let allBallotItemsFlattenedDict = {}; // Key is office, candidate or measure weVoteId
    let allBallotItemsHaveBeenRetrievedForElection = {};
    let allBallotItemsStateCode = '';
    let ballotCaveat = '';
    let ballotItemWeVoteIdList = [];
    let ballotItemWeVoteIdTemp = '';
    let convertedElection;
    let googleCivicElectionId;
    let isCandidate = false;
    let isMeasure = false;
    let newBallots = {};
    let nextNationalElectionDayText = '';
    let positionListFromFriendsHasBeenRetrievedOnceByBallotItem = {};
    let revisedState;
    let tempBallotItemList = [];
    let textForMapSearch = '';
    let voterBallotItemsRetrieveHasReturned = false;
    let voterBallotList = [];
    let voterGuides;
    let voterGuideElectionListByElectionId;
    const { ballotItemListCandidatesDict, ballotItemUnfurledTracker: newBallotItemUnfurledTracker } = state;

    switch (action.type) {
      case 'allBallotItemsRetrieve':
        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

        // console.log('BallotStore, voterBallotItemsRetrieve response received.');
        tempBallotItemList = action.res.ballot_item_list;
        // console.log('BallotStore, voterBallotItemsRetrieve, action.res.ballot_item_list: ', action.res.ballot_item_list);
        allBallotItemsByOfficeOrMeasureDict = {};
        if (state.allBallotItemsByOfficeOrMeasureDict) {
          ({ allBallotItemsByOfficeOrMeasureDict } = state);
        }
        // We use this dict for searching
        allBallotItemsFlattenedDict = {};
        if (state.allBallotItemsFlattenedDict) {
          ({ allBallotItemsFlattenedDict } = state);
        }
        allBallotItemsHaveBeenRetrievedForElection = {};
        if (state.allBallotItemsHaveBeenRetrievedForElection) {
          ({ allBallotItemsHaveBeenRetrievedForElection } = state);
        }
        googleCivicElectionId = action.res.google_civic_election_id || 0;
        googleCivicElectionId = parseInt(googleCivicElectionId, 10);
        allBallotItemsStateCode = action.res.state_code;
        if (allBallotItemsStateCode) {
          allBallotItemsStateCode = allBallotItemsStateCode.toLowerCase();
        }
        if (googleCivicElectionId && allBallotItemsStateCode) {
          if (!allBallotItemsHaveBeenRetrievedForElection[googleCivicElectionId]) {
            allBallotItemsHaveBeenRetrievedForElection[googleCivicElectionId] = {};
          }
          allBallotItemsHaveBeenRetrievedForElection[googleCivicElectionId][allBallotItemsStateCode] = true;
        }

        revisedState = state;

        tempBallotItemList.forEach((topBallotItem) => {
          // If office data is received without a race_office_level, default to 'Federal'
          if (topBallotItem.kind_of_ballot_item === 'OFFICE' && !topBallotItem.race_office_level) {
            topBallotItem.race_office_level = 'Federal';
          }
          if (topBallotItem.kind_of_ballot_item === 'MEASURE' && !topBallotItem.race_office_level) {
            topBallotItem.race_office_level = 'Measure';
          }
          allBallotItemsByOfficeOrMeasureDict[topBallotItem.we_vote_id] = topBallotItem;
          allBallotItemsFlattenedDict[topBallotItem.we_vote_id] = topBallotItem;
          // if (topBallotItem.candidate_list) {
          //   topBallotItem.candidate_list.forEach((oneCandidate) => {
          //     // Add the following for filtering
          //     // If candidate data is received without a race_office_level, default to 'Federal'
          //     if (!oneCandidate.race_office_level) {
          //       oneCandidate.race_office_level = topBallotItem.race_office_level;
          //     }
          //     oneCandidate.kind_of_ballot_item = 'CANDIDATE';
          //     oneCandidate.office_we_vote_id = topBallotItem.we_vote_id;
          //     oneCandidate.google_civic_election_id = topBallotItem.google_civic_election_id;
          //     allBallotItemsFlattenedDict[oneCandidate.we_vote_id] = oneCandidate;
          //   });
          // }
        });

        revisedState = { ...revisedState,
          allBallotItemsByOfficeOrMeasure: Object.values(allBallotItemsByOfficeOrMeasureDict),
          allBallotItemsByOfficeOrMeasureDict,
          allBallotItemsFlattened: Object.values(allBallotItemsFlattenedDict),
          allBallotItemsFlattenedDict,
          allBallotItemsHaveBeenRetrievedForElection,
          allBallotItemsLastStateCodeReceived: allBallotItemsStateCode };
        return revisedState;

      case 'allBallotItemsRetrieveCalled':
        // Make note that allBallotItemsRetrieved has been called - do not call again
        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

        return { ...state, allBallotItemsRetrieveCalled: action.payload };

      case 'ballotItemOptionsClear':
        // console.log('action.res', action.res)
        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

        return {
          ...state,
          ballotItemSearchResultsList: [],
        };

      case 'ballotItemOptionsRetrieve':
        return {
          ...state,
          ballotItemSearchResultsList: action.res.ballot_item_list,
        };

      case 'setBallotCaveat':
        return { ...state, ballotCaveat: action.payload };

      case 'positionListForBallotItem':
        // console.log('BallotStore, positionListForBallotItem response received.');
        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

        if (action.res.count === 0) return state;

        state.positionListHasBeenRetrievedOnceByBallotItem[action.res.ballot_item_we_vote_id] = true;

        return {
          ...state,
          positionListHasBeenRetrievedOnceByBallotItem: state.positionListHasBeenRetrievedOnceByBallotItem,
        };

      case 'positionListForBallotItemFromFriends':
        // console.log('BallotStore, positionListForBallotItemFromFriends response received.');
        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

        if (action.res.count === 0) return state;

        state.positionListFromFriendsHasBeenRetrievedOnceByBallotItem[action.res.ballot_item_we_vote_id] = true;

        return {
          ...state,
          positionListFromFriendsHasBeenRetrievedOnceByBallotItem: state.positionListFromFriendsHasBeenRetrievedOnceByBallotItem,
        };

      case 'raceLevelFilterTypeSave':
        // console.log('raceLevelFilterTypeSave action.res', action.res);
        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

        return {
          ...state,
          raceLevelFilterTypeSaved: action.res.race_level_filter_type_saved,
        };


      case 'completionLevelFilterTypeSave':
        // console.log('completionLevelFilterTypeSave action.res', action.res);
        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

        return {
          ...state,
          completionLevelFilterTypeSaved: action.res.completion_level_filter_type_saved,
        };

      case 'voterAddressRetrieve':
        // console.log('BallotStore, voterAddressRetrieve response received, calling voterBallotItemsRetrieve now.');
        // DALE NOTE: 2020-02-11 Experimenting with this off
        // BallotActions.voterBallotItemsRetrieve();  // Avoid calling actions from Stores, it often results in unintended useless API queries
        return state;

      case 'voterAddressOnlyRetrieve':
        // voterAddressRetrieve causes a cascade of other actions, rather than untangle the cascade...
        return state;

      case 'voterAddressSave':
      case 'voterBallotItemsRetrieve':
        if (action.res.status === 'SIMPLE_ADDRESS_SAVE') {
          // console.log('BallotStore, voterAddressSave SIMPLE_ADDRESS_SAVE response received.');
          return state;
        }
        // console.log('BallotStore, ', action.type, ' response received, action.res:', action.res);
        AppObservableStore.voterBallotItemsRetrieveHasBeenCalled(false);
        if (action.res && action.res.success === false && action.res.voter_device_id_not_valid) {
          // We need to stop. The hope is that the voter_device_id will get sorted elsewhere, and then this
          // retrieve can be triggered again.
          console.log('BallotStore, voterBallotItemsRetrieve response received, but voter_device_id_not_valid');
          voterBallotItemsRetrieveHasReturned = false;
        } else if (action.res && action.res.success === false && stringContains('VALID_VOTER_DEVICE_ID_MISSING', action.res.status)) {
          // On the first call, we didn't have a valid voter_device_id yet. Call again.
          // console.log('BallotStore, voterBallotItemsRetrieve response received, action.res:', action.res);
          // Add a 5-second delay
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            BallotActions.voterBallotItemsRetrieve(action.res.google_civic_election_id);
          }, 5000);
          voterBallotItemsRetrieveHasReturned = false;
        } else {
          voterBallotItemsRetrieveHasReturned = true;
        }

        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

        tempBallotItemList = action.res.ballot_item_list;
        // console.log('BallotStore, voterBallotItemsRetrieve, action.res.ballot_item_list: ', action.res.ballot_item_list);
        newBallots = {};
        if (state.ballots) {
          newBallots = state.ballots;
        }
        revisedState = state;
        ballotCaveat = action.res.ballot_caveat;
        revisedState = { ...revisedState, ballotCaveat };
        googleCivicElectionId = action.res.google_civic_election_id || 0;
        googleCivicElectionId = parseInt(googleCivicElectionId, 10);
        nextNationalElectionDayText = action.res.next_national_election_day_text;
        if (nextNationalElectionDayText && nextNationalElectionDayText !== '') {
          revisedState = { ...revisedState, nextNationalElectionDayText };
        }
        textForMapSearch = action.res.text_for_map_search;
        revisedState = { ...revisedState, textForMapSearch };
        revisedState = { ...revisedState, voterBallotItemsRetrieveHasReturned };
        if (googleCivicElectionId !== 0) {
          newBallots[googleCivicElectionId] = action.res;

          // Remove duplicate offices in ballot_item_list
          const weVoteIdAlreadySeen = [];
          const filteredBallotItems = [];
          newBallots[googleCivicElectionId].ballot_item_list.forEach((ballotItem) => {
            if (!weVoteIdAlreadySeen.includes(ballotItem.we_vote_id)) {
              weVoteIdAlreadySeen.push(ballotItem.we_vote_id);
              // If office data is received without a race_office_level, default to 'Federal'
              if (ballotItem.kind_of_ballot_item === 'OFFICE' && !ballotItem.race_office_level) {
                ballotItem.race_office_level = 'Federal';
              }
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
          newBallots[googleCivicElectionId].ballot_item_list = unfilteredItems.concat(alphanumericFilteredItems);

          // tracking displaying raccoon flags for offices
          newBallots[googleCivicElectionId].ballot_item_list.forEach((ballotItem) => {
            if (ballotItem.kind_of_ballot_item === 'OFFICE') {
              newBallotItemUnfurledTracker[ballotItem.we_vote_id] = false;
            }
          });
          revisedState = { ...revisedState,
            ballots: newBallots,
            ballotItemUnfurledTracker: newBallotItemUnfurledTracker };
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
          revisedState = { ...revisedState, ballotItemListCandidatesDict };
        }
        if (tempBallotItemList) {
          tempBallotItemList.forEach((topBallotItem) => {
            // If office data is received without a race_office_level, default to 'Federal'
            if (topBallotItem.kind_of_ballot_item === 'OFFICE' && !topBallotItem.race_office_level) {
              topBallotItem.race_office_level = 'Federal';
            }
            if (topBallotItem.kind_of_ballot_item === 'MEASURE' && !topBallotItem.race_office_level) {
              topBallotItem.race_office_level = 'Measure';
            }
            allBallotItemsByOfficeOrMeasureDict[topBallotItem.we_vote_id] = topBallotItem;
            allBallotItemsFlattenedDict[topBallotItem.we_vote_id] = topBallotItem;
            if (topBallotItem.candidate_list) {
              topBallotItem.candidate_list.forEach((oneCandidate) => {
                // Add the following for filtering
                // If candidate data is received without a race_office_level, default to 'Federal'
                if (!oneCandidate.race_office_level) {
                  oneCandidate.race_office_level = topBallotItem.race_office_level;
                }
                oneCandidate.kind_of_ballot_item = 'CANDIDATE';
                oneCandidate.office_we_vote_id = topBallotItem.we_vote_id;
                oneCandidate.google_civic_election_id = topBallotItem.google_civic_election_id;
                allBallotItemsFlattenedDict[oneCandidate.we_vote_id] = oneCandidate;
              });
            }
          });
          revisedState = {
            ...revisedState,
            allBallotItemsByOfficeOrMeasureDict,
            allBallotItemsFlattened: Object.values(allBallotItemsFlattenedDict),
            allBallotItemsFlattenedDict,
          };
        }
        return revisedState;

      case 'voterBallotListRetrieve':
        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

        voterBallotList = action.res.voter_ballot_list;
        // console.log('BallotStore, voterBallotListRetrieve response received, voterBallotList: ', voterBallotList);
        return {
          ...state,
          ballotElectionList: voterBallotList || [],
        };

        /*
      case 'voterAddressSave':
        // console.log('BallotStore, voterAddressSave response received.');
        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

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
        */

      case 'voterBallotItemOpenOrClosedSave':
        // console.log('action.res', action.res)
        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

        return {
          ...state,
          ballotItemUnfurledTracker: action.res.ballot_item_unfurled_tracker,
        };

      case 'voterGuidesRetrieve':
        voterGuides = action.res.voter_guides;
        voterGuideElectionListByElectionId = state.voterGuideElectionListByElectionId || {};
        voterGuides.forEach((oneVoterGuide) => {
          if (voterGuideElectionListByElectionId[oneVoterGuide.google_civic_election_id] === undefined) {
            convertedElection = convertVoterGuideToElection(oneVoterGuide);
            if (convertedElection !== false) {
              voterGuideElectionListByElectionId[oneVoterGuide.google_civic_election_id] = convertedElection;
            }
          }
        });
        // console.log('voterGuideElectionListByElectionId:', voterGuideElectionListByElectionId);
        return {
          ...state,
          voterGuideElectionListByElectionId,
        };

      case 'voterSignOut':
        // console.log('voterSignOut resetting BallotStore resetState');
        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

        BallotActions.voterBallotItemsRetrieve();
        return this.resetState();

      case 'twitterSignInRetrieve':
      case 'voterEmailAddressSignIn':
      case 'voterFacebookSignInRetrieve':
      case 'voterMergeTwoAccounts':
      case 'voterVerifySecretCode':
        // Voter is signing in
        // console.log('BallotStore resetVoterSpecificState action.type:', action.type);
        // Exit if we don't have a successful response
        if (!action.res || !action.res.success) return state;

        // Cycle through all existing positionListFromFriendsHasBeenRetrievedOnceByBallotItem and request again
        ({ positionListFromFriendsHasBeenRetrievedOnceByBallotItem } = state);
        ballotItemWeVoteIdList = Object.keys(positionListFromFriendsHasBeenRetrievedOnceByBallotItem);
        for (let i = 0; i < ballotItemWeVoteIdList.length; i++) {
          ballotItemWeVoteIdTemp = ballotItemWeVoteIdList[i];
          isCandidate = stringContains('cand', ballotItemWeVoteIdTemp);
          isMeasure = stringContains('meas', ballotItemWeVoteIdTemp);
          if (isCandidate) {
            CandidateActions.positionListForBallotItemFromFriends(ballotItemWeVoteIdTemp);
          } else if (isMeasure) {
            MeasureActions.positionListForBallotItemFromFriends(ballotItemWeVoteIdTemp);
          }
        }
        revisedState = state;
        revisedState = { ...revisedState,
          allBallotItemsHaveBeenRetrievedForElection: {},
          ballotItemSearchResultsList: [],
          ballotItemUnfurledTracker: {},
          positionListFromFriendsHasBeenRetrievedOnceByBallotItem: {}, // Dictionary with ballot_item_we_vote_id as key and true/false as value
        };
        return revisedState;

      case 'error-voterBallotItemsRetrieve':
      default:
        return state;
    }
  }
}

export default new BallotStore(Dispatcher);
