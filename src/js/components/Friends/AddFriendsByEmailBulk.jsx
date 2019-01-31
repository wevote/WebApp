import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../LoadingWheel";
import { renderLog } from "../../utils/logging";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import VoterStore from "../../stores/VoterStore";

// this is currently not called by the interface
export default class AddFriendsByEmailBulk extends Component {
  static senderEmailAddressVerified () {
    return true;
  }

  constructor (props) {
    super(props);
    this.state = {
      addFriendsMessage: "Please join me in preparing for the upcoming election.",
      emailAddresses: "",
      emailAddressesError: false,
      senderEmailAddress: "",
      senderEmailAddressError: false,
      redirectURLUponSave: "/friends/sign_in", // TODO DALE Remove this?
      loading: false,
      onEnterEmailAddressStep: true,
      onCollectEmailStep: false,
      onFriendInvitationSentStep: false,
      voter: {},
    };
  }

  componentDidMount () {
    this.setState({ voter: VoterStore.getVoter() });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange);
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange);
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onKeyDown = (event) => {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.AddFriendsByEmailStepsManager(event).bind(scope);
    }
  }

  onFriendStoreChange = () => {
    const addFriendsByEmailStep = FriendStore.switchToAddFriendsByEmailStep();
    console.log("AddFriendsByEmail, onFriendStoreChange, addFriendsByEmailStep:", addFriendsByEmailStep);
    if (addFriendsByEmailStep === "on_collect_email_step") {
      // Switch to "onCollectEmailStep"
      this.setState({
        loading: false,
        onEnterEmailAddressStep: false,
        onCollectEmailStep: true,
        onFriendInvitationSentStep: false,
      });
      // FriendStore.clearErrorMessageToShowVoter()
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  onVoterStoreChange = () => {
    this.setState({ voter: VoterStore.getVoter(), loading: false });
  }

  AddFriendsByEmailStepsManager = (event) => {
    // This function is called when the form is submitted
    console.log("AddFriendsByEmailStepsManager");
    let errorMessage = "";

    if (this.state.onEnterEmailAddressStep) {
      // Validate friends' email addresses
      let emailAddressesError = false;
      if (!this.state.emailAddresses) {
        emailAddressesError = true;
        errorMessage += "Please enter at least one email address.";
      }

      if (emailAddressesError) {
        console.log("AddFriendsByEmailStepsManager, emailAddressesError");
        this.setState({
          loading: false,
          emailAddressesError: true,
          errorMessage,
        });
      } else if (!this.hasValidEmail()) {
        console.log("AddFriendsByEmailStepsManager, NOT hasValidEmail");
        this.setState({
          loading: false,
          onEnterEmailAddressStep: false,
          onCollectEmailStep: true,
        });
      } else {
        console.log("AddFriendsByEmailStepsManager, calling friendInvitationByEmailSend");
        this.friendInvitationByEmailSend(event);
      }
    } else if (this.state.onCollectEmailStep) {
      // Validate sender's email addresses
      let senderEmailAddressError = false;
      if (!this.state.emailAddresses) {
        senderEmailAddressError = true;
        errorMessage += "Please enter a valid email address for yourself. ";
      } else if (!this.senderEmailAddressVerified()) {
        senderEmailAddressError = true;
        errorMessage += "This is not a valid email address. ";
      }

      if (senderEmailAddressError) {
        this.setState({
          loading: false,
          senderEmailAddressError: true,
          errorMessage,
        });
      } else {
        console.log("AddFriendsByEmailStepsManager, calling friendInvitationByEmailSend");
        this.friendInvitationByEmailSend(event);
      }
    }
  }

  cacheEmailAddresses = (e) => {
    this.setState({
      emailAddresses: e.target.value,
      onFriendInvitationSentStep: false,
    });
  }

  cacheSenderEmailAddress = (e) => {
    this.setState({
      senderEmailAddress: e.target.value,
    });
  }

  cacheAddFriendsByEmailMessage = (e) => {
    this.setState({
      addFriendsMessage: e.target.value,
    });
  }

  friendInvitationByEmailSend (e) {
    e.preventDefault();
    FriendActions.friendInvitationByEmailSend("", "", "", this.state.emailAddresses, this.state.addFriendsMessage, this.state.senderEmailAddress);
    this.setState({
      loading: true,
      emailAddresses: "",
      emailAddressesError: false,
      senderEmailAddress: "",
      onEnterEmailAddressStep: true,
      onCollectEmailStep: false,
      onFriendInvitationSentStep: true,
    });
  }

  _ballotLoaded () {
    // TODO DALE Remove this?
    historyPush(this.state.redirectURLUponSave);
  }

  hasValidEmail () {
    const { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
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
        {this.state.onFriendInvitationSentStep ? (
          <div className="alert alert-success">
          Invitations sent. Is there anyone else you&apos;d like to invite?
          </div>
        ) : null
        }
        {this.state.emailAddressesError || this.state.senderEmailAddressError ? (
          <div className="alert alert-danger">
            {this.state.errorMessage}
          </div>
        ) : null
        }
        {this.state.onEnterEmailAddressStep ? (
          <div>
            <form onSubmit={this.AddFriendsByEmailStepsManager} className="u-stack--md">
              <input
                type="text"
                name="email_address"
                className="form-control"
                onChange={this.cacheEmailAddresses}
                placeholder="Enter email addresses here, separated by commas"
              />
              {this.state.emailAddresses ? (
                <span>
                  <label htmlFor="last-name">
                    Include a Message
                    <span className="small">(Optional)</span>
                  </label>
                  <br />
                  <input
                    type="text"
                    name="addFriendsMessage"
                    className="form-control"
                    onChange={this.cacheAddFriendsByEmailMessage}
                    placeholder="Please join me in preparing for the upcoming election."
                  />
                </span>
              ) : null
              }
            </form>
            <div className="u-stack--md">
              <span style={floatRight}>
                <Button
                  tabIndex="0"
                  onKeyDown={this.onKeyDown}
                  onClick={this.AddFriendsByEmailStepsManager}
                  variant="primary"
                  disabled={!this.state.emailAddresses}
                >
                  { this.hasValidEmail() ?
                    <span>Send</span> :
                    <span>Next</span>
                }
                </Button>
              </span>
              <span>
                These friends will see what you support, oppose, and which opinions you listen to.
                We will never sell your email.
              </span>
            </div>
          </div>
        ) : null
        }

        {this.state.onCollectEmailStep ? (
          <div>
            <form onSubmit={this.AddFriendsByEmailStepsManager} className="u-stack--md">
              <input
                type="text"
                name="senderEmailAddress"
                className="form-control"
                onChange={this.cacheSenderEmailAddress}
                placeholder="Enter your email address"
              />
            </form>

            <div>
              <span style={floatRight}>
                <Button
                  tabIndex="0"
                  onKeyDown={this.onKeyDown}
                  onClick={this.AddFriendsByEmailStepsManager}
                  variant="primary"
                  disabled={!this.state.senderEmailAddress}
                >
                  <span>Send</span>
                </Button>
              </span>
              <p>In order to send your message, you will need to verify your email address. We will never sell your email.</p>
            </div>
          </div>
        ) : null
        }
      </div>
    );
  }
}
