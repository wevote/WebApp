export default function stringOccurs (needle) {
  const regExp = new RegExp(needle, 'gi');
  return (this.match(regExp) || []).length;
}
