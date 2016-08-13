
export function numberWithCommas (raw_number) {
    if (raw_number) {
        var parts = raw_number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    } else {
        return "";
    }
}

export function capitalizeString (str) {
  var lowercase = str.toLowerCase();
  return lowercase.replace( /(^|\s)([a-z])/g, function (m, p1, p2) { return p1 + p2.toUpperCase(); } );
}

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

