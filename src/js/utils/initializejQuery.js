const initializejQuery = (afterFunction) => {
  if (window.$) {
    // console.log('jQuery ALREADY LOADED, SO NOT RELOADING');
    if (afterFunction) {
      afterFunction();
    }
  } else {
    import(/* webpackChunkName: 'jquery' */ 'jquery').then(({ default: jquery }) => {
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

