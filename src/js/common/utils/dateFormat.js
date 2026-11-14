// dateFormat.js
import initializeMoment from './initializeMoment';
import convertToInteger from './convertToInteger';

// eslint-disable-next-line consistent-return
export function formatDateToMonthDayYear (dateString) {
  // console.log(`typeof window.moment is ${typeof window.moment}`);
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

export function isThisYearInOfficeSetTrue (year, representative) {
  const yearInOfficeKey = `year_in_office_${year}`;
  // console.log('yearInOfficeKey: ', yearInOfficeKey);
  return ((yearInOfficeKey in representative) && representative[yearInOfficeKey]);
}

export function isAnyYearInOfficeSetTrue (yearList, representative) {
  for (let i = 0; i < yearList.length; i += 1) {
    if (isThisYearInOfficeSetTrue(yearList[i], representative)) {
      return true;
    }
  }
  return false;
}

export function getYearFromUltimateElectionDate (ultimateElectionDate) {
  if (ultimateElectionDate) {
    const tempYear = String(ultimateElectionDate).slice(0, 4);
    return Number(tempYear);
  } else {
    return 0;
  }
}

export function getDateFromUltimateElectionDate (ultimateElectionDate) {
  const ultimateElectionDateAsString = String(ultimateElectionDate);
  if (typeof window.moment === 'undefined') {
    return initializeMoment(() => window.moment(ultimateElectionDateAsString, 'YYYYMMDD').add(1, 'days').format('YYYY-MM-DD'));
  } else {
    return window.moment(ultimateElectionDateAsString, 'YYYYMMDD').add(1, 'days').format('YYYY-MM-DD');
  }
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

const getNextUpcomingElectionDate = (upcomingElectionDates) => {
  const processDates = () => {
    const today = window.moment().startOf('day'); // Get today's date as midnight
    const futureDates = upcomingElectionDates.filter((date) => window.moment(date, 'YYYY-MM-DD').isSameOrAfter(today));
    return futureDates.length > 0 ?
      futureDates.sort((a, b) => window.moment(a, 'YYYY-MM-DD') - window.moment(b, 'YYYY-MM-DD'))[0] :
      null;
  };

  if (typeof window.moment === 'undefined') {
    // Initialize when `moment` is not loaded
    return initializeMoment(processDates);
  } else {
    // If `moment` is already available
    return processDates();
  }
};

export function nextNationalElectionYYYYMMDDText () {
  // We could of course calculate this date so it is evergreen
  // (The rule is "the Tuesday after the first Monday of November")
  // but there is value in having a date that is searchable in the code...
  const upcomingElectionDates = [
    '2028-11-07',
    '2030-11-05',
    '2032-11-02',
    '2034-11-07',
    '2036-11-04',
    '2038-11-02',
    '2040-11-06',
    '2042-11-04',
    '2044-11-08',
    '2046-11-06',
  ];
  return getNextUpcomingElectionDate(upcomingElectionDates);
}
