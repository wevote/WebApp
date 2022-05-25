import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import daysUntil from '../../common/utils/daysUntil';
import getBooleanValue from '../../common/utils/getBooleanValue';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';
import AppObservableStore from '../../stores/AppObservableStore';

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
    if (this.addressSuggestiontimer) clearTimeout(this.addressSuggestiontimer);
    clearInterval(this.timeInterval);
    if (this.loadDelay) clearTimeout(this.loadDelay);
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

  // eslint-disable-next-line no-unused-vars
  toggleSelectBallotModal (showSelectBallotModal, hideAddressEditIgnored = false, hideElectionsIgnored = false) {
    const hideAddressEdit = false;
    const hideElections = false;
    AppObservableStore.setShowSelectBallotModal(!showSelectBallotModal, getBooleanValue(hideAddressEdit), getBooleanValue(hideElections));
  }

  render () {
    renderLog('ViewUpcomingBallotButton');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      electionDataExistsForUpcomingElection,
    } = this.state;
    return (
      <ViewUpcomingBallotButtonWrapper>
        {!!(electionDataExistsForUpcomingElection) && (
          <Button
            color="primary"
            onClick={this.onClickFunctionLocal}
            style={{
              boxShadow: 'none !important',
              textTransform: 'none',
              width: 250,
            }}
            variant="contained"
          >
            View your ballot
          </Button>
        )}
      </ViewUpcomingBallotButtonWrapper>
    );
  }
}
ViewUpcomingBallotButton.propTypes = {
  onClickFunction: PropTypes.func,
};

const ViewUpcomingBallotButtonWrapper = styled('div')(({ theme }) => (`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`));

export default ViewUpcomingBallotButton;
