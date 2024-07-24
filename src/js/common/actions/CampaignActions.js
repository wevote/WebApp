import Dispatcher from '../dispatcher/Dispatcher';

export default {
  campaignListRetrieve (searchText = '', stateCode = '') {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('campaignListRetrieve',
      {
        hostname,
        search_text: searchText,
        state_code: stateCode,
      });
  },

  campaignLocalAttributesUpdate (campaignXWeVoteId, supportersCountLocal = false, opposersCountLocal = false) {
    const payloadDict = {
      campaignXWeVoteId,
    };
    if (supportersCountLocal !== false) {
      payloadDict.supporters_count = supportersCountLocal;
    }
    if (opposersCountLocal !== false) {
      payloadDict.opposers_count = opposersCountLocal;
    }
    Dispatcher.dispatch({
      type: 'campaignLocalAttributesUpdate',
      payload: payloadDict,
    });
  },

  campaignRetrieve (campaignWeVoteId) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('campaignRetrieve',
      {
        campaignx_we_vote_id: campaignWeVoteId,
        hostname,
      });
  },

  campaignRetrieveAsOwner (campaignWeVoteId) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('campaignRetrieveAsOwner',
      {
        campaignx_we_vote_id: campaignWeVoteId,
        hostname,
      });
  },

  campaignRetrieveBySEOFriendlyPath (campaignSEOFriendlyPath) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('campaignRetrieve',
      {
        hostname,
        seo_friendly_path: campaignSEOFriendlyPath,
      });
  },

  campaignRetrieveBySEOFriendlyPathAsOwner (campaignSEOFriendlyPath) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('campaignRetrieveAsOwner',
      {
        hostname,
        seo_friendly_path: campaignSEOFriendlyPath,
      });
  },

  recommendedCampaignListRetrieve (campaignXWeVoteId) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('campaignListRetrieve',
      {
        hostname,
        recommended_campaigns_for_campaignx_we_vote_id: campaignXWeVoteId,
      });
  },
};
