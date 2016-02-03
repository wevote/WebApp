import BallotStore from '../stores/BallotStore';
import { createStore } from '../utils/createStore';
import {shallowClone} from '../utils/object-utils';

const AppDispatcher = require('../dispatcher/AppDispatcher');
const VoterGuideConstants = require('../constants/VoterGuideConstants');

const request = require('superagent');
const web_app_config = require('../config');

let _organization_store = {};
let _organization_list = []; // A summary of all organizations (list of organization we_vote_id's)
let _voter_guide_store = {};
let _voter_guide_list = []; // A summary of all voter_guides (list of organization we_vote_id's)
let _voter_guides_to_follow_order = [];
let _voter_guides_to_follow_list = []; // A summary of all voter guides to follow (list of voter guide we_vote_id's)
let _voter_guides_to_ignore_list = []; // A summary of voter guides to follow (list of voter guide we_vote_id's)
let _voter_guides_followed_order = [];
let _voter_guides_followed_list = []; // A summary of voter guides already followed (list of voter guide we_vote_id's)

const MEASURE = 'MEASURE';

function printErr (err) {
  console.error(err);
}

//.query({ ballot_item_we_vote_id: 'wv01cand2968' })
//.query({ kind_of_ballot_item: 'CANDIDATE' })
function retrieveVoterGuidesToFollowList () {
  return new Promise( (resolve, reject) => request
    .get(`${web_app_config.WE_VOTE_SERVER_API_ROOT_URL}voterGuidesToFollowRetrieve/`)
    .withCredentials()
    .query(web_app_config.test)
    .query({ google_civic_election_id: BallotStore.getGoogleCivicElectionId() })
    .end( function (err, res) {
      if (err || !res.body.success)
        reject(err || res.body.status);

      console.log('retrieveVoterGuidesToFollowList SUCCESS');
      resolve(res.body);
    })
  )
}

function addVoterGuidesToFollowToVoterGuideStore (data) {
  console.log('ENTERING addVoterGuidesToFollowToVoterGuideStore');
  data.voter_guides.forEach( item => {
    _voter_guide_store[item.we_vote_id] = shallowClone(item);
    _voter_guides_to_follow_order.push(item.we_vote_id);
    _voter_guides_to_follow_list.push(item.we_vote_id);
    _organization_list.push(item.organization_we_vote_id); // To be retrieved in retrieveOrganizations
  });
  console.log('addVoterGuidesToFollowToVoterGuideStore SUCCESS');

  return data;
}

function retrieveVoterGuidesFollowedList () {
  return new Promise( (resolve, reject) => request
    .get(`${web_app_config.WE_VOTE_SERVER_API_ROOT_URL}voterGuidesFollowedRetrieve/`)
    .withCredentials()
    .end( function (err, res) {
      if (err || !res.body.success)
        reject(err || res.body.status);
      console.log("Reached out to retrieveVoterGuidesFollowedList");
      resolve(res.body);
    })
  )
}

function addVoterGuidesFollowedToVoterGuideStore (data) {
  console.log("ENTERING addVoterGuidesFollowedToVoterGuideStore");
  data.voter_guides.forEach( item => {
    _voter_guide_store[item.we_vote_id] = shallowClone(item);
    _voter_guides_followed_order.push(item.we_vote_id);
    _voter_guides_followed_list.push(item.we_vote_id);
  });

  return data;
}

// Cycle through the list of organizations that we know we need, and request the organization information
function retrieveOrganizations (data) {
  var organizations_count = 0;

  return new Promise ( (resolve, reject) => _organization_list
    .forEach( we_vote_id => request
      .get(`${web_app_config.WE_VOTE_SERVER_API_ROOT_URL}organizationRetrieve/`)
      .withCredentials()
      .query({ organization_we_vote_id: we_vote_id })
      .end( function (err, res) {
        if (res.body.success) {
          _organization_store[res.body.organization_we_vote_id] = shallowClone(res.body);
        }
        else if (err) throw err || res.body;

        organizations_count ++;

        if (organizations_count === _organization_list.length) {
          console.log('retrieveOrganizations FOUND ALL');
          resolve(data);
        }
      })
    )
  );
}

function retrieveOrganizationsFollowedList () {
  return new Promise( (resolve, reject) => request
    .get(`${web_app_config.WE_VOTE_SERVER_API_ROOT_URL}organizationsFollowedRetrieve/`)
    .withCredentials()
    .end( function (err, res) {
      if (err || !res.body.success)
        reject(err || res.body.status);

      resolve(res.body);
    })
  )
}

function addOrganizationsFollowedToStore (data) {
  data.organization_list.forEach( item => {
    _organization_store[item.organization_we_vote_id] = shallowClone(item);
    _organization_list.push(item.organization_we_vote_id);
  });

  return data;
}

function followOrganization (we_vote_id) {
  console.log('followOrganization: ' + we_vote_id + ', id: ' + _organization_store[we_vote_id].organization_id);
  return new Promise((resolve, reject) => request
    .get(`${web_app_config.WE_VOTE_SERVER_API_ROOT_URL}organizationFollow/`)
    .withCredentials()
    .query({ organization_id: _organization_store[we_vote_id].organization_id })
    .end( function (err, res) {
      if (res.body.success) {
        _organization_store[we_vote_id].OrganizationFollowed = "Yes";
        _organization_store[we_vote_id].OrganizationIgnored = "No";
      }
      else if (err)
        reject(err || res.body.status);

      resolve(res.body);
    })
  );
}

function ignoreOrganization (we_vote_id) {
  console.log('ignoreOrganization: ' + we_vote_id);
  return new Promise((resolve, reject) => request
    .get(`${web_app_config.WE_VOTE_SERVER_API_ROOT_URL}organizationFollowIgnore/`)
    .withCredentials()
    .query({ organization_id: _organization_store[we_vote_id].organization_id })
    .end( function (err, res) {
      if (res.body.success) {
        _organization_store[we_vote_id].OrganizationFollowed = "No";
        _organization_store[we_vote_id].OrganizationIgnored = "Yes";
      }
      else if (err)
        reject(err || res.body.status);

      resolve(res.body);
    })
  );
}

function stopFollowingOrganization (we_vote_id) {
  console.log('stopFollowingOrganization: ' + we_vote_id);
  return new Promise((resolve, reject) => request
    .get(`${web_app_config.WE_VOTE_SERVER_API_ROOT_URL}organizationStopFollowing/`)
    .withCredentials()
    .query({ organization_id: _organization_store[we_vote_id].id })
    .end( function (err, res) {
      if (res.body.success) {
        _organization_store[we_vote_id].OrganizationFollowed = "No";
      }
      else if (err)
        reject(err || res.body.status);

      resolve(res.body);
    })
  );
}

const VoterGuideStore = createStore({
  /**
   * initialize the voter guide store with "guides to follow" data, if no data
   * and callback with the ordered items
   * @return {Boolean}
   */
  initialize: function (callback) {
    var getItems = this.getOrderedVoterGuides.bind(this);

    if (!callback || typeof callback !== 'function')
      throw new Error('initialize must be called with callback');

    // Do we have Voter Guide data stored in the browser?
    if (Object.keys(_voter_guides_to_follow_list).length)
      callback(getItems());

    else
      // If here, we don't have any ballot items stored in the browser

      retrieveVoterGuidesToFollowList()
        .then(addVoterGuidesToFollowToVoterGuideStore) // Uses data retrieved with retrieveVoterGuidesToFollowList
        .then(retrieveOrganizations)
        .then(data => callback(getItems()))
        .catch(err => console.error(err));
  },

  /**
   * initialize the voter guide store with "guides to follow" data, if no data
   * and callback with the ordered items
   * @return {Boolean}
   */
  initializeGuidesFollowed: function (callback) {
    console.log("ENTERED initializeGuidesFollowed");
    var getFollowedItems = this.getOrderedVoterGuidesFollowed.bind(this);

    if (!callback || typeof callback !== 'function')
      throw new Error('initialize must be called with callback');

    // Do we have Voter Guide data stored in the browser?
    if (Object.keys(_voter_guides_followed_list).length) {
      console.log("(_voter_guides_followed_list).length): " + Object.keys(_voter_guides_followed_list).length);
      callback(getFollowedItems());
    }

    else
      // If here, we don't have any voter guides that have been followed that have been stored in the browser
      retrieveVoterGuidesFollowedList()
        .then(addVoterGuidesFollowedToVoterGuideStore)
        .then(retrieveOrganizationsFollowedList)
        .then(addOrganizationsFollowedToStore) // Uses data from retrieveOrganizationsFollowedList
        .then(data => callback(getFollowedItems()))
        .catch(err => console.error(err));
  },

  /**
   * start with _voter_guides_to_follow_order, and create a new ordered array with the we_vote_id as the key,
   *  and the voter_guide as the value
   * @return {Object} ordered keys and store data
   */
  getOrderedVoterGuides: function () {
      var temp = [];
      _voter_guides_to_follow_order.forEach(we_vote_id => temp
          .push(shallowClone(_voter_guide_store[we_vote_id]))
      )
      return temp;
  },

  /**
   * start with _voter_guides_to_follow_order, and create a new ordered array with the we_vote_id as the key,
   *  and the voter_guide as the value
   * @return {Object} ordered keys and store data
   */
  getOrderedVoterGuidesFollowed: function () {
      var temp = [];
      _voter_guides_followed_order.forEach(we_vote_id => temp
          .push(shallowClone(_voter_guide_store[we_vote_id]))
      )
      return temp;
  },

  /**
   * return organization object by we_vote_id
   * @param  {String} we_vote_id for organization
   * @return {Object} office or measure
   */
  getOrganizationByWeVoteId: function (we_vote_id, callback) {
     callback(shallowClone(_organization_store[we_vote_id]));
  },

  /**
   * return voter_guide object by we_vote_id
   * @param  {String} we_vote_id for voter guide
   * @return {Object} office or measure
   */
  getVoterGuideByWeVoteId: function (we_vote_id, callback) {
     callback(shallowClone(_voter_guide_store[we_vote_id]));
  }
});

AppDispatcher.register( action => {
  switch (action.actionType) {
    case VoterGuideConstants.VOTER_GUIDES_TO_FOLLOW:      // retrieveVoterGuidesToFollowList
      retrieveVoterGuidesToFollowList(action.we_vote_id); // API call: voterGuidesToFollowRetrieve
      VoterGuideStore.emitChange();
      break;
    case VoterGuideConstants.VOTER_GUIDES_FOLLOWED:       // retrieveVoterGuidesFollowedList
      retrieveVoterGuidesFollowedList(action.we_vote_id); // API call: voterGuidesFollowedRetrieve
      VoterGuideStore.emitChange();
      break;
    case VoterGuideConstants.RETRIEVE_ORGANIZATIONS:      // retrieveOrganizations
      retrieveOrganizations(action.we_vote_id);           // API call: organizationRetrieve
      VoterGuideStore.emitChange();
      break;
    case VoterGuideConstants.FOLLOW_ORGANIZATION:         // followOrganization
      followOrganization(action.we_vote_id);              // API call: organizationFollow
      VoterGuideStore.emitChange();
      break;
    case VoterGuideConstants.IGNORE_ORGANIZATION:         // ignoreOrganization
      ignoreOrganization(action.we_vote_id);              // API call: organizationFollowIgnore
      VoterGuideStore.emitChange();
      break;
    case VoterGuideConstants.STOP_FOLLOWING_ORGANIZATION: // stopFollowingOrganization
      stopFollowingOrganization(action.we_vote_id);       // API call: organizationStopFollowing
      VoterGuideStore.emitChange();
      break;
  }
})

export default VoterGuideStore;
