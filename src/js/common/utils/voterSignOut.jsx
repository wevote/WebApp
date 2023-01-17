import VoterActions from '../../actions/VoterActions';
import AppObservableStore from '../stores/AppObservableStore';
import CampaignActions from '../actions/CampaignActions';
import Cookies from './js-cookie/Cookies';

export default function voterSignOut () { // To discuss - having Store/Actions vs. voterSignOut as a function
  AppObservableStore.setShowSignInModal(false);
  AppObservableStore.unsetStoreSignInStartFullUrl();
  VoterActions.voterSignOut();   // Eleven stores or more, act on this action
  Cookies.remove('voter_device_id');
  Cookies.remove('voter_device_id', { path: '/' });
  Cookies.remove('voter_device_id', { path: '/', domain: 'wevote.us' });
  Cookies.remove('ballot_has_been_visited');
  Cookies.remove('ballot_has_been_visited', { path: '/' });
  Cookies.remove('location_guess_closed');
  Cookies.remove('location_guess_closed', { path: '/' });
  Cookies.remove('location_guess_closed', { path: '/', domain: 'wevote.us' });
  Cookies.remove('show_full_navigation');
  Cookies.remove('show_full_navigation', { path: '/' });
  Cookies.remove('sign_in_start_full_url', { path: '/' });
  Cookies.remove('sign_in_start_full_url', { path: '/', domain: 'wevote.us' });
  VoterActions.voterRetrieve();  // to get the new voter_device_id before the next api call
  const delayToAllowVoterRetrieveResponse = 2000;
  setTimeout(() => {
    CampaignActions.campaignListRetrieve();
  }, delayToAllowVoterRetrieveResponse);
}
