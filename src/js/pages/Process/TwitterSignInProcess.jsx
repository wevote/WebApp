import React, { Component } from 'react';
import styled from 'styled-components';
import TwitterActions from '../../actions/TwitterActions';
import VoterActions from '../../actions/VoterActions';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import SnackNotifier from '../../common/components/Widgets/SnackNotifier';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import { hasDynamicIsland, isCordovaWide } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import Cookies from '../../common/utils/js-cookie/Cookies';
import { oAuthLog, renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import IPhoneSpacer from '../../components/Widgets/IPhoneSpacer';
import TwitterStore from '../../stores/TwitterStore';
import VoterStore from '../../stores/VoterStore';

export default class TwitterSignInProcess extends Component {
  constructor (props) {
    super(props);
    this.state = {
      mergingTwoAccounts: false,
      savingAccount: false,
      redirectInProgress: false,
      twitterAuthResponse: {},
      redirectCount: 0,
    };
    this.twitterOauthLeg3 = this.twitterOauthLeg3.bind(this);
  }

  componentDidMount () {
    // console.log('--------------- TwitterSignInProcess componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.twitterStoreListener = TwitterStore.addListener(this.onTwitterStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    window.scrollTo(0, 0);
    this.twitterSignInRetrieve();

    const { redirectCount } = this.state;
    const urlParams = new URLSearchParams(document.location.search);
    const oauthToken = urlParams.get('oauth_token');
    const oauthVerifier = urlParams.get('oauth_verifier');
    oAuthLog(`TwitterSignInProcess search props oauthToken: ${oauthToken}, oauthVerifier: ${oauthVerifier}`);
    if (oauthToken && oauthVerifier && redirectCount === 0) {
      oAuthLog('TwitterSignInProcess received redirect from Twitter  redirectCount: ', redirectCount, ', oauthToken: ', oauthToken, ', oauthVerifier: ', oauthVerifier);
      this.setState({ redirectCount: (redirectCount + 1) });
      TwitterActions.twitterOauth1UserHandler(oauthToken, oauthVerifier);
      this.twitterSignInRetrieve();
    }
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
    console.log('TwitterSignInProcess onTwitterStoreChange, twitterAuthResponse:', twitterAuthResponse);

    if (twitterAuthResponse.twitter_sign_in_failed === undefined && twitterAuthResponse.twitter_oauth_voter_info_stored_in_db) {
      oAuthLog('Twitter sign undefined, but oauth_voter_info_stored_in_db - calling twitterSignInRetrieve()');
      this.twitterSignInRetrieve();
    } else if (twitterAuthResponse.twitter_sign_in_failed) {
      oAuthLog('Twitter sign in failed - push to /settings/account');
      historyPush({
        pathname: '/settings/account',  // SnackNotifier that handles this is in SettingsDashboard
        state: {
          message: 'Twitter sign in failed. Please try again.',
          severity: 'warning',
        },
      });
    } else if (twitterAuthResponse.twitter_retrieve_attempted === undefined && twitterAuthResponse.twitter_sign_in_failed === undefined) {
      oAuthLog('TwitterStore listener tripped before receiving a relevant reduce action, ignoring the event');
    } else if (!twitterAuthResponse.twitter_sign_in_found) {
      // This process starts when we return from attempting voterTwitterSignInRetrieve
      // If twitter_sign_in_found NOT True, go back to the sign in page to try again
      oAuthLog('twitterAuthResponse.twitter_sign_in_found', twitterAuthResponse.twitter_sign_in_found);
      historyPush({
        pathname: '/settings/account',   // SnackNotifier that handles this is in SettingsDashboard
        state: {
          message: 'Twitter authentication not found. Please try again.',
          severity: 'warning',
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
      console.log('twitterSignInStatus:', twitterSignInStatus);
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
                pathname: newRedirectPathname,   // This works in tested return paths, but if you add another, you will need to handle AppObservableStore.getPendingSnackMessage() in the componentDidUpdate()
                state: {
                  message: 'You have successfully signed in with Twitter.',
                  severity: 'success',
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
          oAuthLog('Twitter sign in (2), onVoterStoreChange - push to /ballot');
          if (twitterImageLoadInfo) {
            AppObservableStore.setSignInStateChanged(true);
            TwitterActions.twitterProcessDeferredImages(twitterImageLoadInfo);
            TwitterStore.clearTwitterImageLoadInfo();
          }
          if (normalizedHref() !== 'ballot') {
            historyPush({
              pathname: '/ballot',    // SnackNotifier that handles this is in Ballot
              state: {
                message: 'You have successfully signed in with Twitter.',
                severity: 'success',
              },
            });
          }
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
    oAuthLog('Twitter twitterSignInRetrieve on TwitterSignInProcess component mount');
    TwitterActions.twitterSignInRetrieve();
  }

  twitterOauthLeg3 (oauthToken, oauthVerifier) {
    const { redirectCount } = this.state;
    oAuthLog('TwitterSignInProcess received redirect from Twitter  redirectCount: ', redirectCount, ', oauthToken: ', oauthToken, ', oauthVerifier: ', oauthVerifier);
    this.setState({ redirectCount: (redirectCount + 1) });
    TwitterActions.twitterOauth1UserHandler(oauthToken, oauthVerifier);
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
            <SnackNotifier />
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
            <SnackNotifier />
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
            <SnackNotifier />
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

const LoadingDiv = styled('div')`
  font-size: 18px;
  margin-top: ${() => (hasDynamicIsland() ? '80px' : '50px')};
  ${() => (isCordovaWide() ? {
    marginLeft: '80px',
    marginRight: '80px',
  } : {})};
  text-align: center;
  padding: 10px;
  background-color: white;
  border: 1px solid #333;
  box-shadow: ${standardBoxShadow('wide')};
`;
