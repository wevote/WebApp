import Dispatcher from '../dispatcher/Dispatcher';

export default {
  challengeListRetrieve (searchText = '', stateCode = '') {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('challengeListRetrieve',
      {
        hostname,
        search_text: searchText,
        state_code: stateCode,
      });
  },

  challengeLocalAttributesUpdate (challengeWeVoteId, participantsCountLocal = false, opposersCountLocal = false) {
    const payloadDict = {
      challengeWeVoteId,
    };
    if (participantsCountLocal !== false) {
      payloadDict.participants_count = participantsCountLocal;
    }
    if (opposersCountLocal !== false) {
      payloadDict.opposers_count = opposersCountLocal;
    }
    Dispatcher.dispatch({
      type: 'challengeLocalAttributesUpdate',
      payload: payloadDict,
    });
  },

  challengeRetrieve (challengeWeVoteId) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('challengeRetrieve',
      {
        challenge_we_vote_id: challengeWeVoteId,
        hostname,
      });
  },

  challengeRetrieveAsOwner (challengeWeVoteId) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('challengeRetrieveAsOwner',
      {
        challenge_we_vote_id: challengeWeVoteId,
        hostname,
      });
  },

  challengeRetrieveBySEOFriendlyPath (challengeSEOFriendlyPath) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('challengeRetrieve',
      {
        hostname,
        seo_friendly_path: challengeSEOFriendlyPath,
      });
  },

  challengeRetrieveBySEOFriendlyPathAsOwner (challengeSEOFriendlyPath) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('challengeRetrieveAsOwner',
      {
        hostname,
        seo_friendly_path: challengeSEOFriendlyPath,
      });
  },

  recommendedChallengeListRetrieve (challengeWeVoteId) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('challengeListRetrieve',
      {
        hostname,
        recommended_challenges_for_challenge_we_vote_id: challengeWeVoteId,
      });
  },
};
