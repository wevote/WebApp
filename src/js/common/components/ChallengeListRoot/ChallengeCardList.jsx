import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { CampaignsNotAvailableToShow, ListWrapper, LoadMoreItemsManuallyWrapper, StartACampaignWrapper } from '../Style/CampaignCardStyles';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import ChallengeCardForList from './ChallengeCardForList';
import LoadMoreItemsManually from '../Widgets/LoadMoreItemsManually';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../Widgets/DelayedLoad'));

const STARTING_NUMBER_TO_DISPLAY = 7;
const STARTING_NUMBER_TO_DISPLAY_MOBILE = 5;
const NUMBER_TO_ADD_WHEN_MORE_CLICKED = 10;

class ChallengeCardList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      challengeList: [],
      numberToDisplay: STARTING_NUMBER_TO_DISPLAY,
      showAllEndorsements: false,
      showThisYear: false,
      showUpcomingEndorsements: false,
    };
  }

  componentDidMount () {
    // console.log('ChallengeCardList componentDidMount');
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
    this.onChallengeListChange();
    this.onFilterChange();
  }

  componentDidUpdate (prevProps) { // prevProps, prevState, snapshot
    const { listModeFiltersTimeStampOfChange, timeStampOfChange, shouldLoadMore } = this.props;
    if (listModeFiltersTimeStampOfChange && listModeFiltersTimeStampOfChange !== prevProps.listModeFiltersTimeStampOfChange) {
      this.onFilterChange();
    }
    if (timeStampOfChange && timeStampOfChange !== prevProps.timeStampOfChange) {
      this.onChallengeListChange();
    }
    if (shouldLoadMore && shouldLoadMore !== prevProps.shouldLoadMore) {
      // console.log(shouldLoadMore);
      this.loadMoreHasBeenClicked();
    }
  }

  onChallengeListChange () {
    const { incomingChallengeList } = this.props;
    if (incomingChallengeList) {
      this.setState({
        challengeList: incomingChallengeList,
      });
    } else {
      this.setState({
        challengeList: [],
      });
    }
  }

  onFilterChange = () => {
    // console.log('onFilterOrListChange');
    const { listModeFilters } = this.props;
    const today = new Date();
    const thisYearInteger = today.getFullYear();
    let showAllEndorsements = false;
    let showThisYear = false;
    let showUpcomingEndorsements = false;
    if (listModeFilters && listModeFilters.length > 0) {
      listModeFilters.forEach((oneFilter) => {
        // console.log('oneFilter:', oneFilter);
        if ((oneFilter.filterType === 'showAllEndorsements') && (oneFilter.filterSelected === true)) {
          showAllEndorsements = true;
        }
        if ((oneFilter.filterYear === thisYearInteger) && (oneFilter.filterSelected === true)) {
          showThisYear = true;
        }
        if ((oneFilter.filterType === 'showUpcomingEndorsements') && (oneFilter.filterSelected === true)) {
          showUpcomingEndorsements = true;
        }
      });
    }
    this.setState({
      showAllEndorsements,
      showThisYear,
      showUpcomingEndorsements,
    });
  }

  increaseNumberToDisplay = () => {
    let { numberToDisplay } = this.state;
    numberToDisplay += NUMBER_TO_ADD_WHEN_MORE_CLICKED;
    this.setState({
      numberToDisplay,
    });
  }

  loadMoreHasBeenClicked = () => {
    this.increaseNumberToDisplay();
    // console.log('load more has been clicked');
    if (this.props.loadMoreScroll) {
      // console.log('loadMoreScroll exists');
      this.props.loadMoreScroll();
    }
  }

  render () {
    renderLog('ChallengeCardList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('ChallengeCardList render');
    const { searchText, useVerticalCard } = this.props;
    const { challengeList, numberToDisplay, showAllEndorsements, showThisYear, showUpcomingEndorsements } = this.state;

    if (!challengeList) {
      return null;
    }
    let numberDisplayed = 0;
    return (
      <Wrapper>
        <ListWrapper useVerticalCard={useVerticalCard}>
          {challengeList.map((oneChallenge) => {
            if (numberDisplayed >= numberToDisplay) {
              return null;
            }
            numberDisplayed += 1;
            return (
              <div key={`oneChallengeItem-${oneChallenge.challenge_we_vote_id}`}>
                <ChallengeCardForList
                  challengeWeVoteId={oneChallenge.challenge_we_vote_id}
                  limitCardWidth={useVerticalCard}
                  useVerticalCard={useVerticalCard}
                />
              </div>
            );
          })}
          {!!(numberDisplayed && (searchText || showAllEndorsements || showThisYear || showUpcomingEndorsements)) && (
            <StartACampaignWrapper>
              <Link className="u-link-color" to="/start-a-challenge">
                Start a challenge
                {(searchText && searchText.length > 0) && (
                  <>
                    {' '}
                    related to
                    {' '}
                    &quot;
                    {searchText}
                    &quot;
                  </>
                )}
              </Link>
            </StartACampaignWrapper>
          )}
          {!!(challengeList &&
              challengeList.length > 1 &&
              numberToDisplay < challengeList.length) &&
          (
            <LoadMoreItemsManuallyWrapper>
              <LoadMoreItemsManually
                loadMoreFunction={this.loadMoreHasBeenClicked}
                uniqueExternalId="ChallengeCardList"
              />
            </LoadMoreItemsManuallyWrapper>
          )}
        </ListWrapper>
        <Suspense fallback={<></>}>
          <DelayedLoad loadingTextLeftAlign showLoadingText waitBeforeShow={2000}>
            <div>
              {!(numberDisplayed) && (
                <CampaignsNotAvailableToShow>
                  No challenges match.
                  {!!(searchText || showAllEndorsements || showThisYear || showUpcomingEndorsements) && (
                    <>
                      {' '}
                      <Link className="u-link-color" to="/start-a-challenge">
                        Start a challenge
                        {(searchText && searchText.length > 0) && (
                          <>
                            {' '}
                            related to
                            {' '}
                            &quot;
                            {searchText}
                            &quot;
                          </>
                        )}
                      </Link>
                      .
                    </>
                  )}
                </CampaignsNotAvailableToShow>
              )}
            </div>
          </DelayedLoad>
        </Suspense>
      </Wrapper>
    );
  }
}

ChallengeCardList.propTypes = {
  incomingChallengeList: PropTypes.array,
  listModeFilters: PropTypes.array,
  listModeFiltersTimeStampOfChange: PropTypes.number,
  searchText: PropTypes.string,
  startingNumberToDisplay: PropTypes.number,
  timeStampOfChange: PropTypes.number,
  useVerticalCard: PropTypes.bool,
  loadMoreScroll: PropTypes.func,
  shouldLoadMore: PropTypes.bool,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const Wrapper = styled('div')`
  min-height: 30px;
`;

export default withStyles(styles)(ChallengeCardList);
