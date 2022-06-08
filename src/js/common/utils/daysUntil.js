// daysUntil.js
import initializeMoment from './initializeMoment';

function calculateDaysUntil (dayText) {
  // console.log('calculateDaysUntil dayText:', dayText);
  if (dayText) {
    const dayMDYSlash = window.moment(dayText, 'YYYY-MM-DD').format('MM/DD/YYYY');
    const dateObject = new Date(dayMDYSlash);
    const electionTime = new Date(dateObject).getTime();
    const currentTime = new Date().getTime();
    // console.log('calculateDaysUntil electionTime:', electionTime, ', currentTime:', currentTime);
    const distance = electionTime - currentTime;
    // console.log('distance:', distance);
    if (distance >= 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      return parseInt(`${days + 1}`, 10) || 0;
    } else if (distance > -86400000) {  // 86400000 is one day of milliseconds
      return 0;
    } else {
      const absoluteDistance = Math.abs(distance);
      const negativeDays = Math.floor(absoluteDistance / (1000 * 60 * 60 * 24));
      // console.log('calculateDaysUntil absoluteDistance:', absoluteDistance, ', negativeDays:', negativeDays);
      return -parseInt(`${negativeDays}`, 10);
    }
  }
  return 0;
}

// eslint-disable-next-line consistent-return
export default function daysUntil (dayText) {
  if (typeof window.moment === 'undefined') {
    initializeMoment(() => calculateDaysUntil(dayText));
  } else {
    return calculateDaysUntil(dayText);
  }
}
