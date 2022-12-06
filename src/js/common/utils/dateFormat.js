// dateFormat.js
import initializeMoment from './initializeMoment';
import { convertToInteger } from '../../utils/textFormat';

// eslint-disable-next-line consistent-return
export function formatDateToMonthDayYear (dateString) {
  // console.log(`typeof window.moment is ${typeof window.moment}` );
  if (typeof window.moment === 'undefined') {
    initializeMoment(() => {
      const momentDate = window.moment(dateString, 'YYYY-MM-DD');
      return momentDate.format('MMM Do, YYYY');
    });
  } else {
    const momentDate = window.moment(dateString, 'YYYY-MM-DD');
    return momentDate.format('MMM Do, YYYY');
  }
}

export function formatDateToYearMonthDay (dateString) {
  initializeMoment(() => {
    // console.log('dateString:', dateString);
    const momentDate = window.moment(dateString, 'YYYY-MM-DD');
    return momentDate.format('YYYY/M/D');
  });
}

export function timeFromDate (dateString) {
  if (window.moment === undefined) {
    initializeMoment(() => {
      if (!dateString || dateString === '') {
        return '';
      }
      return window.moment.utc(dateString).fromNow();
    });
  }
  if (!dateString || dateString === '' || window.moment === undefined) {
    return '';
  }
  return window.moment.utc(dateString).fromNow();
}

export function getTodayAsInteger (daysInPast = 0) {
  const today = new Date();
  const thisYearInteger = today.getFullYear();
  let month = today.getMonth() + 1; // getMonth comes back starting with 0
  let monthDay = today.getDate();
  // console.log('thisYearInteger:', thisYearInteger, ', month: ', month, ', monthDay:', monthDay);
  // We want to adjust date returned by adjustDayByThisInteger so for thinks like seeing endorsements for an election 5 days past election date
  if (daysInPast > 0) {
    if (monthDay < (daysInPast + 1)) {
      monthDay = 30 - daysInPast;
      if (month > 1) {
        month -= 1;
      }
    } else {
      monthDay -= daysInPast;
    }
  }
  const monthAsString = month < 10 ? `0${month}` : `${month}`; // `${month}` for string result
  const monthDayAsString = monthDay < 10 ? `0${monthDay}` : `${monthDay}`; // `${monthDay}` for string result
  const dateAsString = `${thisYearInteger}${monthAsString}${monthDayAsString}`;
  return convertToInteger(dateAsString);
}

export function electionDateTomorrowFormatted (dayText) {
  if (typeof window.moment === 'undefined') {
    return initializeMoment(() => window.moment(dayText, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD'));
  } else {
    return window.moment(dayText, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');
  }
}

export function formatDateMMMDoYYYY (date) {
  if (typeof window.moment === 'undefined') {
    return initializeMoment(() => window.moment(date).format('MMM Do, YYYY'));
  } else {
    return window.moment(date).format('MMM Do, YYYY');
  }
}
