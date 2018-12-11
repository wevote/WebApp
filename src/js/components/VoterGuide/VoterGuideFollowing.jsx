import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { Button } from "react-bootstrap";
import { _ } from "lodash";
import GuideList from "./GuideList";
import LoadingWheel from "../LoadingWheel";
import OrganizationActions from "../../actions/OrganizationActions";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import { renderLog } from "../../utils/logging";

export default class VoterGuideFollowing extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      editMode: false,
      organization: {},
      search_filter: false,
      search_term: "",
      voter: {},
      voter_guide_followed_list: [],
      voter_guide_followed_list_filtered_by_search: [],
    };
  }

  componentDidMount () {
    OrganizationActions.organizationsFollowedRetrieve();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.props.organization.organization_we_vote_id);
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.setState({
      organization: this.props.organization,
      voter: VoterStore.getVoter(),
      voter_guide_followed_list: VoterGuideStore.getVoterGuidesFollowedByOrganization(this.props.organization.organization_we_vote_id),
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
      voter_guide_followed_list: VoterGuideStore.getVoterGuidesFollowedByOrganization(nextProps.organization.organization_we_vote_id),
    });
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  onVoterGuideStoreChange () {
    this.setState({
      voter_guide_followed_list: VoterGuideStore.getVoterGuidesFollowedByOrganization(this.state.organization.organization_we_vote_id),
    });
  }

  searchFollowingVoterGuides (event) {
    const search_term = event.target.value;
    if (search_term.length === 0) {
      this.setState({
        search_filter: false,
        search_term: "",
        voter_guide_followed_list_filtered_by_search: [],
      });
    } else {
      const search_term_lowercase = search_term.toLowerCase();
      const searched_followed_list = _.filter(this.state.voter_guide_followed_list,
        user => user.voter_guide_display_name.toLowerCase().includes(search_term_lowercase));

      this.setState({
        search_filter: true,
        search_term,
        voter_guide_followed_list_filtered_by_search: searched_followed_list,
      });
    }
  }

  followAllOrganizations () {
    VoterGuideActions.voterFollowAllOrganizationsFollowedByOrganization(this.state.organization.organization_we_vote_id);
  }

  toggleEditMode () {
    this.setState({ editMode: !this.state.editMode });
  }

  onKeyDownEditMode (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.setState({ editMode: !this.state.editMode });
    }
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return <div>{LoadingWheel}</div>;
    }
    let looking_at_self = false;
    if (this.state.organization) {
      looking_at_self = this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id;
    }
    // console.log("VoterGuideFollowing, linked_organization_we_vote_id: ", this.state.voter.linked_organization_we_vote_id, "organization: ", this.state.organization.organization_we_vote_id);

    let voter_guide_followed_list = [];
    if (!this.state.search_filter) {
      voter_guide_followed_list = this.state.voter_guide_followed_list;
    } else {
      voter_guide_followed_list = this.state.voter_guide_followed_list_filtered_by_search;
    }
    const hide_stop_following_button = !looking_at_self || !this.state.editMode;
    const show_search_when_more_than_this_number = 3;

    return (
      <div className="opinions-followed__container">
        {/* Since VoterGuidePositions, VoterGuideFollowing, and VoterGuideFollowers are in tabs the title seems to use the Helmet values from the last tab */}
        <Helmet title={`${this.state.organization.organization_name} - We Vote`} />
        <div className="card">
          <ul className="card-child__list-group">
            { this.state.voter_guide_followed_list && this.state.voter_guide_followed_list.length > 0 ? (
              <span>
                { looking_at_self ? (
                  <a
                    className="fa-pull-right u-push--md"
                    onKeyDown={this.onKeyDownEditMode.bind(this)}
                    onClick={this.toggleEditMode.bind(this)}
                  >
                    {this.state.editMode ? "Done Editing" : "Edit"}
                  </a>
                ) : (
                  <Button
                    variant="success"
                    size="small"
                    bsPrefix="fa-pull-right u-push--md"
                    onClick={this.followAllOrganizations.bind(this)}
                  >
                    <span>Listen to All</span>
                  </Button>
                )}
                { !this.state.search_filter ? (
                  <span>
                    {this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id ? (
                      <h4 className="card__additional-heading">
                        You Are Listening To
                        <span className="d-none d-sm-block">
                          {" "}
                          {this.state.voter_guide_followed_list.length}
                          {" "}
                          Organizations or People
                        </span>
                      </h4>
                    ) : (
                      <h4 className="card__additional-heading">
                        {this.state.organization.organization_name}
                        {" "}
                        is Listening To
                      </h4>
                    )}
                  </span>
                ) :
                  <h4 className="card__additional-heading">Search Results</h4>
              }
                { this.state.voter_guide_followed_list && this.state.voter_guide_followed_list.length > show_search_when_more_than_this_number ? (
                  <input
                    type="text"
                    className="form-control"
                    name="search_following_voter_guides_text"
                    placeholder="Search these voter guides"
                    onChange={this.searchFollowingVoterGuides.bind(this)}
                  />
                ) : null
                }
                { this.state.search_filter ? (
                  <span>
                    { voter_guide_followed_list.length === 0 ? (
                      <h4 className="card__additional-heading">
                        &quot;
                        {this.state.search_term}
                        &quot; not found
                      </h4>
                    ) : null
                    }
                  </span>
                ) : null
                }
                <span>
                  <GuideList
                    organizationsToFollow={voter_guide_followed_list}
                    hide_stop_following_button={hide_stop_following_button}
                    hide_ignore_button
                    instantRefreshOn
                  />
                </span>
              </span>
            ) : (
              <span>
                {this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id ?
                  <h4 className="card__additional-heading">You&apos;re not listening to anyone.</h4> : (
                    <h4 className="card__additional-heading">
                      {this.state.organization.organization_name}
                      {" "}
                      is not listening to anyone.
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
