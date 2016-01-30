import keyMirror from 'keymirror';

const Constants = {
    FACEBOOK_INITIALIZED: null,
    FACEBOOK_LOGIN_CHANGE: null,
    FACEBOOK_GETTING_PICTURE: null,
    FACEBOOK_RECEIVED_PICTURE: null,
    FACEBOOK_LOGGED_IN: null,
    FACEBOOK_LOGGED_OUT: null,
    IMAGE_UPLOADED: null,
}

module.exports = keyMirror(Constants)