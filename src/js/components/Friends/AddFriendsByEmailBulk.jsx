import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../LoadingWheel";
import { renderLog } from "../../utils/logging";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import VoterStore from "../../stores/VoterStore";

export default class AddFriendsByEmail extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      add_friends_message: "Please join me in preparing for the upcoming election.",
      email_addresses: "",
      email_addresses_error: false,
      sender_email_address: "",
      sender_email_address_error: false,
      redirect_url_upon_save: "/friends/sign_in",  // TODO DALE Remove this?
      loading: false,
      on_enter_email_addresses_step: true,
      on_collect_email_step: false,
      on_friend_invitations_sent_step: false,
      voter: {},
    };
  }

  componentDidMount () {
    this.setState({ voter: VoterStore.getVoter() });
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onFriendStoreChange () {
    let add_friends_by_email_step = FriendStore.switchToAddFriendsByEmailStep();
    let error_message_to_show_voter = FriendStore.getErrorMessageToShowVoter();
    console.log("AddFriendsByEmail, _onFriendStoreChange, add_friends_by_email_step:", add_friends_by_email_step);
    if (add_friends_by_email_step === "on_collect_email_step") {
      // Switch to "on_collect_email_step"
      this.setState({
        loading: false,
        on_enter_email_addresses_step: false,
        on_collect_email_step: true,
        on_friend_invitations_sent_step: false,
        error_message_to_show_voter: error_message_to_show_voter
      });
      // FriendStore.clearErrorMessageToShowVoter()
    } else {
      this.setState({
        loading: false,
        error_message_to_show_voter: ""
      });

    }
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter(), loading: false });
  }

  _ballotLoaded (){
    // TODO DALE Remove this?
    historyPush(this.state.redirect_url_upon_save);
  }

  cacheEmailAddresses (e) {
    this.setState({
      email_addresses: e.target.value,
      on_friend_invitations_sent_step: false
    });
  }

  cacheSenderEmailAddress (e) {
    this.setState({
      sender_email_address: e.target.value
    });
  }

  cacheAddFriendsByEmailMessage (e) {
    this.setState({
      add_friends_message: e.target.value
    });
  }

  friendInvitationByEmailSend (e) {
    e.preventDefault();
    FriendActions.friendInvitationByEmailSend("", "", "", this.state.email_addresses, this.state.add_friends_message, this.state.sender_email_address);
    this.setState({
      loading: true,
      email_addresses: "",
      email_addresses_error: false,
      sender_email_address: "",
      on_enter_email_addresses_step: true,
      on_collect_email_step: false,
      on_friend_invitations_sent_step: true,
    });
  }

  hasValidEmail () {
    let { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }

  senderEmailAddressVerified () {
    return true;
  }

  onKeyDown (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    let scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.AddFriendsByEmailStepsManager(event).bind(scope);
    }
  }

  AddFriendsByEmailStepsManager (event) {
    // This function is called when the form is submitted
    console.log("AddFriendsByEmailStepsManager");
    let error_message = "";

    if (this.state.on_enter_email_addresses_step) {
      // Validate friends' email addresses
      let email_addresses_error = false;
      if (!this.state.email_addresses) {
        email_addresses_error = true;
        error_message += "Please enter at least one email address.";
      }

      if (email_addresses_error) {
        console.log("AddFriendsByEmailStepsManager, email_addresses_error");
        this.setState({
          loading: false,
          email_addresses_error: true,
          error_message: error_message
        });
      } else if (!this.hasValidEmail()) {
        console.log("AddFriendsByEmailStepsManager, NOT hasValidEmail");
        this.setState({
          loading: false,
          on_enter_email_addresses_step: false,
          on_collect_email_step: true,
        });
      } else {
        console.log("AddFriendsByEmailStepsManager, calling friendInvitationByEmailSend");
        this.friendInvitationByEmailSend(event);
      }
    } else if (this.state.on_collect_email_step) {
      // Validate sender's email addresses
      let sender_email_address_error = false;
      if (!this.state.email_addresses) {
        sender_email_address_error = true;
        error_message += "Please enter a valid email address for yourself. ";
      } else if (!this.senderEmailAddressVerified()) {
        sender_email_address_error = true;
        error_message += "This is not a valid email address. ";
      }

      if (sender_email_address_error) {
        this.setState({
          loading: false,
          sender_email_address_error: true,
          error_message: error_message
        });
      } else {
        console.log("AddFriendsByEmailStepsManager, calling friendInvitationByEmailSend");
        this.friendInvitationByEmailSend(event);
      }
    }
  }

	render () {
    renderLog(__filename);
    var { loading } = this.state;
    if (loading){
      return LoadingWheel;
    }
    var floatRight = {
        float: "right"
    };

		return <div>
      {this.state.on_friend_invitations_sent_step ?
        <div className="alert alert-success">
          Invitations sent. Is there anyone else you'd like to invite?
        </div> :
        null }
      {this.state.email_addresses_error || this.state.sender_email_address_error ?
        <div className="alert alert-danger">
          {this.state.error_message}
        </div> :
        null }
      {this.state.on_enter_email_addresses_step ?
        <div>
          <form onSubmit={this.AddFriendsByEmailStepsManager.bind(this)} className="u-stack--md">
            <input type="text" name="email_address"
                   className="form-control"
                   onChange={this.cacheEmailAddresses.bind(this)}
                   placeholder="Enter email addresses here, separated by commas" />
            {this.state.email_addresses ?
              <span>
                <label htmlFor="last-name">Include a Message <span className="small">(Optional)</span></label><br />
                <input type="text" name="add_friends_message"
                       className="form-control"
                       onChange={this.cacheAddFriendsByEmailMessage.bind(this)}
                       placeholder="Please join me in preparing for the upcoming election." />
              </span> :
              null }
          </form>
          <div className="u-stack--md">
            <span style={floatRight}>
              <Button
                tabIndex="0"
                onKeyDown={this.onKeyDown.bind(this)}
                onClick={this.AddFriendsByEmailStepsManager.bind(this)}
                variant="primary"
                disabled={!this.state.email_addresses}
              >
                { this.hasValidEmail() ?
                  <span>Send</span> :
                  <span>Next</span>
                }
              </Button>
            </span>
            <span>These friends will see what you support, oppose, and which opinions you listen to.
              We will never sell your email.</span>
          </div>
        </div> :
        null }

      {this.state.on_collect_email_step ?
        <div>
          <form onSubmit={this.AddFriendsByEmailStepsManager.bind(this)} className="u-stack--md">
            <input type="text" name="sender_email_address"
                   className="form-control"
                   onChange={this.cacheSenderEmailAddress.bind(this)}
                   placeholder="Enter your email address" />
          </form>

          <div>
              <span style={floatRight}>
                <Button
                  tabIndex="0"
                  onKeyDown={this.onKeyDown.bind(this)}
                  onClick={this.AddFriendsByEmailStepsManager.bind(this)}
                  variant="primary"
                  disabled={!this.state.sender_email_address} >
                  <span>Send</span>
                </Button>
              </span>
              <p>In order to send your message, you will need to verify your email address. We will never sell your email.</p>
          </div>
        </div> :
        null }
		</div>;
	}
}
