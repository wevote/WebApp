export default function shallowClone (obj) {
  return Object.keys(obj).reduce((target, key) => {
    Object.assign(target, { [key]: obj[key] });
    return target;
  }, {});
}

/* The way it was prior to 12/1/18, the new version passes lint and I think it does the same thing
export function shallowClone (obj) {
    let target = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
        }
    }
    return target;
}
 */
