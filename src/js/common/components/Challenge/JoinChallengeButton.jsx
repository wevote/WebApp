import withStyles from '@mui/styles/withStyles';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import TagManager from 'react-gtm-module';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';
import ChallengeStore from '../../stores/ChallengeStore';
import ChallengeParticipantActions from '../../actions/ChallengeParticipantActions';
import ReadyStore from '../../../stores/ReadyStore';
import VoterStore from '../../../stores/VoterStore';
import { getChallengeValuesFromIdentifiers } from '../../utils/challengeUtils';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../../utils/lookupPageNameAndPageTypeDict';

class JoinChallengeButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      challengeSEOFriendlyPath: '',
      challengeWeVoteId: '',
      goToNextStepAfterSignIn: false,
      challengeInviteTextDefault: '',
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
      challengeInviteTextDefault,
      challengeSEOFriendlyPath,
      challengeWeVoteId,
    } = getChallengeValuesFromIdentifiers(challengeSEOFriendlyPathFromProps, challengeWeVoteIdFromProps);
    // console.log('onChallengeStoreChange AFTER getChallengeValuesFromIdentifiers challengeWeVoteId: ', challengeWeVoteId);
    this.setState({
      challengeInviteTextDefault,
    });
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
    const { challengeWeVoteId: challengeWeVoteIdFromProps } = this.props;
    const { challengeWeVoteId, goToNextStepAfterSignIn, voterIsSignedIn: voterIsSignedInPrevious } = this.state;
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      voterFirstName: VoterStore.getFirstName(),
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
      voterPhotoUrlLarge: VoterStore.getVoterPhotoUrlLarge(),
    }, () => {
      // We started the sign-in process, and seem to have completed it.
      if (voterIsSignedIn && voterIsSignedIn !== voterIsSignedInPrevious) {
        if (goToNextStepAfterSignIn) {
          const challengeWeVoteIdToUse = challengeWeVoteId || challengeWeVoteIdFromProps;
          let voterIsChallengeParticipant = false;
          if (challengeWeVoteIdToUse) {
            voterIsChallengeParticipant = ChallengeStore.getVoterIsChallengeParticipant(challengeWeVoteIdToUse);
          }
          if (voterIsChallengeParticipant) {
            this.goToInviteFriends();
          } else {
            this.goToJoinChallenge();
          }
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
      challengeBasePath = `/++/${challengeWeVoteId}/`;
    }
    return challengeBasePath;
  }

  goToInviteFriends = () => {
    // DALE 2024-09-13 Soon we will evolve this to have a mode where the Invite friends page is shown in a drawer
    const challengeBasePath = this.getChallengeBasePath();
    const inviteFriendsPath = `${challengeBasePath}invite-friends`;
    const { location: { pathname: currentPathname } } = window;
    const { challengeWeVoteId } = this.state;
    // console.log('goToInviteFriends currentPathname: ', currentPathname);

    // Adding event data to dataLayer for Google Tag Manager to fire the inviteFriendsToChallenge tag
    const destinationPage = lookupPageNameAndPageTypeDict(inviteFriendsPath);
    const dataLayerObject = {
      actionDetails: {
        actionType: 'invite',
        buttonId: 'joinChallengeButton',
      },
      event: 'action',
      userDetails: VoterStore.getAnalyticsUserDetails(),
      challengeDetails: {
        challengeWeVoteId,
      },
      pageDetails: getPageDetails(),
      destinationDetails: {
        destinationPageName: destinationPage.pageName,
        destinationPageType: destinationPage.pageType,
        destinationPathname: inviteFriendsPath,
      },
    };
    TagManager.dataLayer({ dataLayer: dataLayerObject });

    AppObservableStore.setSetUpAccountBackLinkPath(currentPathname);
    AppObservableStore.setSetUpAccountEntryPath(inviteFriendsPath);
    historyPush(inviteFriendsPath);
  }

  goToJoinChallenge = () => {
    const challengeBasePath = this.getChallengeBasePath();
    // console.log('goToJoinChallenge challengeBasePath: ', challengeBasePath);
    const { challengeWeVoteId, challengeInviteTextDefault, voterFirstName, voterPhotoUrlLarge } = this.state;
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
      // console.log('goToJoinChallenge currentPathname: ', currentPathname);
      // Adding event data to dataLayer for Google Tag Manager to fire the inviteFriendsToChallenge tag
      const destinationPage = lookupPageNameAndPageTypeDict(joinChallengeNextStepPath);
      const dataLayerObject = {
        actionDetails: {
          actionType: 'join',
          buttonId: 'joinChallengeButton',
        },
        event: 'action',
        userDetails: VoterStore.getAnalyticsUserDetails(),
        challengeDetails: {
          challengeWeVoteId,
        },
        pageDetails: getPageDetails(),
        destinationDetails: {
          destinationPageName: destinationPage.pageName,
          destinationPageType: destinationPage.pageType,
          destinationPathname: joinChallengeNextStepPath,
        },
      };
      TagManager.dataLayer({ dataLayer: dataLayerObject });

      if (itemsAreMissing) {
        historyPush(joinChallengeNextStepPath);
      } else {
        ChallengeParticipantActions.challengeParticipantSave(challengeWeVoteId, challengeInviteTextDefault, true);
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
    // console.log('JoinChallengeButton render voterIsChallengeParticipant: ', voterIsChallengeParticipant);
    // const { challengeSEOFriendlyPath, challengeWeVoteId } = this.state;
    // console.log('JoinChallengeButton render challengeSEOFriendlyPath: ', challengeSEOFriendlyPath, ', challengeWeVoteId: ', challengeWeVoteId);
    let buttonText;
    if (voterIsChallengeParticipant) {
      if (this.props.inChallengeList) {
        buttonText = 'Invite';
      } else {
        buttonText = 'Invite more friends';
      }
    } else if (this.props.inChallengeList) {
      buttonText = 'Join';
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
  inChallengeList: PropTypes.bool,
};

const styles = () => ({
  buttonDesktop: {
    width: '100%',
    borderRadius: 45,
    minWidth: 110,
    //    background: 'var(--Primary-600, #0858A1)',
    //    border: '1px solid var(--Primary-400, #4187C6)',
    //    color: 'var(--WhiteUI, #FFFFFF)',
    marginRight: 5,
    marginTop: 0,
    fontSize: 14,
  },
});

const JoinChallengeButtonWrapper = styled('div')`
`;

export default withStyles(styles)(JoinChallengeButton);
