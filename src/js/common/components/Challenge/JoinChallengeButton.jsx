import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import BaseButton from '../../../components/Buttons/BaseButton';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';
import VoterStore from '../../../stores/VoterStore';

class JoinChallengeButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      voterFirstName: '',
      voterIsSignedIn: false,
      goToNextStepAfterSignIn: false,
    };
  }

  componentDidMount () {
    // console.log('JoinChallengeButton componentDidMount');
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const { goToNextStepAfterSignIn, voterIsSignedIn: voterIsSignedInPrevious } = this.state;
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      voterFirstName: VoterStore.getFirstName(),
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    }, () => {
      // We started the sign-in process, and seem to have completed it.
      if (voterIsSignedIn && voterIsSignedIn !== voterIsSignedInPrevious) {
        if (goToNextStepAfterSignIn) {
          this.goToJoinChallenge();
        }
      }
    });
  }

  goToJoinChallenge = () => {
    const { challengeBasePath } = this.props;
    const { voterFirstName } = this.state;
    // TODO: Check to see if voter has filled out a voting plan
    const itemsAreMissing = true; // Temporarily assume we have something we need from voter
    if (VoterStore.getVoterIsSignedIn()) {
      let setUpAccountEntryPath = '';
      if (!voterFirstName || itemsAreMissing) {
        setUpAccountEntryPath = `${challengeBasePath}join-challenge`;
      } else {
        setUpAccountEntryPath = `${challengeBasePath}customize-message`;
      }
      const { location: { pathname: currentPathname } } = window;
      AppObservableStore.setSetUpAccountBackLinkPath(currentPathname);
      AppObservableStore.setSetUpAccountEntryPath(setUpAccountEntryPath);
      historyPush(setUpAccountEntryPath);
    } else {
      this.setState({
        goToNextStepAfterSignIn: true,
      });
      AppObservableStore.setShowSignInModal(true);
    }
  }

  render () {
    renderLog('JoinChallengeButton');  // Set LOG_RENDER_EVENTS to log all renders
    const { buttonText } = this.props;
    return (
      <JoinChallengeButtonWrapper>
        <BaseButton
          id="joinChallengeButton"
          onClick={this.goToJoinChallenge}
          primary
          label={buttonText || 'Join Challenge'}
        />
      </JoinChallengeButtonWrapper>
    );
  }
}
JoinChallengeButton.propTypes = {
  buttonText: PropTypes.string,
  challengeBasePath: PropTypes.string,
};

const JoinChallengeButtonWrapper = styled('div')`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export default JoinChallengeButton;
