
// export function generateActivityTidbitKey (kindOfActivity, activityTidbitId) {
//   let kindOfActivityPrefix;
//   if (kindOfActivity === 'ACTIVITY_NOTICE_SEED') {
//     kindOfActivityPrefix = `ActSeed${activityTidbitId}`;
//   } if (kindOfActivity === 'ACTIVITY_POST') {
//     kindOfActivityPrefix = `ActPost${activityTidbitId}`;
//   }
//   return kindOfActivityPrefix;
// }

// export function generateActivityTidbitKeyWithPrefix (activityTidbitPrefix, activityTidbitId) {
//   return `${activityTidbitPrefix}${activityTidbitId}`;
// }

export function createDescriptionOfFriendPosts (positionNameList) {
  if (!positionNameList) return 'added opinion';
  // added an opinion.
  // added opinion about Mark Fickes.
  // added opinions about Mark Fickes and Proposition 16.
  // added opinions about Mark Fickes, Proposition 16 and Kamala Harris.
  // added opinions about Mark Fickes, Proposition 16, Kamala Harris and 1 other item.
  // added opinions about Mark Fickes, Proposition 16, Kamala Harris and 3 other items.
  const positionNameListCount = positionNameList.length;
  let activityDescription = '';
  if (positionNameListCount === 0) {
    activityDescription += 'added opinion';
  } else if (positionNameListCount === 1) {
    activityDescription += ' added opinion about ';
    activityDescription += positionNameList[0];
    activityDescription += '';
  } else if (positionNameListCount === 2) {
    activityDescription += ' added opinions about ';
    activityDescription += positionNameList[0];
    activityDescription += ' and ';
    activityDescription += positionNameList[1];
    activityDescription += '';
  } else if (positionNameListCount === 3) {
    activityDescription += ' added opinions about ';
    activityDescription += positionNameList[0];
    activityDescription += ', ';
    activityDescription += positionNameList[1];
    activityDescription += ' and ';
    activityDescription += positionNameList[2];
    activityDescription += '';
  } else if (positionNameListCount > 3) {
    activityDescription += ' added opinions about ';
    activityDescription += positionNameList[0];
    activityDescription += ', ';
    activityDescription += positionNameList[1];
    activityDescription += ', ';
    activityDescription += positionNameList[2];
    activityDescription += ' and ';
    activityDescription += positionNameListCount - 3;
    activityDescription += ' other item';
    activityDescription += positionNameListCount > 4 ? 's' : '';
  }
  return activityDescription;
}
