import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { historyPush } from "../../utils/cordovaUtils";
import VoterGuideStore from "../../stores/VoterGuideStore";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationTinyDisplay from "../VoterGuide/OrganizationTinyDisplay";
import { showToastError, showToastSuccess } from "../../utils/showToast";
import VoterStore from "../../stores/VoterStore";

export default class FollowToggle extends Component {
  static propTypes = {
    classNameOverride: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    hide_stop_following_button: PropTypes.bool,
    ballotItemWeVoteId: PropTypes.string,
    organization_for_display: PropTypes.object,
    opposesThisBallotItem: PropTypes.bool,
    supportsThisBallotItem: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
    organizationWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      componentDidMountFinished: false,
      voter: {
        we_vote_id: "",
      },
    };

    this.followInstantly = this.followInstantly.bind(this);
    this.stopFollowingInstantly = this.stopFollowingInstantly.bind(this);
  }

  componentDidMount () {
    // console.log("componentDidMount, this.props: ", this.props);
    this.setState({
      componentDidMountFinished: true,
      is_following: OrganizationStore.isVoterFollowingThisOrganization(this.props.organizationWeVoteId),
      organization: OrganizationStore.getOrganizationByWeVoteId(this.props.organizationWeVoteId),
    });
    this.onVoterStoreChange();

    // We need the voterGuideStoreListener until we take the follow functions out of OrganizationActions and VoterGuideStore
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    // console.log("componentWillUnmount, this.props.organizationWeVoteId: ", this.props.organizationWeVoteId);
    this.voterGuideStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }

    if (this.state.is_following !== nextState.is_following) {
      // console.log("shouldComponentUpdate: this.state.showBallotIntroFollowIssues", this.state.showBallotIntroFollowIssues, ", nextState.showBallotIntroFollowIssues", nextState.showBallotIntroFollowIssues);
      return true;
    }
    return false;
  }

  onVoterGuideStoreChange () {
    // console.log("FollowToggle, onVoterGuideStoreChange, organization_we_vote_id: ", this.props.organizationWeVoteId);
    this.setState({
      is_following: OrganizationStore.isVoterFollowingThisOrganization(this.props.organizationWeVoteId),
      organization: OrganizationStore.getOrganizationByWeVoteId(this.props.organizationWeVoteId),
    });
  }

  onOrganizationStoreChange () {
    // console.log("FollowToggle, onOrganizationStoreChange, organization_we_vote_id: ", this.props.organizationWeVoteId);
    this.setState({
      is_following: OrganizationStore.isVoterFollowingThisOrganization(this.props.organizationWeVoteId),
      organization: OrganizationStore.getOrganizationByWeVoteId(this.props.organizationWeVoteId),
    });
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  startFollowingLocalState () {
    this.setState({ is_following: true });
  }

  stopFollowingLocalState () {
    this.setState({ is_following: false });
  }

  stopFollowingInstantly (stopFollowingFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId) {
    if (currentBallotIdInUrl && urlWithoutHash && urlWithoutHash) {
      if (currentBallotIdInUrl !== ballotItemWeVoteId) {
        historyPush(`${this.props.urlWithoutHash}#${this.props.ballotItemWeVoteId}`);
      }
    }

    let toastMessage = "You've stopped listening to this organization's opinions.";

    // We use this.state.organization instead of this.props.organization_for_display on purpose - there is some weird behavior to be debugged
    if (this.state.organization && this.state.organization.organization_name) {
      const organizationName = this.state.organization.organization_name;
      toastMessage = `You've stopped listening to ${organizationName}'s opinions!`;
    }

    stopFollowingFunc();
    showToastError(toastMessage);
    this.stopFollowingLocalState();
  }

  followInstantly (followFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId) {
    if (currentBallotIdInUrl && urlWithoutHash && urlWithoutHash) {
      if (currentBallotIdInUrl !== ballotItemWeVoteId) {
        historyPush(`${this.props.urlWithoutHash}#${this.props.ballotItemWeVoteId}`);
      }
    }

    let toastMessage = "Now listening to this organization's opinions!";

    // We use this.state.organization instead of this.props.organization_for_display on purpose - there is some weird behavior to be debugged
    if (this.state.organization && this.state.organization.organization_name) {
      const organizationName = this.state.organization.organization_name;
      toastMessage = `Now listening to ${organizationName}'s opinions!`;
    }

    followFunc();
    showToastSuccess(toastMessage);
    this.startFollowingLocalState();
  }

  render () {
    // console.log("FollowToggle render");
    renderLog(__filename);
    if (!this.state) { return <div />; }

    const { organizationWeVoteId: weVoteId, organization_for_display: organizationForDisplay } = this.props;
    // let classNameOverride = this.props.classNameOverride || "";
    const isLookingAtSelf = this.state.voter.linked_organization_we_vote_id === weVoteId;

    // You should not be able to follow yourself
    if (isLookingAtSelf) { return <div />; }

    const { currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId } = this.props;
    const followFunc = OrganizationActions.organizationFollow.bind(this, weVoteId);
    const stopFollowingFunc = OrganizationActions.organizationStopFollowing.bind(this, weVoteId);

    // NOTE: We want to leave this as showing only if this.props.organization_for_display comes in
    if (organizationForDisplay) {
      return (
        <span onClick={() => this.followInstantly(followFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}>
          <OrganizationTinyDisplay
            {...organizationForDisplay}
            showPlaceholderImage
            toFollow
            showSupport={this.props.supportsThisBallotItem}
            showOppose={this.props.opposesThisBallotItem}
          />
        </span>
      );
    }

    return this.state.is_following ? (
      <span className="d-print-none">
        { this.props.hide_stop_following_button ?
          null : (
            <Button
              variant="warning"
              size="sm"
              onClick={() => this.stopFollowingInstantly(stopFollowingFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
            >
              Listening
            </Button>
          )}
      </span>
    ) : (
      <span className="d-print-none">
        <Button
          variant="success"
          size="sm"
          onClick={() => this.followInstantly(followFunc, currentBallotIdInUrl, urlWithoutHash, ballotItemWeVoteId)}
        >
          Listen
        </Button>
      </span>
    );
  }
}
