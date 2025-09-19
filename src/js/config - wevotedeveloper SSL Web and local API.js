/* eslint-disable */
// Note that we import these values where needed as "webAppConfig"
module.exports = {
  WE_VOTE_URL_PROTOCOL: 'https://', // "http://" for local dev or "https://" for live server
  WE_VOTE_HOSTNAME: 'wevotedeveloper.com:3000', // This should be without "http...". This is "WeVote.US" on live server.
  WE_VOTE_IMAGE_PATH_FOR_CORDOVA: 'https://wevote.us',   // If you are not working with Cordova, you don't need to change this
  SECURE_CERTIFICATE_INSTALLED: false,

  WE_VOTE_SERVER_ROOT_URL: 'https://wevotedeveloper.com:8000/',
  WE_VOTE_SERVER_ADMIN_ROOT_URL: 'https://wevotedeveloper.com:8000/admin/',
  WE_VOTE_SERVER_API_ROOT_URL: 'https://wevotedeveloper.com:8000/apis/v1/',
  WE_VOTE_SERVER_API_CDN_ROOT_URL: 'https://wevotedeveloper.com:8000/apis/v1/',

  ENABLE_NEXT_RELEASE_FEATURES: false,
  ENABLE_WORKBOX_SERVICE_WORKER: false,  // After setting this false, recompile, then in Chrome DevTools go to Application Tab, Application/Service Worker and for the sw.js click the "unregister" button to the right

  DEBUG_MODE: false,
  SHOW_TEST_OPTIONS: false,    // On the DeviceDialog

  LOG_RENDER_EVENTS: false,
  LOG_ONLY_FIRST_RENDER_EVENTS: false,
  LOG_HTTP_REQUESTS: false,
  LOG_ROUTING: false,
  LOG_SIGNIN_STEPS: false,
  LOG_CORDOVA_OFFSETS: false,
  SHOW_CORDOVA_URL_FIELD: false,  // Only needed for debugging in Cordova

  // Use 1 or 0 as opposed to true or false
  test: {
    use_test_election: 0,
  },

  location: {
    text_for_map_search: '',
  },

  ENABLE_FACEBOOK: false,
  ENABLE_TWITTER:  true,
  ENABLE_PAY_TO_PROMOTE: false,

  // API Keys, some of these are publishable (not secret)
  FACEBOOK_APP_ID: "1097389196952441",
  FULL_STORY_ORG: '',
  GOOGLE_ADS_TRACKING_ID: 'T',
  GOOGLE_ANALYTICS_TRACKING_ID: '',
  GOOGLE_TAG_MANAGER_ID: '',
  GOOGLE_MAPS_API_KEY: '',
  GOOGLE_PEOPLE_API_KEY: '',
  GOOGLE_PEOPLE_API_CLIENT_ID: '',
  GOOGLE_RECAPTCHA_KEY: '',
  OPEN_REPLAY_PROJECT_KEY: '',
  OPEN_REPLAY_INGEST_POINT: 'https://openreplay.wevote.us/ingest',
  STRIPE_API_KEY: "",
};
