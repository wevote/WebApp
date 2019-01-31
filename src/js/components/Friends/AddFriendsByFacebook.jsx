import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { historyPush } from "../../utils/cordovaUtils";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import LoadingWheel from "../LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/89479679 */
export default class AddFriendsByFacebook extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      add_friends_message: "Please join me in preparing for the upcoming election.",
      email_addresses: "",
      redirect_url_upon_save: "/friends/sign_in", // TODO DALE Remove this?
      loading: false,
      on_enter_email_addresses_step: true,
      on_request_email_step: false,
      on_friend_invitations_sent_step: false,
      voter: {},
    };
  }

  componentDidMount () {
    this.setState({ voter: VoterStore.getVoter() });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({ loading: false });
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter(), loading: false });
  }

  _ballotLoaded () {
    // TODO DALE Remove this?
    historyPush(this.state.redirect_url_upon_save);
  }

  cacheEmailAddresses (e) {
    this.setState({
      email_addresses: e.target.value,
      on_friend_invitations_sent_step: false,
    });
  }

  cacheAddFriendsByFacebookMessage (e) {
    this.setState({
      add_friends_message: e.target.value,
    });
  }

  friendInvitationByEmailSend (e) {
    e.preventDefault();
    FriendActions.friendInvitationByEmailSend("", "", "", this.state.email_addresses, this.state.add_friends_message);
    this.setState({
      loading: true,
      email_addresses: "",
      on_enter_email_addresses_step: true,
      on_request_email_step: false,
      on_friend_invitations_sent_step: true,
    });
  }

  hasValidEmail () {
    const { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }

  onKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.AddFriendsByFacebookStepsManager(event).bind(scope);
    }
  }

  AddFriendsByFacebookStepsManager (event) {
    // This function is called when the form is submitted
    console.log("AddFriendsByFacebookStepsManager");

    // Validate email_addresses
    let email_addresses_error = false;
    let error_message = "";
    if (!this.state.email_addresses) {
      email_addresses_error = true;
      error_message += "Please enter email address or Twitter handle. ";
    }

    if (email_addresses_error) {
      console.log("AddFriendsByFacebookStepsManager, email_addresses_error");
      this.setState({
        loading: false,
        email_addresses_error: true,
        error_message,
      });
    } else if (!this.hasValidEmail()) {
      console.log("AddFriendsByFacebookStepsManager, NOT hasValidEmail");
      this.setState({
        loading: false,
        on_request_email_step: true,
      });
    } else {
      console.log("AddFriendsByFacebookStepsManager, calling friendInvitationByEmailSend");
      this.friendInvitationByEmailSend(event);
    }
  }

  render () {
    renderLog(__filename);
    const { loading } = this.state;
    if (loading) {
      return LoadingWheel;
    }
    const floatRight = {
      float: "right",
    };

    return (
      <div>
        {this.state.on_friend_invitations_sent_step ? (
          <div className="alert alert-success">
          Invitations sent. Is there anyone else you&apos;d like to invite?
          </div>
        ) : null
        }

        {this.state.on_enter_email_addresses_step ? (
          <div>
            <form onSubmit={this.AddFriendsByFacebookStepsManager.bind(this)} className="u-stack--md">
              <div>
            ADD_FRIENDS_BY_FACEBOOK - NOT FINISHED YET
              </div>
            </form>

            <div>
              <span style={floatRight}>
                <Button
                  tabIndex="0"
                  onKeyDown={this.onKeyDown.bind(this)}
                  onClick={this.AddFriendsByFacebookStepsManager.bind(this)}
                  variant="primary"
                  disabled={!this.state.email_addresses}
                >
                  { this.hasValidEmail() ?
                    <span>Send &gt;</span> :
                    <span>Next &gt;</span>
                  }
                </Button>
              </span>
              <p>These friends will see what you support, oppose, and which opinions you listen to.</p>
            </div>
          </div>
        ) : null
        }

        {this.state.on_request_email_step ? (
          <div>
          ON REQUEST EMAIL STEP
          </div>
        ) : null
        }
      </div>
    );
  }
}
