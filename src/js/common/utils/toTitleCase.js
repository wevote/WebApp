export default function toTitleCase (incomingString) {
  if (!incomingString || incomingString === '') {
    return '';
  }
  let count;
  let arrayLength;
  let str;
  str = incomingString.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  const lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  for (count = 0, arrayLength = lowers.length; count < arrayLength; count++) {
    str = str.replace(new RegExp(`\\s${lowers[count]}\\s`, 'g'),
      (txt) => txt.toLowerCase());
  }

  // Leave state codes, measure names and 'VP' upper case
  // AC Transit
  const uppers = ['Ac',
    'Us', 'Ak', 'Al', 'Ar', 'Az', 'Ca', 'Co', 'Ct', 'Dc', 'De', 'Fl', 'Ga', 'Gu', 'Hi', 'Ia', 'Id',
    'Il', 'In', 'Ks', 'La', 'Ma', 'Md', 'Me', 'Mi', 'Mn', 'Mo', 'Mp', 'Ms', 'Mt', 'Na', 'Nc', 'Nd', 'Ne',
    'Nh', 'Nj', 'Nm', 'Nv', 'Ny', 'Oh', 'Ok', 'Pa', 'Pr', 'Ri', 'Sc', 'Sd', 'Tn', 'Tx', 'Ut', 'Va', 'Vi',
    'Vt', 'Wa', 'Wi', 'Wv', 'Wy',
    'Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff', 'Gg', 'Hh', 'Ii', 'Jj', 'Kk', 'Ll', 'Mm', 'Nn', 'Oo', 'Pp',
    'Qq', 'Rr', 'Ss', 'Tt', 'Uu', 'Vv', 'Ww', 'Xx', 'Yy', 'Zz',
    'Vp'];
  for (count = 0, arrayLength = uppers.length; count < arrayLength; count++) {
    str = str.replace(new RegExp(`\\b${uppers[count]}\\b`, 'g'),
      uppers[count].toUpperCase());
  }

  // Finally, search and replace for pesky abbreviations
  str = str.replace('U.s.', 'U.S.');
  str = str.replace('u.s.', 'U.S.');

  return str;
}
