import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';
import { PageContentContainer } from '../Style/pageLayoutStyles';
import GuideList from './GuideList';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));


class VoterGuideFollowers extends Component {
  constructor (props) {
    super(props);
    this.state = {
      linkedOrganizationWeVoteId: '',
      organizationName: '',
      searchTerm: '',
      voterGuideFollowersList: [],
      voterGuideFollowersListFilteredBySearch: [],
    };
  }

  componentDidMount () {
    const { organizationWeVoteId } = this.props;
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
    let organizationName;
    if (organization && organization.organization_we_vote_id) {
      organizationName = organization.organization_name;
      this.setState({
        organizationName,
      });
    } else {
      OrganizationActions.organizationRetrieve(organizationWeVoteId);
    }
    this.onVoterStoreChange();
    VoterGuideActions.voterGuideFollowersRetrieve(organizationWeVoteId);
    this.setState({
      voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(organizationWeVoteId),
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { organizationWeVoteId } = this.props;
    const { organizationWeVoteId: nextOrganizationWeVoteId } = nextProps;
    // When a new organization is passed in, update this component to show the new data
    this.onOrganizationStoreChange();
    if (organizationWeVoteId && nextOrganizationWeVoteId && organizationWeVoteId !== nextOrganizationWeVoteId) {
      VoterGuideActions.voterGuideFollowersRetrieve(nextOrganizationWeVoteId);
      VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(nextOrganizationWeVoteId);
      this.setState({
        voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(nextProps.organizationWeVoteId),
      });
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.props;
    const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
    let organizationName;
    if (organization && organization.organization_we_vote_id) {
      organizationName = organization.organization_name;
      this.setState({
        organizationName,
      });
    }
    // We also want to update voterGuideFollowersList from the VoterGuideStore when there is a change in the OrganizationStore
    this.onVoterGuideStoreChange();
  }

  onVoterGuideStoreChange () {
    const { organizationWeVoteId } = this.props;
    this.setState({
      voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(organizationWeVoteId),
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    if (voter) {
      this.setState({
        linkedOrganizationWeVoteId: voter.linked_organization_we_vote_id,
      });
    }
  }

  searchFollowers = (searchTerm) => {
    if (searchTerm.length === 0) {
      this.setState({
        searchTerm: '',
        voterGuideFollowersListFilteredBySearch: [],
      });
    } else {
      const searchTermLowerCase = searchTerm.toLowerCase();
      const { voterGuideFollowersList } = this.state;
      const searchedFollowersList = filter(voterGuideFollowersList,
        (oneVoterGuide) => oneVoterGuide.voter_guide_display_name.toLowerCase().includes(searchTermLowerCase));

      this.setState({
        searchTerm,
        voterGuideFollowersListFilteredBySearch: searchedFollowersList,
      });
    }
  }

  clearSearchBarFunction = () => {
    this.setState({
      searchTerm: '',
      voterGuideFollowersListFilteredBySearch: [],
    });
  }

  render () {
    renderLog('VoterGuideFollowers');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('VoterGuideFollowers render');
    const { organizationWeVoteId } = this.props;
    const {
      linkedOrganizationWeVoteId, organizationName, searchTerm,
      voterGuideFollowersListFilteredBySearch,
    } = this.state;
    let { voterGuideFollowersList } = this.state;
    if (!organizationWeVoteId) {
      return <div>{LoadingWheel}</div>;
    }
    let lookingAtSelf = false;
    if (linkedOrganizationWeVoteId && organizationWeVoteId) {
      lookingAtSelf = linkedOrganizationWeVoteId === organizationWeVoteId;
    }

    if (lookingAtSelf) {
      // If looking at your own voter guide, filter out your own entry as a follower
      voterGuideFollowersList = voterGuideFollowersList.filter((oneVoterGuide) => {
        if (oneVoterGuide.organization_we_vote_id !== linkedOrganizationWeVoteId) {
          return oneVoterGuide;
        } else {
          return null;
        }
      });
    }

    return (
      <PageContentContainer>
        <Wrapper>
          {/* Since VoterGuidePositions, VoterGuideFollowing, and VoterGuideFollowers are in tabs the title seems to use the Helmet values from the last tab */}
          <Helmet title={`${organizationName} - WeVote`} />
          <div className="card">
            <ul className="card-child__list-group">
              {((voterGuideFollowersList && voterGuideFollowersList.length > 0) ||
                (voterGuideFollowersListFilteredBySearch && voterGuideFollowersListFilteredBySearch.length > 0)) ? (
                  <TitleWrapper>
                    {lookingAtSelf ? (
                      <>
                        Your Followers
                      </>
                    ) : (
                      <>
                        Followers of
                        {' '}
                        {organizationName}
                      </>
                    )}
                  </TitleWrapper>
                ) : (
                  <Suspense fallback={<></>}>
                    <DelayedLoad showLoadingText waitBeforeShow={2000}>
                      <TitleWrapper>
                        {lookingAtSelf ? (
                          <>
                            No followers can be found.
                          </>
                        ) : (
                          <>
                            No followers of
                            {' '}
                            {organizationName}
                            {' '}
                            can be found.
                          </>
                        )}
                      </TitleWrapper>
                    </DelayedLoad>
                  </Suspense>
                )}
              {voterGuideFollowersList && voterGuideFollowersList.length > 0 && (
                <SearchInputWrapper>
                  <SearchBar2024
                    clearButton
                    clearFunction={this.clearSearchBarFunction}
                    placeholder="Search these followers"
                    searchButton
                    searchFunction={this.searchFollowers}
                    searchUpdateDelayTime={200}
                  />
                </SearchInputWrapper>
              )}
              {(searchTerm && (voterGuideFollowersListFilteredBySearch && voterGuideFollowersListFilteredBySearch.length === 0)) && (
                <SearchResultsWrapper>
                  &quot;
                  {searchTerm}
                  &quot; not found
                </SearchResultsWrapper>
              )}
              <span>
                <GuideList
                  incomingVoterGuideList={searchTerm ? voterGuideFollowersListFilteredBySearch : voterGuideFollowersList}
                />
              </span>
            </ul>
          </div>
        </Wrapper>
      </PageContentContainer>
    );
  }
}
VoterGuideFollowers.propTypes = {
  organizationWeVoteId: PropTypes.string.isRequired,
};

const SearchInputWrapper = styled('div')`
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 8px;
`;

const SearchResultsWrapper = styled('div')`
  margin-left: 15px;
  margin-right: 15px;
`;

const TitleWrapper = styled('div')`
  margin: 15px;
`;

const Wrapper = styled('div')(({ theme }) => (`
  ${theme.breakpoints.down('md')} {
    // margin-left: 15px;
    // margin-right: 15px;
  }
`));

export default (VoterGuideFollowers);
