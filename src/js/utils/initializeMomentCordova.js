import moment from 'moment';

const initializeMomentCordova = (afterFunction) => {
  window.moment = moment;
  // console.log('moment.js loaded');
  if (afterFunction) {
    afterFunction();
  }
};

export default initializeMomentCordova;
