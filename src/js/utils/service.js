import assign from 'object-assign';
// import url from 'url';
import webAppConfig from '../config';
import Cookies from '../common/utils/js-cookie/Cookies';
import { httpLog } from '../common/utils/logging';
/* eslint no-param-reassign: 0 */


const defaults = {
  dataType: 'json',
  baseUrl: webAppConfig.WE_VOTE_SERVER_API_ROOT_URL,
  baseCdnUrl: webAppConfig.WE_VOTE_SERVER_API_CDN_ROOT_URL,
  url: webAppConfig.WE_VOTE_SERVER_API_ROOT_URL,
  query: {},
  method: 'GET',
  data () {
    // console.log('----------- voter_device_id sent with request in service.js/data: ', Cookies.get('voter_device_id'));
    return Cookies.get('voter_device_id') ? {
      // csrfmiddlewaretoken: cookies.getItem('csrftoken'),
      voter_device_id: Cookies.get('voter_device_id'),
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
  if (options.endpoint === 'campaignStartSave' ||
      // options.endpoint === 'challengeSave' || // TBD
      options.endpoint === 'challengeStartSave' ||
      options.endpoint === 'organizationPhotosSave' ||
      options.endpoint === 'reactionLikeStatusRetrieve' ||
      options.endpoint === 'voterContactListSave' ||
      options.endpoint === 'voterUpdate') {
    options.method = 'POST';
  } else {
    options.method = 'GET';
  }
  // Switch between master API server and CDN
  if (options.endpoint === 'allBallotItemsRetrieve' ||
    options.endpoint === 'candidateRetrieve' ||
    options.endpoint === 'candidatesQuery' ||
    options.endpoint === 'candidatesRetrieve' ||
    options.endpoint === 'challengeRetrieve' ||
    options.endpoint === 'defaultPricing' ||
    options.endpoint === 'electionsRetrieve' ||
    options.endpoint === 'issueDescriptionsRetrieve' ||
    options.endpoint === 'issueOrganizationsRetrieve' ||
    options.endpoint === 'issuesUnderBallotItemsRetrieve' ||
    options.endpoint === 'measureRetrieve' ||
    options.endpoint === 'officeRetrieve' ||
    // options.endpoint === 'organizationRetrieve' || // Includes data a client can update, and needs to be fresh
    options.endpoint === 'politicianRetrieve' ||
    options.endpoint === 'positionListForBallotItem' ||
    options.endpoint === 'representativesQuery' ||
    options.endpoint === 'twitterIdentityRetrieve' ||
    options.endpoint === 'voterGuidesUpcomingRetrieve' ||
    options.endpoint === 'voterGuidesRetrieve'
  ) {
    // Retrieve API data from CDN
    options.data = assign({}, options.data || {}); // Do not pass voter_device_id
    if (options.endpoint && !options.endpoint.endsWith('/')) {
      options.endpoint += '/';
    }
    options.url = new URL(options.endpoint, defaults.baseCdnUrl); // `${URL.resolve(defaults.baseCdnUrl, options.endpoint)}/`;
  } else {
    // Retrieve API from API Server Pool
    options.data = assign({}, options.data || {}, defaults.data());
    if (options.endpoint && !options.endpoint.endsWith('/')) {
      options.endpoint += '/';
    }
    options.url = new URL(options.endpoint, defaults.baseUrl); // `${URL.resolve(defaults.baseUrl, options.endpoint)}/`;
  }

  httpLog(`AJAX URL: ${options.url} -- voter_device_id: ${Cookies.get('voter_device_id')}`);
  if (options.method === 'POST') {
    httpLog(JSON.stringify(options.data));
  }
  if (['voterRetrieve', 'deviceStoreFirebaseCloudMessagingToken', 'siteConfigurationRetrieve'].includes(options.endpoint)) {
    httpLog('AJAX voter_device_id: ', Cookies.get('voter_device_id'));
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
      if (loop++ > 400 && loop < 405) {
        throw new Error('$ajax could not load jQuery within 20 seconds');
      }
    }, 10);
  }
}
