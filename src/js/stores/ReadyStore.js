import { ReduceStore } from 'flux/utils';
import Dispatcher from '../common/dispatcher/Dispatcher';


class ReadyStore extends ReduceStore {
  // The store keeps information about Voter Making a Plan and Pledging to Vote
  getInitialState () {
    return {
      allCachedVoterPlansForVoterByElectionId: {}, // This is a dictionary with google_civic_election_id as key and a voterPlan for this voter as the value
      allCachedVoterPlansByElectionIdAndVoterId: {}, // This is a dictionary with google_civic_election_id as one key and voter_we_vote_id as a second key and a friends only voterPlan as the value
      allLatestPublicVoterPlansByElectionIdAndStateCode: {}, // This is a dictionary with google_civic_election_id as one key and state_code as a second key and a public voterPlan as the value
      allLatestPublicVoterPlansByElectionId: {}, // This is a dictionary with google_civic_election_id as key and a public voterPlan as the value
      voterPlansForVoterRetrieved: false, // This is a boolean indicating whether there has been an attempted retrieval of the voter plans for a voter
    };
  }

  getLatestPublicVoterPlansForElection (googleCivicElectionId) {
    const { allLatestPublicVoterPlansByElectionId } = this.getState();
    return allLatestPublicVoterPlansByElectionId[googleCivicElectionId] || [];
  }

  getVoterPlanTextForVoterByElectionId (googleCivicElectionId) {
    const voterPlan = this.getState().allCachedVoterPlansForVoterByElectionId[googleCivicElectionId] || {};
    if (voterPlan.voter_plan_text) {
      return voterPlan.voter_plan_text || '';
    }
    return '';
  }

  getVoterPlanForVoterByElectionId (googleCivicElectionId) {
    return this.getState().allCachedVoterPlansForVoterByElectionId[googleCivicElectionId] || {};
  }

  getVoterPlansForVoterRetrieved () {
    return this.getState().voterPlansForVoterRetrieved || false;
  }

  reduce (state, action) {
    const { allCachedVoterPlansForVoterByElectionId, allLatestPublicVoterPlansByElectionId, voterPlansForVoterRetrieved } = state;
    let googleCivicElectionId = 0;
    let voterPlanList = [];


    switch (action.type) {
      case 'voterPlanListRetrieve':
        // console.log('ReadyStore voterPlanListRetrieve, action.res:', action.res);
        if (!action.res || !action.res.success) return state;
        voterPlanList = action.res.voter_plan_list || [];
        voterPlanList.forEach((oneVoterPlan) => {
          if (oneVoterPlan.show_to_public) {
            googleCivicElectionId = oneVoterPlan.google_civic_election_id || 0;
            if (allLatestPublicVoterPlansByElectionId[googleCivicElectionId] === undefined) {
              allLatestPublicVoterPlansByElectionId[googleCivicElectionId] = [];
            }
            allLatestPublicVoterPlansByElectionId[googleCivicElectionId].push(oneVoterPlan);
          }
        });
        return {
          ...state,
          allCachedVoterPlansForVoterByElectionId,
        };

      case 'voterPlanSave':
        // console.log('ReadyStore voterPlanSave, action.res:', action.res);
        if (!action.res || !action.res.success) return state;
        voterPlanList = action.res.voter_plan_list || [];
        voterPlanList.forEach((oneVoterPlan) => {
          googleCivicElectionId = oneVoterPlan.google_civic_election_id || 0;
          allCachedVoterPlansForVoterByElectionId[googleCivicElectionId] = oneVoterPlan;
        });
        return {
          ...state,
          allCachedVoterPlansForVoterByElectionId,
        };

      case 'voterPlansForVoterRetrieve':
        // console.log('ReadyStore voterPlansForVoterRetrieve, action.res:', action.res);
        if (!action.res || !action.res.success) return state;
        voterPlanList = action.res.voter_plan_list || [];
        if (voterPlanList.length) {
          voterPlanList.forEach((oneVoterPlan) => {
            googleCivicElectionId = oneVoterPlan.google_civic_election_id || 0;
            allCachedVoterPlansForVoterByElectionId[googleCivicElectionId] = oneVoterPlan;
          });
          return {
            ...state,
            allCachedVoterPlansForVoterByElectionId,
            voterPlansForVoterRetrieved: true,
          };
        } else if (!voterPlansForVoterRetrieved) {
          return {
            ...state,
            voterPlansForVoterRetrieved: true,
          };
        } else {
          return state;
        }

      default:
        return state;
    }
  }
}

export default new ReadyStore(Dispatcher);
