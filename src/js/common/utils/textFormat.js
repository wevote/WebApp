// textFormat.js
import stringContains from './stringContains';

// We assume that arrayHaystack contains objects with one property with the name in needleProperty
// When we find the first object in the arrayHaystack, replace it with the newObject
export function arrayReplaceObjectMatchingPropertyValue (needleValue, needleProperty, arrayHaystack, newObject) {
  let objectWasReplaced = false;
  const indexOfExistingObject = arrayHaystack.findIndex((existingObject) => existingObject[needleProperty] === needleValue);
  if (indexOfExistingObject !== -1) {
    arrayHaystack.splice(indexOfExistingObject, 1, newObject);
    objectWasReplaced = true;
  }
  // console.log('objectWasReplaced: ', objectWasReplaced, ', indexOfExistingObject:', indexOfExistingObject);
  return {
    objectWasReplaced,
    arrayHaystack,
  };
}

export function calculateBallotBaseUrl (incomingBallotBaseUrl, incomingPathname) {
  const incomingPathnameExists = incomingPathname && incomingPathname !== '';
  const ballotBaseUrlEmpty = !incomingBallotBaseUrl || incomingBallotBaseUrl === '';
  let ballotBaseUrl = '';
  if ((incomingBallotBaseUrl === '/ready') || (incomingBallotBaseUrl === '/welcome')) {
    ballotBaseUrl = '/ready';
  } else if (incomingPathnameExists && ballotBaseUrlEmpty) {
    // console.log("incomingPathname:", incomingPathname);
    // Strip off everything after these path strings "/ballot" "/positions" "/followers" "/followed"
    const temp1 = incomingPathname.toLowerCase().split('/ballot')[0];
    const temp2 = temp1.split('/positions')[0];
    const temp3 = temp2.split('/followers')[0];
    const temp4 = temp3.split('/followed')[0];
    ballotBaseUrl = `${temp4}/ballot`;
    // console.log("ballotBaseUrl:", ballotBaseUrl);
  } else {
    ballotBaseUrl = incomingBallotBaseUrl || '/ballot';
  }
  return ballotBaseUrl;
}

export function calculateBallotBaseUrlForVoterGuide (incomingBallotBaseUrl, incomingPathname) {
  const incomingPathnameExists = incomingPathname && incomingPathname !== '';
  let ballotBaseUrl = '';
  if (incomingPathnameExists) {
    ballotBaseUrl = incomingPathname;
    // console.log("ballotBaseUrl:", ballotBaseUrl);
  } else {
    ballotBaseUrl = incomingBallotBaseUrl || '/ballot';
  }
  return ballotBaseUrl;
}

export function convertNameToSlug (incomingString) {
  // This is used to turn issue/value names into URL paths
  if (!incomingString || incomingString === '') {
    return '';
  }
  let convertedString = incomingString.toLowerCase();
  convertedString = convertedString.split(' ').join('_');
  convertedString = convertedString.split('&_').join('_');
  convertedString = convertedString.split('/_').join('_');
  // console.log('convertedString: ', convertedString);
  return convertedString;
}

export function cleanArray (actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

export function convertToInteger (incomingNumber) {
  return parseInt(incomingNumber, 10) || 0;
}

export function extractTwitterHandleFromTextString (incomingString) {
  if (!incomingString || incomingString === '') {
    return '';
  }
  let lowerCaseString = incomingString.toLowerCase();
  lowerCaseString = lowerCaseString.replace('http://twitter.com', '');
  lowerCaseString = lowerCaseString.replace('http://www.twitter.com', '');
  lowerCaseString = lowerCaseString.replace('https://twitter.com', '');
  lowerCaseString = lowerCaseString.replace('https://www.twitter.com', '');
  lowerCaseString = lowerCaseString.replace('www.twitter.com', '');
  lowerCaseString = lowerCaseString.replace('twitter.com', '');
  lowerCaseString = lowerCaseString.replace('@', '');
  lowerCaseString = lowerCaseString.replace('/', '');
  return lowerCaseString;
}

export function isNumber (value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isString (value) {
  return typeof value === 'string' || value instanceof String;
}

export function isValidUrl (incomingString) {
  const incomingStringTrimmed = incomingString.trim();
  const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return regexp.test(incomingStringTrimmed);
}

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * Duplicate values in the second object will overwrite those in the first
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
export function mergeTwoObjectLists (obj1, obj2) {
  const obj3 = {};
  Object.keys(obj1).forEach((key) => {
    if ({}.hasOwnProperty.call(obj1, key)) {
      obj3[key] = obj1[key];
    }
  });

  Object.keys(obj2).forEach((key) => {
    if ({}.hasOwnProperty.call(obj2, key)) {
      obj3[key] = obj2[key];
    }
  });

  return obj3;
}

export function sentenceCaseString (incomingString) {
  if (!incomingString || incomingString === '') {
    return '';
  }
  const incomingStringLowerCase = incomingString.toLowerCase();
  const stringArray = incomingStringLowerCase.split('.');
  let finalString = '';
  let count;
  let count2;
  for (count = 0; count < stringArray.length; count++) {
    let spaceput = '';
    const spaceCount = stringArray[count].replace(/^(\s*).*$/, '$1').length;
    stringArray[count] = stringArray[count].replace(/^\s+/, '');
    const newString = stringArray[count].charAt(stringArray[count]).toUpperCase() + stringArray[count].slice(1);
    for (count2 = 0; count2 < spaceCount; count2++) {
      spaceput = `${spaceput} `;
    }
    finalString = `${finalString + spaceput + newString}.`;
  }
  finalString = finalString.substring(0, finalString.length - 1);
  return finalString;
}

export function stripHtmlFromString (incomingString) {
  if (!incomingString || incomingString === '') {
    return '';
  }
  let strippedString = incomingString.replace(/&nbsp;/gi, ' ');
  strippedString = strippedString.replace(/<br>/gi, ' ');
  strippedString = strippedString.split(/<[^<>]*>/).join(''); // Strip away any HTML tags
  return strippedString;
}

export const youTubeRegX = /(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/;
export const vimeoRegX = /http(s)?:\/\/(www\.)?vimeo.com\/(\d+)(\/)?(#.*)?/;

// This must be placed after declaration of stringContains
export function isProperlyFormattedVoterGuideWeVoteId (voterGuideWeVoteId) {
  return voterGuideWeVoteId && stringContains('wv', voterGuideWeVoteId) && stringContains('vg', voterGuideWeVoteId);
}
