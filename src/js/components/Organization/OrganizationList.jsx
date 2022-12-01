import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { renderLog } from '../../common/utils/logging';
import EndorsementCard from '../Widgets/EndorsementCard';
import OrganizationDisplayForList from './OrganizationDisplayForList';

const ShowMoreItems = React.lazy(() => import(/* webpackChunkName: 'ShowMoreItems' */ '../Widgets/ShowMoreItems'));


class OrganizationList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loadingMoreItems: false,
      numberOfItemsToDisplay: 10,
      organizationListToDisplay: [],
      organizationListToDisplayCount: 0,
    };
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    // console.log('OrganizationList componentDidMount');
    this.onOrganizationListChange();
    window.addEventListener('scroll', this.onScroll);
  }

  componentDidUpdate (prevProps) {
    const { organizationListIdentifier: previous } = prevProps;
    const { organizationListIdentifier } = this.props;
    // console.log('previous:', previous, 'organizationListIdentifier:', organizationListIdentifier);
    if (previous !== organizationListIdentifier) {
      this.onOrganizationListChange();
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount () {
    if (this.numberOfItemsTimer) clearTimeout(this.numberOfItemsTimer);
    window.removeEventListener('scroll', this.onScroll);
  }

  onOrganizationListChange = () => {
    const { incomingOrganizationList } = this.props;
    const organizationListToDisplay = this.sortOrganizations(incomingOrganizationList);
    let organizationListToDisplayCount = 0;
    if (organizationListToDisplay) {
      organizationListToDisplayCount = organizationListToDisplay.length;
    }
    // console.log('onOrganizationListChange organizationListToDisplay:', organizationListToDisplay);
    this.setState({
      organizationListToDisplay,
      organizationListToDisplayCount,
    });
  }

  onScroll () {
    const { increaseNumberOfItemsOnScroll } = this.props;
    if (increaseNumberOfItemsOnScroll) {
      const showMoreItemsElement = document.querySelector('#showMoreItemsId');
      // console.log('showMoreItemsElement: ', showMoreItemsElement);
      // console.log('loadingMoreItems: ', this.state.loadingMoreItems);
      if (showMoreItemsElement) {
        const {
          numberOfItemsToDisplay, organizationListToDisplayCount,
        } = this.state;

        // console.log('window.height: ', window.innerHeight);
        // console.log('Bottom: ', showMoreItemsElement.getBoundingClientRect().bottom);
        // console.log('numberOfItemsToDisplay: ', numberOfItemsToDisplay);
        // console.log('totalNumberOfBallotItems: ', organizationListToDisplayCount);
        if (numberOfItemsToDisplay < organizationListToDisplayCount) {
          if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
            this.setState({ loadingMoreItems: true });
            this.increaseNumberOfItemsToDisplay();
          }
        } else {
          this.setState({ loadingMoreItems: false });
        }
      }
    }
  }

  increaseNumberOfItemsToDisplay = () => {
    let { numberOfItemsToDisplay } = this.state;
    // console.log('Number of ballot items before increment: ', numberOfItemsToDisplay);

    numberOfItemsToDisplay += 10;
    // console.log('Number of ballot items after increment: ', numberOfItemsToDisplay);

    if (this.numberOfItemsTimer) clearTimeout(this.numberOfItemsTimer);
    this.numberOfItemsTimer = setTimeout(() => {
      this.setState({
        numberOfItemsToDisplay,
      });
    }, 500);
  }

  orderByTwitterFollowers = (firstGuide, secondGuide) => secondGuide.twitter_followers_count - firstGuide.twitter_followers_count;

  sortOrganizations (organizationList) {
    // console.log('sortOrganizations: ', organizationsList, 'ballotItemWeVoteId: ', ballotItemWeVoteId);
    // let organizationListSorted;
    return organizationList.sort(this.orderByTwitterFollowers);
    // return organizationListSorted;
  }

  render () {
    renderLog('OrganizationList');  // Set LOG_RENDER_EVENTS to log all renders
    const { hideShowMoreItems } = this.props;
    const {
      loadingMoreItems, numberOfItemsToDisplay, organizationListToDisplay, organizationListToDisplayCount,
    } = this.state;
    if (organizationListToDisplay === undefined) {
      // console.log('OrganizationList this.state.organizations_to_follow === undefined');
      return null;
    }

    // console.log('OrganizationList organizationListToDisplay: ', organizationListToDisplayCount, organizationListToDisplayCount, loadingMoreItems);
    let numberOfItemsDisplayed = 0;
    if (!organizationListToDisplay) {
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
        {(organizationListToDisplay && organizationListToDisplayCount) ? (
          <div>
            {organizationListToDisplay.map((organization) => {
              if (organization) {
                if (numberOfItemsDisplayed >= numberOfItemsToDisplay) {
                  return null;
                }
                numberOfItemsDisplayed += 1;
              }
              // console.log('OrganizationList render', numberOfItemsDisplayed, numberOfItemsToDisplay);
              return (
                <OrganizationDisplayForList
                  key={organization.organization_we_vote_id}
                  organizationWeVoteId={organization.organization_we_vote_id}
                  twitterDescription={organization.twitter_description}
                  twitterHandle={organization.twitter_handle}
                  voterGuideDisplayName={organization.voter_guide_display_name}
                  voterGuideImageUrlLarge={organization.voter_guide_image_url_large}
                />
              );
            })}
            {!hideShowMoreItems && (
              <ShowMoreItemsWrapper id="showMoreItemsId" onClick={this.increaseNumberOfItemsToDisplay}>
                <Suspense fallback={<></>}>
                  <ShowMoreItems
                    loadingMoreItemsNow={loadingMoreItems}
                    numberOfItemsDisplayed={numberOfItemsDisplayed}
                    numberOfItemsTotal={organizationListToDisplayCount}
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
OrganizationList.propTypes = {
  hideShowMoreItems: PropTypes.bool,
  incomingOrganizationList: PropTypes.array,
  increaseNumberOfItemsOnScroll: PropTypes.bool,
  organizationListIdentifier: PropTypes.string,
};

const ShowMoreItemsWrapper = styled('div')`
`;

export default (OrganizationList);
