// Note that we import these values into "web_app_config" (so we can search for it)
module.exports = {
    WE_VOTE_HOSTNAME: "wevote.me",  // This should be without "https://"

    WE_VOTE_SERVER_ADMIN_ROOT_URL: "https://api.wevoteusa.org/admin/",
    WE_VOTE_SERVER_API_ROOT_URL: "https://api.wevoteusa.org/apis/v1/",
    // WE_VOTE_SERVER_ADMIN_ROOT_URL: "http://localhost:8000/admin/",
    // WE_VOTE_SERVER_API_ROOT_URL: "http://localhost:8000/apis/v1/",

    DEBUG_MODE: false,

    // Use 1 or 0 as opposed to true or false
    test: {
        use_test_election: 0
    },

    location: {
        text_for_map_search: ""
    },

    FACEBOOK_APP_ID: ""
};
