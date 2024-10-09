import withStyles from '@mui/styles/withStyles';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';
import ChallengeStore from '../../stores/ChallengeStore';
import ChallengeParticipantActions from '../../actions/ChallengeParticipantActions';
import ReadyStore from '../../../stores/ReadyStore';
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
      voterPhotoUrlLarge: '',
      voterIsChallengeParticipant: false,
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
    // console.log('onChallengeStoreChange challengeSEOFriendlyPathFromProps: ', challengeSEOFriendlyPathFromProps, ', challengeWeVoteIdFromProps: ', challengeWeVoteIdFromProps);
    const {
      challengeSEOFriendlyPath,
      challengeWeVoteId,
    } = getChallengeValuesFromIdentifiers(challengeSEOFriendlyPathFromProps, challengeWeVoteIdFromProps);
    // console.log('onChallengeStoreChange AFTER getChallengeValuesFromIdentifiers challengeWeVoteId: ', challengeWeVoteId);
    if (challengeSEOFriendlyPath) {
      this.setState({
        challengeSEOFriendlyPath,
      });
    } else if (challengeSEOFriendlyPathFromProps) {
      this.setState({
        challengeSEOFriendlyPath: challengeSEOFriendlyPathFromProps,
      });
    }
    let voterIsChallengeParticipant;
    if (challengeWeVoteId) {
      // const voterCanEditThisChallenge = ChallengeStore.getVoterCanEditThisChallenge(challengeWeVoteId);
      voterIsChallengeParticipant = ChallengeStore.getVoterIsChallengeParticipant(challengeWeVoteId);
      this.setState({
        challengeWeVoteId,
        // voterCanEditThisChallenge,
        voterIsChallengeParticipant,
      });
    } else if (challengeWeVoteIdFromProps) {
      voterIsChallengeParticipant = ChallengeStore.getVoterIsChallengeParticipant(challengeWeVoteIdFromProps);
      this.setState({
        challengeWeVoteId: challengeWeVoteIdFromProps,
        voterIsChallengeParticipant,
      });
    }
  }

  onVoterStoreChange () {
    const { goToNextStepAfterSignIn, voterIsSignedIn: voterIsSignedInPrevious } = this.state;
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      voterFirstName: VoterStore.getFirstName(),
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
      voterPhotoUrlLarge: VoterStore.getVoterPhotoUrlLarge(),
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
    // console.log('goToJoinChallenge challengeBasePath: ', challengeBasePath);
    const { challengeWeVoteId, voterFirstName, voterPhotoUrlLarge } = this.state;
    const upcomingGoogleCivicElectionId = VoterStore.electionId();
    const voterPlanCreatedForThisElection = ReadyStore.getVoterPlanTextForVoterByElectionId(upcomingGoogleCivicElectionId);
    // console.log('upcomingGoogleCivicElectionId: ', upcomingGoogleCivicElectionId, 'voterPlanCreatedForThisElection: ', voterPlanCreatedForThisElection);
    const itemsAreMissing = !(voterFirstName) || !(voterPhotoUrlLarge) || (upcomingGoogleCivicElectionId && !(voterPlanCreatedForThisElection));
    if (VoterStore.getVoterIsSignedIn()) {
      let joinChallengeNextStepPath = '';
      if (itemsAreMissing) {
        joinChallengeNextStepPath = `${challengeBasePath}join-challenge`;
      } else {
        joinChallengeNextStepPath = `${challengeBasePath}customize-message`;
      }
      const { location: { pathname: currentPathname } } = window;
      AppObservableStore.setSetUpAccountBackLinkPath(currentPathname);
      AppObservableStore.setSetUpAccountEntryPath(joinChallengeNextStepPath);
      if (itemsAreMissing) {
        historyPush(joinChallengeNextStepPath);
      } else {
        ChallengeParticipantActions.challengeParticipantSave(challengeWeVoteId);
        AppObservableStore.setShowChallengeThanksForJoining(true);
        // Delay the redirect, so we have time to fire the above API call first
        this.timer = setTimeout(() => {
          historyPush(joinChallengeNextStepPath);
        }, 500);
      }
    } else {
      this.setState({
        goToNextStepAfterSignIn: true,
      });
      AppObservableStore.setShowSignInModal(true);
    }
  }

  render () {
    renderLog('JoinChallengeButton');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { voterIsChallengeParticipant } = this.state;
    // const { challengeSEOFriendlyPath, challengeWeVoteId } = this.state;
    // console.log('JoinChallengeButton render challengeSEOFriendlyPath: ', challengeSEOFriendlyPath, ', challengeWeVoteId: ', challengeWeVoteId);
    let buttonText;
    if (voterIsChallengeParticipant) {
      buttonText = 'Invite more friends';
    } else {
      buttonText = 'Join Challenge';
    }
    // console.log('JoinChallengeButton render voterIsChallengeParticipant: ', voterIsChallengeParticipant);
    // const upcomingGoogleCivicElectionId = VoterStore.electionId();
    // const voterPlanCreatedForThisElection = ReadyStore.getVoterPlanTextForVoterByElectionId(upcomingGoogleCivicElectionId);
    // console.log('upcomingGoogleCivicElectionId: ', upcomingGoogleCivicElectionId, 'voterPlanCreatedForThisElection: ', voterPlanCreatedForThisElection);
    return (
      <JoinChallengeButtonWrapper>
        <Button
          classes={{ root: classes.buttonDesktop }}
          id="joinChallengeButton"
          onClick={voterIsChallengeParticipant ? this.goToInviteFriends : this.goToJoinChallenge}
          color="primary"
          variant="contained"
        >
          {buttonText}
        </Button>
      </JoinChallengeButtonWrapper>
    );
  }
}
JoinChallengeButton.propTypes = {
  classes: PropTypes.object,
  challengeSEOFriendlyPath: PropTypes.string,
  challengeWeVoteId: PropTypes.string,
};


const styles = () => ({
  buttonDesktop: {
    borderRadius: 45,
    // fontSize: '18px',
    minWidth: '300px',
    width: '100%',
  },
});

const JoinChallengeButtonWrapper = styled('div')`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export default withStyles(styles)(JoinChallengeButton);
