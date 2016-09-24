import React, { Component, PropTypes } from "react";
import { Button, ButtonToolbar, Input } from "react-bootstrap";
import { browserHistory } from "react-router";
import LoadingWheel from "../LoadingWheel";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/89479679 */
export default class AddFriends extends Component {
  static propTypes = {
  };

  constructor (props) {
      super(props);
      this.state = {
        add_friends_message: "Please join me in preparing for the upcoming election.",
        email_addresses: "",
        redirect_url_upon_save: "/friends/sign_in",
        loading: false,
        on_enter_email_addresses_step: true,
        on_request_email_step: false,
        on_friend_invitations_sent_step: false,
        voter: {}
      };
  }

  componentDidMount () {
    this.setState({ voter: VoterStore.getVoter() });
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
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

  cacheAddFriendsMessage (e) {
    this.setState({
      add_friends_message: e.target.value
    });
  }

  friendInvitationByEmailSend (e) {
    e.preventDefault();
    VoterActions.friendInvitationByEmailSend(this.state.email_addresses, this.state.add_friends_message);
    this.setState({
      loading: true,
      email_addresses: "",
      on_enter_email_addresses_step: true,
      on_request_email_step: false,
      on_friend_invitations_sent_step: true
    });
  }

  hasValidEmail () {
    let { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }

  addFriendsStepsManager (event) {
    // This function is called when the form is submitted
    console.log("addFriendsStepsManager");

    // Validate email_addresses
    let email_addresses_error = false;
    let error_message = "";
    if (!this.state.email_addresses) {
      email_addresses_error = true;
      error_message += "Please enter email address or Twitter handle. ";
    }

    if (email_addresses_error) {
      console.log("addFriendsStepsManager, email_addresses_error");
      this.setState({
        loading: false,
        email_addresses_error: true,
        error_message: error_message
      });
    } else if (!this.hasValidEmail()) {
      console.log("addFriendsStepsManager, NOT hasValidEmail");
      this.setState({
        loading: false,
        on_request_email_step: true,
      });
    } else {
      console.log("addFriendsStepsManager, calling friendInvitationByEmailSend");
      this.friendInvitationByEmailSend(event);
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
			<h4 className="text-left">Add Friends</h4>
      {this.state.on_friend_invitations_sent_step ?
        <div className="alert alert-success">
          Invitations sent. Is there anyone else you'd like to invite?
        </div> :
        null }

      {this.state.on_enter_email_addresses_step ?
        <div>
          <form onSubmit={this.addFriendsStepsManager.bind(this)}>
          <div>
            <Input type="text" addonBefore="@" name="email_address"
                   className="form-control"
                   onChange={this.cacheEmailAddresses.bind(this)}
                   placeholder="Enter email addresses here, separated by commas" />
            {this.state.email_addresses ?
              <span>
                <label htmlFor="last-name">Include a Message <span className="small">(Optional)</span></label><br />
                <Input type="text" name="add_friends_message"
                       className="form-control"
                       onChange={this.cacheAddFriendsMessage.bind(this)}
                       defaultValue="Please join me in preparing for the upcoming election." />
              </span> :
              null }
          </div>
          </form>

          <div className="u-gutter__top--small">
            <ButtonToolbar bsClass="btn-toolbar">
              <span style={floatRight}>
                <Button
                  onClick={this.addFriendsStepsManager.bind(this)}
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

      {this.state.on_request_email_step ?
        <div>
          ON REQUEST EMAIL STEP
        </div> :
        null }
		</div>;
	}
}
