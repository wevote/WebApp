import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { CampaignsNotAvailableToShow, ListWrapper, LoadMoreItemsManuallyWrapper } from '../../common/components/Style/CampaignCardStyles';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import PoliticianCardForList from './PoliticianCardForList';
import LoadMoreItemsManually from '../../common/components/Widgets/LoadMoreItemsManually';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));

const STARTING_NUMBER_TO_DISPLAY = 7;
const STARTING_NUMBER_TO_DISPLAY_MOBILE = 5;
const NUMBER_TO_ADD_WHEN_MORE_CLICKED = 10;

class PoliticianCardList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      politicianList: [],
      numberToDisplay: STARTING_NUMBER_TO_DISPLAY,
    };
  }

  componentDidMount () {
    // console.log('PoliticianCardList componentDidMount');
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
    this.onPoliticianListChange();
  }

  componentDidUpdate (prevProps) { // prevProps, prevState, snapshot
    const { timeStampOfChange, shouldLoadMore } = this.props;
    if (timeStampOfChange && timeStampOfChange !== prevProps.timeStampOfChange) {
      this.onPoliticianListChange();
    }
    if (shouldLoadMore && shouldLoadMore !== prevProps.shouldLoadMore) {
      // console.log(shouldLoadMore);
      this.loadMoreHasBeenClicked();
    }
  }

  onPoliticianListChange () {
    const { incomingPoliticianList } = this.props;
    if (incomingPoliticianList) {
      this.setState({
        politicianList: incomingPoliticianList,
      });
    } else {
      this.setState({
        politicianList: [],
      });
    }
  }

  increaseNumberToDisplay = () => {
    let { numberToDisplay } = this.state;
    numberToDisplay += NUMBER_TO_ADD_WHEN_MORE_CLICKED;
    this.setState({
      numberToDisplay,
    });
  };

  loadMoreHasBeenClicked = () => {
    this.increaseNumberToDisplay();
    // console.log('load more has been clicked');
    if (this.props.loadMoreScroll) {
      // console.log('loadMoreScroll exists');
      this.props.loadMoreScroll();
    }
  };

  render () {
    renderLog('PoliticianCardList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('PoliticianCardList render');
    const { useVerticalCard } = this.props;
    const { politicianList, numberToDisplay } = this.state;

    if (!politicianList) {
      return null;
    }
    let numberDisplayed = 0;
    // console.log('PoliticianCardList politicianList', politicianList);
    return (
      <PoliticianCardListWrapper>
        <ListWrapper useVerticalCard={useVerticalCard}>
          {politicianList.map((onePolitician) => {
            if (numberDisplayed >= numberToDisplay) {
              return null;
            }
            numberDisplayed += 1;
            return (
              <div key={`onePoliticianItem-${onePolitician.politician_we_vote_id}`}>
                <PoliticianCardForList
                  politicianWeVoteId={onePolitician.politician_we_vote_id}
                  limitCardWidth={useVerticalCard}
                  searchText={this.props.searchText}
                  useVerticalCard={useVerticalCard}
                />
              </div>
            );
          })}
          <LoadMoreItemsManuallyWrapper>
            {!!(politicianList &&
                politicianList.length > 1 &&
                numberToDisplay < politicianList.length) &&
            (
              <LoadMoreItemsManually
                loadMoreFunction={this.loadMoreHasBeenClicked}
                uniqueExternalId="PoliticianCardList"
              />
            )}
          </LoadMoreItemsManuallyWrapper>
        </ListWrapper>
        {!numberDisplayed && (
          <Suspense fallback={<></>}>
            <DelayedLoad loadingTextLeftAlign showLoadingText waitBeforeShow={2000}>
              <CampaignsNotAvailableToShow>
                No politicians match.
              </CampaignsNotAvailableToShow>
            </DelayedLoad>
          </Suspense>
        )}
      </PoliticianCardListWrapper>
    );
  }
}
PoliticianCardList.propTypes = {
  incomingPoliticianList: PropTypes.array,
  startingNumberToDisplay: PropTypes.number,
  timeStampOfChange: PropTypes.number,
  useVerticalCard: PropTypes.bool,
  loadMoreScroll: PropTypes.func,
  shouldLoadMore: PropTypes.bool,
  searchText: PropTypes.string,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const PoliticianCardListWrapper = styled('div')`
  min-height: 30px;
`;

export default withStyles(styles)(PoliticianCardList);
