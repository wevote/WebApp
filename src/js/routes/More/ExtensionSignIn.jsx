import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { renderLog } from '../../utils/logging';
import LoadingWheel from '../../components/LoadingWheel';
import SettingsAccount from '../../components/Settings/SettingsAccount';
import VoterStore from '../../stores/VoterStore';
import DelayedLoad from '../../components/Widgets/DelayedLoad';


class ExtensionSignIn extends Component {
  static propTypes = {
    location: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: {},
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    const { title } = this.props.location.query;  // https://localhost:3000/more/extensionsignin?title=2020%20Endorsements%20%7C%20Sierra%20Club&
    console.log(`SettingsDomain ExtensionSignIn title: ${title}`);
    this.onVoterStoreChange();
    // this.onOrganizationStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      voter,
      voterIsSignedIn,
    });
  }

  render () {
    renderLog('extensionSignIn');  // Set LOG_RENDER_EVENTS to log all renders
    /* eslint-disable react/jsx-one-expression-per-line */
    /* eslint-disable react/jsx-max-props-per-line */
    const {
      voter, voterIsSignedIn,
    } = this.state;
    if (!voter) {
      return LoadingWheel;
    }
    // let title = localStorage.extensionTitle;
    // Unfortunately even local storage doesn't survive the Twitter redirects, we come back in the new instance, and the request handleOpenURL(
    //   comes back without the search terms.

    if (!voterIsSignedIn) {
      // console.log('voterIsSignedIn is false');
      return (
        <DelayedLoad showLoadingText waitBeforeShow={2000}>
          <SignInOuterWrapper>
            <SignInInnerWrapper>
              <SignInIntro>
                Please sign in here:
              </SignInIntro>
              <SettingsAccount />
            </SignInInnerWrapper>
          </SignInOuterWrapper>
        </DelayedLoad>
      );
    } else {
      return (
        <Wrapper>
          <div className="card" style={{ marginTop: '15%' }}>
            <Success>
              You are now signed in!
              <br />
              <br />
              {/* This button is a placeholder, feel free to improve */}
              <Button onClick={() => window.close()} color="primary" autoFocus style={{
                transition: 'none',
                color: '#fff',
                backgroundColor: '#1976d2',
                boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                transitionTimingFunction: 'none !important',
              }}
              >
                Return to the chrome extension
              </Button>
              <br />
              <br />
            </Success>
          </div>
        </Wrapper>
      );
    }
  }
}

const SignInOuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SignInInnerWrapper = styled.div`
  padding: 24px;
  width: 50%;
  @media (max-width: 640px) {
    width: 100%;
  }
`;

const SignInIntro = styled.div`
  color: #2e3c5d;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
  @media (max-width: 576px) {
    font-size: 20px;
  }
`;

const Success = styled.div`
  color: #2e3c5d;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 12px;
  padding-top: 24px;
  text-align: center;
  @media (max-width: 576px) {
    font-size: 20px;
  }
`;

const Wrapper = styled.div`
  background-color: #E9EBEE;
  margin-bottom: 64px;
  margin-left: 12px;
  margin-right: 12px;
`;

export default (ExtensionSignIn);
