// superSharingStepPaths.js

export function onStep1ClickPath (campaignBasePath, campaignXNewsItemWeVoteId, sms) {
  if (campaignBasePath && campaignXNewsItemWeVoteId) {
    if (sms) {
      return `${campaignBasePath}/super-sharing-add-sms-contacts/${campaignXNewsItemWeVoteId}`;
    } else {
      return `${campaignBasePath}/super-sharing-add-email-contacts/${campaignXNewsItemWeVoteId}`;
    }
  } else if (campaignBasePath) {
    if (sms) {
      return `${campaignBasePath}/super-sharing-add-sms-contacts`;
    } else {
      return `${campaignBasePath}/super-sharing-add-email-contacts`;
    }
  }
  return '';
}

export function onStep2ClickPath (campaignBasePath, campaignXNewsItemWeVoteId, sms) {
  if (campaignBasePath && campaignXNewsItemWeVoteId) {
    if (sms) {
      return `${campaignBasePath}/super-sharing-choose-sms-recipients/${campaignXNewsItemWeVoteId}`;
    } else {
      return `${campaignBasePath}/super-sharing-choose-email-recipients/${campaignXNewsItemWeVoteId}`;
    }
  } else if (campaignBasePath) {
    if (sms) {
      return `${campaignBasePath}/super-sharing-choose-sms-recipients`;
    } else {
      return `${campaignBasePath}/super-sharing-choose-email-recipients`;
    }
  }
  return '';
}

export function onStep3ClickPath (campaignBasePath, campaignXNewsItemWeVoteId, sms) {
  if (campaignBasePath && campaignXNewsItemWeVoteId) {
    if (sms) {
      return `${campaignBasePath}/super-sharing-compose-sms/${campaignXNewsItemWeVoteId}`;
    } else {
      return `${campaignBasePath}/super-sharing-compose-email/${campaignXNewsItemWeVoteId}`;
    }
  } else if (campaignBasePath) {
    if (sms) {
      return `${campaignBasePath}/super-sharing-compose-sms`;
    } else {
      return `${campaignBasePath}/super-sharing-compose-email`;
    }
  }
  return '';
}

export function onStep4ClickPath (campaignBasePath, campaignXNewsItemWeVoteId, sms) {
  if (campaignBasePath && campaignXNewsItemWeVoteId) {
    if (sms) {
      return `${campaignBasePath}/super-sharing-send-sms/${campaignXNewsItemWeVoteId}`;
    } else {
      return `${campaignBasePath}/super-sharing-send-email/${campaignXNewsItemWeVoteId}`;
    }
  } else if (campaignBasePath) {
    if (sms) {
      return `${campaignBasePath}/super-sharing-send-sms`;
    } else {
      return `${campaignBasePath}/super-sharing-send-email`;
    }
  }
  return '';
}
