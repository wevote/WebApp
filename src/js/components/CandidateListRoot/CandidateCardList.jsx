import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { CampaignsNotAvailableToShow, ListWrapper, LoadMoreItemsManuallyWrapper } from '../../common/components/Style/CampaignCardStyles';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import CandidateCardForList from './CandidateCardForList';
import LoadMoreItemsManually from '../../common/components/Widgets/LoadMoreItemsManually';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));

const STARTING_NUMBER_TO_DISPLAY = 7;
const STARTING_NUMBER_TO_DISPLAY_MOBILE = 5;
const NUMBER_TO_ADD_WHEN_MORE_CLICKED = 10;

class CandidateCardList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidateList: [],
      numberToDisplay: STARTING_NUMBER_TO_DISPLAY,
    };
  }

  componentDidMount () {
    // console.log('CandidateCardList componentDidMount');
    const { startingNumberToDisplay } = this.props;
    if (startingNumberToDisplay && startingNumberToDisplay > 0) {
      this.setState({
        numberToDisplay: startingNumberToDisplay,
      });
    } else if (isMobileScreenSize()) {
      // We deviate from pure responsive in order to request fewer images on initial load
      this.setState({
        numberToDisplay: STARTING_NUMBER_TO_DISPLAY_MOBILE,
      });
    }
    this.onCandidateListChange();
  }

  componentDidUpdate (prevProps) { // prevProps, prevState, snapshot
    const { timeStampOfChange } = this.props;
    if (timeStampOfChange && timeStampOfChange !== prevProps.timeStampOfChange) {
      this.onCandidateListChange();
    }
  }

  onCandidateListChange () {
    const { incomingCandidateList } = this.props;
    if (incomingCandidateList) {
      this.setState({
        candidateList: incomingCandidateList,
      });
    } else {
      this.setState({
        candidateList: [],
      });
    }
  }

  increaseNumberToDisplay = () => {
    let { numberToDisplay } = this.state;
    numberToDisplay += NUMBER_TO_ADD_WHEN_MORE_CLICKED;
    this.setState({
      numberToDisplay,
    });
  }

  render () {
    renderLog('CandidateCardList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('CandidateCardList render');
    const { verticalListOn } = this.props;
    const { candidateList, numberToDisplay } = this.state;

    if (!candidateList) {
      return null;
    }
    let numberDisplayed = 0;
    return (
      <CandidateCardListWrapper>
        <ListWrapper verticalListOn={verticalListOn}>
          {candidateList.map((oneCandidate) => {
            if (numberDisplayed >= numberToDisplay) {
              return null;
            }
            numberDisplayed += 1;
            return (
              <div key={`oneCandidateItem-${oneCandidate.we_vote_id}`}>
                <CandidateCardForList
                  candidateWeVoteId={oneCandidate.we_vote_id}
                  limitCardWidth={verticalListOn}
                />
              </div>
            );
          })}
          <LoadMoreItemsManuallyWrapper>
            {!!(candidateList &&
                candidateList.length > 1 &&
                numberToDisplay < candidateList.length) &&
            (
              <LoadMoreItemsManually
                loadMoreFunction={this.increaseNumberToDisplay}
                uniqueExternalId="CandidateCardList"
              />
            )}
          </LoadMoreItemsManuallyWrapper>
        </ListWrapper>
        {!numberDisplayed && (
          <Suspense fallback={<></>}>
            <DelayedLoad loadingTextLeftAlign showLoadingText waitBeforeShow={2000}>
              <CampaignsNotAvailableToShow>
                No candidates match.
              </CampaignsNotAvailableToShow>
            </DelayedLoad>
          </Suspense>
        )}
      </CandidateCardListWrapper>
    );
  }
}
CandidateCardList.propTypes = {
  incomingCandidateList: PropTypes.array,
  startingNumberToDisplay: PropTypes.number,
  timeStampOfChange: PropTypes.number,
  verticalListOn: PropTypes.bool,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const CandidateCardListWrapper = styled('div')`
  min-height: 30px;
`;

export default withStyles(styles)(CandidateCardList);
