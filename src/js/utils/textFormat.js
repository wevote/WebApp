
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

export function capitalizeString (raw_string) {
  if (raw_string === undefined) {
    return "";
  }
  if (raw_string === raw_string.toUpperCase()) {
    var lowercase = raw_string.toLowerCase();
    return lowercase.replace( /\b\w/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); } );
  } else {
    return raw_string;
  }
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
