import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import BaseButton from '../../../components/Buttons/BaseButton';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';
import ChallengeStore from '../../stores/ChallengeStore';
import VoterStore from '../../../stores/VoterStore';
import { getChallengeValuesFromIdentifiers } from '../../utils/challengeUtils';

class JoinChallengeButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      challengeSEOFriendlyPath: '',
      challengeWeVoteId: '',
      goToNextStepAfterSignIn: false,
      voterFirstName: '',
      voterIsSignedIn: false,
      voterSupportsThisChallenge: false,
    };
  }

  componentDidMount () {
    // console.log('JoinChallengeButton componentDidMount');
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onChallengeStoreChange();
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.challengeStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onChallengeStoreChange () {
    const { challengeSEOFriendlyPath: challengeSEOFriendlyPathFromProps, challengeWeVoteId: challengeWeVoteIdFromProps } = this.props;
    console.log('onChallengeStoreChange challengeSEOFriendlyPathFromProps: ', challengeSEOFriendlyPathFromProps, ', challengeWeVoteIdFromProps: ', challengeWeVoteIdFromProps);
    const {
      challengeSEOFriendlyPath,
      challengeWeVoteId,
    } = getChallengeValuesFromIdentifiers(challengeSEOFriendlyPathFromProps, challengeWeVoteIdFromProps);
    // console.log('onChallengeStoreChange AFTER getChallengeValuesFromIdentifiers challengeWeVoteId: ', challengeWeVoteId);
    if (challengeSEOFriendlyPath) {
      this.setState({
        challengeSEOFriendlyPath,
      });
    } else {
      this.setState({
        challengeSEOFriendlyPath: challengeSEOFriendlyPathFromProps,
      });
    }
    let voterSupportsThisChallenge
    if (challengeWeVoteId) {
      // const voterCanEditThisChallenge = ChallengeStore.getVoterCanEditThisChallenge(challengeWeVoteId);
      voterSupportsThisChallenge = ChallengeStore.getVoterSupportsThisChallenge(challengeWeVoteId);
      this.setState({
        challengeWeVoteId,
        // voterCanEditThisChallenge,
        voterSupportsThisChallenge,
      });
    } else {
      voterSupportsThisChallenge = ChallengeStore.getVoterSupportsThisChallenge(challengeWeVoteIdFromProps);
      this.setState({
        challengeWeVoteId: challengeWeVoteIdFromProps,
        voterSupportsThisChallenge,
      });
    }
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

  getChallengeBasePath = () => {
    const { challengeSEOFriendlyPath, challengeWeVoteId } = this.state;
    let challengeBasePath;
    if (challengeSEOFriendlyPath) {
      challengeBasePath = `/${challengeSEOFriendlyPath}/+/`;
    } else {
      challengeBasePath = `/+/${challengeWeVoteId}/`;
    }
    return challengeBasePath;
  }

  goToInviteFriends = () => {
    // DALE 2024-09-13 Soon we will evolve this to have a mode where the Invite friends page is shown in a drawer
    const challengeBasePath = this.getChallengeBasePath();
    const inviteFriendsPath = `${challengeBasePath}invite-friends`;
    const { location: { pathname: currentPathname } } = window;
    AppObservableStore.setSetUpAccountBackLinkPath(currentPathname);
    AppObservableStore.setSetUpAccountEntryPath(inviteFriendsPath);
    historyPush(inviteFriendsPath);
  }

  goToJoinChallenge = () => {
    const challengeBasePath = this.getChallengeBasePath();
    console.log('goToJoinChallenge challengeBasePath: ', challengeBasePath);
    const { voterFirstName } = this.state;
    // TODO: Check to see if voter has filled out a voting plan
    const itemsAreMissing = true; // Temporarily assume we have something we need from voter
    if (VoterStore.getVoterIsSignedIn()) {
      let joinChallengeNextStepPath = '';
      if (!voterFirstName || itemsAreMissing) {
        joinChallengeNextStepPath = `${challengeBasePath}join-challenge`;
      } else {
        joinChallengeNextStepPath = `${challengeBasePath}customize-message`;
      }
      const { location: { pathname: currentPathname } } = window;
      AppObservableStore.setSetUpAccountBackLinkPath(currentPathname);
      AppObservableStore.setSetUpAccountEntryPath(joinChallengeNextStepPath);
      historyPush(joinChallengeNextStepPath);
    } else {
      this.setState({
        goToNextStepAfterSignIn: true,
      });
      AppObservableStore.setShowSignInModal(true);
    }
  }

  render () {
    renderLog('JoinChallengeButton');  // Set LOG_RENDER_EVENTS to log all renders
    const { voterSupportsThisChallenge } = this.state;
    const { challengeSEOFriendlyPath, challengeWeVoteId } = this.state;
    console.log('JoinChallengeButton render challengeSEOFriendlyPath: ', challengeSEOFriendlyPath, ', challengeWeVoteId: ', challengeWeVoteId);
    let buttonText;
    if (voterSupportsThisChallenge) {
      buttonText = 'Invite more friends';
    } else {
      buttonText = 'Join Challenge';
    }
    console.log('JoinChallengeButton render voterSupportsThisChallenge: ', voterSupportsThisChallenge);
    return (
      <JoinChallengeButtonWrapper>
        <BaseButton
          id="joinChallengeButton"
          onClick={voterSupportsThisChallenge ? this.goToInviteFriends : this.goToJoinChallenge}
          primary
          label={buttonText}
        />
      </JoinChallengeButtonWrapper>
    );
  }
}
JoinChallengeButton.propTypes = {
  challengeSEOFriendlyPath: PropTypes.string,
  challengeWeVoteId: PropTypes.string,
};

const JoinChallengeButtonWrapper = styled('div')`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export default JoinChallengeButton;
