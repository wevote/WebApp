import Dispatcher from '../dispatcher/Dispatcher';

export default {
  challengeSupporterRetrieve (challengeWeVoteId) {
    Dispatcher.loadEndpoint('challengeSupporterRetrieve',
      {
        challenge_we_vote_id: challengeWeVoteId,
      });
  },

  supportChallengeSave (challengeWeVoteId, challengeSupported, challengeSupportedChanged, visibleToPublic, visibleToPublicChanged) { // challengeSupporterSave
    // console.log('supportChallengeSave');
    Dispatcher.loadEndpoint('challengeSupporterSave',
      {
        challenge_supported: challengeSupported,
        challenge_supported_changed: challengeSupportedChanged,
        challenge_we_vote_id: challengeWeVoteId,
        visible_to_public: visibleToPublic,
        visible_to_public_changed: visibleToPublicChanged,
      });
  },

  shareButtonClicked (value) {
    Dispatcher.dispatch({ type: 'shareButtonClicked', payload: value });
  },

  supporterEndorsementQueuedToSave (supporterEndorsement) {
    Dispatcher.dispatch({ type: 'supporterEndorsementQueuedToSave', payload: supporterEndorsement });
  },

  visibleToPublicQueuedToSave (visibleToPublic) {
    Dispatcher.dispatch({ type: 'visibleToPublicQueuedToSave', payload: visibleToPublic });
  },

  supporterEndorsementSave (challengeWeVoteId, supporterEndorsement, visibleToPublic, visibleToPublicChanged) { // challengeSupporterSave
    // console.log('supporterEndorsementSave: ', supporterEndorsement);
    Dispatcher.loadEndpoint('challengeSupporterSave',
      {
        challenge_we_vote_id: challengeWeVoteId,
        supporter_endorsement: supporterEndorsement,
        supporter_endorsement_changed: true,
        visible_to_public: visibleToPublic,
        visible_to_public_changed: visibleToPublicChanged,
      });
  },
};
