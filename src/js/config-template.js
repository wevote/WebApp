// Note that we import these values where needed as 'webAppConfig'
module.exports = {
  WE_VOTE_URL_PROTOCOL: 'http://', // 'http://' for local dev or 'https://' for live server
  WE_VOTE_HOSTNAME: 'localhost:3000', // This should be without 'http...'. This is 'WeVote.US' on live server.
  SECURE_CERTIFICATE_INSTALLED: false,

  WE_VOTE_SERVER_ROOT_URL: 'https://api.wevoteusa.org/',
  WE_VOTE_SERVER_ADMIN_ROOT_URL: 'https://api.wevoteusa.org/admin/',
  WE_VOTE_SERVER_API_ROOT_URL: 'https://api.wevoteusa.org/apis/v1/',
  WE_VOTE_SERVER_API_CDN_ROOT_URL: 'https://cdn.wevoteusa.org/apis/v1/',

  DEBUG_MODE: false,

  LOG_RENDER_EVENTS: false,
  LOG_ONLY_FIRST_RENDER_EVENTS: false,
  LOG_HTTP_REQUESTS: false,
  LOG_ROUTING: false,
  LOG_SIGNIN_STEPS: false,
  LOG_CORDOVA_OFFSETS: false,

  // Use 1 or 0 as opposed to true or false
  test: {
    use_test_election: 0,
  },

  location: {
    text_for_map_search: '',
  },

  ENABLE_FACEBOOK: true,

  // We currently store the Google Places API key in /src/index.html

  FACEBOOK_APP_ID: '1097389196952441',

  // This is the publishable key (not secret)
  STRIPE_API_KEY: 'pk_test_bWuWGC3jrMIFH3wvRvHR6Z5H',

  // Note to Apple:  We only use these codes to determine iPhone device type when using the iOS simulator in XCode
  // Look for a log line like this "Application initCordova ------------ /js/Application.jsx uuid: AC328523-8362-4D90-9805-D5F94203B113"
  // and put that uuid in the following table, to be able to use the XCode simulator for iPhones
  CORDOVA_IPHONE_UUIDS: [
    { name: 'i5', val: '' },
    { name: 'i5s', val: '' },
    { name: 'iSE', val: '' },
    { name: 'i6', val: '' },
    { name: 'i6s', val: '' },
    { name: 'i8', val: '' },
    { name: 'i8plus', val: '' },
    { name: 'iX', val: '' },
    { name: 'iXR', val: '' },
    { name: 'iXsMax', val: '' },
  ],
};
