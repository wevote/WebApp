import Dispatcher from '../dispatcher/Dispatcher';
import cookies from '../utils/cookies';
import AppActions from './AppActions';
import { stringContains } from '../utils/textFormat';

export default {
  voterSignOut () {
    AppActions.unsetStoreSignInStartFullUrl();
    Dispatcher.loadEndpoint('voterSignOut', { sign_out_all_devices: false });
    cookies.removeItem('voter_device_id');
    cookies.removeItem('voter_device_id', '/');
    cookies.removeItem('voter_device_id', '/', 'wevote.us');
    cookies.removeItem('ballot_has_been_visited');
    cookies.removeItem('ballot_has_been_visited', '/');
    cookies.removeItem('show_full_navigation');
    cookies.removeItem('show_full_navigation', '/');
    cookies.removeItem('sign_in_start_full_url', '/');
    cookies.removeItem('sign_in_start_full_url', '/', 'wevote.us');
  },

  setVoterDeviceIdCookie (id) {
    const { hostname } = window.location;
    console.log('VoterSessionActions setVoterDeviceIdCookie hostname:', hostname);
    if (hostname && stringContains('wevote.us', hostname)) {
      // If hanging off We Vote sub domain, store the cookie with top level domain
      cookies.setItem('voter_device_id', id, Infinity, '/', 'wevote.us');
    } else {
      cookies.setItem('voter_device_id', id, Infinity, '/');
    }
  },
};
