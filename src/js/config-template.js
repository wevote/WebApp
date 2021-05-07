// Note that we import these values where needed as 'webAppConfig'
module.exports = {
  WE_VOTE_URL_PROTOCOL: 'http://', // 'http://' for local dev or 'https://' for live server
  WE_VOTE_HOSTNAME: 'localhost:3000', // Don't add 'http...' here.  Live server: 'WeVote.US', Quality: 'quality.WeVote.US', developers: 'localhost:3000'
  WE_VOTE_IMAGE_PATH_FOR_CORDOVA: 'https://wevote.us',   // If you are not working with Cordova, you don't need to change this
  SECURE_CERTIFICATE_INSTALLED: false,

  WE_VOTE_SERVER_ROOT_URL: 'https://api.wevoteusa.org/',
  WE_VOTE_SERVER_ADMIN_ROOT_URL: 'https://api.wevoteusa.org/admin/',
  WE_VOTE_SERVER_API_ROOT_URL: 'https://api.wevoteusa.org/apis/v1/',
  WE_VOTE_SERVER_API_CDN_ROOT_URL: 'https://cdn.wevoteusa.org/apis/v1/',

  ENABLE_NEXT_RELEASE_FEATURES: true,
  ENABLE_WORKBOX_SERVICE_WORKER: true,  // After setting this false, in Chrome DevTools go to Application Tab, Application/Service Worker and for the sw.js click the "unregister" button to the right

  DEBUG_MODE: false,
  SHOW_TEST_OPTIONS: false,    // On the DeviceDialog and elsewhere

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
};
