import { Component } from "react";
import { historyPush } from "../../utils/cordovaUtils";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import FriendStore from "../../stores/FriendStore";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";


export default class FacebookLandingProcess extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this._onFacebookStoreChange();
    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
    this._onFriendStoreChange();
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  _onFacebookStoreChange () {
    console.log("_onFacebookStoreChange app_request_already_processed", FacebookStore.facebookAppRequestAlreadyProcessed());
    this.setState({
      app_request_already_processed: FacebookStore.facebookAppRequestAlreadyProcessed(),
    });
  }

  _onFriendStoreChange () {
    console.log("_onFriendStoreChange invitation_status", FriendStore.getInvitationFromFacebookStatus());
    this.setState({
      invitation_status: FriendStore.getInvitationFromFacebookStatus(),
      saving: false,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.facebookStoreListener.remove();
    this.friendStoreListener.remove();
  }

  readFacebookAppRequests () {
    FacebookActions.readFacebookAppRequests();
    this.setState({ saving: true });
  }

  render () {
    renderLog(__filename);

    if (this.state.app_request_already_processed) {
      historyPush({
        pathname: "/ballot",
      });
      return LoadingWheel;
    }

    if (!this.state.voter || this.state.saving) {
      return LoadingWheel;
    }

    console.log("Got voter", this.state.voter);
    if (!this.state.voter.signed_in_facebook) {
      console.log("Voter is not logged in through facebook");
      FacebookActions.login();
      return LoadingWheel;
    } else {
      console.log("Voter is signed in through facebook and app_already_processed:", this.state.app_request_already_processed);
      if (!this.state.app_request_already_processed &&
        (!this.state.invitation_status || !this.state.invitation_status.voter_device_id)) {
        // If facebook log in finished successfully then read all app requests
        console.log("Reading facebook app request and accepting the same");
        this.readFacebookAppRequests();
        return LoadingWheel;
      }
    }

    console.log("Invitation status:", this.state.invitation_status);
    // This process starts when we return from attempting friendInvitationByFacebookVerify
    if (!this.state.invitation_status.invitation_found) {
      historyPush({
        pathname: "/more/network/friends",
        state: {
          message: "Invitation not found. You may have already accepted this invitation. Invitation links may only be used once.",
          message_type: "warning",
        },
      });
      return LoadingWheel;
    }

    if (this.state.invitation_status.attempted_to_approve_own_invitation) {
      historyPush({
        pathname: "/more/network/friends",
        state: {
          message: "You are not allowed to approve your own invitation.",
          message_type: "danger",
        },
      });
      return LoadingWheel;
    }

    if (this.state.invitation_status.invitation_found) {
      FacebookActions.deleteFacebookAppRequest(this.state.invitation_status.facebook_request_id);
      historyPush({
        pathname: "/more/network/friends",
        state: {
          message: "You have accepted your friend's invitation. Visit your ballot to see what your friends are supporting or opposing.",
          message_type: "success",
        },
      });
      return LoadingWheel;
    }

    return LoadingWheel;
  }
}
