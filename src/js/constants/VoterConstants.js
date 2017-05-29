// accessed in VoterStore's getInterfaceFlagState and getNotificationSettingsFlagState methods
// The bits are 1, 2, 4, 8, 16, ... 2 power x
const VoterConstants = {
  // Used for interface_status_flags
  SUPPORT_OPPOSE_MODAL_SHOWN: 1, // When this bit is set, we know the voter has seen the initial support/oppose modal
  BALLOT_INTRO_MODAL_SHOWN: 2, // When this bit is set, we know the voter has seen the initial ballot introduction modal

  // Used for notification_settings bits. Which notification options has the voter chosen?
  NOTIFICATION_NEWSLETTER_OPT_IN: 1, // "I would like to receive the We Vote newsletter"
};

module.exports = VoterConstants;
