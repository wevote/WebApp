import React, { Component } from 'react';
import styled from 'styled-components';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import LoadingWheel from '../../components/LoadingWheel';
import SettingsAccount from '../../components/Settings/SettingsAccount';
import VoterStore from '../../stores/VoterStore';
import DelayedLoad from '../../components/Widgets/DelayedLoad';


class ExtensionSignIn extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voter: {},
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    // console.log('SettingsDomain componentDidMount');
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
    // console.log('onVoterStoreChange organization: ', organization);
    this.setState({
      voter,
      voterIsSignedIn,
    });
  }

  render () {
    renderLog('extensionSignIn');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      voter, voterIsSignedIn,
    } = this.state;
    if (!voter) {
      return LoadingWheel;
    }
    if (!voterIsSignedIn) {
      // console.log('voterIsSignedIn is false');
      return (
        <DelayedLoad showLoadingText waitBeforeShow={2000}>
          <SignInOuterWrapper>
            <SignInInnerWrapper>
              <SettingsAccount />
            </SignInInnerWrapper>
          </SignInOuterWrapper>
        </DelayedLoad>
      );
    }
    return (
      <Wrapper>
        <Success>
          You are now signed in!
        </Success>
        <Step>Step 1</Step>
        <Description>Click the We Vote logo above (the Chrome Extension Icon), in browser navigation bar.</Description>
        <ImageWrapper>
          <IconImage src={cordovaDot('/img/global/screens/chrome-extension-icon-198x25.png')} />
        </ImageWrapper>
        <Step>Step 2</Step>
        <ImageWrapper>
          <ScreenImage src={cordovaDot('/img/global/screens/chrome-extension-sign-in-452x246.png')} />
        </ImageWrapper>
        <Step>Step 3</Step>
        <Description>
          Go back to original tab in your browser where you clicked &quot;Sign In&quot;, and refresh the browser.
        </Description>
      </Wrapper>
    );
  }
}

const Description = styled.h4`
  font-size: 22px;
  text-align: center;
  @media (max-width: 576px) {
    font-size: 15px;
  }
`;

const IconImage = styled.img`
  height: auto;
  margin-top: 8px;
  margin-bottom: 12px;
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const ImageWrapper = styled.div`
    text-align: center;
`;

const ScreenImage = styled.img`
  border: 1px solid #999;
  border-radius: 16px;
  box-shadow: 2px 2px 4px 2px ${({ theme }) => theme.colors.grayLight};
  width: 70%;
  height: auto;
  margin-top: 8px;
  margin-bottom: 12px;
  @media (max-width: 576px) {
    width: 100%;
  }
`;

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

const Step = styled.h3`
  color: #A9A9A9;
  font-size: 25px;
  font-weight: bold;
  margin-top: 12px;
  margin-bottom: 8px;
  text-align: center;
  @media (max-width: 576px) {
    font-size: 15px;
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
  margin-bottom: 32px;
  margin-left: 12px;
  margin-right: 12px;
`;

export default (ExtensionSignIn);
