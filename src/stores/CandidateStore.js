// CandidateStore will hold candidates
import { dispatcher } from 'AppDispatcher';
import { mergeIntoStore, createStore } from 'utils/createStore';
import { CandidateConstants } from 'constants/Constants';
import { each } from 'underscore';

const _candidates = {};
const _ballotItems = {};

/**
 * add data into store via mergeIntoStore
 * @param {Object} data data from server to merge
 */
function add(data) {
    mergeIntoStore(_candidates, data);
}

/**
 * this function adds a list of candidates to a
 * ballot id
 */
function indexCandidates (ballotId, candidate_list) {
    var candidate_keys = [];
    candidate_list.forEach( candidate =>
        candidate_keys.push( candidate.candidate_we_vote_id )
    );
}

/**
 * add an array of candidates to the store
 * @param {Array} candidateArray array of candidates to be merged
 */
function addArray (candidates) {
    candidates.forEach(candidate => add(candidate));
}

const CandidateStore = createStore({
    /**
     * get candidate by id
     * @param  {String} candidate_id id of candidate
     * @return {Object} candidate data item
     */
    get (id) {
        return _candidates[id];
    },

    /**
     * @return {Array} array of Candidate Data
     */
    toArray () {
        let _candidateArray = [];
        each( _candidates, (val, key) =>
            _candidateArray.push(_candidates[key])
        );
        return _candidateArray;
    }
});

export default CandidateStore;

dispatcher.register ( action => {
    switch (action.actionType) {
        case CandidateConstants.CANDIDATES_RETRIEVED:
            let {
                    office_we_vote_id,
                    candidate_list
                                        } = action.actionData;

            addArray( candidate_list );
            indexCandidates( office_we_vote_id, candidate_list );

            CandidateStore.emitChange();
            break;

        default:
            // do nothing
            break;
    }
});
