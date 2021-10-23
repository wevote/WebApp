import assign from 'object-assign';
import url from 'url';
import webAppConfig from '../config';
import cookies from './cookies';
import { httpLog } from './logging';
// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-param-reassign: 0 */


const defaults = {
  dataType: 'json',
  baseUrl: webAppConfig.WE_VOTE_SERVER_API_ROOT_URL,
  baseCdnUrl: webAppConfig.WE_VOTE_SERVER_API_CDN_ROOT_URL,
  url: webAppConfig.WE_VOTE_SERVER_API_ROOT_URL,
  query: {},
  method: 'GET',
  data () {
    // console.log('----------- cookies.getItem(\'voter_device_id\')', cookies.getItem('voter_device_id'));
    // console.log('----------- document.cookie', document.cookie);
    return cookies.getItem('voter_device_id') ? {
      // csrfmiddlewaretoken: cookies.getItem('csrftoken'),
      voter_device_id: cookies.getItem('voter_device_id'),
    } : {};
  },

  success: (res) => console.warn('Success function not defined:', res),
  error: (err) => console.error(`Ajax error: ${err.message}`),
};

/*
 * 2021: This function uses jQuery, to do deferred fetches from endpoints, and is already loaded with React
 * i.e. making sure jQuery is loaded right away becomes less important
 * React fetch is a more up to date way of doing this:
 *    https://reactjs.org/docs/faq-ajax.html
 *
 * 2016: The idea of this APIS.js file is to abstract away the details
 * of many repetitive service calls that we will be using.
 * @author Nick Fiorini <nf071590@gmail.com>
 */


function innerAjax (options) {
  const { $ } = window;
  if (!options.endpoint) throw new Error('$ajax missing endpoint option');
  if (!defaults.baseCdnUrl) throw new Error('$ajax missing base CDN url option');
  if (!defaults.baseUrl) throw new Error('$ajax missing base url option');

  options.crossDomain = true;
  options.success = options.success || defaults.success;
  options.error = options.error || defaults.error;
  // console.log('service.js, options.endpoint: ', options.endpoint);
  if (options.endpoint === 'organizationPhotosSave') {
    options.method = 'POST';
    // const csrftoken = cookies.getItem('csrftoken');
    // const headers = new Headers();
    // headers.append('X-CSRFToken', csrftoken);
    // headers.append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    // headers.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    // headers.append('Access-Control-Allow-Origin', '*');
    // options.headers = headers;
  } else {
    options.method = 'GET';
  }
  // Switch between master API server and CDN
  if (options.endpoint === 'allBallotItemsRetrieve' ||
    options.endpoint === 'candidateRetrieve' ||
    options.endpoint === 'candidatesRetrieve' ||
    options.endpoint === 'defaultPricing' ||
    options.endpoint === 'electionsRetrieve' ||
    options.endpoint === 'issueDescriptionsRetrieve' ||
    options.endpoint === 'issuesUnderBallotItemsRetrieve' ||
    options.endpoint === 'measureRetrieve' ||
    options.endpoint === 'officeRetrieve' ||
    // options.endpoint === 'organizationRetrieve' || // Includes data a client can update, and needs to be fresh
    options.endpoint === 'positionListForBallotItem' ||
    options.endpoint === 'voterGuidesUpcomingRetrieve' ||
    options.endpoint === 'voterGuidesRetrieve'
  ) {
    // Retrieve API data from CDN
    options.data = assign({}, options.data || {}); // Do not pass voter_device_id
    options.url = `${url.resolve(defaults.baseCdnUrl, options.endpoint)}/`;
  } else {
    // Retrieve API from API Server Pool
    options.data = assign({}, options.data || {}, defaults.data());
    options.url = `${url.resolve(defaults.baseUrl, options.endpoint)}/`;
  }

  httpLog(`AJAX URL: ${options.url}`);
  if (options.endpoint === 'voterRetrieve') {
    httpLog('AJAX voter_device_id: ', cookies.getItem('voter_device_id'));
  }
  return $.ajax(options);
}

export default function $ajax (options) {
  if (typeof window.$ !== 'undefined') {
    innerAjax(options);
  } else {
    let loop = 0;
    // eslint-disable-next-line consistent-return
    const waitForJQuery = setInterval(() => {
      if (typeof window.$ !== 'undefined') {
        clearInterval(waitForJQuery);
        innerAjax(options);
      }
      if (loop++ > 400) {
        throw new Error('$ajax could not load jQuery within 20 seconds');
      }
    }, 10);
  }
}
