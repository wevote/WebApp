// OfficeStore will hold Office data
import { dispatcher } from 'AppDispatcher';
import { mergeIntoStore, createStore } from 'utils/createStore';
import { OfficeConstants } from 'constants/Constants';
import { each } from 'underscore';

const _offices = {};

/**
 * add data into store via mergeIntoStore
 * @param {Object} data data from server to merge
 */
function add (data) {
    mergeIntoStore(_offices, data);
}

/**
 * add an array of offices to the store
 * @param {Array} officeArray array of offices to be added to the store
 */
function addArray (offices) {
    offices.forEach(office => add(office));
}

const OfficeStore = createStore({
    /**
     * get ballot by id
     * @param  {String} ballot_id id of ballot
     * @return {Object} ballot data item
     */
    get (id) {
        return _offices[id];
    },

    /**
     * add a list of candidates to an office
     * @param {String} id   we vote office id
     * @param {Array} list array of string ids
     */
    addCandidates (id, list) {
        _offices[id].candidate_list = list;
    },

    /**
     * @return {Array} array of Ballot Data
     */
    toArray () {
        let _officeArray = [];
        each(_offices, (val, key) =>
            _officeArray.push(_offices[key])
        );
        return _officeArray;
    }
});

export default OfficeStore;

dispatcher.register ( action => {
    switch (action.actionType) {
        case OfficeConstants.OFFICES_DONE_LOADING:
            addArray(action.offices);
            OfficeStore.emitChange();
            break;
    }
});
