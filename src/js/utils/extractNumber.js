export default function extractNumber (str) {
  const pattern = /\d+/g;
  const regex = str.match(pattern);
  if (regex) {
    return regex[0];
  }
  return str;
}
