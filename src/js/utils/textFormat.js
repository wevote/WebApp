
export function numberWithCommas (raw_number) {
    if (raw_number) {
        var parts = raw_number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    } else {
        return "";
    }
}

export function removeTwitterNameFromDescription (displayName, twitterDescription) {
    var displayNameNotNull = displayName ? displayName : "";
    var twitterDescriptionNotNull = twitterDescription ? twitterDescription : "";
    var twitterDescriptionMinusName;

    if (twitterDescriptionNotNull.startsWith(displayNameNotNull)) {
      twitterDescriptionMinusName = twitterDescriptionNotNull.substr(displayNameNotNull.length);
    } else if (twitterDescriptionNotNull.startsWith("The " + displayNameNotNull)) {
      twitterDescriptionMinusName = twitterDescriptionNotNull.substr(displayNameNotNull.length + 4);
    } else if (twitterDescriptionNotNull.length) {
      twitterDescriptionMinusName = ". " + twitterDescriptionNotNull;
    } else {
      twitterDescriptionMinusName = "";
    }
    return twitterDescriptionMinusName;
}
