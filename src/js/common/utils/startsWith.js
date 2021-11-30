/**
 * @param needle
 * @param incomingString
 * @returns {boolean}
 */
export default function startsWith (needle, incomingString) {
  // IE 10 does not support the "string.startsWith" function.  DO NOT USE THAT FUNCTION
  // console.log("startsWith, needle:", needle, ", haystack: ", incomingString);
  if (incomingString) {
    return incomingString.indexOf(needle) === 0;
  } else {
    return false;
  }
}

/**
 * @param needle
 * @param incomingString
 * @returns {boolean}
 */
export function endsWith (needle, incomingString) {
  // IE 10 does not support the "string.startsWith" function.  DO NOT USE THAT FUNCTION
  // console.log("startsWith, needle:", needle, ", haystack: ", incomingString);
  if (incomingString) {
    return incomingString.endsWith(needle);
  } else {
    return false;
  }
}
