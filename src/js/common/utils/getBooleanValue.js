export default function getBooleanValue (thing) {
  if (thing === undefined) {
    return false;
  } else if (typeof thing === 'boolean') {
    return thing;
  } else if (typeof thing === 'string') {
    return thing === 'true';
  } else {
    return false;
  }
}
