import React, { Component } from "react";
import PropTypes from "prop-types";
import GuidePositionListForVoter from "./VoterGuide/GuidePositionListForVoter";
import { historyPush } from "../utils/cordovaUtils";
import LoadingWheel from "../components/LoadingWheel";
import { renderLog } from "../utils/logging";
import OrganizationActions from "../actions/OrganizationActions";
import TwitterHandleBox from "../components/Twitter/TwitterHandleBox";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";

// This file is only for use with people who aren't signed in
export default class YourPage extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = { voter: VoterStore.getVoter() };
  }

  componentWillMount () {
    const { voter } = this.state;

    const voter_has_twitter_handle = !!voter.twitter_screen_name;
    if (voter_has_twitter_handle) {
      historyPush(`/${voter.twitter_screen_name}`);
    }

    const voter_has_public_page = !!voter.linked_organization_we_vote_id;
    if (voter_has_public_page) {
      historyPush(`/voterguide/${voter.linked_organization_we_vote_id}`);
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

    const voter_has_twitter_handle = !!voter.twitter_screen_name;
    if (voter_has_twitter_handle) {
      historyPush(`/${voter.twitter_screen_name}`);
    }

    const voter_has_public_page = !!voter.linked_organization_we_vote_id;
    if (voter_has_public_page) {
      historyPush(`/voterguide/${voter.linked_organization_we_vote_id}`);
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog(__filename);
    if (this.state.voter === undefined) {
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    }

    const { voter } = this.state;

    const signed_in_facebook = voter === undefined ? false : voter.signed_in_facebook;
    if (signed_in_facebook) {
      const voter_not_linked_to_organization = !voter.linked_organization_we_vote_id;
      if (voter_not_linked_to_organization) {
        let organization_name = "";
        const first_name_value_exists = voter.first_name && voter.first_name !== "null" && voter.first_name.length;
        const last_name_value_exists = voter.last_name && voter.last_name !== "null" && voter.last_name.length;
        if (first_name_value_exists) {
          organization_name += voter.first_name;
        }
        if (first_name_value_exists && last_name_value_exists) {
          organization_name += " ";
        }
        if (last_name_value_exists) {
          organization_name += voter.last_name;
        }
        OrganizationActions.saveFromFacebook(voter.facebook_id, voter.facebook_email, voter.facebook_profile_image_url_https, organization_name);
      }
    }

    return (
      <div>
        <div className="container-fluid well u-stack--md u-inset--md">
          <h1 className="h4">
            Enter your Twitter handle to create a public voter guide.
          </h1>
          <div>
            <TwitterHandleBox {...this.props} />
          </div>
        </div>
        { this.state.voter ?
          <GuidePositionListForVoter voter={this.state.voter} /> :
          null }
      </div>
    );
  }
}
