import React, { Component } from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash-es/filter';
import Helmet from 'react-helmet';
import DelayedLoad from '../Widgets/DelayedLoad';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import GuideList from './GuideList';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

export default class VoterGuideFollowers extends Component {
  static propTypes = {
    organizationWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      linkedOrganizationWeVoteId: '',
      organizationName: '',
      searchFilter: false,
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

  componentWillReceiveProps (nextProps) {
    // When a new organization is passed in, update this component to show the new data
    this.onOrganizationStoreChange();
    this.setState({
      voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(nextProps.organizationWeVoteId),
    });
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
      this.setState({ linkedOrganizationWeVoteId: voter.linked_organization_we_vote_id });
    }
  }

  searchFollowers (event) {
    const searchTerm = event.target.value;
    if (searchTerm.length === 0) {
      this.setState({
        searchFilter: false,
        searchTerm: '',
        voterGuideFollowersListFilteredBySearch: [],
      });
    } else {
      const searchTermLowerCase = searchTerm.toLowerCase();
      const { voterGuideFollowersList } = this.state;
      const searchedFollowersList = filter(voterGuideFollowersList,
        oneVoterGuide => oneVoterGuide.voter_guide_display_name.toLowerCase().includes(searchTermLowerCase));

      this.setState({
        searchFilter: true,
        searchTerm,
        voterGuideFollowersListFilteredBySearch: searchedFollowersList,
      });
    }
  }

  render () {
    renderLog('VoterGuideFollowers');  // Set LOG_RENDER_EVENTS to log all renders
    const { organizationWeVoteId } = this.props;
    const {
      linkedOrganizationWeVoteId, organizationName, searchFilter, searchTerm,
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

    if (searchFilter) {
      voterGuideFollowersList = voterGuideFollowersListFilteredBySearch;
    } else if (linkedOrganizationWeVoteId === organizationWeVoteId) {
      // If looking at your own voter guide, filter out your own entry as a follower
      voterGuideFollowersList = voterGuideFollowersList.filter((oneVoterGuide) => {
        if (oneVoterGuide.organization_we_vote_id !== linkedOrganizationWeVoteId) {
          return oneVoterGuide;
        } else {
          return null;
        }
      });
    }
    const showSearchWhenMoreThanThisNumber = 3;

    return (
      <div className="opinions-followed__container">
        {/* Since VoterGuidePositions, VoterGuideFollowing, and VoterGuideFollowers are in tabs the title seems to use the Helmet values from the last tab */}
        <Helmet title={`${organizationName} - We Vote`} />
        <div className="card">
          <ul className="card-child__list-group">
            { voterGuideFollowersList && voterGuideFollowersList.length > 0 ? (
              <span>
                <span>
                  {lookingAtSelf ?
                    <h4 className="card__additional-heading">Your Followers</h4> : (
                      <h4 className="card__additional-heading">
                        Followers of
                        {' '}
                        {organizationName}
                      </h4>
                    )}
                </span>
                {/* ***************** */}
                {/* Results Not Found */}
                {(searchFilter) && (
                  <span>
                    { (voterGuideFollowersList.length === 0) && (
                      <h4 className="card__additional-heading">
                        &quot;
                        {searchTerm}
                        &quot; not found
                      </h4>
                    )}
                  </span>
                )}
                {/* ********** */}
                {/* Search Box */}
                {(voterGuideFollowersList && ((voterGuideFollowersList.length > showSearchWhenMoreThanThisNumber) || searchTerm)) && (
                  <input
                    type="text"
                    className="form-control"
                    name="search_followers_voter_guides_text"
                    placeholder="Search these followers"
                    onChange={this.searchFollowers.bind(this)}
                  />
                )}
                <span>
                  <GuideList
                    incomingVoterGuideList={voterGuideFollowersList}
                    instantRefreshOn
                  />
                </span>
              </span>
            ) : (
              <DelayedLoad showLoadingText waitBeforeShow={2000}>
                {lookingAtSelf ?
                  <h4 className="card__additional-heading">No followers can be found.</h4> : (
                    <h4 className="card__additional-heading">
                      No followers of
                      {' '}
                      {organizationName}
                      {' '}
                      can be found.
                    </h4>
                  )}
              </DelayedLoad>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
