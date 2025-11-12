// Misc utilities to help with Apple Silicon debugging, where the Safari Web Inspector is not available.

export function dumpCssFromId (id) {
  try {
    let el = document.getElementById(id);
    if (!el) {
      el = window.$('div[class*=\'PageContentContainer\']');
      if (el) {
        const [first = undefined] = el;
        if (first) {
          el = first;
        }
      }
    }
    const computedStyles = window.getComputedStyle(el);

    for (let i = 0; i < computedStyles.length; i++) {
      const key = computedStyles[i];
      const value = computedStyles.getPropertyValue(key);
      if (key.startsWith('top') || key.startsWith('margin') || key.startsWith('padding') || key.startsWith('height')) {
        console.log(`style dump for ${id} - ${key}: ${value}`);
      }
    }
    // return Object.keys(styles).forEach((index) => {
    //   const value = styles.getPropertyValue(index);
    //   if (value !== null && value.length > 0) {
    //     console.log(`style dump for ${id} - ${index}: ${value}`);
    //   }
    // }, {});
  } catch (error) {
    console.log('Error in dumpCssFromId for id: "', id, '" - ', error);
  }
}

// Copy of this function moved into cordovaUtils to avoid Dependency cycle problem
export function dumpObjProps (name, obj) {
  // eslint-disable-next-line guard-for-in
  Object.keys(obj).forEach((key) => console.log(`Dump Object ${name} ${key}: ${obj[key]}`));
}

/* eslint-disable no-unused-vars */
export function dumpScreenAndDeviceFields () {
  dumpObjProps('window.screen', window.screen);
  dumpObjProps('window.device', window.device);
}
