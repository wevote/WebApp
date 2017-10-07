import Dispatcher from "../dispatcher/Dispatcher";

// ACTION_VOTER_GUIDE_VISIT = 1;
// ACTION_VOTER_GUIDE_ENTRY = 2;
// ACTION_ORGANIZATION_FOLLOW = 3;
// ACTION_ORGANIZATION_AUTO_FOLLOW = 4;
// ACTION_ISSUE_FOLLOW = 5;
// ACTION_BALLOT_VISIT = 6;
// ACTION_POSITION_TAKEN = 7;
// ACTION_VOTER_TWITTER_AUTH = 8;
// ACTION_VOTER_FACEBOOK_AUTH = 9;
// ACTION_WELCOME_ENTRY = 10;
// ACTION_FRIEND_ENTRY = 11;
// ACTION_WELCOME_VISIT = 12;
// ACTION_ORGANIZATION_FOLLOW_IGNORE = 13
// ACTION_ORGANIZATION_STOP_FOLLOWING = 14
// ACTION_ISSUE_FOLLOW_IGNORE = 15
// ACTION_ISSUE_STOP_FOLLOWING = 16
// ACTION_MODAL_ISSUES = 17
// ACTION_MODAL_ORGANIZATIONS = 18
// ACTION_MODAL_POSITIONS = 19
// ACTION_MODAL_FRIENDS = 20
// ACTION_MODAL_SHARE = 21
// ACTION_MODAL_VOTE = 22
// ACTION_NETWORK = 23
// ACTION_FACEBOOK_INVITABLE_FRIENDS = 24
// ACTION_DONATE_VISIT = 25
// ACTION_ACCOUNT_PAGE = 26
// ACTION_INVITE_BY_EMAIL = 27
// ACTION_ABOUT_GETTING_STARTED = 28
// ACTION_ABOUT_VISION = 29
// ACTION_ABOUT_ORGANIZATION = 30
// ACTION_ABOUT_TEAM = 31
// ACTION_ABOUT_MOBILE = 32
// ACTION_OFFICE = 33
// ACTION_CANDIDATE = 34
// ACTION_FACEBOOK_AUTHENTICATION_EXISTS = 36
// ACTION_GOOGLE_AUTHENTICATION_EXISTS = 37
// ACTION_TWITTER_AUTHENTICATION_EXISTS = 38
// ACTION_EMAIL_AUTHENTICATION_EXISTS = 39
// ACTION_ELECTIONS = 40


module.exports = {

  saveActionWrapper: function (action_constant, google_civic_election_id) {
    Dispatcher.loadEndpoint("saveAnalyticsAction",
      {
        action_constant: action_constant,
        google_civic_election_id: google_civic_election_id,
      });
  },

  saveActionWrapperWithOrganization: function (action_constant, google_civic_election_id, organization_we_vote_id) {
    Dispatcher.loadEndpoint("saveAnalyticsAction",
      {
        action_constant: action_constant,
        google_civic_election_id: google_civic_election_id,
        organization_we_vote_id: organization_we_vote_id,
      });
  },

  saveActionWrapperWithBallotItem: function (action_constant, google_civic_election_id, ballot_item_we_vote_id) {
    Dispatcher.loadEndpoint("saveAnalyticsAction",
      {
        action_constant: action_constant,
        google_civic_election_id: google_civic_election_id,
        ballot_item_we_vote_id: ballot_item_we_vote_id,
      });
  },

  saveActionAboutGettingStarted: function (google_civic_election_id) {
    const action_constant = 28; // ACTION_ABOUT_GETTING_STARTED
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionAboutVision: function (google_civic_election_id) {
    const action_constant = 29; // ACTION_ABOUT_VISION
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionAboutOrganization: function (google_civic_election_id) {
    const action_constant = 30; // ACTION_ABOUT_ORGANIZATION
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionAboutTeam: function (google_civic_election_id) {
    const action_constant = 31; // ACTION_ABOUT_TEAM
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionAboutMobile: function (google_civic_election_id) {
    const action_constant = 32; // ACTION_ABOUT_MOBILE
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionAccountPage: function (google_civic_election_id) {
    const action_constant = 26; // ACTION_ACCOUNT_PAGE
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionBallotVisit: function (google_civic_election_id) {
    const action_constant = 6; // ACTION_BALLOT_VISIT
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionCandidate: function (google_civic_election_id, ballot_item_we_vote_id) {
    const action_constant = 34; // ACTION_CANDIDATE
    this.saveActionWrapperWithBallotItem(action_constant, google_civic_election_id, ballot_item_we_vote_id);
  },

  saveActionDonateVisit: function (google_civic_election_id) {
    const action_constant = 25; // ACTION_DONATE_VISIT
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionElections: function (google_civic_election_id) {
    const action_constant = 40; // ACTION_ELECTIONS
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionFacebookInvitableFriends: function (google_civic_election_id) {
    const action_constant = 24; // ACTION_FACEBOOK_INVITABLE_FRIENDS
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionInviteByEmail: function (google_civic_election_id) {
    const action_constant = 27; // ACTION_INVITE_BY_EMAIL
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionModalIssues: function (google_civic_election_id) {
    const action_constant = 17; // ACTION_MODAL_ISSUES
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionModalOrganizations: function (google_civic_election_id) {
    const action_constant = 18; // ACTION_MODAL_ORGANIZATIONS
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionModalPositions: function (google_civic_election_id) {
    const action_constant = 19; // ACTION_MODAL_POSITIONS
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionModalFriends: function (google_civic_election_id) {
    const action_constant = 20; // ACTION_MODAL_FRIENDS
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionModalShare: function (google_civic_election_id) {
    const action_constant = 21; // ACTION_MODAL_SHARE
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionModalVote: function (google_civic_election_id) {
    const action_constant = 22; // ACTION_MODAL_VOTE
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionNetwork: function (google_civic_election_id) {
    const action_constant = 23; // ACTION_NETWORK
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionOffice: function (google_civic_election_id, ballot_item_we_vote_id) {
    const action_constant = 33; // ACTION_OFFICE
    this.saveActionWrapperWithBallotItem(action_constant, google_civic_election_id, ballot_item_we_vote_id);
  },

  saveActionVoterGuideAutoFollow: function (organization_we_vote_id, google_civic_election_id) {
    const action_constant = 4; // ACTION_ORGANIZATION_AUTO_FOLLOW
    this.saveActionWrapperWithOrganization(action_constant, google_civic_election_id, organization_we_vote_id);
  },

  saveActionVoterGuideGetStarted: function (organization_we_vote_id, google_civic_election_id) {
    const action_constant = 35; // ACTION_VOTER_GUIDE_GET_STARTED
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionVoterGuideVisit: function (organization_we_vote_id, google_civic_election_id) {
    const action_constant = 1; // ACTION_VOTER_GUIDE_VISIT
    this.saveActionWrapperWithOrganization(action_constant, google_civic_election_id, organization_we_vote_id);
  },

  saveActionWelcomeVisit: function (google_civic_election_id) {
    const action_constant = 12; // ACTION_WELCOME_VISIT
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

};
