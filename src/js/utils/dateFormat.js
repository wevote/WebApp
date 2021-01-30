// dateFormat.js

import moment from 'moment';

export function formatDateToMonthDayYear (dateString) {
  // console.log('dateString:', dateString);
  const momentDate = moment(dateString, 'YYYY-MM-DD');
  return momentDate.format('MMM Do, YYYY');
}

export function formatDateToYearMonthDay (dateString) {
  // console.log('dateString:', dateString);
  const momentDate = moment(dateString, 'YYYY-MM-DD');
  return momentDate.format('YYYY/M/D');
}

export function timeFromDate (dateString) {
  if (!dateString || dateString === '') {
    return '';
  }
  return moment.utc(dateString).fromNow();
}

