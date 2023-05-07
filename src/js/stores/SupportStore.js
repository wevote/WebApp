import { ReduceStore } from 'flux/utils';
import assign from 'object-assign';
import CandidateActions from '../actions/CandidateActions';
import MeasureActions from '../actions/MeasureActions';
import SupportActions from '../actions/SupportActions';
import Dispatcher from '../common/dispatcher/Dispatcher';
import stringContains from '../common/utils/stringContains';
import { extractScoreFromNetworkFromPositionList } from '../utils/positionFunctions'; // eslint-disable-line import/no-cycle
import CandidateStore from './CandidateStore'; // eslint-disable-line import/no-cycle
import MeasureStore from './MeasureStore'; // eslint-disable-line import/no-cycle

class SupportStore extends ReduceStore {
  getInitialState () {
    return {
      voter_supports: {},
      voter_opposes: {},
      voter_statement_text: {},
      is_public_position: {},
      weVoteIdSupportListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      weVoteIdOpposeListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      nameSupportListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      nameOpposeListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
    };
  }

  resetState () {
    return this.getInitialState();
  }

  getBallotItemStatSheet (ballotItemWeVoteId) {
    if (!(this.voterSupportsList && this.voterOpposesList)) { //  && this.supportCounts && this.opposeCounts
      // console.log('getBallotItemStatSheet undefined');
      return undefined;
    }
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    // const isPolitician = stringContains('pol', ballotItemWeVoteId);
    let allCachedPositions = [];
    if (isCandidate) {
      allCachedPositions = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    } else if (isMeasure) {
      allCachedPositions = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
    }
    // TODO Reality check this
    // else if (isPolitician) {
    //   allCachedPositions = CandidateStore.getAllCachedPositionsByPoliticianWeVoteId(ballotItemWeVoteId);
    // }
    // console.log('getBallotItemStatSheet allCachedPositions:', allCachedPositions);
    const results = extractScoreFromNetworkFromPositionList(allCachedPositions);
    const { numberOfSupportPositionsForScore, numberOfOpposePositionsForScore, numberOfInfoOnlyPositionsForScore } = results;
    // console.log('getBallotItemStatSheet ballotItemWeVoteId:', ballotItemWeVoteId, ', this.voterSupportsList:', this.voterSupportsList);
    return {
      voterSupportsBallotItem: this.voterSupportsList[ballotItemWeVoteId] || false,
      voterOpposesBallotItem: this.voterOpposesList[ballotItemWeVoteId] || false,
      voterPositionIsPublic: this.isForPublicList[ballotItemWeVoteId] || false, // Default to friends only
      voterTextStatement: this.statementList[ballotItemWeVoteId] || '',
      numberOfSupportPositionsForScore: numberOfSupportPositionsForScore || 0,
      numberOfOpposePositionsForScore: numberOfOpposePositionsForScore || 0,
      numberOfInfoOnlyPositionsForScore: numberOfInfoOnlyPositionsForScore || 0,
    };
  }

  getVoterOpposesByBallotItemWeVoteId (ballotItemWeVoteId) {
    if (!(this.voterOpposesList)) {
      return false;
    }

    return this.voterOpposesList[ballotItemWeVoteId] || false;
  }

  getVoterTextStatementByBallotItemWeVoteId (ballotItemWeVoteId) {
    if (!(this.statementList)) {
      return false;
    }
    return this.statementList[ballotItemWeVoteId] || '';
  }

  getVoterSupportsByBallotItemWeVoteId (ballotItemWeVoteId) {
    if (!(this.voterSupportsList)) {
      return false;
    }

    return this.voterSupportsList[ballotItemWeVoteId] || false;
  }

  get voterSupportsList () {
    return this.getState().voter_supports;
  }

  getVoterSupportsListLength () {
    if (this.getState().voter_supports) {
      return Object.keys(this.getState().voter_supports).length;
    }
    return 0;
  }

  get voterOpposesList () {
    return this.getState().voter_opposes;
  }

  getVoterOpposesListLength () {
    if (this.getState().voter_opposes) {
      return Object.keys(this.getState().voter_opposes).length;
    }
    return 0;
  }

  get isForPublicList () {
    return this.getState().is_public_position;
  }

  get statementList () {
    return this.getState().voter_statement_text;
  }

  statementListWithChanges (statement_list, ballotItemWeVoteId, new_voter_statement_text) { // eslint-disable-line
    return assign({}, statement_list, { [ballotItemWeVoteId]: new_voter_statement_text });
  }

  isForPublicListWithChanges (is_public_position_list, ballotItemWeVoteId, is_public_position) { // eslint-disable-line
    return assign({}, is_public_position_list, { [ballotItemWeVoteId]: is_public_position });
  }

  // Turn action into a dictionary/object format with we_vote_id as key for fast lookup
  parseListToHash (property, list) { // eslint-disable-line
    const hashMap = {};
    if (list !== undefined && property) {
      list.forEach((el) => {
        if (el.ballot_item_we_vote_id && el[property]) {
          hashMap[el.ballot_item_we_vote_id] = el[property];
        }
      });
    }
    return hashMap;
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    let ballotItemWeVoteId = '';
    if (action.res.ballot_item_we_vote_id) {
      ballotItemWeVoteId = action.res.ballot_item_we_vote_id;
    }

    let isCandidate = false;
    let isMeasure = false;
    let revisedState;
    let voterOpposes = {};
    let voterSupports = {};

    switch (action.type) {
      case 'voterAddressRetrieve':
        // We should really avoid overly broad cascading API calls like this, they can cause problems
        SupportActions.voterAllPositionsRetrieve();
        return state;

      case 'voterAllPositionsRetrieve':
        // is_support is a property coming from 'position_list' in the incoming response
        // state.voter_supports is an updated hash with the contents of position list['is_support']
        return {
          ...state,
          voter_supports: this.parseListToHash('is_support', action.res.position_list),
          voter_opposes: this.parseListToHash('is_oppose', action.res.position_list),
          voter_statement_text: this.parseListToHash('statement_text', action.res.position_list),
          is_public_position: this.parseListToHash('is_public_position', action.res.position_list),
        };

      case 'voterOpposingSave':
        ({ voter_supports: voterSupports } = state);
        if (voterSupports && voterSupports[ballotItemWeVoteId] !== undefined) {
          delete voterSupports[ballotItemWeVoteId];
        }
        return {
          ...state,
          voter_supports: voterSupports,
          voter_opposes: assign({}, state.voter_opposes, { [ballotItemWeVoteId]: true }),
        };

      case 'voterStopOpposingSave':
        ({ voter_opposes: voterOpposes } = state);
        if (voterOpposes && voterOpposes[ballotItemWeVoteId] !== undefined) {
          delete voterOpposes[ballotItemWeVoteId];
        }
        return {
          ...state,
          voter_opposes: voterOpposes,
        };

      case 'voterSupportingSave':
        ({ voter_opposes: voterOpposes } = state);
        if (voterOpposes && voterOpposes[ballotItemWeVoteId] !== undefined) {
          delete voterOpposes[ballotItemWeVoteId];
        }
        return {
          ...state,
          voter_supports: assign({}, state.voter_supports, { [ballotItemWeVoteId]: true }),
          voter_opposes: voterOpposes,
        };

      case 'voterStopSupportingSave':
        ({ voter_supports: voterSupports } = state);
        if (voterSupports && voterSupports[ballotItemWeVoteId] !== undefined) {
          delete voterSupports[ballotItemWeVoteId];
        }
        return {
          ...state,
          voter_supports: voterSupports,
        };

      case 'voterPositionCommentSave':
        // Add the comment to the list in memory
        isCandidate = stringContains('cand', ballotItemWeVoteId);
        isMeasure = stringContains('meas', ballotItemWeVoteId);
        if (isCandidate) {
          CandidateActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
        } else if (isMeasure) {
          MeasureActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
        }
        return {
          ...state,
          voter_statement_text: this.statementListWithChanges(state.voter_statement_text, ballotItemWeVoteId, action.res.statement_text),
        };

      case 'voterPositionVisibilitySave':
        // Add the visibility to the list in memory
        return {
          ...state,
          is_public_position: this.isForPublicListWithChanges(state.is_public_position, ballotItemWeVoteId, action.res.is_public_position),
        };

      case 'voterSignOut':
        // console.log('resetting SupportStore');
        SupportActions.voterAllPositionsRetrieve();
        return this.resetState();

      case 'twitterNativeSignInSave':
      case 'twitterSignInRetrieve':
      case 'voterEmailAddressSignIn':
      case 'voterFacebookSignInRetrieve':
      case 'voterMergeTwoAccounts':
      case 'voterVerifySecretCode':
        // Voter is signing in
        // console.log('SupportStore call SupportActions.voterAllPositionsRetrieve action.type:', action.type);
        SupportActions.voterAllPositionsRetrieve();
        revisedState = state;
        revisedState = { ...revisedState,
          voter_supports: {},
          voter_opposes: {},
          voter_statement_text: {},
          is_public_position: {} };
        return revisedState;

      default:
        return state;
    }
  }
}

export default new SupportStore(Dispatcher);
