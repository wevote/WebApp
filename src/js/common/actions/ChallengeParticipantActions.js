import Dispatcher from '../dispatcher/Dispatcher';

export default {
  challengeParticipantListRetrieve (challengeWeVoteId, searchText = '') {
    Dispatcher.loadEndpoint('challengeParticipantListRetrieve',
      {
        challenge_we_vote_id: challengeWeVoteId,
        search_text: searchText,
      });
  },

  challengeParticipantRetrieve (challengeWeVoteId) {
    Dispatcher.loadEndpoint('challengeParticipantRetrieve',
      {
        challenge_we_vote_id: challengeWeVoteId,
      });
  },

  challengeParticipantSave (challengeWeVoteId) { // challengeParticipantSave
    // console.log('challengeParticipantSave');
    Dispatcher.loadEndpoint('challengeParticipantSave',
      {
        challenge_we_vote_id: challengeWeVoteId,
        // visible_to_public: visibleToPublic,
        // visible_to_public_changed: visibleToPublicChanged,
      });
  },

  shareButtonClicked (value) {
    Dispatcher.dispatch({ type: 'shareButtonClicked', payload: value });
  },

  participantEndorsementQueuedToSave (participantEndorsement) {
    Dispatcher.dispatch({ type: 'participantEndorsementQueuedToSave', payload: participantEndorsement });
  },

  visibleToPublicQueuedToSave (visibleToPublic) {
    Dispatcher.dispatch({ type: 'visibleToPublicQueuedToSave', payload: visibleToPublic });
  },

  participantEndorsementSave (challengeWeVoteId, participantEndorsement, visibleToPublic, visibleToPublicChanged) { // challengeParticipantSave
    // console.log('participantEndorsementSave: ', participantEndorsement);
    Dispatcher.loadEndpoint('challengeParticipantSave',
      {
        challenge_we_vote_id: challengeWeVoteId,
        participant_endorsement: participantEndorsement,
        participant_endorsement_changed: true,
        visible_to_public: visibleToPublic,
        visible_to_public_changed: visibleToPublicChanged,
      });
  },
};
