import React, { Component } from 'react';
import styled from 'styled-components';
import TwitterActions from '../../actions/TwitterActions';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import { isAndroidSizeFold, isIPad } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import Cookies from '../../common/utils/js-cookie/Cookies';
import { oAuthLog, renderLog } from '../../common/utils/logging';
import IPhoneSpacer from '../../components/Widgets/IPhoneSpacer';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import TwitterStore from '../../stores/TwitterStore';
import VoterStore from '../../stores/VoterStore';
import { PageContentContainer } from '../../utils/pageLayoutStyles';
import { stringContains } from '../../utils/textFormat';

export default class TwitterSignInProcess extends Component {
  constructor (props) {
    super(props);
    this.state = {
      mergingTwoAccounts: false,
      savingAccount: false,
      redirectInProgress: false,
      twitterAuthResponse: {},
    };
  }

  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.twitterStoreListener = TwitterStore.addListener(this.onTwitterStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.twitterSignInRetrieve();
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.twitterStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    this.setState({});
  }

  onTwitterStoreChange () {
    const twitterAuthResponse = TwitterStore.getTwitterAuthResponse();
    const { twitter_image_load_info: twitterImageLoadInfo, twitter_secret_key: twitterSecretKey } = twitterAuthResponse;
    this.setState({ twitterAuthResponse, twitterImageLoadInfo });
    const { mergingTwoAccounts, savingAccount } = this.state;
    // console.log('TwitterSignInProcess onTwitterStoreChange, twitterImageLoadInfo:', twitterImageLoadInfo);

    if (twitterAuthResponse.twitter_sign_in_failed) {
      oAuthLog('Twitter sign in failed - push to /settings/account');
      historyPush({
        pathname: '/settings/account',
        state: {
          message: 'Twitter sign in failed. Please try again.',
          message_type: 'success',
        },
      });
    } else if (!twitterAuthResponse.twitter_sign_in_found) {
      // This process starts when we return from attempting voterTwitterSignInRetrieve
      // If twitter_sign_in_found NOT True, go back to the sign in page to try again
      oAuthLog('twitterAuthResponse.twitter_sign_in_found', twitterAuthResponse.twitter_sign_in_found);
      historyPush({
        pathname: '/settings/account',
        state: {
          message: 'Twitter authentication not found. Please try again.',
          message_type: 'warning',
        },
      });
    } else if (twitterAuthResponse.existing_twitter_account_found) {
      if (!mergingTwoAccounts) {
        oAuthLog('twitterAuthResponse voterMergeTwoAccountsByTwitterKey');
        this.voterMergeTwoAccountsByTwitterKey(twitterSecretKey);  // , twitterAuthResponse.voter_has_data_to_preserve
      } else if (!savingAccount) {
        oAuthLog('Setting up new Twitter entry - voterTwitterSaveToCurrentAccount -- actually calling API');
        this.localVoterTwitterSaveToCurrentAccount();
      }
    }
  }

  onVoterStoreChange () {
    const { redirectInProcess, twitterImageLoadInfo } = this.state;
    // console.log('TwitterSignInProcess onVoterStoreChange, redirectInProcess:', redirectInProcess);
    // console.log('TwitterSignInProcess onVoterStoreChange, twitterImageLoadInfo:', twitterImageLoadInfo);
    if (!redirectInProcess) {
      const twitterSignInStatus = VoterStore.getTwitterSignInStatus();
      // console.log('twitterSignInStatus:', twitterSignInStatus);
      const voter = VoterStore.getVoter();
      const { signed_in_twitter: voterIsSignedInTwitter } = voter;
      if (voterIsSignedInTwitter || (twitterSignInStatus && twitterSignInStatus.voter_merge_two_accounts_attempted)) {
        // Once the Twitter merge returns successfully, redirect to starting page
        let redirectFullUrl = '';
        let signInStartFullUrl = Cookies.get('sign_in_start_full_url');
        // console.log('TwitterSignInProcess signInStartFullUrl:', signInStartFullUrl);
        if (signInStartFullUrl && stringContains('twitter_sign_in', signInStartFullUrl)) {
          // Do not support a redirect to facebook_sign_in
          // console.log('TwitterSignInProcess Ignore facebook_sign_in url');
          signInStartFullUrl = null;
        }
        if (signInStartFullUrl) {
          // console.log('TwitterSignInProcess Executing Redirect');
          AppObservableStore.unsetStoreSignInStartFullUrl();
          Cookies.remove('sign_in_start_full_url', { path: '/' });
          Cookies.remove('sign_in_start_full_url', { path: '/', domain: 'wevote.us' });
          redirectFullUrl = signInStartFullUrl;
          // if (!voterHasDataToPreserve) {
          //   redirectFullUrl += '?voter_refresh_timer_on=1';
          // }
          let useWindowLocationAssign = true;
          if (window && window.location && window.location.origin) {
            if (stringContains(window.location.origin, redirectFullUrl)) {
              // Switch to path names to reduce load on browser and API server
              useWindowLocationAssign = false;
              const newRedirectPathname = isWebApp() ? redirectFullUrl.replace(window.location.origin, '') : '/ballot';
              // console.log('newRedirectPathname:', newRedirectPathname);
              this.setState({ redirectInProcess: true });
              oAuthLog(`Twitter sign in (1), onVoterStoreChange - push to ${newRedirectPathname}`);
              if (twitterImageLoadInfo) {
                AppObservableStore.setSignInStateChanged(true);
                TwitterActions.twitterProcessDeferredImages(twitterImageLoadInfo);
                TwitterStore.clearTwitterImageLoadInfo();
              }
              historyPush({
                pathname: newRedirectPathname,
                state: {
                  message: 'You have successfully signed in with Twitter.',
                  message_type: 'success',
                },
              });
            } else {
              // console.log('window.location.origin empty');
            }
          }
          if (useWindowLocationAssign) {
            // console.log('useWindowLocationAssign:', useWindowLocationAssign);
            this.setState({ redirectInProcess: true });
            window.location.assign(redirectFullUrl);
          }
        } else {
          this.setState({ redirectInProcess: true });
          const redirectPathname = '/ballot';
          oAuthLog(`Twitter sign in (2), onVoterStoreChange - push to ${redirectPathname}`);
          if (twitterImageLoadInfo) {
            AppObservableStore.setSignInStateChanged(true);
            TwitterActions.twitterProcessDeferredImages(twitterImageLoadInfo);
            TwitterStore.clearTwitterImageLoadInfo();
          }
          historyPush({
            pathname: redirectPathname,
            // query: {voter_refresh_timer_on: voterHasDataToPreserve ? 0 : 1},
            state: {
              message: 'You have successfully signed in with Twitter.',
              message_type: 'success',
            },
          });
        }
      }
    }
  }

  voterMergeTwoAccountsByTwitterKey (twitterSecretKey) {  // , voterHasDataToPreserve = true
    const { mergingTwoAccounts } = this.state;
    if (mergingTwoAccounts) {
      // console.log('In process of mergingTwoAccounts');
    } else {
      // console.log('About to make voterMergeTwoAccountsByTwitterKey API call');
      VoterActions.voterMergeTwoAccountsByTwitterKey(twitterSecretKey);
      this.setState({ mergingTwoAccounts: true });  // Prevent from being called multiple times
    }
  }

  // This creates the public.twitter_twitterlinktovoter entry, which is needed
  // to establish is_signed_in within the voter.voter
  localVoterTwitterSaveToCurrentAccount () {
    // console.log('localVoterTwitterSaveToCurrentAccount');
    this.setState({ savingAccount: true });  // Prevent from being called multiple times
    VoterActions.voterTwitterSaveToCurrentAccount();
    if (VoterStore.getVoterPhotoUrlMedium().length === 0) {
      // This only fires once, for brand new users on their very first login
      VoterActions.voterRetrieve();
    }
  }

  twitterSignInRetrieve () {
    TwitterActions.twitterSignInRetrieve();
  }

  render () {
    renderLog('TwitterSignInProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { redirectInProgress, twitterAuthResponse } = this.state;

    if (redirectInProgress) {
      return null;
    }
    if (window.$ === undefined) {
      return (
        <div className="twitter_sign_in_root">
          <IPhoneSpacer />
          <PageContentContainer>
            <LoadingDiv>
              <span>
                Loading libraries...
              </span>
              {LoadingWheel}
            </LoadingDiv>
          </PageContentContainer>
        </div>
      );
    }

    // oAuthLog('TwitterSignInProcess render');
    if (!twitterAuthResponse ||
      !twitterAuthResponse.twitter_retrieve_attempted) {
      oAuthLog('STOPPED, missing twitter_retrieve_attempted: twitterAuthResponse:', twitterAuthResponse);
      return (
        <div className="twitter_sign_in_root">
          <IPhoneSpacer />
          <PageContentContainer>
            <LoadingDiv>
              <span>
                Waiting for a response from Twitter...
              </span>
              {LoadingWheel}
            </LoadingDiv>
          </PageContentContainer>
        </div>
      );
    }
    // oAuthLog('=== Passed initial gate === with twitterAuthResponse: ', twitterAuthResponse);

    if (twitterAuthResponse.twitter_sign_in_failed) {
      return LoadingWheel;
    }

    // This process starts when we return from attempting voterTwitterSignInRetrieve
    // If twitter_sign_in_found NOT True, go back to the sign in page to try again
    if (!twitterAuthResponse.twitter_sign_in_found) {
      return LoadingWheel;
    }

    // Is there a collision of two accounts?
    if (twitterAuthResponse.existing_twitter_account_found) {
      return (
        <div className="twitter_sign_in_root">
          <IPhoneSpacer />
          <PageContentContainer>
            <LoadingDiv>
              <span>
                Loading your account...
              </span>
              {LoadingWheel}
            </LoadingDiv>
          </PageContentContainer>
        </div>
      );
    } else {
      return LoadingWheel;
    }
  }
}

const LoadingDiv = styled.div`
  font-size: 18px;
  margin-top: 50px;
  ${() => (isIPad() || isAndroidSizeFold() ? {
    marginLeft: '80px',
    marginRight: '80px',
  } : {})};
  text-align: center;
  padding: 10px;
  background-color: white;
  border: 1px solid #333;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`;
