import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cookies from '../../utils/cookies';
import AnalyticsActions from '../../actions/AnalyticsActions';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import FacebookActions from '../../actions/FacebookActions';
import FacebookStore from '../../stores/FacebookStore';
import { historyPush, isWebApp } from '../../utils/cordovaUtils';
import FacebookSignIn from '../Facebook/FacebookSignIn';
import LoadingWheel from '../LoadingWheel';
import { oAuthLog, renderLog } from '../../utils/logging';
import TwitterActions from '../../actions/TwitterActions';
import TwitterSignIn from '../Twitter/TwitterSignIn';
import VoterActions from '../../actions/VoterActions';
import VoterEmailAddressEntry from '../VoterEmailAddressEntry';
import VoterSessionActions from '../../actions/VoterSessionActions';
import VoterStore from '../../stores/VoterStore';

const debugMode = false;

export default class SettingsAccount extends Component {
  static propTypes = {
    inModal: PropTypes.bool,
    toggleSignInModal: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      facebookAuthResponse: {},
      isOnWeVoteRootUrl: true,
      isOnWeVoteSubDomainUrl: false,
      pleaseSignInTitle: '',
      pleaseSignInSubTitle: '',
      showTwitterDisconnect: false,
    };
    this.toggleTwitterDisconnectClose = this.toggleTwitterDisconnectClose.bind(this);
    this.toggleTwitterDisconnectOpen = this.toggleTwitterDisconnectOpen.bind(this);
    this.voterSplitIntoTwoAccounts = this.voterSplitIntoTwoAccounts.bind(this);
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log("SignIn componentDidMount");
    this.onVoterStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    cookies.removeItem('sign_in_start_full_url', '/');
    cookies.removeItem('sign_in_start_full_url', '/', 'wevote.us');
    const oneDayExpires = 86400;
    let pathname = '';

    const getStartedMode = AppStore.getStartedMode();
    AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
    const { origin } = window.location;
    let signInStartFullUrl = '';
    if (getStartedMode && getStartedMode === 'getStartedForCampaigns') {
      pathname = '/settings/profile';
      signInStartFullUrl = `${origin}${pathname}`;
      cookies.setItem('sign_in_start_full_url', signInStartFullUrl, oneDayExpires, '/', 'wevote.us');
      this.setState({
        pleaseSignInTitle: 'Please sign in to get started.',
        pleaseSignInSubTitle: 'Use Twitter to verify your account most quickly.',
      });
    } else if (getStartedMode && getStartedMode === 'getStartedForOrganizations') {
      pathname = '/settings/profile';
      signInStartFullUrl = `${origin}${pathname}`;
      cookies.setItem('sign_in_start_full_url', signInStartFullUrl, oneDayExpires, '/', 'wevote.us');
      this.setState({
        pleaseSignInTitle: 'Please sign in to get started.',
        pleaseSignInSubTitle: 'Use Twitter to verify your account most quickly.',
      });
    } else if (getStartedMode && getStartedMode === 'getStartedForVoters') {
      pathname = '/settings/profile';
      signInStartFullUrl = `${origin}${pathname}`;
      cookies.setItem('sign_in_start_full_url', signInStartFullUrl, oneDayExpires, '/', 'wevote.us');
      this.setState({
        pleaseSignInTitle: 'Please sign in to get started.',
        pleaseSignInSubTitle: 'Don\'t worry, we won\'t post anything automatically.',
      });
    } else {
      AppActions.storeSignInStartFullUrl();
      this.setState({
        pleaseSignInTitle: '',
        pleaseSignInSubTitle: 'Don\'t worry, we won\'t post anything automatically.',
      });
    }
    this.setState({
      isOnWeVoteRootUrl: AppStore.isOnWeVoteRootUrl(),
      isOnWeVoteSubDomainUrl: AppStore.isOnWeVoteSubDomainUrl(),
    });
  }

  componentWillUnmount () {
    // console.log("SignIn ---- UN mount");
    this.appStoreListener.remove();
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
    this.timer = null;
  }

  onAppStoreChange () {
    this.setState({
      isOnWeVoteRootUrl: AppStore.isOnWeVoteRootUrl(),
      isOnWeVoteSubDomainUrl: AppStore.isOnWeVoteSubDomainUrl(),
    });
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  onFacebookChange () {
    this.setState({
      facebookAuthResponse: FacebookStore.getFacebookAuthResponse(),
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('SignIn caught error: ', `${error} with info: `, info);
  }

  facebookLogOutOnKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      FacebookActions.appLogout();
    }
  }

  twitterLogOutOnKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      TwitterActions.appLogout();
    }
  }

  toggleTwitterDisconnectOpen () {
    this.setState({ showTwitterDisconnect: true });
  }

  toggleTwitterDisconnectClose () {
    this.setState({ showTwitterDisconnect: false });
  }

  voterSplitIntoTwoAccounts () {
    VoterActions.voterSplitIntoTwoAccounts();
    this.setState({ showTwitterDisconnect: false });
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    const { inModal } = this.props;

    // console.log("SignIn.jsx this.state.facebookAuthResponse:", this.state.facebookAuthResponse);
    if (!this.state.voter.signed_in_facebook && this.state.facebookAuthResponse && this.state.facebookAuthResponse.facebook_retrieve_attempted) {
      oAuthLog('SignIn.jsx facebook_retrieve_attempted');
      historyPush('/facebook_sign_in');

      // return <span>SignIn.jsx facebook_retrieve_attempted</span>;
      return LoadingWheel;
    }

    const { isOnWeVoteRootUrl, isOnWeVoteSubDomainUrl, pleaseSignInTitle, pleaseSignInSubTitle } = this.state;
    let pageTitle = 'Sign In - We Vote';
    let yourAccountTitle = 'Security & Sign In';
    let yourAccountExplanation = '';
    if (this.state.voter.is_signed_in) {
      pageTitle = 'Security & Sign In - We Vote';
      if (this.state.voter.signed_in_facebook && !this.state.voter.signed_in_twitter) {
        yourAccountTitle = 'Have Twitter Too?';
        yourAccountExplanation = 'By adding your Twitter account to your We Vote profile, you get access to the voter guides of everyone you follow.';
      } else if (this.state.voter.signed_in_twitter && !this.state.voter.signed_in_facebook) {
        yourAccountTitle = 'Have Facebook Too?';
        yourAccountExplanation = 'By adding Facebook to your We Vote profile, it is easier to invite friends.';
      }
    }

    return (
      <div className="">
        <Helmet title={pageTitle} />
        <BrowserPushMessage incomingProps={this.props} />
        <div className={inModal ? '' : 'card'}>
          <Main inModal={inModal}>
            {this.state.voter.signed_in_twitter && this.state.voter.signed_in_facebook ?
              null :
              <h1 className="h3">{this.state.voter.is_signed_in ? <span>{yourAccountTitle}</span> : null}</h1>
            }
            {this.state.voter.is_signed_in ?
              <div className="u-stack--sm">{yourAccountExplanation}</div> : (
                <div>
                  <div className="u-f3">{pleaseSignInTitle}</div>
                  <SignInSubtitle className="u-stack--sm">{pleaseSignInSubTitle}</SignInSubtitle>
                </div>
              )
            }
            {!this.state.voter.signed_in_twitter || !this.state.voter.signed_in_facebook ? (
              <>
                <div className="u-stack--md">
                  { !this.state.voter.signed_in_twitter && (isOnWeVoteRootUrl || isOnWeVoteSubDomainUrl) && (
                    <span>
                      <RecommendedText className="u-tl u-stack--sm">Recommended</RecommendedText>
                      <TwitterSignIn buttonText="Sign in with Twitter" />
                    </span>
                  )
                  }
                </div>
                <div className="u-stack--md">
                  { !this.state.voter.signed_in_facebook && isOnWeVoteRootUrl && (
                    <span>
                      <FacebookSignIn toggleSignInModal={this.props.toggleSignInModal} buttonText="Sign in with Facebook" />
                    </span>
                  )
                  }
                </div>
              </>
            ) : null
            }
            {this.state.voter.is_signed_in ? (
              <div className="u-stack--md">
                <div className="u-stack--sm">
                  <span className="h3">Currently Signed In</span>
                  <span className="u-margin-left--sm" />
                  <span className="account-edit-action" onKeyDown={this.twitterLogOutOnKeyDown.bind(this)}>
                    <span className="pull-right" onClick={VoterSessionActions.voterSignOut}>sign out</span>
                  </span>
                </div>
                <div className="u-stack--sm">
                  {this.state.voter.signed_in_twitter ? (
                    <div>
                      <span className="btn btn-social btn-md btn-twitter" href="#">
                        <i className="fab fa-twitter" />
                        @
                        {this.state.voter.twitter_screen_name}
                      </span>
                      <span className="u-margin-left--sm" />
                    </div>
                  ) : null
                  }
                  {this.state.voter.signed_in_twitter && (this.state.voter.signed_in_facebook || this.state.voter.signed_in_with_email) ? (
                    <div className="u-margin-top--xs">
                      {this.state.showTwitterDisconnect ? (
                        <div>
                          <Button
                            className="btn-sm"
                            id="voterSplitIntoTwoAccounts"
                            onClick={this.voterSplitIntoTwoAccounts}
                            type="submit"
                            variant="danger"
                          >
                            Are you sure you want to un-link?
                          </Button>
                          <span
                            className="u-margin-left--sm"
                            id="toggleTwitterDisconnectClose"
                            onClick={this.toggleTwitterDisconnectClose}
                          >
                            cancel
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span
                            id="toggleTwitterDisconnectOpen"
                            onClick={this.toggleTwitterDisconnectOpen}
                          >
                            un-link @
                            {this.state.voter.twitter_screen_name}
                            {' '}
                            twitter account
                          </span>
                        </div>
                      )}
                    </div>
                  ) : null
                  }
                  <div className="u-margin-top--sm">
                    {this.state.voter.signed_in_facebook && (
                    <span>
                      <span className="btn btn-social-icon btn-lg btn-facebook">
                        <span className="fab fa-facebook" />
                      </span>
                      <span className="u-margin-left--sm" />
                    </span>
                    )}
                    {this.state.voter.signed_in_with_email && (
                    <span>
                      <span className="btn btn-social-icon btn-lg btn-openid">
                        <span className="fas fa-envelope" />
                      </span>
                    </span>
                    )}
                  </div>
                </div>
              </div>
            ) : null
            }
            <br />
            {isWebApp() &&
              <VoterEmailAddressEntry />
            }

            {debugMode && (
            <div className="text-center">
              is_signed_in:
              {' '}
              {this.state.voter.is_signed_in ? <span>True</span> : null}
              <br />
              signed_in_facebook:
              {' '}
              {this.state.voter.signed_in_facebook ? <span>True</span> : null}
              <br />
              signed_in_twitter:
              {' '}
              {this.state.voter.signed_in_twitter ? <span>True</span> : null}
              <br />
              we_vote_id:
              {' '}
              {this.state.voter.we_vote_id ? <span>{this.state.voter.we_vote_id}</span> : null}
              <br />
              email:
              {' '}
              {this.state.voter.email ? <span>{this.state.voter.email}</span> : null}
              <br />
              facebook_email:
              {' '}
              {this.state.voter.facebook_email ? <span>{this.state.voter.facebook_email}</span> : null}
              <br />
              facebook_profile_image_url_https:
              {' '}
              {this.state.voter.facebook_profile_image_url_https ? <span>{this.state.voter.facebook_profile_image_url_https}</span> : null}
              <br />
              first_name:
              {' '}
              {this.state.voter.first_name ? <span>{this.state.voter.first_name}</span> : null}
              <br />
              facebook_id:
              {' '}
              {this.state.voter.facebook_id ? <span>{this.state.voter.facebook_id}</span> : null}
              <br />
            </div>
            )}
          </Main>
        </div>
      </div>
    );
  }
}

const Main = styled.div`
  margin-top: ${({ inModal }) => (inModal ? '-16px' : '0')};
  padding: 16px;
  text-align: center;
  padding-top: 0;
`;

const SignInSubtitle = styled.p`
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 24px;
`;

const RecommendedText = styled.p`
  margin: 0;
  color: #333;
  font-weight: bold;
  font-size: 16px;
`;
