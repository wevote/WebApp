import { Component } from 'react';
import AppActions from '../../actions/AppActions';
import FacebookActions from '../../actions/FacebookActions';
import FacebookStore from '../../stores/FacebookStore';
import { historyPush } from '../../utils/cordovaUtils';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import VoterActions from '../../actions/VoterActions';
import cookies from '../../utils/cookies';

export default class FacebookSignInProcess extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      facebookAuthResponse: {},
      saving: false,
      yesPleaseMergeAccounts: false,
      mergingTwoAccounts: false,
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    // console.log("FacebookSignInProcess, componentDidMount");
    this.voterFacebookSignInRetrieve();
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
  }

  onFacebookStoreChange () {
    this.setState({
      facebookAuthResponse: FacebookStore.getFacebookAuthResponse(),
      saving: false,
    });
  }

  voterMergeTwoAccountsByFacebookKey (facebookSecretKey, voterHasDataToPreserve = true) {
    // console.log("In voterMergeTwoAccountsByFacebookKey, facebookSecretKey: ", facebookSecretKey, ", voterHasDataToPreserve: ", voterHasDataToPreserve);
    if (this.state.mergingTwoAccounts) {
      // console.log("In process of mergingTwoAccounts");
    } else {
      // console.log("About to make voterMergeTwoAccountsByFacebookKey API call");
      VoterActions.voterMergeTwoAccountsByFacebookKey(facebookSecretKey);
      // Prevent voterMergeTwoAccountsByFacebookKey from being called multiple times
      this.setState({ mergingTwoAccounts: true });
    }
    let redirectFullUrl = '';
    const signInStartFullUrl = cookies.getItem('sign_in_start_full_url');
    if (signInStartFullUrl) {
      AppActions.unsetStoreSignInStartFullUrl();
      cookies.removeItem('sign_in_start_full_url', '/');
      cookies.removeItem('sign_in_start_full_url', '/', 'wevote.us');
      redirectFullUrl = signInStartFullUrl;
      // The Facebook sign in delay isn't as great as Twitter, so this might not be needed.
      if (!voterHasDataToPreserve) {
        redirectFullUrl += '?voter_refresh_timer_on=1';
      }
      window.location.assign(redirectFullUrl);
    } else {
      const redirectPathname = '/ballot';
      historyPush({
        pathname: redirectPathname,
        // The Facebook sign in delay isn't as great as Twitter, so this might not needed.
        query: { voter_refresh_timer_on: voterHasDataToPreserve ? 0 : 1 },
        state: {
          message: 'You have successfully signed in with Facebook.',
          message_type: 'success',
        },
      });
    }
  }

  voterFacebookSaveToCurrentAccount () {
    // console.log("In voterFacebookSaveToCurrentAccount");
    VoterActions.voterFacebookSaveToCurrentAccount();
    const signInStartFullUrl = cookies.getItem('sign_in_start_full_url');
    if (signInStartFullUrl) {
      AppActions.unsetStoreSignInStartFullUrl();
      cookies.removeItem('sign_in_start_full_url', '/');
      cookies.removeItem('sign_in_start_full_url', '/', 'wevote.us');
      window.location.assign(signInStartFullUrl);
    } else {
      const redirectPathname = '/ballot';
      historyPush({
        pathname: redirectPathname,
        state: {
          message: 'You have successfully signed in with Facebook.',
          message_type: 'success',
        },
      });
    }
  }

  voterFacebookSignInRetrieve () {
    // console.log("FacebookSignInProcess voterFacebookSignInRetrieve");
    if (!this.state.saving) {
      FacebookActions.voterFacebookSignInRetrieve();
      this.setState({ saving: true });
    }
  }

  render () {
    renderLog('FacebookSignInProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { facebookAuthResponse, yesPleaseMergeAccounts } = this.state;

    if (this.state.saving ||
      !facebookAuthResponse ||
      !facebookAuthResponse.facebook_retrieve_attempted) {
      // console.log("facebookAuthResponse:", facebookAuthResponse);
      return LoadingWheel;
    }
    // console.log("=== Passed initial gate ===");
    // console.log("facebookAuthResponse:", facebookAuthResponse);
    const { facebook_secret_key: facebookSecretKey } = facebookAuthResponse;

    if (facebookAuthResponse.facebook_sign_in_failed) {
      // console.log("Facebook sign in failed - push to /settings/account");
      historyPush({
        pathname: '/settings/account',
        state: {
          message: 'Facebook sign in failed. Please try again.',
          message_type: 'success',
        },
      });
      return LoadingWheel;
    }

    if (yesPleaseMergeAccounts) {
      // Go ahead and merge this voter record with the voter record that the facebookSecretKey belongs to
      console.log('this.voterMergeTwoAccountsByFacebookKey -- yes please merge accounts');
      this.voterMergeTwoAccountsByFacebookKey(facebookSecretKey);
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterFacebookSignInRetrieve
    // If facebook_sign_in_found NOT True, go back to the sign in page to try again
    if (!facebookAuthResponse.facebook_sign_in_found) {
      // console.log("facebookAuthResponse.facebook_sign_in_found", facebookAuthResponse.facebook_sign_in_found);
      historyPush({
        pathname: '/settings/account',
        state: {
          message: 'Facebook authentication not found. Please try again.',
          message_type: 'warning',
        },
      });
      return LoadingWheel;
    }

    // Is there a collision of two accounts?
    if (facebookAuthResponse.existing_facebook_account_found) {
      // For now are not asking to merge accounts
      this.voterMergeTwoAccountsByFacebookKey(facebookSecretKey, facebookAuthResponse.voter_has_data_to_preserve);
      return LoadingWheel;
    } else {
      // console.log("Setting up new Facebook entry - voterFacebookSaveToCurrentAccount");
      this.voterFacebookSaveToCurrentAccount();
      return LoadingWheel;
    }
  }
}
