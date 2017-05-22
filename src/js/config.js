// Note that we import these values into "web_app_config" (so we can search for it)
module.exports = {
    WE_VOTE_URL_PROTOCOL: "http://",  // "http://" for local dev or "https://" for live server
    WE_VOTE_HOSTNAME: "localhost:3000",  // This should be without "http...". This is "WeVote.US" on live server.

    WE_VOTE_SERVER_ROOT_URL: "http://localhost:8000/",
    WE_VOTE_SERVER_ADMIN_ROOT_URL: "http://localhost:8000/admin/",
    WE_VOTE_SERVER_API_ROOT_URL: "http://localhost:8000/apis/v1/",

//  WE_VOTE_SERVER_ROOT_URL: "https://api.wevoteusa.org/",
//  WE_VOTE_SERVER_ADMIN_ROOT_URL: "https://api.wevoteusa.org/admin/",
//  WE_VOTE_SERVER_API_ROOT_URL: "https://api.wevoteusa.org/apis/v1/",

    DEBUG_MODE: false,

    // Use 1 or 0 as opposed to true or false
    test: {
        use_test_election: 0
    },

    location: {
        text_for_map_search: ""
    },

    FACEBOOK_APP_ID: "",

    STRIPE_API_KEY: "pk_test_bWuWGC3jrMIFH3wvRvHR6Z5H"
};
