import { isCordova } from './isCordovaOrWebApp';

const initializejQuery = (afterFunction) => {
  if (window.$) {
    // console.log('jQuery ALREADY LOADED, SO NOT RELOADING');
    if (afterFunction) {
      afterFunction();
    }
  } else {
    if (isCordova()) {
      console.log('WARNING: jQuery was not loaded from index.html');
    }
    // Do not put this in a chunk, it is always needed for basic operation, and MUST be present on startup in Cordova
    import('jquery').then(({ default: jquery }) => {
      window.jQuery = jquery;
      window.$ = jquery;
      // console.log('jquery loaded');
      if (afterFunction) {
        afterFunction();
      }
    }).catch((error) => console.error('An error occurred while loading jQuery', error));
  }
};

export default initializejQuery;

