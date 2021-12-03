// dateFormat.js
import initializeMoment from './initializeMoment';

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
