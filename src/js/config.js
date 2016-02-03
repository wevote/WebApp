// Note that we import these values into 'web_app_config' (so we can search for it)
module.exports = {
    WE_VOTE_SERVER_ADMIN_ROOT_URL: 'http://localhost:8000/admin/',
    WE_VOTE_SERVER_API_ROOT_URL: 'http://localhost:8000/apis/v1/',
    DEBUG_MODE: true,

    // Use 1 or 0 as opposed to true or false
    test: {
        use_test_election: 0
    },

    location: {
        text_for_map_search: '2201 Wilson Blvd, Arlington VA 22201'
    },

    // const APP_ID = '1097389196952441'; // DaleMcGrew Facebook App Id, https://wevote.me
    // const APP_ID = '868492333200013'; // wevote-dev, http://localhost:3000
    FACEBOOK_APP_ID: '868492333200013'
};
