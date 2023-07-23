import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import CandidateStore from '../../../stores/CandidateStore';
import {
  limitToShowSupport,
  orderPositionByUltimateDate,
  orderByTwitterFollowers,
  orderByWrittenComment,
  limitToOnePositionPerSpeaker,
} from '../../utils/orderByPositionFunctions';
import LoadMoreItemsManually from '../Widgets/LoadMoreItemsManually';
import PoliticianEndorsementForList from './PoliticianEndorsementForList';

const STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY = 2;
const NUMBER_OF_POSITIONS_TO_ADD_WHEN_MORE_CLICKED = 10;

class PoliticianEndorsementsList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filteredPositionList: [],
      numberOfPositionsToDisplay: STARTING_NUMBER_OF_POSITIONS_TO_DISPLAY,
    };
  }

  componentDidMount () {
    this.onCandidateStoreChange();
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    const { startingNumberOfPositionsToDisplay } = this.props;
    // console.log('PoliticianEndorsementsList componentDidMount politicianWeVoteId:', politicianWeVoteId);
    if (startingNumberOfPositionsToDisplay && startingNumberOfPositionsToDisplay > 0) {
      this.setState({
        numberOfPositionsToDisplay: startingNumberOfPositionsToDisplay,
      });
    }
  }

  componentDidUpdate (prevProps) {
    // console.log('MostRecentCampaignSupport componentDidUpdate');
    const {
      politicianWeVoteId: previousPoliticianWeVoteId,
    } = prevProps;
    const {
      politicianWeVoteId,
    } = this.props;
    // console.log('componentDidUpdate politicianWeVoteId:', politicianWeVoteId, ', previousPoliticianWeVoteId:', previousPoliticianWeVoteId);
    if (previousPoliticianWeVoteId !== politicianWeVoteId) {
      this.clearPoliticianValues();
      this.timer = setTimeout(() => {
        this.onCandidateStoreChange();
      }, 500);
    }
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onCandidateStoreChange () {
    const { politicianWeVoteId } = this.props;
    if (politicianWeVoteId) {
      const allCachedPositionsForThisPolitician = CandidateStore.getAllCachedPositionsByPoliticianWeVoteId(politicianWeVoteId);
      let filteredPositionList = limitToShowSupport(allCachedPositionsForThisPolitician);
      // let filteredPositionList = allCachedPositionsForThisPolitician;
      filteredPositionList = filteredPositionList.sort(orderPositionByUltimateDate);
      filteredPositionList = filteredPositionList.sort(orderByTwitterFollowers);
      filteredPositionList = filteredPositionList.sort(orderByWrittenComment);
      filteredPositionList = limitToOnePositionPerSpeaker(filteredPositionList);
      this.setState({
        filteredPositionList,
      });
    }
  }

  clearPoliticianValues = () => {
    // When we transition from one politician to another politician, there
    // can be a delay in getting the new politician's values. We want to clear
    // out the values currently being displayed, while waiting for new values
    // to arrive.
    this.setState({
      filteredPositionList: [],
      numberOfPositionsToDisplay: 0,
    });
  }

  increaseNumberOfEndorsementsToDisplay = () => {
    let { numberOfPositionsToDisplay } = this.state;
    numberOfPositionsToDisplay += NUMBER_OF_POSITIONS_TO_ADD_WHEN_MORE_CLICKED;
    this.setState({
      numberOfPositionsToDisplay,
    });
  }

  // When we have "likes" put endorsements with most likes at top

  render () {
    renderLog('PoliticianEndorsementsList');  // Set LOG_RENDER_EVENTS to log all renders
    const { politicianWeVoteId, hideEncouragementToEndorse } = this.props;
    const { filteredPositionList, numberOfPositionsToDisplay } = this.state;
    // console.log('PoliticianEndorsementsList render numberOfPositionsToDisplay:', numberOfPositionsToDisplay);

    if (!filteredPositionList || filteredPositionList.length === 0) {
      return (
        <Wrapper>
          {!hideEncouragementToEndorse && (
            <NoPositionsFound>
              Be the first to add an endorsement!
            </NoPositionsFound>
          )}
        </Wrapper>
      );
    }
    let numberOfCampaignsDisplayed = 0;
    return (
      <Wrapper>
        <div>
          {filteredPositionList.map((position) => {
            // console.log('position:', position);
            if (numberOfCampaignsDisplayed >= numberOfPositionsToDisplay) {
              return null;
            }
            numberOfCampaignsDisplayed += 1;
            return (
              <div key={`politicianEndorsementItem-${politicianWeVoteId}-${position.position_we_vote_id}`}>
                <PoliticianEndorsementForList
                  politicianWeVoteId={politicianWeVoteId}
                  position={position}
                />
              </div>
            );
          })}
        </div>
        <LoadMoreItemsManuallyWrapper>
          {!!(filteredPositionList &&
              filteredPositionList.length > 1 &&
              numberOfPositionsToDisplay < filteredPositionList.length) &&
          (
            <LoadMoreItemsManually
              loadMoreFunction={this.increaseNumberOfEndorsementsToDisplay}
              uniqueExternalId="PoliticianEndorsementsList"
            />
          )}
        </LoadMoreItemsManuallyWrapper>
      </Wrapper>
    );
  }
}
PoliticianEndorsementsList.propTypes = {
  hideEncouragementToEndorse: PropTypes.bool,
  politicianWeVoteId: PropTypes.string,
  startingNumberOfPositionsToDisplay: PropTypes.number,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const LoadMoreItemsManuallyWrapper = styled('div')`
  margin-bottom: 0;
  @media print{
    display: none;
  }
`;

const NoPositionsFound = styled('div')`
  border-top: 1px solid #ddd;
  margin-top: 25px;
  padding-top: 25px;
`;

const Wrapper = styled('div')`
`;

export default withStyles(styles)(PoliticianEndorsementsList);
