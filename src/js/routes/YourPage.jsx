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

    const voterHasTwitterHandle = !!voter.twitter_screen_name;
    if (voterHasTwitterHandle) {
      historyPush(`/${voter.twitter_screen_name}`);
    }

    const voterHasPublicPage = !!voter.linked_organization_we_vote_id;
    if (voterHasPublicPage) {
      historyPush(`/voterguide/${voter.linked_organization_we_vote_id}`);
    }
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));

    let showOnlyThisElection = true;
    let showAllOtherElections = false;
    VoterActions.positionListForVoter(showOnlyThisElection, showAllOtherElections);
    showOnlyThisElection = false;
    showAllOtherElections = true;
    VoterActions.positionListForVoter(showOnlyThisElection, showAllOtherElections);
  }

  componentWillUpdate () {
    const { voter } = this.state;

    const voterHasTwitterHandle = !!voter.twitter_screen_name;
    if (voterHasTwitterHandle) {
      historyPush(`/${voter.twitter_screen_name}`);
    }

    const voterHasPublicPage = !!voter.linked_organization_we_vote_id;
    if (voterHasPublicPage) {
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

    const signedInFacebook = voter === undefined ? false : voter.signed_in_facebook;
    if (signedInFacebook) {
      const voterNotLinkedToOrganization = !voter.linked_organization_we_vote_id;
      if (voterNotLinkedToOrganization) {
        let organizationName = "";
        const firstNameValueExists = voter.first_name && voter.first_name !== "null" && voter.first_name.length;
        const lastNameValueExists = voter.last_name && voter.last_name !== "null" && voter.last_name.length;
        if (firstNameValueExists) {
          organizationName += voter.first_name;
        }
        if (firstNameValueExists && lastNameValueExists) {
          organizationName += " ";
        }
        if (lastNameValueExists) {
          organizationName += voter.last_name;
        }
        OrganizationActions.saveFromFacebook(voter.facebook_id, voter.facebook_email, voter.facebook_profile_image_url_https, organizationName);
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
