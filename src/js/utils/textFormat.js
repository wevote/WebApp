
export function abbreviateNumber (num) {
  // =< 1,000,000 - round to hundred-thousand (1.4M)
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  // 100,000 – 999,999 - round to nearest thousand (847K)
  if (num >= 100000) {
    return (num / 1000).toFixed(0).replace(/\.0$/, "") + "K";
  }
  // 10,000 – 99,999 - round to single decimal (45.8K)
  if (num >= 10000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  // < 10,000 - add comma for thousands (3,857)
  if (num < 10000) {
    var stringNum = num.toString();
    return stringNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return num;
}

// Gives preference to the earlier entry in the incoming array
export function arrayUnique (array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j])
        a.splice(j--, 1);
    }
  }
  return a;
}

export function arrayContains (needle, array_haystack) {
  // console.log("arrayContains, needle:", needle, ", haystack: ", array_haystack);
  if (array_haystack) {
    return array_haystack.indexOf(needle) > -1;
  } else {
    return false;
  }
}

export function stringContains (needle, string_haystack) {
  // console.log("stringContains, needle:", needle, ", haystack: ", string_haystack);
  if (string_haystack) {
    return string_haystack.indexOf(needle) !== -1;
  } else {
    return false;
  }
}

export function calculateBallotBaseUrl (incoming_ballot_base_url, incoming_pathname) {
  let incoming_pathname_exists = incoming_pathname && incoming_pathname !== "";
  let ballot_base_url_empty = !incoming_ballot_base_url || incoming_ballot_base_url === "";
  let ballotBaseUrl = "";
  if (incoming_pathname_exists && ballot_base_url_empty) {
    // console.log("incoming_pathname:", incoming_pathname);
    // Strip off everything after these path strings "/ballot" "/positions" "/followers" "/followed"
    let temp1 = incoming_pathname.split("/ballot")[0];
    let temp2 = temp1.split("/positions")[0];
    let temp3 = temp2.split("/followers")[0];
    let temp4 = temp3.split("/followed")[0];
    ballotBaseUrl = temp4 + "/ballot";
    // console.log("ballotBaseUrl:", ballotBaseUrl);
  } else {
    ballotBaseUrl = incoming_ballot_base_url || "/ballot";
  }
  return ballotBaseUrl;
}

export function capitalizeString (raw_string) {
  if (raw_string === undefined) {
    return "";
  }
  if (raw_string === raw_string.toUpperCase()) {
    var lowercase = raw_string.toLowerCase();
    return lowercase.replace( /(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); } );
  } else {
    return raw_string;
  }
}

export function sentenceCaseString (raw_string_incoming) {
  if (raw_string_incoming === undefined) {
    return "";
  }
  var raw_string = raw_string_incoming.toLowerCase();
  var string_array = raw_string.split(".");
  var final_string = "";
  var count;
  var count2;
  for (count = 0; count < string_array.length; count++) {
     var spaceput = "";
     var spaceCount = string_array[count].replace(/^(\s*).*$/, "$1").length;
     string_array[count] = string_array[count].replace(/^\s+/, "");
     var new_string = string_array[count].charAt(string_array[count]).toUpperCase() + string_array[count].slice(1);
     for (count2 = 0; count2 < spaceCount; count2++) {
       spaceput = spaceput + " ";
     }
     final_string = final_string + spaceput + new_string + ".";
  }
  final_string = final_string.substring(0, final_string.length - 1);
  return final_string;
}

export function cleanArray (actual) {
  var newArray = [];
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

export function extractTwitterHandleFromTextString (raw_string) {
  if (raw_string === undefined) {
    return "";
  }
  var lowerCaseString = raw_string.toLowerCase();
  lowerCaseString = lowerCaseString.replace("http://twitter.com", "");
  lowerCaseString = lowerCaseString.replace("http://www.twitter.com", "");
  lowerCaseString = lowerCaseString.replace("https://twitter.com", "");
  lowerCaseString = lowerCaseString.replace("https://www.twitter.com", "");
  lowerCaseString = lowerCaseString.replace("www.twitter.com", "");
  lowerCaseString = lowerCaseString.replace("twitter.com", "");
  lowerCaseString = lowerCaseString.replace("@", "");
  lowerCaseString = lowerCaseString.replace("/", "");
  return lowerCaseString;
}
/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * Duplicate values in the second object will overwrite those in the first
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
export function mergeTwoObjectLists (obj1, obj2) {
    var obj3 = {};
    for (var attribute_name1 in obj1) { obj3[attribute_name1] = obj1[attribute_name1]; }
    for (var attribute_name2 in obj2) { obj3[attribute_name2] = obj2[attribute_name2]; }
    return obj3;
}

export function numberWithCommas (raw_number) {
    if (raw_number) {
        var parts = raw_number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    } else {
        return "";
    }
}

// If Display name is repeated in beginning of the description, remove the name from the description (along with trailing 'is') and capitalize next word to begin description.
export function removeTwitterNameFromDescription (displayName, twitterDescription) {
    var displayNameNotNull = displayName ? displayName : "";
    var twitterDescriptionNotNull = twitterDescription ? twitterDescription : "";
    var twitterDescriptionMinusName;

    if (twitterDescriptionNotNull.startsWith(displayNameNotNull)) {
      twitterDescriptionMinusName = twitterDescriptionNotNull.substr(displayNameNotNull.length);
    } else if (twitterDescriptionNotNull.startsWith("The " + displayNameNotNull)) {
      twitterDescriptionMinusName = twitterDescriptionNotNull.substr(displayNameNotNull.length + 4);
    } else if (twitterDescriptionNotNull.length) {
      twitterDescriptionMinusName = twitterDescriptionNotNull;
    } else {
      twitterDescriptionMinusName = "";
    }
    if (twitterDescriptionMinusName.startsWith(", ")) {
        twitterDescriptionMinusName = twitterDescriptionMinusName.substr(2);
    }
    if (twitterDescriptionMinusName.startsWith(": ")) {
        twitterDescriptionMinusName = twitterDescriptionMinusName.substr(2);
    }
    return twitterDescriptionMinusName;
}

export function returnFirstXWords (originalString, numberOfWordsToReturn) {
  var wordsArray = originalString.split(" ");
  var xWords = "";
  for (var i = 0; i < wordsArray.length; i++) {
    if (i >= numberOfWordsToReturn) {
      break;
    }
    xWords += wordsArray[i] + " ";
  }
  // Finally remove leading or trailing spaces
  xWords = xWords.trim();

  return xWords;
}

export function shortenText (incoming_string, maximum_length){
  let maximum_length_int = parseInt(maximum_length, 10);
  let crop_length_to_make_room_for_ellipses = maximum_length_int - 2;
  // Don't allow the string to use less than 3 characters
  let minimum_characters_to_display = 3;
  crop_length_to_make_room_for_ellipses = crop_length_to_make_room_for_ellipses > 2 ? crop_length_to_make_room_for_ellipses : minimum_characters_to_display;
  return incoming_string.length < maximum_length_int ? incoming_string : `${incoming_string.slice(0, crop_length_to_make_room_for_ellipses)}...`;
}

export function elipses (name, mobile){
  function cut (position){
    return name.length < position ? name : `${name.slice(0, position)}...`;
  }
  return mobile ? cut(3) : cut(8);
}

export let youtube_reg = /(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/;
export let vimeo_reg = /http(s)?:\/\/(www\.)?vimeo.com\/(\d+)(\/)?(#.*)?/;
