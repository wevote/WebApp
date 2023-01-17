import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Cookies from '../../utils/js-cookie/Cookies';
import { renderLog } from '../../utils/logging';
import stringContains from '../../utils/stringContains';
import AppObservableStore from '../../stores/AppObservableStore';
import VoterStore from '../../../stores/VoterStore';
import voterSignOut from '../../utils/voterSignOut';


class SignInButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({ voterIsSignedIn });
    // this.start = window.performance.now();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    // console.log('SignInButton onVoterStoreChange voter:', VoterStore.getVoter());
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({ voterIsSignedIn });
  }

  openSignInModal = () => {
    // console.log('SignInButton openSignInModal');
    const { origin, pathname } = window.location;
    const signInStartFullUrl = `${origin}${pathname}`;
    // console.log('SettingsAccount getStartedForCampaigns, new origin: ', origin, ', pathname: ', pathname, ', signInStartFullUrl: ', signInStartFullUrl);
    if (origin && stringContains('wevote.us', origin)) {
      Cookies.set('sign_in_start_full_url', signInStartFullUrl, { expires: 1, path: '/', domain: 'wevote.us' });
    } else {
      Cookies.set('sign_in_start_full_url', signInStartFullUrl, { expires: 1, path: '/' });
    }
    AppObservableStore.setShowSignInModal(true);
    AppObservableStore.setBlockCampaignXRedirectOnSignIn(true);
  };

  signOut = () => {
    voterSignOut();
  };

  render () {
    renderLog('SignInButton');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('SignInButton voterLoaded at start of render: ', voterLoaded);
    // const end = window.performance.now();
    // console.log(`Execution time: ${end - this.start} ms, ${voterPhotoUrlMedium}`);
    const { hideSignOut, topNavigationStyles } = this.props;
    const { voterIsSignedIn } = this.state;

    return (
      <Wrapper>
        {voterIsSignedIn ? (
          <>
            {!(hideSignOut) && (
              <SignInText onClick={this.signOut} topNavigationStyles={topNavigationStyles}>Sign&nbsp;out</SignInText>
            )}
          </>
        ) : (
          <SignInText onClick={this.openSignInModal} topNavigationStyles={topNavigationStyles}>Sign&nbsp;in</SignInText>
        )}
      </Wrapper>
    );
  }
}
SignInButton.propTypes = {
  hideSignOut: PropTypes.bool,
  topNavigationStyles: PropTypes.bool,
};

const SignInText = styled('div', {
  shouldForwardProp: (prop) => !['topNavigationStyles'].includes(prop),
})(({ topNavigationStyles }) => (`
  ${topNavigationStyles ? 'color: #6f6f6f; font-size: 14px; :hover { color: #4371cc; };' : ''}
`));

const Wrapper = styled('div')`
  width: 100%;
`;

export default SignInButton;

