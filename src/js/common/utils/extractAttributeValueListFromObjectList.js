
export default function extractAttributeValueListFromObjectList (attributeName, objectList, useToLowerCase = false) {
  const attributeList = [];
  if (objectList) {
    objectList.forEach((oneObject) => {
      if (oneObject && oneObject[attributeName]) {
        if (useToLowerCase) {
          attributeList.push(oneObject[attributeName].toLowerCase());
        } else {
          attributeList.push(oneObject[attributeName]);
        }
      }
    });
  }
  return attributeList;
}
