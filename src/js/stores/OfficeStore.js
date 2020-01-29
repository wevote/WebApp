import { ReduceStore } from 'flux/utils';
import assign from 'object-assign';
import Dispatcher from '../dispatcher/Dispatcher';

class OfficeStore extends ReduceStore {
  getInitialState () {
    return {
      offices: {}, // Dictionary with office_we_vote_id as key and the office as value
      success: true,
    };
  }

  getOffice (officeWeVoteId) {
    // console.log('in getOffice----');
    // if (!this.isLoaded()){ return undefined; }
    const officeList = this.getState().offices;
    if (officeList) {
      return officeList[officeWeVoteId];
    } else {
      return undefined;
    }
  }

  reduce (state, action) { // eslint-disable-line
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    // let arrayOfOfficeWeVoteIds;
    let googleCivicElectionId;
    let office;
    const newOffices = {};

    switch (action.type) {
      case 'officeRetrieve':
        office = action.res;
        newOffices[office.we_vote_id] = office;
        return {
          ...state,
          offices: assign({}, state.offices, newOffices),
        };

      case 'voterBallotItemsRetrieve':
        googleCivicElectionId = action.res.google_civic_election_id || 0;
        if (googleCivicElectionId !== 0) {
          const offices = {};
          let modifiedBallotItem;
          action.res.ballot_item_list.forEach((oneBallotItem) => {
            if (oneBallotItem.kind_of_ballot_item === 'OFFICE') {
              // If office data is received without a race_office_level, default to 'Federal'
              if (!oneBallotItem.race_office_level) {
                modifiedBallotItem = oneBallotItem;
                modifiedBallotItem.race_office_level = 'Federal';
                offices[oneBallotItem.we_vote_id] = modifiedBallotItem;
              } else {
                offices[oneBallotItem.we_vote_id] = oneBallotItem;
              }
            }
          });

          return {
            ...state,
            offices: assign({}, state.offices, offices),
          };
        }
        return state;

      case 'error-officeRetrieve':
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

export default new OfficeStore(Dispatcher);
