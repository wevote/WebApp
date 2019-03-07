// Position related functions
export default function extractFirstEndorsementFromPositionList (positionList) {
  let onePosition = {};
  let endorsementOrganization = '';
  let endorsementText = '';
  for (let i = 0; i < positionList.length; i++) {
    onePosition = positionList[i];
    if (onePosition && onePosition.statement_text && onePosition.statement_text.length > 2) {
      endorsementOrganization = onePosition.speaker_display_name;
      endorsementText = onePosition.statement_text;
      break;
    }
  }
  return {
    endorsementOrganization,
    endorsementText,
  };
}
