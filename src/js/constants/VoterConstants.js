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
  POSITION_PUBLIC_MODAL_SHOWN: 256, // ...the voter has seen the initial public position modal
  HOW_IT_WORKS_WATCHED: 512, // ...the voter has seen the initial bookmark action modal

  // Used for notification_settings bits. Which notification options has the voter chosen?
  NOTIFICATION_ZERO: 0,
  NOTIFICATION_NEWSLETTER_OPT_IN: 1, // "I would like to receive the We Vote newsletter"

  // Used for converting features_provided_bitmap into which features this voter can choose to use
  // Mirrored in WeVoteServer/organization/models.py
  CHOSEN_FAVICON_ALLOWED: 1, // Able to upload/display custom favicon in browser
  CHOSEN_FULL_DOMAIN_ALLOWED: 2, // Able to specify full domain for white label version of WeVote.US
  CHOSEN_GOOGLE_ANALYTICS_ALLOWED: 4, // Able to specify and have rendered org's Google Analytics Javascript
  CHOSEN_SOCIAL_SHARE_IMAGE_ALLOWED: 8, // Able to specify sharing images for white label version of WeVote.US
  CHOSEN_SOCIAL_SHARE_DESCRIPTION_ALLOWED: 16, // Able to specify sharing description for white label version of WeVote.US
  CHOSEN_PROMOTED_ORGANIZATIONS_ALLOWED: 32, // Able to promote endorsements from specific organizations
};

export default VoterConstants;
