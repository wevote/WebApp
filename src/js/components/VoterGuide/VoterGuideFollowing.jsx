import React, {Component, PropTypes } from "react";
import Helmet from "react-helmet";
import GuideStore from "../../stores/GuideStore";
import GuideActions from "../../actions/GuideActions";
import GuideList from "./GuideList";
import LoadingWheel from "../LoadingWheel";
import VoterStore from "../../stores/VoterStore";
var _ = require("lodash");

export default class VoterGuideFollowing extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      organization: this.props.organization,
      search_filter: false,
      search_term: "",
      voter: VoterStore.getVoter(),
      voter_guide_followed_list: GuideStore.getVoterGuidesFollowedByLatestOrganization(),
      voter_guide_followed_list_filtered_by_search: [],
    };
  }

  componentDidMount () {
    // this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    GuideActions.voterGuidesFollowedByOrganizationRetrieve(this.props.organization.organization_we_vote_id);
    // this._onGuideStoreChange();
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // When a new organization is passed in, update this component to show the new data
    if (this.state.organization.organization_we_vote_id !== nextProps.organization.organization_we_vote_id)
      GuideActions.voterGuidesFollowedByOrganizationRetrieve(nextProps.organization.organization_we_vote_id);
    this.setState({organization: nextProps.organization});
  }

  componentWillUnmount (){
    this.guideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter()});
   }

  _onGuideStoreChange (){
    this.setState({
      voter_guide_followed_list: GuideStore.getVoterGuidesFollowedByLatestOrganization()
    });
  }

  searchFollowingVoterGuides (event) {
    let search_term = event.target.value;
    if (search_term.length === 0) {
      this.setState({
        search_filter: false,
        search_term: "",
        voter_guide_followed_list_filtered_by_search: [],
      });
    } else {
      let search_term_lowercase = search_term.toLowerCase();
      var searched_followed_list = _.filter(this.state.voter_guide_followed_list,
        function (user) {
            return user.voter_guide_display_name.toLowerCase().includes(search_term_lowercase);
          });

      this.setState({
        search_filter: true,
        search_term: search_term,
        voter_guide_followed_list_filtered_by_search: searched_followed_list,
      });
    }
  }


  render () {
    if (!this.state.voter) {
      return <div>{LoadingWheel}</div>;
    }
    let looking_at_self = false;
    if (this.state.organization) {
      looking_at_self = this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id;
    }
    // console.log("VoterGuideFollowing, linked_organization_we_vote_id: ", this.state.voter.linked_organization_we_vote_id, "organization: ", this.state.organization.organization_we_vote_id);

    var voter_guide_followed_list = [];
    if (!this.state.search_filter) {
      voter_guide_followed_list = this.state.voter_guide_followed_list;
    } else {
      voter_guide_followed_list = this.state.voter_guide_followed_list_filtered_by_search;
    }
    let hide_stop_following_button = !looking_at_self;

    return <div className="opinions-followed__container">
      {/* Since VoterGuidePositions, VoterGuideFollowing, and VoterGuideFollowers are in tabs the title seems to use the Helmet values from the last tab */}
      <Helmet title={this.state.organization.organization_name + " - We Vote"} />
      <div className="card">
        <ul className="card-child__list-group">
          { this.state.voter_guide_followed_list && this.state.voter_guide_followed_list.length > 0 ?
            <span>
              { !this.state.search_filter ?
                <span>
                  {this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id ?
                    <h4 className="card__additional-heading">You Are Following<span className={"hidden-xs"}> {this.state.voter_guide_followed_list.length} Organizations or People</span></h4> :
                    <h4 className="card__additional-heading">{this.state.organization.organization_name} is Following</h4>
                  }
                </span> :
                <h4 className="card__additional-heading">Search Results</h4>
              }
              { this.state.voter_guide_followed_list && this.state.voter_guide_followed_list.length > 0 ?
                <input type="text"
                     className="form-control"
                     name="search_following_voter_guides_text"
                     placeholder="Search these voter guides"
                     onChange={this.searchFollowingVoterGuides.bind(this)} /> : null
              }
              { this.state.search_filter ?
                <span>
                  { voter_guide_followed_list.length === 0 ?
                    <h4 className="card__additional-heading">"{this.state.search_term}" not found</h4> :
                    null
                  }
                </span> :
                null
              }
              <span>
                  <GuideList organizationsToFollow={voter_guide_followed_list}
                             hide_stop_following_button={hide_stop_following_button}
                             hide_ignore_button
                             instantRefreshOn />
              </span>
            </span> :
            <span>
              {this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id ?
                <h4 className="card__additional-heading">You're not following anyone.</h4> :
                <h4 className="card__additional-heading">{this.state.organization.organization_name} is not following anyone.</h4>
              }
            </span>
          }
        </ul>
      </div>
    </div>;
  }
}
