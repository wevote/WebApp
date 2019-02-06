import React, { Component } from "react";
import PropTypes from "prop-types";
import { _ } from "lodash";
import Helmet from "react-helmet";
import { renderLog } from "../../utils/logging";
import VoterGuideStore from "../../stores/VoterGuideStore";
import GuideList from "./GuideList";
import LoadingWheel from "../LoadingWheel";
import VoterStore from "../../stores/VoterStore";

export default class VoterGuideFollowers extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      organization: {},
      searchFilter: false,
      searchTerm: "",
      voterGuideFollowersList: [],
      voterGuideFollowersListFilteredBySearch: [],
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // VoterGuideActions.voterGuideFollowersRetrieve(this.props.organization.organization_we_vote_id);
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.setState({
      organization: this.props.organization,
      voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(this.props.organization.organization_we_vote_id),
    });
  }

  componentWillReceiveProps (nextProps) {
    // When a new organization is passed in, update this component to show the new data
    this.setState({
      organization: nextProps.organization,
      voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(nextProps.organization.organization_we_vote_id),
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
    const { organization } = this.state;
    this.setState({
      voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(organization.organization_we_vote_id),
    });
  }

  searchFollowers (event) {
    const searchTerm = event.target.value;
    if (searchTerm.length === 0) {
      this.setState({
        searchFilter: false,
        searchTerm: "",
        voterGuideFollowersListFilteredBySearch: [],
      });
    } else {
      const searchTermLowerCase = searchTerm.toLowerCase();
      const { voterGuideFollowersList } = this.state;
      const searchedFollowersList = _.filter(voterGuideFollowersList,
        oneVoterGuide => oneVoterGuide.voter_guide_display_name.toLowerCase().includes(searchTermLowerCase));

      this.setState({
        searchFilter: true,
        searchTerm,
        voterGuideFollowersListFilteredBySearch: searchedFollowersList,
      });
    }
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter || !this.state.organization) {
      return <div>{LoadingWheel}</div>;
    }

    let { voterGuideFollowersList } = this.state;
    if (this.state.searchFilter) {
      voterGuideFollowersList = this.state.voterGuideFollowersListFilteredBySearch;
    } else if (this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id) {
      // If looking at your own voter guide, filter out your own entry as a follower
      voterGuideFollowersList = voterGuideFollowersList.filter((oneVoterGuide) => {
        if (oneVoterGuide.organization_we_vote_id !== this.state.voter.linked_organization_we_vote_id) {
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
        <Helmet title={`${this.state.organization.organization_name} - We Vote`} />
        <div className="card">
          <ul className="card-child__list-group">
            { voterGuideFollowersList && voterGuideFollowersList.length > 0 ? (
              <span>
                { !this.state.searchFilter ? (
                  <span>
                    {this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id ?
                      <h4 className="card__additional-heading">Your Listeners</h4> : (
                        <h4 className="card__additional-heading">
                          Listeners of
                          {this.state.organization.organization_name}
                        </h4>
                      )}
                  </span>
                ) : (
                  <span>
                    { voterGuideFollowersList.length === 0 ? (
                      <h4 className="card__additional-heading">
                        &quot;
                        {this.state.searchTerm}
                        &quot; not found
                      </h4>
                    ) : null
                    }
                  </span>
                )}
                { voterGuideFollowersList && voterGuideFollowersList.length > showSearchWhenMoreThanThisNumber ? (
                  <input
                    type="text"
                    className="form-control"
                    name="search_followers_voter_guides_text"
                    placeholder="Search these listeners"
                    onChange={this.searchFollowers.bind(this)}
                  />
                ) : null
                }
                <span>
                  <GuideList
                    organizationsToFollow={voterGuideFollowersList}
                    hide_ignore_button
                    instantRefreshOn
                  />
                </span>
              </span>
            ) : (
              <span>
                {this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id ?
                  <h4 className="card__additional-heading">No listeners can be found.</h4> : (
                    <h4 className="card__additional-heading">
                      No listeners can be found for
                      {this.state.organization.organization_name}
                      .
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
