import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Button } from 'react-bootstrap';
import { _ } from 'lodash';
import GuideList from './GuideList';
import LoadingWheel from '../LoadingWheel';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';

export default class VoterGuideFollowing extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      editMode: false,
      organization: {},
      searchFilter: false,
      searchTerm: '',
      voter: {},
      voterGuideFollowedList: [],
      voterGuideFollowedListFilteredBySearch: [],
    };
  }

  componentDidMount () {
    OrganizationActions.organizationsFollowedRetrieve();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.props.organization.organization_we_vote_id);
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.setState({
      organization: this.props.organization,
      voter: VoterStore.getVoter(),
      voterGuideFollowedList: VoterGuideStore.getVoterGuidesFollowedByOrganization(this.props.organization.organization_we_vote_id),
    });
  }

  componentWillReceiveProps (nextProps) {
    // When a new organization is passed in, update this component to show the new data
    if (this.state.organization.organization_we_vote_id !== nextProps.organization.organization_we_vote_id) {
      OrganizationActions.organizationsFollowedRetrieve();
      VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(nextProps.organization.organization_we_vote_id);
    }
    this.setState({
      organization: nextProps.organization,
      voterGuideFollowedList: VoterGuideStore.getVoterGuidesFollowedByOrganization(nextProps.organization.organization_we_vote_id),
    });
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  onVoterGuideStoreChange () {
    const { organization_we_vote_id: organizationWeVoteId } = this.state.organization;
    this.setState({
      voterGuideFollowedList: VoterGuideStore.getVoterGuidesFollowedByOrganization(organizationWeVoteId),
    });
  }

  onKeyDownEditMode (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      const { editMode } = this.state;
      scope.setState({ editMode: !editMode });
    }
  }

  followAllOrganizations = () => {
    VoterGuideActions.voterFollowAllOrganizationsFollowedByOrganization(this.state.organization.organization_we_vote_id);
  }

  searchFollowingVoterGuides (event) {
    const searchTerm = event.target.value;
    if (searchTerm.length === 0) {
      this.setState({
        searchFilter: false,
        searchTerm: '',
        voterGuideFollowedListFilteredBySearch: [],
      });
    } else {
      const searchTermLowerCase = searchTerm.toLowerCase();
      const { voterGuideFollowedList } = this.state;
      const searchedFollowedList = _.filter(voterGuideFollowedList,
        user => user.voter_guide_display_name.toLowerCase().includes(searchTermLowerCase));

      this.setState({
        searchFilter: true,
        searchTerm,
        voterGuideFollowedListFilteredBySearch: searchedFollowedList,
      });
    }
  }

  toggleEditMode () {
    const { editMode } = this.state;
    this.setState({ editMode: !editMode });
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return <div>{LoadingWheel}</div>;
    }
    let lookingAtSelf = false;
    if (this.state.organization) {
      lookingAtSelf = this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id;
    }
    // console.log("VoterGuideFollowing, linked_organization_we_vote_id: ", this.state.voter.linked_organization_we_vote_id, "organization: ", this.state.organization.organization_we_vote_id);

    let { voterGuideFollowedList } = this.state;
    if (this.state.searchFilter) {
      voterGuideFollowedList = this.state.voterGuideFollowedListFilteredBySearch;
    }
    const hideStopFollowingButton = !lookingAtSelf || !this.state.editMode;
    const showSearchWhenMoreThanThisNumber = 3;

    return (
      <div className="opinions-followed__container">
        {/* Since VoterGuidePositions, VoterGuideFollowing, and VoterGuideFollowers are in tabs the title seems to use the Helmet values from the last tab */}
        <Helmet title={`${this.state.organization.organization_name} - We Vote`} />
        <div className="card">
          <ul className="card-child__list-group">
            { this.state.voterGuideFollowedList && this.state.voterGuideFollowedList.length > 0 ? (
              <span>
                { lookingAtSelf ? (
                  <a
                    className="fa-pull-right u-push--md"
                    onKeyDown={this.onKeyDownEditMode.bind(this)}
                    onClick={this.toggleEditMode.bind(this)}
                  >
                    {this.state.editMode ? 'Done Editing' : 'Edit'}
                  </a>
                ) : (
                  <Button
                    variant="success"
                    size="small"
                    bsPrefix="fa-pull-right u-push--md"
                    onClick={this.followAllOrganizations}
                  >
                    <span>Follow All</span>
                  </Button>
                )}
                { !this.state.searchFilter ? (
                  <span>
                    {this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id ? (
                      <h4 className="card__additional-heading">
                        You Are Following
                        <span className="d-none d-sm-block">
                          {' '}
                          {this.state.voterGuideFollowedList.length}
                          {' '}
                          Organizations or People
                        </span>
                      </h4>
                    ) : (
                      <h4 className="card__additional-heading">
                        {this.state.organization.organization_name}
                        {' '}
                        is Following
                      </h4>
                    )}
                  </span>
                ) :
                  <h4 className="card__additional-heading">Search Results</h4>
              }
                { this.state.voterGuideFollowedList && this.state.voterGuideFollowedList.length > showSearchWhenMoreThanThisNumber ? (
                  <input
                    type="text"
                    className="form-control"
                    name="search_following_voter_guides_text"
                    placeholder="Search these voter guides"
                    onChange={this.searchFollowingVoterGuides.bind(this)}
                  />
                ) : null
                }
                { this.state.searchFilter ? (
                  <span>
                    { voterGuideFollowedList.length === 0 ? (
                      <h4 className="card__additional-heading">
                        &quot;
                        {this.state.searchTerm}
                        &quot; not found
                      </h4>
                    ) : null
                    }
                  </span>
                ) : null
                }
                <span>
                  <GuideList
                    organizationsToFollow={voterGuideFollowedList}
                    hide_stop_following_button={hideStopFollowingButton}
                    hide_ignore_button
                    instantRefreshOn
                  />
                </span>
              </span>
            ) : (
              <span>
                {this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id ?
                  <h4 className="card__additional-heading">You&apos;re not following anyone.</h4> : (
                    <h4 className="card__additional-heading">
                      {this.state.organization.organization_name}
                      {' '}
                      is not following anyone.
                    </h4>
                  )}
              </span>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
