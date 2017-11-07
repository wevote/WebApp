export function isSpeakerTypeIndividual (speaker_type) {
  var is_individual = false;
  switch (speaker_type) {
    // These are defined in https://github.com/wevote/WeVoteServer/organization/models.py
    case "I": // INDIVIDUAL
    case "V": // VOTER
      is_individual = true;
      break;
    default:
      break;
  }
  return is_individual;
}

export function isSpeakerTypeOrganization (speaker_type) {
  var is_organization = false;
  switch (speaker_type) {
    // These are defined in https://github.com/wevote/WeVoteServer/organization/models.py
    case "C": // CORPORATION
    case "G": // GROUP
    case "NP": // NONPROFIT
    case "C3": // NONPROFIT_501C3
    case "C4": // NONPROFIT_501C4
    case "NW": // NEWS_ORGANIZATION
    case "O": // ORGANIZATION
    case "P": // POLITICAL_ACTION_COMMITTEE
      is_organization = true;
      break;
    default:
      break;
  }
  return is_organization;
}

export function isSpeakerTypePublicFigure (speaker_type) {
  var is_public_figure = false;
  switch (speaker_type) {
    // These are defined in https://github.com/wevote/WeVoteServer/organization/models.py
    case "PF": // PUBLIC_FIGURE
      is_public_figure = true;
      break;
    default:
      break;
  }
  return is_public_figure;
}
