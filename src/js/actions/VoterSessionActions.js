import Dispatcher from '../common/dispatcher/Dispatcher';
// eslint-disable-next-line import/no-cycle
import AppObservableStore from '../common/stores/AppObservableStore';
import Cookies from '../common/utils/js-cookie/Cookies';
import stringContains from '../common/utils/stringContains';

export default {
  voterSignOut (signOutAllDevices = false) {
    AppObservableStore.setShowSignInModal(false);
    AppObservableStore.unsetStoreSignInStartFullUrl();
    Dispatcher.loadEndpoint('voterSignOut', { sign_out_all_devices: signOutAllDevices });
    const names = [
      'voter_device_id',
      'ballot_has_been_visited',
      'location_guess_closed',
      'number_of_ballot_choices_made',
      'number_of_topic_choices_made',
      'show_full_navigation',
      'sign_in_opened_from_issue_follow',
      'sign_in_start_full_url',
    ];
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      Cookies.remove(name);
      Cookies.remove(name, { path: '/' });
      Cookies.remove(name, { path: '/', domain: 'wevote.us' });
    }
  },

  setVoterDeviceIdCookie (id) {
    let { hostname } = window.location;
    hostname = hostname || '';
    console.log('VoterSessionActions setVoterDeviceIdCookie hostname:', hostname);
    if (hostname && stringContains('wevote.us', hostname)) {
      // If hanging off WeVote subdomain, store the cookie with top level domain
      Cookies.set('voter_device_id', id, { expires: 10000, path: '/', domain: 'wevote.us' });
    } else {
      Cookies.set('voter_device_id', id, { expires: 10000, path: '/' });
    }
  },
};
