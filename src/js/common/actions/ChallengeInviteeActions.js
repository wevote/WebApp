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

  challengeInviteeSave (challengeWeVoteId, destinationFullURL = '', googleCivicElectionId = 0, inviteeId = 0, inviteeName = '', inviteeNameChanged = false, inviteTextFromInviter = '', inviteTextFromInviterChanged = false, inviteeUrlCode = '', inviteeUrlCodeChanged = false) {
    // console.log('challengeInviteeSave called with challengeWeVoteId: ', challengeWeVoteId, ' and inviteeName: ', inviteeName);
    Dispatcher.loadEndpoint('challengeInviteeSave',
      {
        challenge_we_vote_id: challengeWeVoteId,
        destination_full_url: destinationFullURL,
        google_civic_election_id: googleCivicElectionId,
        invitee_id: inviteeId,
        invitee_name: inviteeName,
        invitee_name_changed: inviteeNameChanged,
        invite_text_from_inviter: inviteTextFromInviter,
        invite_text_from_inviter_changed: inviteTextFromInviterChanged,
        invitee_url_code: inviteeUrlCode,
        invitee_url_code_changed: inviteeUrlCodeChanged,
      });
  },

  challengeInviteeFlagsSave (challengeWeVoteId, inviteeId = 0, inviteSent = false, inviteSentChanged = false) {
    // console.log('challengeInviteeFlagsSave called with challengeWeVoteId: ', challengeWeVoteId, ' and inviteeId: ', inviteeId, ', inviteSent:', inviteSent, ', inviteSentChanged:', inviteSentChanged);
    Dispatcher.loadEndpoint('challengeInviteeSave',
      {
        challenge_we_vote_id: challengeWeVoteId,
        invitee_id: inviteeId,
        invite_sent: inviteSent,
        invite_sent_changed: inviteSentChanged,
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
