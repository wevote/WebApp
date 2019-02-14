
export function abbreviateNumber (num) {
  // =< 1,000,000 - round to hundred-thousand (1.4M)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  // 100,000 – 999,999 - round to nearest thousand (847K)
  if (num >= 100000) {
    return `${(num / 1000).toFixed(0).replace(/\.0$/, '')}K`;
  }
  // 10,000 – 99,999 - round to single decimal (45.8K)
  if (num >= 10000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  // < 10,000 - add comma for thousands (3,857)
  if (num < 10000) {
    const stringNum = num.toString();
    return stringNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return num;
}

export function arrayContains (needle, arrayHaystack) {
  // console.log("arrayContains, needle:", needle, ", haystack: ", arrayHaystack);
  if (arrayHaystack) {
    return arrayHaystack.indexOf(needle) > -1;
  } else {
    return false;
  }
}

// Gives preference to the earlier entry in the incoming array
export function arrayUnique (array) {
  const a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }
  return a;
}

export function calculateBallotBaseUrl (incomingBallotBaseUrl, incomingPathname) {
  const incomingPathnameExists = incomingPathname && incomingPathname !== '';
  const ballotBaseUrlEmpty = !incomingBallotBaseUrl || incomingBallotBaseUrl === '';
  let ballotBaseUrl = '';
  if (incomingPathnameExists && ballotBaseUrlEmpty) {
    // console.log("incomingPathname:", incomingPathname);
    // Strip off everything after these path strings "/ballot" "/positions" "/followers" "/followed"
    const temp1 = incomingPathname.split('/ballot')[0];
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

export function toTitleCase (incomingString) {
  if (!incomingString) {
    return '';
  }
  let count;
  let arrayLength;
  let str;
  str = incomingString.replace(/([^\W_]+[^\s-]*) */g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  const lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  for (count = 0, arrayLength = lowers.length; count < arrayLength; count++) {
    str = str.replace(new RegExp(`\\s${lowers[count]}\\s`, 'g'),
      txt => txt.toLowerCase());
  }

  // Leave state codes and measure names upper case
  const uppers = ['Us', 'Ak', 'Al', 'Ar', 'Az', 'Ca', 'Co', 'Ct', 'Dc', 'De', 'Fl', 'Ga', 'Gu', 'Hi', 'Ia', 'Id',
    'Il', 'In', 'Ks', 'La', 'Ma', 'Md', 'Me', 'Mi', 'Mn', 'Mo', 'Mp', 'Ms', 'Mt', 'Na', 'Nc', 'Nd', 'Ne',
    'Nh', 'Nj', 'Nm', 'Nv', 'Ny', 'Oh', 'Ok', 'Pa', 'Pr', 'Ri', 'Sc', 'Sd', 'Tn', 'Tx', 'Ut', 'Va', 'Vi',
    'Vt', 'Wa', 'Wi', 'Wv', 'Wy',
    'Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff', 'Gg', 'Hh', 'Ii', 'Jj', 'Kk', 'Ll', 'Mm', 'Nn', 'Oo', 'Pp',
    'Qq', 'Rr', 'Ss', 'Tt', 'Uu', 'Vv', 'Ww', 'Xx', 'Yy', 'Zz'];
  for (count = 0, arrayLength = uppers.length; count < arrayLength; count++) {
    str = str.replace(new RegExp(`\\b${uppers[count]}\\b`, 'g'),
      uppers[count].toUpperCase());
  }

  // Finally, search and replace for pesky abbreviations
  str = str.replace('U.s.', 'U.S.');
  str = str.replace('u.s.', 'U.S.');

  return str;
}

// March 24, 2018:  Poorly named and DOESN'T seem to work.
// It seems like it is supposed to do what the new "toTitleCase" (above) does,
// but send this function "Now is the time" and it returns "Now is the time"
export function capitalizeString (rawString) {
  // TODO Update everywhere we use capitalizeString to use toTitleCase
  return toTitleCase(rawString);
  // if (rawString === undefined) {
  //   return "";
  // }
  // if (rawString === rawString.toUpperCase()) {
  //   var lowercase = rawString.toLowerCase();
  //   return lowercase.replace( /(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); } );
  // } else {
  //   return rawString;
  // }
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

export function elipses (name, mobile) {
  function cut (position) {
    return name.length < position ? name : `${name.slice(0, position)}...`;
  }
  return mobile ? cut(3) : cut(8);
}

export function extractTwitterHandleFromTextString (rawString) {
  if (rawString === undefined) {
    return '';
  }
  let lowerCaseString = rawString.toLowerCase();
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

export function isValidUrl (rawString) {
  const rawStringTrimmed = rawString.trim();
  const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return regexp.test(rawStringTrimmed);
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

export function numberWithCommas (rawNumber) {
  if (rawNumber) {
    const parts = rawNumber.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  } else {
    return '';
  }
}

// If Display name is repeated in beginning of the description, remove the name from the description (along with trailing 'is') and capitalize next word to begin description.
export function removeTwitterNameFromDescription (displayName, twitterDescription) {
  const displayNameNotNull = displayName || '';
  const twitterDescriptionNotNull = twitterDescription || '';
  let twitterDescriptionMinusName;

  if (twitterDescriptionNotNull.startsWith(displayNameNotNull)) {
    twitterDescriptionMinusName = twitterDescriptionNotNull.substr(displayNameNotNull.length);
  } else if (twitterDescriptionNotNull.startsWith(`The ${displayNameNotNull}`)) {
    twitterDescriptionMinusName = twitterDescriptionNotNull.substr(displayNameNotNull.length + 4);
  } else if (twitterDescriptionNotNull.length) {
    twitterDescriptionMinusName = twitterDescriptionNotNull;
  } else {
    twitterDescriptionMinusName = '';
  }
  if (twitterDescriptionMinusName.startsWith(', ')) {
    twitterDescriptionMinusName = twitterDescriptionMinusName.substr(2);
  }
  if (twitterDescriptionMinusName.startsWith(': ')) {
    twitterDescriptionMinusName = twitterDescriptionMinusName.substr(2);
  }
  return twitterDescriptionMinusName;
}

export function removeValueFromArray (listArray, valueToRemove) {
  if (listArray && listArray.constructor === Array) {
    const index = listArray.indexOf(valueToRemove);
    if (index !== -1) {
      listArray.splice(index, 1);
    }
  }
  return listArray;
}

export function returnFirstXWords (originalString, numberOfWordsToReturn) {
  if (!originalString) return '';

  const wordsArray = originalString.split(' ');
  let xWords = '';
  for (let i = 0; i < wordsArray.length; i++) {
    if (i >= numberOfWordsToReturn) {
      break;
    }
    xWords += `${wordsArray[i]} `;
  }
  // Finally remove leading or trailing spaces
  xWords = xWords.trim();

  return xWords;
}

export function sentenceCaseString (rawStringIncoming) {
  if (rawStringIncoming === undefined) {
    return '';
  }
  const rawString = rawStringIncoming.toLowerCase();
  const stringArray = rawString.split('.');
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

export function shortenText (incomingString, maximumLength) {
  const maximumLengthInteger = parseInt(maximumLength, 10);
  let cropLengthToMakeRoomForEllipses = maximumLengthInteger - 2;
  // Don't allow the string to use less than 3 characters
  const minimumCharactersToDisplay = 3;
  cropLengthToMakeRoomForEllipses = cropLengthToMakeRoomForEllipses > 2 ? cropLengthToMakeRoomForEllipses : minimumCharactersToDisplay;
  return incomingString.length < maximumLengthInteger ? incomingString : `${incomingString.slice(0, cropLengthToMakeRoomForEllipses)}...`;
}

export function stringContains (needle, stringHaystack) {
  // console.log("stringContains, needle:", needle, ", haystack: ", stringHaystack);
  if (stringHaystack) {
    return stringHaystack.indexOf(needle) !== -1;
  } else {
    return false;
  }
}

export const youTubeRegX = /(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/;
export const vimeoRegX = /http(s)?:\/\/(www\.)?vimeo.com\/(\d+)(\/)?(#.*)?/;

// This must be placed after declaration of stringContains
export function isProperlyFormattedVoterGuideWeVoteId (voterGuideWeVoteId) {
  return voterGuideWeVoteId && stringContains('wv', voterGuideWeVoteId) && stringContains('vg', voterGuideWeVoteId);
}
