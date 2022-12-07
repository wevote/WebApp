// removeTwitterNameFromDescription.js

function startsWithLocal (needle, incomingString) {
  // IE 10 does not support the "string.startsWith" function.  DO NOT USE THAT FUNCTION
  // console.log("startsWith, needle:", needle, ", haystack: ", incomingString);
  if (incomingString) {
    return incomingString.indexOf(needle) === 0;
  } else {
    return false;
  }
}

// If Display name is repeated in beginning of the description, remove the name from the description (along with trailing 'is') and capitalize next word to begin description.
export default function removeTwitterNameFromDescription (displayName, twitterDescription) {
  const displayNameNotNull = displayName || '';
  const twitterDescriptionNotNull = twitterDescription || '';
  let twitterDescriptionMinusName;

  if (startsWithLocal(displayNameNotNull, twitterDescriptionNotNull)) {
    twitterDescriptionMinusName = twitterDescriptionNotNull.substr(displayNameNotNull.length);
  } else if (startsWithLocal(`The ${displayNameNotNull}`, twitterDescriptionNotNull)) {
    twitterDescriptionMinusName = twitterDescriptionNotNull.substr(displayNameNotNull.length + 4);
  } else if (twitterDescriptionNotNull.length) {
    twitterDescriptionMinusName = twitterDescriptionNotNull;
  } else {
    twitterDescriptionMinusName = '';
  }
  if (startsWithLocal(', ', twitterDescriptionMinusName)) {
    twitterDescriptionMinusName = twitterDescriptionMinusName.substr(2);
  }
  if (startsWithLocal(': ', twitterDescriptionMinusName)) {
    twitterDescriptionMinusName = twitterDescriptionMinusName.substr(2);
  }
  return twitterDescriptionMinusName;
}
