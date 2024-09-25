import Dispatcher from '../dispatcher/Dispatcher';

export default {
  challengeInviteeListRetrieve (challengeWeVoteId, searchText = '') {
    Dispatcher.loadEndpoint('challengeInviteeListRetrieve',
      {
        challenge_we_vote_id: challengeWeVoteId,
        search_text: searchText,
      });
  },

  challengeInviteeRetrieve (challengeWeVoteId) {
    Dispatcher.loadEndpoint('challengeInviteeRetrieve',
      {
        challenge_we_vote_id: challengeWeVoteId,
      });
  },

  challengeInviteeSave (challengeWeVoteId, inviteeName) {
    console.log('challengeInviteeSave called with challengeWeVoteId: ', challengeWeVoteId, ' and inviteeName: ', inviteeName);
    Dispatcher.loadEndpoint('challengeInviteeSave',
      {
        challenge_we_vote_id: challengeWeVoteId,
        invitee_name: inviteeName,
      });
  },

  shareButtonClicked (value) {
    Dispatcher.dispatch({ type: 'shareButtonClicked', payload: value });
  },

  inviteeEndorsementQueuedToSave (inviteeEndorsement) {
    Dispatcher.dispatch({ type: 'inviteeEndorsementQueuedToSave', payload: inviteeEndorsement });
  },

  visibleToPublicQueuedToSave (visibleToPublic) {
    Dispatcher.dispatch({ type: 'visibleToPublicQueuedToSave', payload: visibleToPublic });
  },

  inviteeEndorsementSave (challengeWeVoteId, inviteeEndorsement, visibleToPublic, visibleToPublicChanged) { // challengeInviteeSave
    // console.log('inviteeEndorsementSave: ', inviteeEndorsement);
    Dispatcher.loadEndpoint('challengeInviteeSave',
      {
        challenge_we_vote_id: challengeWeVoteId,
        invitee_endorsement: inviteeEndorsement,
        invitee_endorsement_changed: true,
        visible_to_public: visibleToPublic,
        visible_to_public_changed: visibleToPublicChanged,
      });
  },
};
