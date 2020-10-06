

export function dumpCssFromId (id) {
  const el = document.getElementById(id);
  const styles = window.getComputedStyle(el);
  return Object.keys(styles).forEach((index) => {
    const value = styles.getPropertyValue(index);
    if (value !== null  && value.length > 0) {
      console.log(`style dump for ${id} - ${index}: ${value}`);
    }
  }, {});
}

export function dumpObjProps (name, obj) {
  // eslint-disable-next-line guard-for-in
  Object.keys(obj).forEach((key) => console.log(`Dump Object ${name} ${key}: ${obj[key]}`));
}
