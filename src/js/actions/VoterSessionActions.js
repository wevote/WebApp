import Dispatcher from '../dispatcher/Dispatcher';
import cookies from '../utils/cookies';
import AppActions from './AppActions';

export default {
  voterSignOut () {
    AppActions.unsetStoreSignInStartPath();
    Dispatcher.loadEndpoint('voterSignOut', { sign_out_all_devices: false });
    cookies.removeItem('voter_device_id');
    cookies.removeItem('voter_device_id', '/');
    cookies.removeItem('show_full_navigation');
    cookies.removeItem('show_full_navigation', '/');
    cookies.removeItem('sign_in_start_path', '/');
  },

  setVoterDeviceIdCookie (id) {
    cookies.setItem('voter_device_id', id, Infinity, '/');
  },
};
