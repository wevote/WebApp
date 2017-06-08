import React, {Component, PropTypes } from "react";
import Helmet from "react-helmet";
import GuideStore from "../stores/GuideStore";
import GuideActions from "../actions/GuideActions";
import GuideList from "../components/VoterGuide/GuideList";
import LoadingWheel from "../components/LoadingWheel";
import VoterStore from "../stores/VoterStore";
var _ = require("lodash");

/* VISUAL DESIGN HERE: https://invis.io/8F53FDX9G */

export default class VoterGuidesFollowers extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      voter_guide_followers_list: [],
      organization_we_vote_id: this.props.organization.organization_we_vote_id,
      organization_name: this.props.organization.organization_name,
      search_filter: false,
      search_term: "",
      voter_guide_followers_list_filtered_by_search: [],
    };
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    GuideActions.voterGuideFollowersRetrieve(this.state.organization_we_vote_id);
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
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
    var list = GuideStore.followersList();

    if (list !== undefined && list.length > 0){
      this.setState({ voter_guide_followers_list: GuideStore.followersList() });
    }
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
    if (!this.state.voter) {
      return <div>{LoadingWheel}</div>;
    }

    var voter_guide_followers_list = [];
    if (!this.state.search_filter) {
      voter_guide_followers_list = this.state.voter_guide_followers_list;
    } else {
      voter_guide_followers_list = this.state.voter_guide_followers_list_filtered_by_search;
    }

    return <div className="opinions-followed__container">
      <Helmet title="Followers of Your Organization - We Vote" />
      { this.state.voter_guide_followers_list && this.state.voter_guide_followers_list.length > 0 ?
        <input type="text"
             className="form-control"
             name="search_followers_voter_guides_text"
             placeholder="Search for followers."
             onChange={this.searchFollowers.bind(this)} /> : null
      }
      <div className="card">
        <ul className="card-child__list-group">
          { this.state.voter_guide_followers_list && this.state.voter_guide_followers_list.length > 0 ?
            <span>
              { !this.state.search_filter ?
                <span>
                  {this.state.voter.linked_organization_we_vote_id === this.state.organization_we_vote_id ?
                    <h4 className="card__additional-heading">Your Followers:</h4> :
                    <h4 className="card__additional-heading">Followers of {this.state.organization_name}:</h4>
                  }
                </span> :
                <span>
                  { voter_guide_followers_list.length === 0 ?
                    <h4 className="card__additional-heading">"{this.state.search_term}" not found</h4> :
                    null
                  }
                </span>
              }
              <span>
                  <GuideList organizationsToFollow={voter_guide_followers_list} instantRefreshOn />
              </span>
            </span> :
            <span>
              {this.state.voter.linked_organization_we_vote_id === this.state.organization_we_vote_id ?
                <h4 className="card__additional-heading">No one is following you yet.</h4> :
                <h4 className="card__additional-heading">No one is following {this.state.organization_name} yet.</h4>
              }
            </span>
          }
        </ul>
      </div>
    </div>;
  }
}
