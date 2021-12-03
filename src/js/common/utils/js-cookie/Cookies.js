// Hacked version of js-cookie version 3.0.1, with changes for Cordova iOS for WeVote
/* eslint-disable no-var */
/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable indent */
/* eslint-disable no-continue */
/* eslint-disable no-empty */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-assign */
/* eslint-disable no-shadow */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-template */
/* eslint-disable semi */
/* eslint-disable semi */
/* eslint-disable vars-on-top */

import { isIOS } from '../../../utils/cordovaUtils';
import assign from './assign';
import defaultConverter from './converter';

function init (converter, defaultAttributes) {
  function set (name, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes)

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString()
    }

    name = encodeURIComponent(name)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape)

    var stringifiedAttributes = ''
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0]
    }

    if (isIOS()) {
      // 1/2/21 1pm, for the first pass just make all cookies session cookies without manual expiration
      if (['voter_device_id'].includes(name)) {
        window.localStorage.setItem(name, value);     // Persists between sessions
      } else {
        window.sessionStorage.setItem(name, value);
      }
    } else {
      return (document.cookie =
        name + '=' + converter.write(value, name) + stringifiedAttributes)
    }
  }

  function get (name) {
    if (isIOS()) {
      // 1/2/21 1pm, for the first pass just make all cookies session cookies without manual expiration
      if (['voter_device_id'].includes(name)) {
        return window.localStorage.getItem(name);
      } else {
        return window.sessionStorage.getItem(name);
      }
    }

    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : []
    var jar = {}
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=')
      var value = parts.slice(1).join('=')

      try {
        var found = decodeURIComponent(parts[0])
        jar[found] = converter.read(value, found)

        if (name === found) {
          break
        }
      } catch (e) {}
    }

    return name ? jar[name] : jar
  }

  return Object.create(
    {
      set: set,
      get: get,
      remove: function (name, attributes) {
        if (isIOS()) {
          // This is over simplistic, would not handle the case of two cookies with different domains
          if (['voter_device_id'].includes(name)) {
            window.localStorage.removeItem(name);
          } else {
            window.sessionStorage.removeItem(name);
          }
        } else {
          set(
            name,
            '',
            assign({}, attributes, {
              expires: -1
            })
          )
        }
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

export default init(defaultConverter, { path: '/' })
/* eslint-enable no-var */
