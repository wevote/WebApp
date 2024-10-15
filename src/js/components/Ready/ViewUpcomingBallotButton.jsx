import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import AppObservableStore from '../../common/stores/AppObservableStore';
import apiCalming from '../../common/utils/apiCalming';
import daysUntil from '../../common/utils/daysUntil';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';
import VoterStore from '../../stores/VoterStore';
import BaseButton from '../Buttons/BaseButton';

class ViewUpcomingBallotButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      electionDataExistsForUpcomingElection: 0,
    };
  }

  componentDidMount () {
    // console.log('ViewUpcomingBallotButton componentDidMount');
    this.onBallotStoreChange();
    this.onVoterStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.voterContactListRetrieveTimer = setTimeout(() => {
      if (apiCalming('voterContactListRetrieve', 3000)) {
        VoterActions.voterContactListRetrieve();
      }
    }, 3000);
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.voterStoreListener.remove();
    clearTimeout(this.voterContactListRetrieveTimer);
  }

  onBallotStoreChange () {
    const nextElectionDayText = BallotStore.currentBallotElectionDate;
    // console.log('nextElectionDayText:', nextElectionDayText);
    if (nextElectionDayText) {
      const daysUntilNextElection = daysUntil(nextElectionDayText);
      if (daysUntilNextElection >= 0) {
        this.setState({
          electionDataExistsForUpcomingElection: true,
        });
      } else {
        // Election was yesterday or earlier
        this.setState({
          electionDataExistsForUpcomingElection: false,
        });
      }
    }
  }

  onVoterStoreChange () {
    this.setState({
      voterContactEmailListCount: VoterStore.getVoterContactEmailListCount(),
      voterFirstName: VoterStore.getFirstName(),
      voterPhotoUrlLarge: VoterStore.getVoterPhotoUrlLarge(),
    });
  }

  onClickFunctionLocal = () => {
    if (this.props.onClickFunction) {
      this.props.onClickFunction();
    }
  }

  goToFindFriends = () => {
    const { voterContactEmailListCount, voterFirstName, voterPhotoUrlLarge } = this.state;
    let setUpAccountEntryPath = '';
    if (voterContactEmailListCount > 0) {
      if (!VoterStore.getVoterIsSignedIn()) {
        setUpAccountEntryPath = '/findfriends/signin';
      } else if (!voterFirstName) {
        setUpAccountEntryPath = '/findfriends/editname';
      } else if (!voterPhotoUrlLarge) {
        setUpAccountEntryPath = '/findfriends/addphoto';
      } else {
        setUpAccountEntryPath = '/findfriends/invitecontacts';
      }
    } else {
      setUpAccountEntryPath = '/findfriends/importcontacts';
    }
    const { location: { pathname: currentPathname } } = window;
    AppObservableStore.setSetUpAccountBackLinkPath(currentPathname);
    AppObservableStore.setSetUpAccountEntryPath(setUpAccountEntryPath);
    historyPush(setUpAccountEntryPath);
  }

  render () {
    renderLog('ViewUpcomingBallotButton');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      buttonText, onlyOfferViewYourBallot,
    } = this.props;
    const {
      electionDataExistsForUpcomingElection,
    } = this.state;
    return (
      <ViewUpcomingBallotButtonWrapper>
        <BaseButton
          id={(electionDataExistsForUpcomingElection || onlyOfferViewYourBallot) ? 'viewUpcomingBallotButton' : 'viewUpcomingBallotFindYourFriends'}
          onClick={(electionDataExistsForUpcomingElection || onlyOfferViewYourBallot) ? this.onClickFunctionLocal : this.goToFindFriends}
          primary
          label={(electionDataExistsForUpcomingElection || onlyOfferViewYourBallot) ? buttonText || 'View Your Ballot' : 'Find Your Friends'}
        />
      </ViewUpcomingBallotButtonWrapper>
    );
  }
}
ViewUpcomingBallotButton.propTypes = {
  buttonText: PropTypes.string,
  onClickFunction: PropTypes.func,
  onlyOfferViewYourBallot: PropTypes.bool,
};

const ViewUpcomingBallotButtonWrapper = styled('div')`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export default ViewUpcomingBallotButton;
