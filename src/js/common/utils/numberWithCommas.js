// numberWithCommas.js

export default function numberWithCommas (rawNumber) {
  if (rawNumber) {
    const parts = rawNumber.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  } else {
    return '0';
  }
}
