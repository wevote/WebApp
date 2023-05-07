import arrayContains from './arrayContains';

export default function filterListToRemoveEntriesWithDuplicateValue (incomingList, fieldName, fieldRequired = false) {
  let isUniqueEntry;
  const valuesAlreadySeenList = [];
  return incomingList.filter((oneEntry) => {
    isUniqueEntry = true;
    if (!oneEntry || !oneEntry[fieldName]) {
      if (fieldRequired) {
        // While we require a value in the field (in fieldName), we filter out all entries that don't have one
        isUniqueEntry = false;
      } else {
        // When we don't require a value for the fieldName, we can pass -- entry can be considered unique
      }
    } else if (arrayContains(oneEntry[fieldName], valuesAlreadySeenList)) {
      isUniqueEntry = false;
    } else {
      valuesAlreadySeenList.push(oneEntry[fieldName]);
    }
    return isUniqueEntry;
  });
}
