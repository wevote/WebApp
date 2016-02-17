// Note that we import these values into 'web_app_config' (so we can search for it)
module.exports = {
    WE_VOTE_SERVER_ADMIN_ROOT_URL: 'https://api.wevoteusa.org/admin/',
    WE_VOTE_SERVER_API_ROOT_URL: 'https://api.wevoteusa.org/apis/v1/',
    // WE_VOTE_SERVER_ADMIN_ROOT_URL: 'http://localhost:8000/admin/',
    // WE_VOTE_SERVER_API_ROOT_URL: 'http://localhost:8000/apis/v1/',
    DEBUG_MODE: true,

    // Use 1 or 0 as opposed to true or false
    test: {
        use_test_election: 0
    },

    location: {
        text_for_map_search: '2208 Ebb Tide Rd, Virginia Beach, VA 23451'
    },

    // FACEBOOK_APP_ID: '1097389196952441' // DaleMcGrew Facebook App Id, https://wevote.me
    FACEBOOK_APP_ID: '1104012436290117' // We Vote - Test App
    // FACEBOOK_APP_ID: '868492333200013'  // wevote-dev, http://localhost:3000
};
