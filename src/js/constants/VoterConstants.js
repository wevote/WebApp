// accessed in VoterStore's getInterfaceFlagState and getNotificationSettingsFlagState methods
// The bits are 1, 2, 4, 8, 16, ... 2 power x
const VoterConstants = {
  // Used for interface_status_flags
  SUPPORT_OPPOSE_MODAL_SHOWN: 1, // When this bit is set, we know the voter has seen the initial support/oppose modal
  BALLOT_INTRO_MODAL_SHOWN: 2, // When this bit is set, we know the voter has seen the initial ballot introduction modal
  BALLOT_INTRO_ISSUES_COMPLETED: 4, // When this bit is set, the voter follows at least one issue (no need for intro)
  BALLOT_INTRO_ORGANIZATIONS_COMPLETED: 8, // ...the voter follows at least one organization (no need for intro)
  BALLOT_INTRO_POSITIONS_COMPLETED: 16, // ...the voter has taken at least one position (no need for intro)
  BALLOT_INTRO_FRIENDS_COMPLETED: 32, // ...the voter has reached out to at least one friend (no need for intro)
  BALLOT_INTRO_SHARE_COMPLETED: 64, // ...the voter has shared at least one item (no need for intro)
  BALLOT_INTRO_VOTE_COMPLETED: 128, // ...the voter learned about casting their vote (no need for intro)

  // Used for notification_settings bits. Which notification options has the voter chosen?
  NOTIFICATION_ZERO: 0,
  NOTIFICATION_NEWSLETTER_OPT_IN: 1, // "I would like to receive the We Vote newsletter"
};

module.exports = VoterConstants;
