/* Test cases
5
5.1
5.01
5.011
$5.01=
*/
export default function moneyStringToPennies (moneyString) {
  try {
    const cleanedMoneyString = moneyString.replace(/[^0-9.]/g, '');
    const pieces = cleanedMoneyString.split('.');
    let penniesInt = 0;
    if (pieces[0].length > 0) {
      penniesInt = parseInt(pieces[0]) * 100;   // Dollars as pennies
    }
    if (pieces.length > 1) {
      let padded = '';
      if (pieces[1].length === 1) {
        padded = `${pieces[1]}0`;                 // 5.1
      } else {
        padded = pieces[1].substring(0, 2);       // ignores tenths of penny etc.
      }
      penniesInt += parseInt(padded);
    }
    return penniesInt;
  } catch (err) {
    console.error('Unable to parse moneyString', moneyString);
    return undefined;
  }
}

