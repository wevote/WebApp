// Misc utilities to help with Apple Silicon debugging, where the Safari Web Inspector is not available.

export function dumpCssFromId (id) {
  try {
    const el = document.getElementById(id);
    const styles = window.getComputedStyle(el);
    return Object.keys(styles).forEach((index) => {
      const value = styles.getPropertyValue(index);
      if (value !== null && value.length > 0) {
        console.log(`style dump for ${id} - ${index}: ${value}`);
      }
    }, {});
  } catch (error) {
    console.log('Error in dumpCssFromId for id: "', id, '" - ', error);
    return {};
  }
}

// Copy of this function moved into cordovaUtils to avoid Dependency cycle problem
export function dumpObjProps (name, obj) {
  // eslint-disable-next-line guard-for-in
  Object.keys(obj).forEach((key) => console.log(`Dump Object ${name} ${key}: ${obj[key]}`));
}

export function dumpScreenAndDeviceFields () {
  dumpObjProps('window.screen', window.screen);
  dumpObjProps('window.device', window.device);
}
