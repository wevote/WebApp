export default function arrayContains (needle, arrayHaystack, caseSensitive = true) {
  // console.log('arrayContains, needle:', needle, ', haystack: ', arrayHaystack);
  if (arrayHaystack && arrayHaystack.length > 0) {
    if (caseSensitive) {
      return arrayHaystack.indexOf(needle) > -1;
    } else {
      const needleLower = typeof needle === 'string' ? needle.toLowerCase() : needle;
      return arrayHaystack.some((item) => typeof item === 'string' && item.toLowerCase() === needleLower);
    }
  } else {
    return false;
  }
}
