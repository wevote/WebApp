import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import daysUntil from '../../common/utils/daysUntil';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';

class ViewUpcomingBallotButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      electionDataExistsForUpcomingElection: 0,
    };
  }

  componentDidMount () {
    this.onBallotStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
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

  onClickFunctionLocal = () => {
    if (this.props.onClickFunction) {
      this.props.onClickFunction();
    }
  }

  goToFindFriends = () => {
    historyPush('/findfriends/importcontacts');
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
