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
          <SettingsAccount />
        </DelayedLoad>
      );
    }
    return (
      <Wrapper>
        <Step>Step 1</Step>
        <Description>Click the We Vote Chrome extension icon</Description>
        <ImageWrapper>
          <Image src={cordovaDot('../../../img/global/screens/chrome-extension-452x246.png')} />
        </ImageWrapper>
        <Step>Step 3</Step>
        <Description>
          Go back to
          {' '}
          <i>Sierra Club</i>
          {' '}
          tab
        </Description>
      </Wrapper>
    );
  }
}

const Description = styled.h4`
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  @media (max-width: 576px) {
    text-align: center;
    font-size: 15px;
  }
`;

const Image = styled.img`
  border: 1px solid #999;
  border-radius: 16px;
  box-shadow: 2px 2px 4px 2px ${({ theme }) => theme.colors.grayLight};
  width: 70%;
  height: auto;
  margin-top: 12px;
  margin-bottom: 12px;
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const ImageWrapper = styled.div`
    text-align: center;
`;

const Step = styled.h3`
  color: #A9A9A9;
  font-size: 25px;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 12px;
  @media (max-width: 576px) {
    text-align: center;
    font-size: 15px;
  }
`;

const Wrapper = styled.div`
  background-color: #E9EBEE;
  margin-left: 12px;
  margin-right: 12px;
`;

export default (ExtensionSignIn);
