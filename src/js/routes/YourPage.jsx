import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import GuidePositionListForVoter from "./Guide/GuidePositionListForVoter";
import LoadingWheel from "../components/LoadingWheel";
import OrganizationActions from "../actions/OrganizationActions";
import TwitterHandleBox from "../components/Twitter/TwitterHandleBox";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";

// This file is only for use with people who aren't signed in
export default class YourPage extends Component {
  static propTypes = {
    params: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {voter: VoterStore.voter()};
  }

  componentWillMount () {
    const { voter } = this.state;

    let voter_has_twitter_handle = voter.twitter_screen_name ? true : false;
    if (voter_has_twitter_handle) {
      browserHistory.push("/" + voter.twitter_screen_name);
    }

    let voter_has_public_page = voter.linked_organization_we_vote_id ? true : false;
    if (voter_has_public_page) {
      browserHistory.push("/voterguide/" + voter.linked_organization_we_vote_id);
    }
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));

    let show_only_this_election = true;
    let show_all_other_elections = false;
    VoterActions.positionListForVoter(show_only_this_election, show_all_other_elections);
    show_only_this_election = false;
    show_all_other_elections = true;
    VoterActions.positionListForVoter(show_only_this_election, show_all_other_elections);
  }

  componentWillUpdate () {
    const { voter } = this.state;

    let voter_has_twitter_handle = voter.twitter_screen_name ? true : false;
    if (voter_has_twitter_handle) {
      browserHistory.push("/" + voter.twitter_screen_name);
    }

    let voter_has_public_page = voter.linked_organization_we_vote_id ? true : false;
    if (voter_has_public_page) {
      browserHistory.push("/voterguide/" + voter.linked_organization_we_vote_id);
    }
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.voter() });
  }

  render () {
    if (this.state.voter === undefined){
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    }

    const { voter } = this.state;

    var signed_in_facebook = voter === undefined ? false : voter.signed_in_facebook;
    if (signed_in_facebook) {
      let voter_not_linked_to_organization = !voter.linked_organization_we_vote_id;
      if (voter_not_linked_to_organization) {
        let organization_name = voter.first_name + " " + voter.last_name;
        OrganizationActions.saveFromFacebook(voter.facebook_id, voter.facebook_email, voter.facebook_profile_image_url_https, organization_name);
      }
    }

    return <div>
      <div className="container-fluid well u-gutter-top--small fluff-full1">
        <h4 className="text-center">
          Enter your Twitter handle to create a public voter guide.
        </h4>
        <div>
          <TwitterHandleBox {...this.props} />
        </div>
      </div>
      <GuidePositionListForVoter voter={this.state.voter} />
    </div>;
  }
}
