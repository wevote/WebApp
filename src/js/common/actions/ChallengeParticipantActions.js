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

  challengeParticipantSave (challengeWeVoteId, inviteText = '', inviteTextChanged = false) { // challengeParticipantSave
    // console.log('challengeParticipantSave');
    Dispatcher.loadEndpoint('challengeParticipantSave',
      {
        challenge_we_vote_id: challengeWeVoteId,
        invite_text_for_friends: inviteText,
        invite_text_for_friends_changed: inviteTextChanged,
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
};
