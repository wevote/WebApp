import { isNumber, isString } from './textFormat';

export default function extractNumber (string) {
  if (!string) return '';
  if (isNumber(string)) return string;
  if (!isString(string)) return '';
  const pattern = /\d+/g;
  const regex = string.match(pattern);
  if (regex) {
    return regex[0];
  }
  return string;
}
