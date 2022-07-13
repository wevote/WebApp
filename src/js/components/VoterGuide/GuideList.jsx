import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import CandidateStore from '../../stores/CandidateStore';
import MeasureStore from '../../stores/MeasureStore';
import EndorsementCard from '../Widgets/EndorsementCard';
import { openSnackbar } from '../Widgets/SnackNotifier';
import VoterGuideDisplayForList from './VoterGuideDisplayForList';

const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../Widgets/FollowToggle'));
const ShowMoreItems = React.lazy(() => import(/* webpackChunkName: 'ShowMoreItems' */ '../Widgets/ShowMoreItems'));


class GuideList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filteredOrganizationsWithPositions: [],
      voterGuideList: [],
      voterGuideListCount: 0,
      ballotItemWeVoteId: '',
      loadingMoreItems: false,
      numberOfItemsToDisplay: 10,
    };
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    // console.log('GuideList componentDidMount');
    const { ballotItemWeVoteId } = this.state;
    const voterGuideList = this.sortOrganizations(this.props.incomingVoterGuideList, ballotItemWeVoteId);
    let voterGuideListCount = 0;
    if (voterGuideList) {
      voterGuideListCount = voterGuideList.length;
    }
    this.setState({
      voterGuideList,
      voterGuideListCount,
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
    }, () => {
      const organizationsWithPositions = this.getOrganizationsWithPositions();
      let filteredOrganizationsWithPositionsCount = 0;
      if (organizationsWithPositions) {
        filteredOrganizationsWithPositionsCount = organizationsWithPositions.length;
      }
      this.setState({
        filteredOrganizationsWithPositions: organizationsWithPositions,
        filteredOrganizationsWithPositionsCount,
      });
    });
    window.addEventListener('scroll', this.onScroll);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('GuideList componentWillReceiveProps');
    // Do not update the state if the voterGuideList list looks the same, and the ballotItemWeVoteId hasn't changed
    const { ballotItemWeVoteId } = this.state;
    const voterGuideList = this.sortOrganizations(nextProps.incomingVoterGuideList, ballotItemWeVoteId);
    let voterGuideListCount = 0;
    if (voterGuideList) {
      voterGuideListCount = voterGuideList.length;
    }
    this.setState({
      voterGuideList,
      voterGuideListCount,
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
    }, () => {
      const organizationsWithPositions = this.getOrganizationsWithPositions();
      let filteredOrganizationsWithPositionsCount = 0;
      if (organizationsWithPositions) {
        filteredOrganizationsWithPositionsCount = organizationsWithPositions.length;
      }
      this.setState({
        filteredOrganizationsWithPositions: organizationsWithPositions,
        filteredOrganizationsWithPositionsCount,
      });
    });
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.state.filteredOrganizationsWithPositionsCount !== nextState.filteredOrganizationsWithPositionsCount) {
  //     return true;
  //   }
  //   if (this.state.voterGuideListCount !== nextState.voterGuideListCount) {
  //     return true;
  //   }
  //   if (this.state.ballotItemWeVoteId !== nextState.ballotItemWeVoteId) {
  //     return true;
  //   }
  //   return false;
  // }

  componentWillUnmount () {
    if (this.ballotItemTimer) clearTimeout(this.ballotItemTimer);
    window.removeEventListener('scroll', this.onScroll);
  }

  handleIgnore (organizationWeVoteId) {
    const { voterGuideList } = this.state;
    // OrganizationActions.organizationFollowIgnore(organizationWeVoteId); // This is run within FollowToggle
    const newVoterGuideList = voterGuideList.filter(
      (org) => org.organization_we_vote_id !== organizationWeVoteId,
    );
    let voterGuideListCount = 0;
    if (newVoterGuideList) {
      voterGuideListCount = newVoterGuideList.length;
    }
    this.setState({
      voterGuideList: newVoterGuideList,
      voterGuideListCount,
    });
    openSnackbar({ message: 'Added to ignore list.' });
  }

  onScroll () {
    const showMoreItemsElement =  document.querySelector('#showMoreItemsId');
    // console.log('showMoreItemsElement: ', showMoreItemsElement);
    // console.log('loadingMoreItems: ', this.state.loadingMoreItems);
    if (showMoreItemsElement) {
      const {
        numberOfItemsToDisplay, filteredOrganizationsWithPositionsCount,
      } = this.state;

      // console.log('window.height: ', window.innerHeight);
      // console.log('Bottom: ', showMoreItemsElement.getBoundingClientRect().bottom);
      // console.log('numberOfItemsToDisplay: ', numberOfItemsToDisplay);
      // console.log('totalNumberOfBallotItems: ', filteredOrganizationsWithPositionsCount);
      if (numberOfItemsToDisplay < filteredOrganizationsWithPositionsCount) {
        if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
          this.setState({ loadingMoreItems: true });
          this.increaseNumberOfItemsToDisplay();
        }
      } else {
        this.setState({ loadingMoreItems: false });
      }
    }
  }

  getOrganizationsWithPositions = () => this.state.voterGuideList.map((organization) => {
    let organizationPositionForThisBallotItem;
    if (stringContains('cand', this.state.ballotItemWeVoteId)) {
      organizationPositionForThisBallotItem = CandidateStore.getPositionAboutCandidateFromOrganization(this.state.ballotItemWeVoteId, organization.organization_we_vote_id);
      // console.log({ ...organizationPositionForThisBallotItem, ...organization });
    } else if (stringContains('meas', this.state.ballotItemWeVoteId)) {
      organizationPositionForThisBallotItem = MeasureStore.getPositionAboutMeasureFromOrganization(this.state.ballotItemWeVoteId, organization.organization_we_vote_id);
    }
    return { ...organizationPositionForThisBallotItem, ...organization };
  });

  increaseNumberOfItemsToDisplay = () => {
    let { numberOfItemsToDisplay } = this.state;
    // console.log('Number of ballot items before increment: ', numberOfItemsToDisplay);

    numberOfItemsToDisplay += 5;
    // console.log('Number of ballot items after increment: ', numberOfItemsToDisplay);

    if (this.ballotItemTimer) clearTimeout(this.ballotItemTimer);
    this.ballotItemTimer = setTimeout(() => {
      this.setState({
        numberOfItemsToDisplay,
      });
    }, 500);
  }

  sortOrganizations (organizationsList, ballotItemWeVoteId) {
    // console.log('sortOrganizations: ', organizationsList, 'ballotItemWeVoteId: ', ballotItemWeVoteId);
    if (organizationsList && ballotItemWeVoteId) {
      // console.log('Checking for resort');
      const arrayLength = organizationsList.length;
      let organization;
      let organizationPositionForThisBallotItem;
      const sortedOrganizations = [];
      for (let i = 0; i < arrayLength; i++) {
        organization = organizationsList[i];
        organizationPositionForThisBallotItem = null;
        if (ballotItemWeVoteId && organization.organization_we_vote_id) {
          if (stringContains('cand', ballotItemWeVoteId)) {
            organizationPositionForThisBallotItem = CandidateStore.getPositionAboutCandidateFromOrganization(ballotItemWeVoteId, organization.organization_we_vote_id);
          } else if (stringContains('meas', ballotItemWeVoteId)) {
            organizationPositionForThisBallotItem = MeasureStore.getPositionAboutMeasureFromOrganization(ballotItemWeVoteId, organization.organization_we_vote_id);
          }
        }
        if (organizationPositionForThisBallotItem && organizationPositionForThisBallotItem.statement_text) {
          // console.log('sortOrganizations unshift');
          sortedOrganizations.unshift(organization);
        } else {
          // console.log('sortOrganizations push');
          sortedOrganizations.push(organization);
        }
      }
      return sortedOrganizations;
    }
    return organizationsList;
  }

  render () {
    renderLog('GuideList');  // Set LOG_RENDER_EVENTS to log all renders
    const { hideShowMoreItems } = this.props;
    const {
      filteredOrganizationsWithPositions, filteredOrganizationsWithPositionsCount,
      loadingMoreItems, numberOfItemsToDisplay, voterGuideListCount,
    } = this.state;
    if (filteredOrganizationsWithPositions === undefined) {
      // console.log('GuideList this.state.organizations_to_follow === undefined');
      return null;
    }

    // console.log('GuideList voterGuideList: ', voterGuideListCount, filteredOrganizationsWithPositionsCount, loadingMoreItems);
    let numberOfItemsDisplayed = 0;
    if (!filteredOrganizationsWithPositions) {
      return (
        <div className="guidelist">
          <div className="u-flex u-flex-column u-items-center">
            <div className="u-margin-top--sm u-stack--sm u-no-break">
              No results found.
            </div>
            <EndorsementCard
              className="btn endorsement-btn btn-sm"
              bsPrefix="u-margin-top--sm u-stack--xs"
              variant="primary"
              buttonText="Organization Missing?"
              text="Don't see an organization you want to follow?"
            />
          </div>
        </div>
      );
    }
    return (
      <div>
        {(filteredOrganizationsWithPositions.length && voterGuideListCount) ? (
          <div className="guidelist">
            {filteredOrganizationsWithPositions.map((organization) => {
              if (organization) {
                if (numberOfItemsDisplayed >= numberOfItemsToDisplay) {
                  return null;
                }
                numberOfItemsDisplayed += 1;
              }
              // console.log('GuideList render', numberOfItemsDisplayed, numberOfItemsToDisplay);
              const handleIgnoreFunc = () => {
                this.handleIgnore(organization.organization_we_vote_id);
              };
              return (
                <VoterGuideDisplayForList
                  key={organization.organization_we_vote_id}
                  organizationWeVoteId={organization.organization_we_vote_id}
                  twitterDescription={organization.twitter_description}
                  twitterHandle={organization.twitter_handle}
                  voterGuideDisplayName={organization.voter_guide_display_name}
                  voterGuideImageUrlLarge={organization.voter_guide_image_url_large}
                >
                  <Suspense fallback={<></>}>
                    <FollowToggle
                      organizationWeVoteId={organization.organization_we_vote_id}
                      handleIgnore={handleIgnoreFunc}
                    />
                  </Suspense>
                </VoterGuideDisplayForList>
              );
            })}
            {!hideShowMoreItems && (
              <ShowMoreItemsWrapper id="showMoreItemsId" onClick={this.increaseNumberOfItemsToDisplay}>
                <Suspense fallback={<></>}>
                  <ShowMoreItems
                    loadingMoreItemsNow={loadingMoreItems}
                    numberOfItemsDisplayed={numberOfItemsDisplayed}
                    numberOfItemsTotal={filteredOrganizationsWithPositionsCount}
                  />
                </Suspense>
              </ShowMoreItemsWrapper>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}
GuideList.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  hideShowMoreItems: PropTypes.bool,
  incomingVoterGuideList: PropTypes.array,
};

const ShowMoreItemsWrapper = styled('div')`
`;

export default (GuideList);
