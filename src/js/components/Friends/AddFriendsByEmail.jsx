import React, { Component, PropTypes } from "react";
import { Button, ButtonToolbar, Input } from "react-bootstrap";
import { browserHistory } from "react-router";
import LoadingWheel from "../LoadingWheel";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import VoterStore from "../../stores/VoterStore";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/89479679 */
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
        redirect_url_upon_save: "/friends/sign_in",
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
    this.setState({ loading: false });
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter(), loading: false });
  }

  _ballotLoaded (){
    browserHistory.push(this.state.redirect_url_upon_save);
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
    FriendActions.friendInvitationByEmailSend(this.state.email_addresses, this.state.add_friends_message, this.state.sender_email_address);
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
        error_message += "This is not a valid email address. "
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
          <form onSubmit={this.AddFriendsByEmailStepsManager.bind(this)}>
            STILL A WORK IN PROGRESS - FOR TESTING ONLY
            <Input type="text" addonBefore="@" name="email_address"
                   className="form-control"
                   onChange={this.cacheEmailAddresses.bind(this)}
                   placeholder="Enter email addresses here, separated by commas" />
            {this.state.email_addresses ?
              <span>
                <label htmlFor="last-name">Include a Message <span className="small">(Optional)</span></label><br />
                <Input type="text" name="add_friends_message"
                       className="form-control"
                       onChange={this.cacheAddFriendsByEmailMessage.bind(this)}
                       defaultValue="Please join me in preparing for the upcoming election." />
              </span> :
              null }
          </form>

          <div className="u-gutter__top--small">
            <ButtonToolbar bsClass="btn-toolbar">
              <span style={floatRight}>
                <Button
                  onClick={this.AddFriendsByEmailStepsManager.bind(this)}
                  bsStyle="primary"
                  disabled={!this.state.email_addresses}
                >
                  { this.hasValidEmail() ?
                    <span>Send &gt;</span> :
                    <span>Next &gt;</span>
                  }
                </Button>
              </span>
              <span>These friends will see what you support, oppose, and which opinions you follow.
                We will never sell your email.</span>
            </ButtonToolbar>
          </div>
        </div> :
        null }

      {this.state.on_collect_email_step ?
        <div>
          <form onSubmit={this.AddFriendsByEmailStepsManager.bind(this)}>
            <Input type="text" addonBefore="@" name="sender_email_address"
                   className="form-control"
                   onChange={this.cacheSenderEmailAddress.bind(this)}
                   placeholder="Enter your email address" />
          </form>

          <div className="u-gutter__top--small">
            <ButtonToolbar bsClass="btn-toolbar">
              <span style={floatRight}>
                <Button
                  onClick={this.AddFriendsByEmailStepsManager.bind(this)}
                  bsStyle="primary"
                  disabled={!this.state.sender_email_address}
                >
                  <span>Send &gt;</span>
                </Button>
              </span>
              <span>In order to send your message, you will need to verify your email address.
                We will never sell your email.</span>
            </ButtonToolbar>
          </div>
        </div> :
        null }
		</div>;
	}
}
