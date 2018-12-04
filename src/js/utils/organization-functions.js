// organization-functions

export function isSpeakerTypeIndividual (speakerType) {
  let isIndividual = false;
  switch (speakerType) {
    // These are defined in https://github.com/wevote/WeVoteServer/organization/models.py
    case "I": // INDIVIDUAL
    case "PF": // PUBLIC_FIGURE
    case "V": // VOTER
      isIndividual = true;
      break;
    default:
      break;
  }
  return isIndividual;
}

export function isSpeakerTypeOrganization (speakerType) {
  let isOrganization = false;
  switch (speakerType) {
    // These are defined in https://github.com/wevote/WeVoteServer/organization/models.py
    case "C": // CORPORATION
    case "G": // GROUP
    case "NP": // NONPROFIT
    case "C3": // NONPROFIT_501C3
    case "C4": // NONPROFIT_501C4
    case "NW": // NEWS_ORGANIZATION
    case "O": // ORGANIZATION
    case "P": // POLITICAL_ACTION_COMMITTEE
      isOrganization = true;
      break;
    default:
      break;
  }
  return isOrganization;
}

export function isSpeakerTypePublicFigure (speakerType) {
  let isPublicFigure = false;
  switch (speakerType) {
    // These are defined in https://github.com/wevote/WeVoteServer/organization/models.py
    case "PF": // PUBLIC_FIGURE
      isPublicFigure = true;
      break;
    default:
      break;
  }
  return isPublicFigure;
}
