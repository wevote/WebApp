// standardBoxShadow.js

export default function standardBoxShadow (weight) {
  switch (weight) {
    case 'wide':
      return '0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgb(0,0,0,0.14),  0 1px 5px 0 rgb(0,0,0,0.12)';
    case 'medium':
      return '0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)';
    case 'narrow':
    default:
      return '0 1px 3px 0 rgba(0,0,0,0.2),    0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12)';
  }
}
