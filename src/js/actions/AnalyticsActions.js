import Dispatcher from "../dispatcher/Dispatcher";

// Dec 2018: Keep this comment as a cheat-sheet for the enumerated values sent by the API
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


export default {

  saveActionWrapper (action_constant, google_civic_election_id) {
    Dispatcher.loadEndpoint("saveAnalyticsAction",
      {
        action_constant,
        google_civic_election_id,
      });
  },

  saveActionWrapperWithOrganization (action_constant, google_civic_election_id, organization_we_vote_id) {
    Dispatcher.loadEndpoint("saveAnalyticsAction",
      {
        action_constant,
        google_civic_election_id,
        organization_we_vote_id,
      });
  },

  saveActionWrapperWithBallotItem (action_constant, google_civic_election_id, ballot_item_we_vote_id) {
    Dispatcher.loadEndpoint("saveAnalyticsAction",
      {
        action_constant,
        google_civic_election_id,
        ballot_item_we_vote_id,
      });
  },

  saveActionAboutGettingStarted (google_civic_election_id) {
    const action_constant = 28; // ACTION_ABOUT_GETTING_STARTED
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionAboutVision (google_civic_election_id) {
    const action_constant = 29; // ACTION_ABOUT_VISION
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionAboutOrganization (google_civic_election_id) {
    const action_constant = 30; // ACTION_ABOUT_ORGANIZATION
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionAboutTeam (google_civic_election_id) {
    const action_constant = 31; // ACTION_ABOUT_TEAM
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionAboutMobile (google_civic_election_id) {
    const action_constant = 32; // ACTION_ABOUT_MOBILE
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionAccountPage (google_civic_election_id) {
    const action_constant = 26; // ACTION_ACCOUNT_PAGE
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionBallotVisit (google_civic_election_id) {
    const action_constant = 6; // ACTION_BALLOT_VISIT
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionCandidate (google_civic_election_id, ballot_item_we_vote_id) {
    const action_constant = 34; // ACTION_CANDIDATE
    this.saveActionWrapperWithBallotItem(action_constant, google_civic_election_id, ballot_item_we_vote_id);
  },

  saveActionDonateVisit (google_civic_election_id) {
    const action_constant = 25; // ACTION_DONATE_VISIT
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionElections (google_civic_election_id) {
    const action_constant = 40; // ACTION_ELECTIONS
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionFacebookInvitableFriends (google_civic_election_id) {
    const action_constant = 24; // ACTION_FACEBOOK_INVITABLE_FRIENDS
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionInviteByEmail (google_civic_election_id) {
    const action_constant = 27; // ACTION_INVITE_BY_EMAIL
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionModalIssues (google_civic_election_id) {
    const action_constant = 17; // ACTION_MODAL_ISSUES
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionModalOrganizations (google_civic_election_id) {
    const action_constant = 18; // ACTION_MODAL_ORGANIZATIONS
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionModalPositions (google_civic_election_id) {
    const action_constant = 19; // ACTION_MODAL_POSITIONS
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionModalFriends (google_civic_election_id) {
    const action_constant = 20; // ACTION_MODAL_FRIENDS
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionModalShare (google_civic_election_id) {
    const action_constant = 21; // ACTION_MODAL_SHARE
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionModalVote (google_civic_election_id) {
    const action_constant = 22; // ACTION_MODAL_VOTE
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionNetwork (google_civic_election_id) {
    const action_constant = 23; // ACTION_NETWORK
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionOffice (google_civic_election_id, ballot_item_we_vote_id) {
    const action_constant = 33; // ACTION_OFFICE
    this.saveActionWrapperWithBallotItem(action_constant, google_civic_election_id, ballot_item_we_vote_id);
  },

  saveActionVoterGuideAutoFollow (organization_we_vote_id, google_civic_election_id) {
    const action_constant = 4; // ACTION_ORGANIZATION_AUTO_FOLLOW
    this.saveActionWrapperWithOrganization(action_constant, google_civic_election_id, organization_we_vote_id);
  },

  saveActionVoterGuideGetStarted (organization_we_vote_id, google_civic_election_id) {
    const action_constant = 35; // ACTION_VOTER_GUIDE_GET_STARTED
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

  saveActionVoterGuideVisit (organization_we_vote_id, google_civic_election_id) {
    const action_constant = 1; // ACTION_VOTER_GUIDE_VISIT
    this.saveActionWrapperWithOrganization(action_constant, google_civic_election_id, organization_we_vote_id);
  },

  saveActionWelcomeVisit (google_civic_election_id) {
    const action_constant = 12; // ACTION_WELCOME_VISIT
    this.saveActionWrapper(action_constant, google_civic_election_id);
  },

};
