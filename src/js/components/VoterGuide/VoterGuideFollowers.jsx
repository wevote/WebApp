import React, {Component, PropTypes } from "react";
import Helmet from "react-helmet";
import VoterGuideStore from "../../stores/VoterGuideStore";
import GuideList from "./GuideList";
import LoadingWheel from "../LoadingWheel";
import VoterStore from "../../stores/VoterStore";
var _ = require("lodash");

export default class VoterGuideFollowers extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      voter_guide_followers_list: [],
      organization: {},
      search_filter: false,
      search_term: "",
      voter_guide_followers_list_filtered_by_search: [],
    };
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    // VoterGuideActions.voterGuideFollowersRetrieve(this.props.organization.organization_we_vote_id);
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.setState({
      organization: this.props.organization,
      voter_guide_followers_list: VoterGuideStore.getVoterGuidesFollowingOrganization(this.props.organization.organization_we_vote_id),
    });
  }

  componentWillReceiveProps (nextProps) {
    // When a new organization is passed in, update this component to show the new data
    this.setState({
      organization: nextProps.organization,
      voter_guide_followers_list: VoterGuideStore.getVoterGuidesFollowingOrganization(nextProps.organization.organization_we_vote_id),
    });
  }

  componentWillUnmount (){
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter()});
   }

  onVoterGuideStoreChange (){
    this.setState({
      voter_guide_followers_list: VoterGuideStore.getVoterGuidesFollowingOrganization(this.state.organization.organization_we_vote_id)
    });
  }

  searchFollowers (event) {
    let search_term = event.target.value;
    if (search_term.length === 0) {
      this.setState({
        search_filter: false,
        search_term: "",
        voter_guide_followers_list_filtered_by_search: [],
      });
    } else {
      let search_term_lowercase = search_term.toLowerCase();
      var searched_followers_list = _.filter(this.state.voter_guide_followers_list,
        function (user) {
            return user.voter_guide_display_name.toLowerCase().includes(search_term_lowercase);
          });

      this.setState({
        search_filter: true,
        search_term: search_term,
        voter_guide_followers_list_filtered_by_search: searched_followers_list,
      });
    }
  }


  render () {
    if (!this.state.voter || !this.state.organization) {
      return <div>{LoadingWheel}</div>;
    }

    var voter_guide_followers_list = [];
    if (!this.state.search_filter) {
      voter_guide_followers_list = this.state.voter_guide_followers_list;
      // console.log("VoterGuideFollowers, voter_guide_followers_list: ", voter_guide_followers_list);
      if (this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id) {
        // If looking at your own voter guide, filter out your own entry as a follower
        voter_guide_followers_list = voter_guide_followers_list.filter(one_voter_guide => {
          if (one_voter_guide.organization_we_vote_id !== this.state.voter.linked_organization_we_vote_id) {
            return one_voter_guide;
          } else {
            return null;
          }
        });
      }
    } else {
      voter_guide_followers_list = this.state.voter_guide_followers_list_filtered_by_search;
    }
    let show_search_when_more_than_this_number = 3;

    return <div className="opinions-followed__container">
      {/* Since VoterGuidePositions, VoterGuideFollowing, and VoterGuideFollowers are in tabs the title seems to use the Helmet values from the last tab */}
      <Helmet title={this.state.organization.organization_name + " - We Vote"} />
      <div className="card">
        <ul className="card-child__list-group">
          { voter_guide_followers_list && voter_guide_followers_list.length > 0 ?
            <span>
              { !this.state.search_filter ?
                <span>
                  {this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id ?
                    <h4 className="card__additional-heading">Your Listeners</h4> :
                    <h4 className="card__additional-heading">Listeners of {this.state.organization.organization_name}</h4>
                  }
                </span> :
                <span>
                  { voter_guide_followers_list.length === 0 ?
                    <h4 className="card__additional-heading">"{this.state.search_term}" not found</h4> :
                    null
                  }
                </span>
              }
              { voter_guide_followers_list && voter_guide_followers_list.length > show_search_when_more_than_this_number ?
                <input type="text"
                     className="form-control"
                     name="search_followers_voter_guides_text"
                     placeholder="Search these listeners"
                     onChange={this.searchFollowers.bind(this)} /> : null
              }
              <span>
                  <GuideList organizationsToFollow={voter_guide_followers_list}
                             hide_ignore_button
                             instantRefreshOn />
              </span>
            </span> :
            <span>
              {this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id ?
                <h4 className="card__additional-heading">No listeners can be found.</h4> :
                <h4 className="card__additional-heading">No listeners can be found for {this.state.organization.organization_name}.</h4>
              }
            </span>
          }
        </ul>
      </div>
    </div>;
  }
}
