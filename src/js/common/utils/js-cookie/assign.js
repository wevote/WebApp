/* eslint-disable func-names */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-var */
/* eslint-disable prefer-rest-params */
/* eslint-disable semi */
/* eslint-disable vars-on-top */

export default function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i]
    for (var key in source) {
      target[key] = source[key]
    }
  }
  return target
}
/* eslint-enable no-var */
