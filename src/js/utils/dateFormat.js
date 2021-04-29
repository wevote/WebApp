import initializeMoment from './initializeMoment';

export function formatDateToMonthDayYear (dateString) {
  initializeMoment(() => {
    // console.log('dateString:', dateString);
    const momentDate = window.moment(dateString, 'YYYY-MM-DD');
    return momentDate.format('MMM Do, YYYY');
  });
}

export function formatDateToYearMonthDay (dateString) {
  initializeMoment(() => {
    // console.log('dateString:', dateString);
    const momentDate = window.moment(dateString, 'YYYY-MM-DD');
    return momentDate.format('YYYY/M/D');
  });
}

export function timeFromDate (dateString) {
  initializeMoment(() => {
    if (!dateString || dateString === '') {
      return '';
    }
    return window.moment.utc(dateString).fromNow();
  });
}

