export default function stringContains (needle, stringHaystack) {
  // console.log("stringContains, needle:", needle, ", haystack: ", stringHaystack);
  if (stringHaystack) {
    return stringHaystack.indexOf(needle) !== -1;
  } else {
    return false;
  }
}
