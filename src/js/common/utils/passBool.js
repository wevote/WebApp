export default function passBool (value) {
  // console.log('passBool: ', value);
  if (value === undefined) return 'false';
  return value ? +value : 'false';
}
