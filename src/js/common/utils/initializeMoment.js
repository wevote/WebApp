const initializeMoment = (afterFunction) => {
  if (window.moment) {
    // console.log('moment ALREADY LOADED, SO NOT RELOADING');
    if (afterFunction) {
      afterFunction();
    }
  } else {
    import(/* webpackChunkName: 'moment' */ 'moment').then(({ default: moment }) => {
      window.moment = moment;
      // console.log('moment.js loaded');
      if (afterFunction) {
        afterFunction();
      }
    }).catch((error) => console.error('An error occurred while loading moment.js', error));
  }
};

export default initializeMoment;

