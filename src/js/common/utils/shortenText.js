export default function shortenText (incomingString, maximumLength) {
  if (!incomingString || incomingString === '') {
    return '';
  }
  const maximumLengthInteger = parseInt(maximumLength, 10);
  if (maximumLengthInteger < 1) {
    return '';
  }
  let cropLengthToMakeRoomForEllipses = maximumLengthInteger - 2;
  // Don't allow the string to use less than 3 characters
  const minimumCharactersToDisplay = 3;
  cropLengthToMakeRoomForEllipses = cropLengthToMakeRoomForEllipses > 2 ? cropLengthToMakeRoomForEllipses : minimumCharactersToDisplay;
  const shortenedText = incomingString.length < maximumLengthInteger ? incomingString : incomingString.slice(0, cropLengthToMakeRoomForEllipses);
  return incomingString.length < maximumLengthInteger ? incomingString.trim() : `${shortenedText.trim()}...`;
}
