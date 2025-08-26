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
      ballotItemMappingToPosition: {}, // Dictionary with key: candidate, measure, politician we_vote_id, value: position_we_vote_id
      is_public_position: {},
      nameSupportListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      nameOpposeListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      voterPositionsByPositionWeVoteId: {}, // Dictionary with key: position_we_vote_id, value: the position dict
      voter_opposes: {},
      voter_statement_text: {},
      voter_supports: {},
      weVoteIdSupportListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      weVoteIdOpposeListForEachBallotItem: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
    };
  }

  resetState () {
    return this.getInitialState();
  }

  getBallotItemStatSheet (ballotItemWeVoteId, politicianWeVoteId = '') {
    if (!(this.voterSupportsList && this.voterOpposesList)) { //  && this.supportCounts && this.opposeCounts
      console.log('getBallotItemStatSheet undefined');
      return undefined;
    }
    const isCandidate = stringContains('cand', ballotItemWeVoteId);
    const isMeasure = stringContains('meas', ballotItemWeVoteId);
    const isPolitician = stringContains('pol', politicianWeVoteId);
    // console.log('getBallotItemStatSheet, isCandidate:', isCandidate, 'isMeasure:', isMeasure, 'isPolitician:', isPolitician, ', politicianWeVoteId: ', politicianWeVoteId);
    let allCachedPositions = [];
    if (isCandidate) {
      allCachedPositions = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    } else if (isMeasure) {
      allCachedPositions = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
    } else if (isPolitician) {
      allCachedPositions = CandidateStore.getAllCachedPositionsByPoliticianWeVoteId(politicianWeVoteId);
      // console.log('getBallotItemStatSheet isPolitician:, ', politicianWeVoteId, ', allCachedPositions:', allCachedPositions);
      const positionFromVoter = this.getPositionFromBallotItemWeVoteId(politicianWeVoteId); // This supports politicianWeVoteId
      // console.log('getBallotItemStatSheet isPolitician, positionFromVoter:', positionFromVoter, ', this.voterSupportsList:', this.voterSupportsList);
      if (positionFromVoter && positionFromVoter.position_we_vote_id) {
        // Find the index of the existing position with the same position_we_vote_id
        const existingIndex = allCachedPositions.findIndex((position) => position.position_we_vote_id === positionFromVoter.position_we_vote_id);
        // console.log('getBallotItemStatSheet, existingIndex:', existingIndex);
        if (existingIndex !== -1) {
          // Replace the existing position
          allCachedPositions[existingIndex] = positionFromVoter;
          // console.log('getBallotItemStatSheet, replaced position');
        } else {
          // Add the new position
          allCachedPositions.push(positionFromVoter);
          // console.log('getBallotItemStatSheet, added new position');
        }
      }
    }
    // if (politicianWeVoteId === 'wv87pol49070' || ballotItemWeVoteId === 'wv87cand3133998') { // Adam Schiff
    //   console.log('getBallotItemStatSheet, ballotItemWeVoteId:', ballotItemWeVoteId, ', politicianWeVoteId: ', politicianWeVoteId, ', allCachedPositions:', allCachedPositions);
    // }
    const results = extractScoreFromNetworkFromPositionList(allCachedPositions);
    const { numberOfSupportPositionsForScore, numberOfOpposePositionsForScore, numberOfInfoOnlyPositionsForScore } = results;
    // if (politicianWeVoteId === 'wv87pol49861') {  // Katie Porter: wv87pol12700, Barbara Lee: wv02pol41, James P. Bradley: wv87pol13089, Eric Early: wv87pol49861
    //   console.log('getBallotItemStatSheet ballotItemWeVoteId:', ballotItemWeVoteId, ', politicianWeVoteId: ', politicianWeVoteId);
    //   // console.log('voterSupportsBallotItem PARTS:', this.voterSupportsList[ballotItemWeVoteId], this.voterSupportsList[politicianWeVoteId]);
    //   console.log('voterSupportsBallotItem:', this.voterSupportsList[ballotItemWeVoteId] || this.voterSupportsList[politicianWeVoteId] || false);
    //   // console.log('voterPositionIsPublic PARTS:', this.isForPublicList[ballotItemWeVoteId], this.isForPublicList[politicianWeVoteId]);
    //   // console.log('voterPositionIsPublic:', this.isForPublicList[ballotItemWeVoteId] || this.isForPublicList[politicianWeVoteId] || false);
    // }
    return {
      voterSupportsBallotItem: this.voterSupportsList[ballotItemWeVoteId] || this.voterSupportsList[politicianWeVoteId] || false,
      voterOpposesBallotItem: this.voterOpposesList[ballotItemWeVoteId] || this.voterOpposesList[politicianWeVoteId] || false,
      voterPositionIsPublic: this.isForPublicList[ballotItemWeVoteId] || this.isForPublicList[politicianWeVoteId] || false, // Default to friends only
      voterTextStatement: this.statementList[ballotItemWeVoteId] || this.statementList[politicianWeVoteId] || '',
      numberOfSupportPositionsForScore: numberOfSupportPositionsForScore || 0,
      numberOfOpposePositionsForScore: numberOfOpposePositionsForScore || 0,
      numberOfInfoOnlyPositionsForScore: numberOfInfoOnlyPositionsForScore || 0,
    };
  }

  getPositionFromBallotItemWeVoteId (ballotItemWeVoteId = '') {
    if (!ballotItemWeVoteId) {
      return {};
    }
    const positionWeVoteId = this.getState().ballotItemMappingToPosition[ballotItemWeVoteId];
    if (!positionWeVoteId) {
      return {};
    }
    // console.log('getPositionFromBallotItemWeVoteId, positionWeVoteId:', positionWeVoteId, ', this.getState().voterPositionsByPositionWeVoteId:', this.getState().voterPositionsByPositionWeVoteId);
    return this.getState().voterPositionsByPositionWeVoteId[positionWeVoteId] || {};
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

  isForPublicListWithChanges (is_public_position_list, ballotItemWeVoteId, is_public_position) { // eslint-disable-line
    return assign({}, is_public_position_list, { [ballotItemWeVoteId]: is_public_position });
  }

  // Turn action into a dictionary/object format with we_vote_id as key for fast lookup
  extractValueByPropertyAndStoreListInDictionaryByWeVoteId (property, list) { // eslint-disable-line
    const hashMap = {};
    if (list !== undefined && property) {
      list.forEach((el) => {
        if (el.ballot_item_we_vote_id && el[property]) {
          hashMap[el.ballot_item_we_vote_id] = el[property];
        }
        if (el.politician_we_vote_id && el[property]) {
          hashMap[el.politician_we_vote_id] = el[property];
        }
      });
    }
    return hashMap;
  }

  updateBallotItemMappingToPosition (position, ballotItemMappingToPositionTemp) {
    const ballotItemMappingToPositionTemp2 = { ...ballotItemMappingToPositionTemp };
    if (position.position_we_vote_id) {
      if (position.ballot_item_we_vote_id && !ballotItemMappingToPositionTemp2[position.ballot_item_we_vote_id]) {
        ballotItemMappingToPositionTemp2[position.ballot_item_we_vote_id] = position.position_we_vote_id;
      }
      if (position.politician_we_vote_id && !ballotItemMappingToPositionTemp2[position.politician_we_vote_id]) {
        ballotItemMappingToPositionTemp2[position.politician_we_vote_id] = position.position_we_vote_id;
      }
    }
    return ballotItemMappingToPositionTemp2;
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    let { ballotItemMappingToPosition } = state; // When building this up bit-by-bit
    let { voterPositionsByPositionWeVoteId } = state;
    let ballotItemMappingToPositionTemp = {}; // When creating a new dictionary from the incoming data
    let ballotItemWeVoteId = '';
    if (action.res.ballot_item_we_vote_id) {
      ballotItemWeVoteId = action.res.ballot_item_we_vote_id;
    }
    let politicianWeVoteId = '';
    if (action.res.politician_we_vote_id) {
      politicianWeVoteId = action.res.politician_we_vote_id;
    }
    let clearOpposes = false;
    let clearSupports = false;
    let isCandidate = false;
    let isMeasure = false;
    let revisedState;
    let voterOpposes = {};
    let voterPositionsByPositionWeVoteIdTemp = {};
    let voterSupports = {};

    switch (action.type) {
      case 'voterAddressRetrieve':
        // We should really avoid overly broad cascading API calls like this, they can cause problems
        SupportActions.voterAllPositionsRetrieve();
        return state;

      case 'voterAllPositionsRetrieve':
        // is_support is a property coming from 'position_list' in the incoming response
        // state.voter_supports is an updated hash with the contents of position list['is_support']
        // console.log('SupportStore from voterAllPositionsRetrieve is_public_position: ', this.extractValueByPropertyAndStoreListInDictionaryByWeVoteId('is_public_position', action.res.position_list));
        voterPositionsByPositionWeVoteIdTemp = action.res.position_list.reduce((acc, position) => {
          if (position.position_we_vote_id) {
            acc[position.position_we_vote_id] = position;
          }
          return acc;
        }, {});
        ballotItemMappingToPositionTemp = action.res.position_list.reduce((acc, position) => {
          if (position.position_we_vote_id) {
            if (position.ballot_item_we_vote_id && !acc[position.ballot_item_we_vote_id]) {
              acc[position.ballot_item_we_vote_id] = position.position_we_vote_id;
            }
            if (position.politician_we_vote_id && !acc[position.politician_we_vote_id]) {
              acc[position.politician_we_vote_id] = position.position_we_vote_id;
            }
          }
          return acc;
        }, {});
        // console.log('SupportStore from voterAllPositionsRetrieve ballotItemMappingToPositionTemp: ', ballotItemMappingToPositionTemp);
        // console.log('SupportStore from voterAllPositionsRetrieve voterPositionsByPositionWeVoteIdTemp: ', voterPositionsByPositionWeVoteIdTemp);
        return {
          ...state,
          ballotItemMappingToPosition: ballotItemMappingToPositionTemp,
          voter_supports: this.extractValueByPropertyAndStoreListInDictionaryByWeVoteId('is_support', action.res.position_list),
          voter_opposes: this.extractValueByPropertyAndStoreListInDictionaryByWeVoteId('is_oppose', action.res.position_list),
          voter_statement_text: this.extractValueByPropertyAndStoreListInDictionaryByWeVoteId('statement_text', action.res.position_list),
          voterPositionsByPositionWeVoteId: voterPositionsByPositionWeVoteIdTemp,
          is_public_position: this.extractValueByPropertyAndStoreListInDictionaryByWeVoteId('is_public_position', action.res.position_list),
        };

      case 'voterOpposingSave':
        ({ voter_opposes: voterOpposes, voter_supports: voterSupports } = state);
        revisedState = state;
        if (!voterOpposes) {
          voterOpposes = {};
        }
        if (ballotItemWeVoteId) {
          voterOpposes[ballotItemWeVoteId] = true;
        }
        if (politicianWeVoteId) {
          voterOpposes[politicianWeVoteId] = true;
        }
        if (!voterSupports) {
          voterSupports = {};
        }
        if (ballotItemWeVoteId && voterSupports[ballotItemWeVoteId] !== undefined) {
          delete voterSupports[ballotItemWeVoteId];
        }
        if (politicianWeVoteId && voterSupports[politicianWeVoteId] !== undefined) {
          delete voterSupports[politicianWeVoteId];
        }
        if (action.res && action.res.position) {
          if (action.res.position.position_we_vote_id) {
            if (!voterPositionsByPositionWeVoteId) {
              voterPositionsByPositionWeVoteId = {};
            }
            voterPositionsByPositionWeVoteId[action.res.position.position_we_vote_id] = action.res.position;
            // console.log('voterOpposingSave action.res.position after adding position:', action.res.position);
            ballotItemMappingToPosition = this.updateBallotItemMappingToPosition(action.res.position, ballotItemMappingToPosition);
            revisedState = {
              ...revisedState,
              ballotItemMappingToPosition,
              voterPositionsByPositionWeVoteId,
            };
          }
        }
        revisedState = {
          ...revisedState,
          voter_supports: voterSupports,
          voter_opposes: voterOpposes,
        };
        return revisedState;

      case 'voterStopOpposingSave':
        ({ voter_opposes: voterOpposes } = state);
        revisedState = state;
        if (!voterOpposes) {
          voterOpposes = {};
        }
        if (voterOpposes[ballotItemWeVoteId] !== undefined) {
          delete voterOpposes[ballotItemWeVoteId];
        }
        if (voterOpposes[politicianWeVoteId] !== undefined) {
          delete voterOpposes[politicianWeVoteId];
        }
        if (action.res && action.res.position) {
          if (action.res.position.position_we_vote_id) {
            if (!voterPositionsByPositionWeVoteId) {
              voterPositionsByPositionWeVoteId = {};
            }
            voterPositionsByPositionWeVoteId[action.res.position.position_we_vote_id] = action.res.position;
            // console.log('voterStopOpposingSave action.res.position after adding position:', action.res.position);
            revisedState = {
              ...revisedState,
              voterPositionsByPositionWeVoteId,
            };
          }
        }
        revisedState = {
          ...revisedState,
          voter_opposes: voterOpposes,
        };
        return revisedState;

      case 'voterSupportingSave':
        ({ voter_opposes: voterOpposes, voter_supports: voterSupports } = state);
        revisedState = state;
        if (!voterOpposes) {
          voterOpposes = {};
        }
        if (ballotItemWeVoteId && voterOpposes[ballotItemWeVoteId] !== undefined) {
          delete voterOpposes[ballotItemWeVoteId];
        }
        if (politicianWeVoteId && voterOpposes[politicianWeVoteId] !== undefined) {
          delete voterOpposes[politicianWeVoteId];
        }
        if (!voterSupports) {
          voterSupports = {};
        }
        if (ballotItemWeVoteId) {
          voterSupports[ballotItemWeVoteId] = true;
        }
        if (politicianWeVoteId) {
          voterSupports[politicianWeVoteId] = true;
        }
        if (action.res && action.res.position) {
          if (action.res.position.position_we_vote_id) {
            if (!voterPositionsByPositionWeVoteId) {
              voterPositionsByPositionWeVoteId = {};
            }
            voterPositionsByPositionWeVoteId[action.res.position.position_we_vote_id] = action.res.position;
            // console.log('voterSupportingSave action.res.position after adding position:', action.res.position);
            ballotItemMappingToPosition = this.updateBallotItemMappingToPosition(action.res.position, ballotItemMappingToPosition);
            revisedState = {
              ...revisedState,
              ballotItemMappingToPosition,
              voterPositionsByPositionWeVoteId,
            };
          }
        }
        revisedState = {
          ...revisedState,
          voter_supports: voterSupports,
          voter_opposes: voterOpposes,
        };
        return revisedState;

      case 'voterStopSupportingSave':
        // console.log('voterStopSupportingSave action.res:', action.res);
        ({ voter_supports: voterSupports } = state);
        revisedState = state;
        if (!voterSupports) {
          voterSupports = {};
        }
        if (ballotItemWeVoteId && voterSupports[ballotItemWeVoteId] !== undefined) {
          delete voterSupports[ballotItemWeVoteId];
        }
        if (politicianWeVoteId && voterSupports[politicianWeVoteId] !== undefined) {
          delete voterSupports[politicianWeVoteId];
        }
        if (action.res && action.res.position) {
          if (action.res.position.position_we_vote_id) {
            if (!voterPositionsByPositionWeVoteId) {
              voterPositionsByPositionWeVoteId = {};
            }
            voterPositionsByPositionWeVoteId[action.res.position.position_we_vote_id] = action.res.position;
            // console.log('voterStopSupportingSave action.res.position after adding position:', action.res.position);
            revisedState = {
              ...revisedState,
              voterPositionsByPositionWeVoteId,
            };
          }
        }
        revisedState = {
          ...revisedState,
          voter_supports: voterSupports,
        };
        return revisedState;

      case 'voterPositionCommentSave':
        clearOpposes = false;
        clearSupports = false;
        revisedState = state;
        ({
          voter_opposes: voterOpposes,
          voter_supports: voterSupports,
        } = state);
        if (!voterOpposes) {
          voterOpposes = {};
        }
        if (!voterSupports) {
          voterSupports = {};
        }
        if (action.res.stance === 'OPPOSE') {
          clearSupports = true;
          if (ballotItemWeVoteId) {
            voterOpposes[ballotItemWeVoteId] = true;
          }
          if (politicianWeVoteId) {
            voterOpposes[politicianWeVoteId] = true;
          }
        } else if (action.res.stance === 'SUPPORT') {
          clearOpposes = true;
          if (ballotItemWeVoteId) {
            voterSupports[ballotItemWeVoteId] = true;
          }
          if (politicianWeVoteId) {
            voterSupports[politicianWeVoteId] = true;
          }
        } else if (action.res.stance === 'INFO_ONLY') {
          clearOpposes = true;
          clearSupports = true;
        }
        if (clearOpposes) {
          if (ballotItemWeVoteId && voterOpposes[ballotItemWeVoteId] !== undefined) {
            delete voterOpposes[ballotItemWeVoteId];
          }
          if (politicianWeVoteId && voterOpposes[politicianWeVoteId] !== undefined) {
            delete voterOpposes[politicianWeVoteId];
          }
        }
        if (clearSupports) {
          if (ballotItemWeVoteId && voterSupports[ballotItemWeVoteId] !== undefined) {
            delete voterSupports[ballotItemWeVoteId];
          }
          if (politicianWeVoteId && voterSupports[politicianWeVoteId] !== undefined) {
            delete voterSupports[politicianWeVoteId];
          }
        }
        if (action.res.statement_text) {
          if (ballotItemWeVoteId) {
            revisedState = {
              ...revisedState,
              voter_statement_text: assign({}, revisedState.voter_statement_text, { [ballotItemWeVoteId]: action.res.statement_text }),
            };
          }
          if (politicianWeVoteId) {
            revisedState = {
              ...revisedState,
              voter_statement_text: assign({}, revisedState.voter_statement_text, { [politicianWeVoteId]: action.res.statement_text }),
            };
          }
        }
        revisedState = { ...revisedState,
          voter_opposes: voterOpposes,
          voter_supports: voterSupports,
        };
        if (action.res.is_public_position !== undefined) {
          if (ballotItemWeVoteId) {
            revisedState = {
              ...revisedState,
              is_public_position: assign({}, revisedState.is_public_position, { [ballotItemWeVoteId]: action.res.is_public_position }),
            };
          }
          if (politicianWeVoteId) {
            revisedState = {
              ...revisedState,
              is_public_position: assign({}, revisedState.is_public_position, { [politicianWeVoteId]: action.res.is_public_position }),
            };
          }
        }
        if (action.res && action.res.position) {
          // console.log('voterPositionCommentSave action.res.position after adding position:', action.res.position, ', voterPositionsByPositionWeVoteId:', voterPositionsByPositionWeVoteId);
          if (action.res.position.position_we_vote_id) {
            if (!voterPositionsByPositionWeVoteId) {
              voterPositionsByPositionWeVoteId = {};
            }
            voterPositionsByPositionWeVoteId[action.res.position.position_we_vote_id] = action.res.position;
            ballotItemMappingToPosition = this.updateBallotItemMappingToPosition(action.res.position, ballotItemMappingToPosition);
            revisedState = {
              ...revisedState,
              ballotItemMappingToPosition,
              voterPositionsByPositionWeVoteId,
            };
          }
        }
        // After storing it locally, refresh the whole list of positions
        isCandidate = stringContains('cand', ballotItemWeVoteId);
        isMeasure = stringContains('meas', ballotItemWeVoteId);
        if (isCandidate) {
          CandidateActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
        } else if (isMeasure) {
          MeasureActions.positionListForBallotItemFromFriends(ballotItemWeVoteId);
        }
        return revisedState;

      case 'voterPositionVisibilitySave':
        // Add the visibility to the list in memory
        revisedState = state;
        // console.log('voterPositionVisibilitySave: ', action.res);
        if (action.res.is_public_position === undefined) {
          // Do not update
        } else {
          if (ballotItemWeVoteId) {
            revisedState = {
              ...revisedState,
              is_public_position: assign({}, revisedState.is_public_position, { [ballotItemWeVoteId]: action.res.is_public_position }),
            };
          }
          if (politicianWeVoteId) {
            revisedState = {
              ...revisedState,
              is_public_position: assign({}, revisedState.is_public_position, { [politicianWeVoteId]: action.res.is_public_position }),
            };
          }
        }
        if (action.res && action.res.position) {
          if (action.res.position.position_we_vote_id) {
            if (!voterPositionsByPositionWeVoteId) {
              voterPositionsByPositionWeVoteId = {};
            }
            voterPositionsByPositionWeVoteId[action.res.position.position_we_vote_id] = action.res.position;
            // console.log('voterPositionVisibilitySave action.res.position after adding position:', action.res.position);
            ballotItemMappingToPosition = this.updateBallotItemMappingToPosition(action.res.position, ballotItemMappingToPosition);
            revisedState = {
              ...revisedState,
              ballotItemMappingToPosition,
              voterPositionsByPositionWeVoteId,
            };
          }
        }
        return revisedState;

      case 'voterSignOut':
        // console.log('resetting SupportStore');
        SupportActions.voterAllPositionsRetrieve();
        return this.resetState();

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
