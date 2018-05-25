import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import VoterGuideStore from "../../stores/VoterGuideStore";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationTinyDisplay from "../VoterGuide/OrganizationTinyDisplay";
import { showToastError, showToastSuccess } from "../../utils/showToast";
import VoterStore from "../../stores/VoterStore";
import { historyPush } from "../../utils/cordovaUtils";

export default class FollowToggle extends Component {
  static propTypes = {
    classNameOverride: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    hide_stop_following_button: PropTypes.bool,
    office_we_vote_id: PropTypes.string,
    organization_for_display: PropTypes.object,
    opposesThisBallotItem: PropTypes.bool,
    supportsThisBallotItem: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      voter: {
        we_vote_id: "",
      }
    };

    this.followInstantly = this.followInstantly.bind(this);
    this.stopFollowingInstantly = this.stopFollowingInstantly.bind(this);
  }

  componentDidMount () {
    // console.log("componentDidMount, this.props: ", this.props);
    this.setState({
      is_following: OrganizationStore.isVoterFollowingThisOrganization(this.props.we_vote_id),
      organization: OrganizationStore.getOrganizationByWeVoteId(this.props.we_vote_id),
    });
    this._onVoterStoreChange();
    // We need the voterGuideStoreListener until we take the follow functions out of OrganizationActions and VoterGuideStore
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    // console.log("componentWillUnmount, this.props.we_vote_id: ", this.props.we_vote_id);
    this.voterGuideStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    // console.log("FollowToggle, onVoterGuideStoreChange, organization_we_vote_id: ", this.props.we_vote_id);
    this.setState({
      is_following: OrganizationStore.isVoterFollowingThisOrganization(this.props.we_vote_id),
      organization: OrganizationStore.getOrganizationByWeVoteId(this.props.we_vote_id),
    });
  }

  _onOrganizationStoreChange () {
    // console.log("FollowToggle, _onOrganizationStoreChange, organization_we_vote_id: ", this.props.we_vote_id);
    this.setState({
      is_following: OrganizationStore.isVoterFollowingThisOrganization(this.props.we_vote_id),
      organization: OrganizationStore.getOrganizationByWeVoteId(this.props.we_vote_id),
    });
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  startFollowingLocalState () {
    this.setState({ is_following: true });
  }

  stopFollowingLocalState () {
    this.setState({ is_following: false });
  }

  stopFollowingInstantly (stopFollowingFunc, currentBallotIdInUrl, urlWithoutHash, office_we_vote_id) {
      if (currentBallotIdInUrl && urlWithoutHash && urlWithoutHash) {
        if (currentBallotIdInUrl !== office_we_vote_id) {
          historyPush(this.props.urlWithoutHash + "#" + this.props.office_we_vote_id);
       }
      }
      let toast_message = "You'veIstopped listening to this organization's opinions.";
      // We use this.state.organization instead of this.props.organization_for_display on purpose - there is some weird behavior to be debugged
      if (this.state.organization && this.state.organization.organization_name) {
        let organization_name = this.state.organization.organization_name;
        toast_message = "You've stopped listening to " + organization_name + "'s opinions!";
      }
      stopFollowingFunc();
      showToastError(toast_message);
      this.stopFollowingLocalState();
  }

  followInstantly (followFunc, currentBallotIdInUrl, urlWithoutHash, office_we_vote_id) {
      if (currentBallotIdInUrl && urlWithoutHash && urlWithoutHash) {
        if (currentBallotIdInUrl !== office_we_vote_id) {
          historyPush(this.props.urlWithoutHash + "#" + this.props.office_we_vote_id);
       }
      }
      let toast_message = "Now listening to this organization's opinions!";
      // We use this.state.organization instead of this.props.organization_for_display on purpose - there is some weird behavior to be debugged
      if (this.state.organization && this.state.organization.organization_name) {
        let organization_name = this.state.organization.organization_name;
        toast_message = "Now listening to " + organization_name + "'s opinions!";
      }
      followFunc();
      showToastSuccess(toast_message);
      this.startFollowingLocalState();
  }

  render () {
    renderLog(__filename);
    if (!this.state) { return <div />; }
    let { we_vote_id, organization_for_display } = this.props;
    let classNameOverride = this.props.classNameOverride || "";
    let is_looking_at_self = this.state.voter.linked_organization_we_vote_id === we_vote_id;
    // You should not be able to follow yourself
    if (is_looking_at_self) { return <div />; }
    let { currentBallotIdInUrl, urlWithoutHash, office_we_vote_id } = this.props;
    const followFunc = OrganizationActions.organizationFollow.bind(this, we_vote_id);
    const stopFollowingFunc = OrganizationActions.organizationStopFollowing.bind(this, we_vote_id);
    // NOTE: We want to leave this as showing only if this.props.organization_for_display comes in
    if (organization_for_display) {
      return <span onClick={()=>this.followInstantly(followFunc, currentBallotIdInUrl, urlWithoutHash, office_we_vote_id)}>
        <OrganizationTinyDisplay {...organization_for_display}
                                 showPlaceholderImage
                                 toFollow
                                 showSupport={this.props.supportsThisBallotItem}
                                 showOppose={this.props.opposesThisBallotItem} />
      </span>;
    }

    return this.state.is_following ?
      <span className="hidden-print">
        { this.props.hide_stop_following_button ?
          null :
          <Button bsStyle="warning"
                  bsSize="small"
                  className={classNameOverride.length ? classNameOverride : "pull-right"}
                  onClick={()=>this.stopFollowingInstantly(stopFollowingFunc, currentBallotIdInUrl, urlWithoutHash, office_we_vote_id)}>
            <span>Listening</span>
          </Button>
        }
      </span> :
      <span className="hidden-print">
        <Button bsStyle="success"
                bsSize="small"
                className={classNameOverride.length ? classNameOverride : "pull-right"}
                onClick={()=>this.followInstantly(followFunc, currentBallotIdInUrl, urlWithoutHash, office_we_vote_id)}>
          <span>Listen</span>
        </Button>
      </span>;
  }
}
