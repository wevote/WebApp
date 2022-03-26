import moment from 'moment';

// This is just a do-nothing stub for Cordova, but it must be in the same dir as initializeMoment.js (when compiling Cordova)
const initializeMomentCordova = (afterFunction) => {
  window.moment = moment;
  // console.log('moment.js loaded');
  if (afterFunction) {
    afterFunction();
  }
};

export default initializeMomentCordova;
