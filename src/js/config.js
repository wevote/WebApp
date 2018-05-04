// Note that we import these values where needed as "webAppConfig"
module.exports = {
  WE_VOTE_URL_PROTOCOL: "https://",  // "http://" for local dev or "https://" for live server
  WE_VOTE_HOSTNAME: "wevote.us",  // This should be without "http...". This is "WeVote.US" on live server.

  WE_VOTE_SERVER_ROOT_URL: "https://api.wevoteusa.org/",
  WE_VOTE_SERVER_ADMIN_ROOT_URL: "https://api.wevoteusa.org/admin/",
  WE_VOTE_SERVER_API_ROOT_URL: "https://api.wevoteusa.org/apis/v1/",

  DEBUG_MODE: false,

  LOG_RENDER_EVENTS: false,
  LOG_ONLY_FIRST_RENDER_EVENTS: false,
  LOG_HTTP_REQUESTS: false,
  LOG_ROUTING: false,
  LOG_SIGNIN_STEPS: false,

  // Use 1 or 0 as opposed to true or false
  test: {
    use_test_election: 0,
  },

  location: {
    text_for_map_search: "",
  },

  FACEBOOK_APP_ID: "1097389196952441",

  STRIPE_API_KEY: "pk_live_zpl7eSkLnySR2i4vtJQ1lJmi",
};
