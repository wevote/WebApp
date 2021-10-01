export default function removeValueFromArray (valueToRemove, listArray) {
  if (listArray && listArray.constructor === Array) {
    const index = listArray.indexOf(valueToRemove);
    if (index !== -1) {
      listArray.splice(index, 1);
    }
  }
  return listArray;
}
