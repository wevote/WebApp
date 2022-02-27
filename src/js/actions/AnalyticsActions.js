import Dispatcher from '../common/dispatcher/Dispatcher';
import AppObservableStore from '../stores/AppObservableStore';

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
// ACTION_ORGANIZATION_STOP_IGNORING = 41
// ACTION_MODAL_VOTER_PLAN = 42
// ACTION_READY_VISIT = 43
// ACTION_SELECT_BALLOT_MODAL = 44
// ACTION_SHARE_BUTTON_COPY = 45
// ACTION_SHARE_BUTTON_EMAIL = 46
// ACTION_SHARE_BUTTON_FACEBOOK = 47
// ACTION_SHARE_BUTTON_FRIENDS = 48
// ACTION_SHARE_BUTTON_TWITTER = 49
// ACTION_SHARE_BALLOT = 50
// ACTION_SHARE_BALLOT_ALL_OPINIONS = 51
// ACTION_SHARE_CANDIDATE = 52
// ACTION_SHARE_CANDIDATE_ALL_OPINIONS = 53
// ACTION_SHARE_MEASURE = 54
// ACTION_SHARE_MEASURE_ALL_OPINIONS = 55
// ACTION_SHARE_OFFICE = 56
// ACTION_SHARE_OFFICE_ALL_OPINIONS = 57
// ACTION_SHARE_READY = 58
// ACTION_SHARE_READY_ALL_OPINIONS = 59
// ACTION_VIEW_SHARED_BALLOT = 60
// ACTION_VIEW_SHARED_BALLOT_ALL_OPINIONS = 61
// ACTION_VIEW_SHARED_CANDIDATE = 62
// ACTION_VIEW_SHARED_CANDIDATE_ALL_OPINIONS = 63
// ACTION_VIEW_SHARED_MEASURE = 64
// ACTION_VIEW_SHARED_MEASURE_ALL_OPINIONS = 65
// ACTION_VIEW_SHARED_OFFICE = 66
// ACTION_VIEW_SHARED_OFFICE_ALL_OPINIONS = 67
// ACTION_VIEW_SHARED_READY = 68
// ACTION_VIEW_SHARED_READY_ALL_OPINIONS = 69
// ACTION_SEARCH_OPINIONS = 70
// ACTION_UNSUBSCRIBE_EMAIL_PAGE = 71
// ACTION_UNSUBSCRIBE_SMS_PAGE = 72
// ACTION_MEASURE = 73
// ACTION_NEWS = 74
// ACTION_SHARE_ORGANIZATION = 75
// ACTION_SHARE_ORGANIZATION_ALL_OPINIONS = 76
// ACTION_VIEW_SHARED_ORGANIZATION = 77
// ACTION_VIEW_SHARED_ORGANIZATION_ALL_OPINIONS = 78

export default {

  saveActionWrapper (actionConstant, googleCivicElectionId = '') {
    Dispatcher.loadEndpoint('saveAnalyticsAction',
      {
        action_constant: actionConstant,
        google_civic_election_id: googleCivicElectionId,
      });
  },

  saveActionWrapperWithOrganization (actionConstant, googleCivicElectionId, organizationWeVoteId) {
    Dispatcher.loadEndpoint('saveAnalyticsAction',
      {
        action_constant: actionConstant,
        google_civic_election_id: googleCivicElectionId,
        organization_we_vote_id: organizationWeVoteId,
      });
  },

  saveActionWrapperWithBallotItem (actionConstant, googleCivicElectionId, ballotItemWeVoteId) {
    Dispatcher.loadEndpoint('saveAnalyticsAction',
      {
        action_constant: actionConstant,
        google_civic_election_id: googleCivicElectionId,
        ballot_item_we_vote_id: ballotItemWeVoteId,
      });
  },

  saveActionAboutGettingStarted (googleCivicElectionId) {
    const actionConstant = 28; // ACTION_ABOUT_GETTING_STARTED
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionAboutVision (googleCivicElectionId) {
    const actionConstant = 29; // ACTION_ABOUT_VISION
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionAboutOrganization (googleCivicElectionId) {
    const actionConstant = 30; // ACTION_ABOUT_ORGANIZATION
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionAboutTeam (googleCivicElectionId) {
    const actionConstant = 31; // ACTION_ABOUT_TEAM
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionAboutMobile (googleCivicElectionId) {
    const actionConstant = 32; // ACTION_ABOUT_MOBILE
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionAccountPage (googleCivicElectionId) {
    const actionConstant = 26; // ACTION_ACCOUNT_PAGE
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionBallotVisit (googleCivicElectionId) {
    const actionConstant = 6; // ACTION_BALLOT_VISIT
    const siteOwnerOrganizationWeVoteId = AppObservableStore.getSiteOwnerOrganizationWeVoteId();
    if (siteOwnerOrganizationWeVoteId) {
      this.saveActionWrapperWithOrganization(actionConstant, googleCivicElectionId, siteOwnerOrganizationWeVoteId);
    } else {
      this.saveActionWrapper(actionConstant, googleCivicElectionId);
    }
  },

  saveActionCandidate (googleCivicElectionId, ballotItemWeVoteId) {
    const actionConstant = 34; // ACTION_CANDIDATE
    this.saveActionWrapperWithBallotItem(actionConstant, googleCivicElectionId, ballotItemWeVoteId);
  },

  saveActionDonateVisit (googleCivicElectionId) {
    const actionConstant = 25; // ACTION_DONATE_VISIT
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionElections (googleCivicElectionId) {
    const actionConstant = 40; // ACTION_ELECTIONS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionFacebookInvitableFriends (googleCivicElectionId) {
    const actionConstant = 24; // ACTION_FACEBOOK_INVITABLE_FRIENDS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionInviteByEmail (googleCivicElectionId) {
    const actionConstant = 27; // ACTION_INVITE_BY_EMAIL
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionMeasure (googleCivicElectionId, ballotItemWeVoteId) {
    const actionConstant = 73; // ACTION_MEASURE
    this.saveActionWrapperWithBallotItem(actionConstant, googleCivicElectionId, ballotItemWeVoteId);
  },

  saveActionModalIssues (googleCivicElectionId) {
    const actionConstant = 17; // ACTION_MODAL_ISSUES
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionModalOrganizations (googleCivicElectionId) {
    const actionConstant = 18; // ACTION_MODAL_ORGANIZATIONS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionModalPositions (googleCivicElectionId) {
    const actionConstant = 19; // ACTION_MODAL_POSITIONS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionModalFriends (googleCivicElectionId) {
    const actionConstant = 20; // ACTION_MODAL_FRIENDS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionModalShare (googleCivicElectionId) {
    const actionConstant = 21; // ACTION_MODAL_SHARE
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionModalVote (googleCivicElectionId) {
    const actionConstant = 22; // ACTION_MODAL_VOTE
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionModalVoterPlan (googleCivicElectionId) {
    const actionConstant = 42; // ACTION_MODAL_VOTER_PLAN
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionNetwork (googleCivicElectionId) {
    const actionConstant = 23; // ACTION_NETWORK
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionNews (googleCivicElectionId) {
    const actionConstant = 74; // ACTION_NEWS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionOffice (googleCivicElectionId, ballotItemWeVoteId) {
    const actionConstant = 33; // ACTION_OFFICE
    this.saveActionWrapperWithBallotItem(actionConstant, googleCivicElectionId, ballotItemWeVoteId);
  },

  saveActionReadyVisit (googleCivicElectionId) {
    const actionConstant = 43; // ACTION_READY_VISIT
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionSearchOpinions (googleCivicElectionId = '') {
    const actionConstant = 70; // ACTION_SEARCH_OPINIONS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionSelectBallotModal (googleCivicElectionId) {
    const actionConstant = 44; // ACTION_SELECT_BALLOT_MODAL
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareBallot (googleCivicElectionId) {
    const actionConstant = 50; // ACTION_SHARE_BALLOT
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareBallotAllOpinions (googleCivicElectionId) {
    const actionConstant = 51; // ACTION_SHARE_BALLOT_ALL_OPINIONS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareButtonCopy (googleCivicElectionId) {
    const actionConstant = 45; // ACTION_SHARE_BUTTON_COPY
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareButtonEmail (googleCivicElectionId) {
    const actionConstant = 46; // ACTION_SHARE_BUTTON_EMAIL
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareButtonFacebook (googleCivicElectionId) {
    const actionConstant = 47; // ACTION_SHARE_BUTTON_FACEBOOK
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareButtonFriends (googleCivicElectionId) {
    const actionConstant = 48; // ACTION_SHARE_BUTTON_FRIENDS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareButtonTwitter (googleCivicElectionId) {
    const actionConstant = 49; // ACTION_SHARE_BUTTON_TWITTER
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareCandidate (googleCivicElectionId) {
    const actionConstant = 52; // ACTION_SHARE_CANDIDATE
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareCandidateAllOpinions (googleCivicElectionId) {
    const actionConstant = 53; // ACTION_SHARE_CANDIDATE_ALL_OPINIONS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareMeasure (googleCivicElectionId) {
    const actionConstant = 54; // ACTION_SHARE_MEASURE
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareMeasureAllOpinions (googleCivicElectionId) {
    const actionConstant = 55; // ACTION_SHARE_MEASURE_ALL_OPINIONS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareOffice (googleCivicElectionId) {
    const actionConstant = 56; // ACTION_SHARE_OFFICE
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareOfficeAllOpinions (googleCivicElectionId) {
    const actionConstant = 57; // ACTION_SHARE_OFFICE_ALL_OPINIONS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareOrganization (googleCivicElectionId) {
    const actionConstant = 75; // ACTION_SHARE_ORGANIZATION
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareOrganizationAllOpinions (googleCivicElectionId) {
    const actionConstant = 76; // ACTION_SHARE_ORGANIZATION_ALL_OPINIONS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareReady (googleCivicElectionId) {
    const actionConstant = 58; // ACTION_SHARE_READY
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionShareReadyAllOpinions (googleCivicElectionId) {
    const actionConstant = 59; // ACTION_SHARE_READY_ALL_OPINIONS
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionUnsubscribeEmailPage (googleCivicElectionId) {
    const actionConstant = 71; // ACTION_UNSUBSCRIBE_EMAIL_PAGE
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionUnsubscribeSmsPage (googleCivicElectionId) {
    const actionConstant = 72; // ACTION_UNSUBSCRIBE_SMS_PAGE
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionVoterGuideAutoFollow (organizationWeVoteId, googleCivicElectionId) {
    const actionConstant = 4; // ACTION_ORGANIZATION_AUTO_FOLLOW
    this.saveActionWrapperWithOrganization(actionConstant, googleCivicElectionId, organizationWeVoteId);
  },

  saveActionVoterGuideGetStarted (organizationWeVoteId, googleCivicElectionId) {
    const actionConstant = 35; // ACTION_VOTER_GUIDE_GET_STARTED
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

  saveActionVoterGuideVisit (organizationWeVoteId, googleCivicElectionId) {
    const actionConstant = 1; // ACTION_VOTER_GUIDE_VISIT
    this.saveActionWrapperWithOrganization(actionConstant, googleCivicElectionId, organizationWeVoteId);
  },

  saveActionWelcomeVisit (googleCivicElectionId) {
    const actionConstant = 12; // ACTION_WELCOME_VISIT
    this.saveActionWrapper(actionConstant, googleCivicElectionId);
  },

};
