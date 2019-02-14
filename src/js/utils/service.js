import assign from 'object-assign';
import url from 'url';
import cookies from './cookies';
import webAppConfig from '../config';
import { httpLog } from './logging';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-param-reassign: 0 */


const defaults = {
  dataType: 'json',
  baseUrl: webAppConfig.WE_VOTE_SERVER_API_ROOT_URL,
  baseCdnUrl: webAppConfig.WE_VOTE_SERVER_API_CDN_ROOT_URL,
  url: webAppConfig.WE_VOTE_SERVER_API_ROOT_URL,
  query: {},
  type: 'GET',
  data () {
    return cookies.getItem('voter_device_id') ? {
      voter_device_id: cookies.getItem('voter_device_id'),
    } : {};
  },

  success: res => console.warn('Success function not defined:', res),
  error: err => console.error(`Ajax error: ${err.message}`),
};

/*
 * 2018: This function uses jQuery, to do deferred fetches from endpoints
 * React fetch is a more up to date way of doing this:
 *    https://facebook.github.io/react-native/docs/network.html
 *
 * 2016: The idea of this APIS.js file is to abstract away the details
 * of many repetitive service calls that we will be using.
 * @author Nick Fiorini <nf071590@gmail.com>
 */

export default function $ajax (options) {
  if (!options.endpoint) throw new Error('$ajax missing endpoint option');
  if (!defaults.baseCdnUrl) throw new Error('$ajax missing base CDN url option');
  if (!defaults.baseUrl) throw new Error('$ajax missing base url option');

  options.crossDomain = true;
  options.success = options.success || defaults.success;
  options.error = options.error || defaults.error;
  // console.log("service.js, options.endpoint: ", options.endpoint);
  if (options.endpoint === 'voterGuidesUpcomingRetrieve') {
    options.data = assign({}, options.data || {}); // Do not pass voter_device_id
    options.url = `${url.resolve(defaults.baseCdnUrl, options.endpoint)}/`;
  } else {
    options.data = assign({}, defaults.data(), options.data || {});
    options.url = `${url.resolve(defaults.baseUrl, options.endpoint)}/`;
  }

  httpLog(`AJAX URL: ${options.url}`);
  if (options.endpoint === 'voterRetrieve') {
    httpLog('AJAX voter_device_id: ', cookies.getItem('voter_device_id'));
  }

  /* global $ */
  /* eslint no-undef: ["error", { "typeof": true }] */
  return $.ajax(options);
}
