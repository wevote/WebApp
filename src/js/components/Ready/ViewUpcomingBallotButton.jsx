import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import daysUntil from '../../common/utils/daysUntil';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';
import VoterStore from '../../stores/VoterStore';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';

class ViewUpcomingBallotButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      electionDataExistsForUpcomingElection: 0,
    };
  }

  componentDidMount () {
    this.onBallotStoreChange();
    this.onVoterStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (apiCalming('voterContactListRetrieve', 3000)) {
      VoterActions.voterContactListRetrieve();
    }
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.voterStoreListener.remove();
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
    if (voterContactEmailListCount > 0) {
      if (!VoterStore.getVoterIsSignedIn()) {
        historyPush('/findfriends/signin');
      } else if (!voterFirstName) {
        historyPush('/findfriends/editname');
      } else if (!voterPhotoUrlLarge) {
        historyPush('/findfriends/addphoto');
      } else {
        historyPush('/findfriends/invitecontacts');
      }
    } else {
      historyPush('/findfriends/importcontacts');
    }
  }

  render () {
    renderLog('ViewUpcomingBallotButton');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      electionDataExistsForUpcomingElection,
    } = this.state;
    return (
      <ViewUpcomingBallotButtonWrapper>
        <Button
          color="primary"
          onClick={electionDataExistsForUpcomingElection ? this.onClickFunctionLocal : this.goToFindFriends}
          style={{
            boxShadow: 'none !important',
            textTransform: 'none',
            width: 250,
          }}
          variant="contained"
        >
          {electionDataExistsForUpcomingElection ? (
            <>View your ballot</>
          ) : (
            <>Find your friends</>
          )}
        </Button>
      </ViewUpcomingBallotButtonWrapper>
    );
  }
}
ViewUpcomingBallotButton.propTypes = {
  onClickFunction: PropTypes.func,
};

const ViewUpcomingBallotButtonWrapper = styled('div')`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export default ViewUpcomingBallotButton;
