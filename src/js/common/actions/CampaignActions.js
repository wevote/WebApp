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

  campaignRetrieve (campaignWeVoteId) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('campaignRetrieve',
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
