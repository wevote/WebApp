// accessed in VoterStore's getInterfaceFlagState and getNotificationSettingsFlagState methods
// The bits are 1, 2, 4, 8, 16, ... 2 power x
const VoterConstants = {
  // Used for interface_status_flags
  SUPPORT_OPPOSE_MODAL_SHOWN: 1, // When this bit is set, we know the voter has seen the initial support/oppose modal
  ADDRESS_INTRO_COMPLETED: 2, // Not using currently. Instead using location_guess_closed cookie
  VALUES_INTRO_COMPLETED: 4, // When this bit is set, the voter follows at least one issue (no need for intro)
  BALLOT_INTRO_ORGANIZATIONS_COMPLETED: 8, // ...the voter follows at least one organization (no need for intro)
  BALLOT_INTRO_POSITIONS_COMPLETED: 16, // ...the voter has taken at least one position (no need for intro)
  BALLOT_INTRO_FRIENDS_COMPLETED: 32, // ...the voter has reached out to at least one friend (no need for intro)
  BALLOT_INTRO_SHARE_COMPLETED: 64, // ...the voter has shared at least one item (no need for intro)
  BALLOT_INTRO_VOTE_COMPLETED: 128, // ...the voter learned about casting their vote (no need for intro)
  POSITION_PUBLIC_MODAL_SHOWN: 256, // ...the voter has seen the initial public position modal
  HOW_IT_WORKS_WATCHED: 512, // ...the voter has watched the 'How It Works' animation
  PERSONALIZED_SCORE_INTRO_COMPLETED: 1024,

  // Used for notification_settings bits. Which notification options has the voter chosen?
  NOTIFICATION_ZERO: 0,
  NOTIFICATION_NEWSLETTER_OPT_IN: 1, // Email: "I would like to receive WeVote newsletter"
  // NOTIFICATION_FRIEND_REQUESTS: n/a, // In App: "Show new friend requests sent to me"
  NOTIFICATION_FRIEND_REQUESTS_EMAIL: 2, // Email: "Show new friend requests sent to me" - friendinvite & friendaccept (for now)
  NOTIFICATION_FRIEND_REQUESTS_SMS: 4, // SMS: "Show new friend requests sent to me"
  // See also: NOTIFICATION_FRIEND_REQUEST_RESPONSES, NOTIFICATION_FRIEND_REQUEST_RESPONSES_EMAIL, NOTIFICATION_FRIEND_REQUEST_RESPONSES_SMS
  // NOTIFICATION_SUGGESTED_FRIENDS: n/a, // In App: "Suggestions of people you may know"
  NOTIFICATION_SUGGESTED_FRIENDS_EMAIL: 8, // Email: "Suggestions of people you may know"
  NOTIFICATION_SUGGESTED_FRIENDS_SMS: 16, // SMS: "Suggestions of people you may know"
  // NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT: n/a, // In App: "Friends' opinions (on your ballot)"
  NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT_EMAIL: 32, // Email: "Friends' opinions (on your ballot)" - friendopinions
  NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT_SMS: 64, // SMS: "Friends' opinions (on your ballot)"
  NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS: 128, // In App: "Friends' opinions (other regions)"
  NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS_EMAIL: 256, // Email: "Friends' opinions (other regions)" - friendopinionsall
  NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS_SMS: 512, // SMS: "Friends' opinions (other regions)"
  // NOTIFICATION_VOTER_DAILY_SUMMARY = n/a  # In App: When a friend posts something, or reacts to another post
  NOTIFICATION_VOTER_DAILY_SUMMARY_EMAIL: 1024,  // Email: When a friend posts something, or reacts to another post - dailyfriendactivity
  NOTIFICATION_VOTER_DAILY_SUMMARY_SMS: 2048,  // SMS: When a friend posts something, or reacts to another post
  // NOTIFICATION_FRIEND_REQUEST_RESPONSES: n/a, // In App: "Show me responses to my friend requests"
  NOTIFICATION_FRIEND_REQUEST_RESPONSES_EMAIL: 4096, // Email: "Show me responses to my friend requests" - friendaccept
  NOTIFICATION_FRIEND_REQUEST_RESPONSES_SMS: 8192, // SMS: "Show me responses to my friend requests"
  NOTIFICATION_LOGIN_EMAIL: 16384, // Email: "Show me responses to my friend requests"
  NOTIFICATION_LOGIN_SMS: 32768, // SMS: "Show me responses to my friend requests"
  // NOTIFICATION_FRIEND_MESSAGES: n/a, // In App: "Show me responses to my friend requests"
  NOTIFICATION_FRIEND_MESSAGES_EMAIL: 65536, // Email: "Show me responses to my friend requests" - friendaccept
  NOTIFICATION_FRIEND_MESSAGES_SMS: 131072, // SMS: "Show me responses to my friend requests"

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
