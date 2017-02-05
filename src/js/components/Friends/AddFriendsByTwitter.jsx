import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { browserHistory } from "react-router";
import LoadingWheel from "../LoadingWheel";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import VoterStore from "../../stores/VoterStore";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/89479679 */
export default class AddFriendsByTwitter extends Component {
  static propTypes = {
  };

  constructor (props) {
      super(props);
      this.state = {
        add_friends_message: "Please join me in preparing for the upcoming election.",
        twitter_handles: "",
        redirect_url_upon_save: "/friends/sign_in",  // TODO DALE Remove this?
        loading: false,
        on_enter_twitter_handles_step: true,
        on_request_email_step: false,
        on_friend_invitations_sent_step: false,
        voter: {}
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
    // TODO DALE Remove this?
    browserHistory.push(this.state.redirect_url_upon_save);
  }

  cacheTwitterHandles (e) {
    this.setState({
      twitter_handles: e.target.value,
      on_friend_invitations_sent_step: false
    });
  }

  cacheAddFriendsByTwitterMessage (e) {
    this.setState({
      add_friends_message: e.target.value
    });
  }

  friendInvitationByTwitterHandleSend (e) {
    e.preventDefault();
    FriendActions.friendInvitationByTwitterHandleSend(this.state.twitter_handles, this.state.add_friends_message);
    this.setState({
      loading: true,
      twitter_handles: "",
      on_enter_twitter_handles_step: true,
      on_request_email_step: false,
      on_friend_invitations_sent_step: true
    });
  }

  hasValidEmail () {
    let { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }

  onKeyDown (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    let scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.AddFriendsByTwitterStepsManager(event).bind(scope);
    }
  }

  AddFriendsByTwitterStepsManager (event) {
    // This function is called when the form is submitted
    console.log("AddFriendsByTwitterStepsManager");

    // Validate twitter_handles
    let twitter_handles_error = false;
    let error_message = "";
    if (!this.state.twitter_handles) {
      twitter_handles_error = true;
      error_message += "Please enter email address or Twitter handle. ";
    }

    if (twitter_handles_error) {
      console.log("AddFriendsByTwitterStepsManager, twitter_handles_error");
      this.setState({
        loading: false,
        twitter_handles_error: true,
        error_message: error_message
      });
    } else if (!this.hasValidEmail()) {
      console.log("AddFriendsByTwitterStepsManager, NOT hasValidEmail");
      this.setState({
        loading: false,
        on_request_email_step: true,
      });
    } else {
      console.log("AddFriendsByTwitterStepsManager, calling friendInvitationByTwitterHandleSend");
      this.friendInvitationByTwitterHandleSend(event);
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

      {this.state.on_enter_twitter_handles_step ?
        <div>
          <form onSubmit={this.AddFriendsByTwitterStepsManager.bind(this)}  className="u-stack--md">
          <div>
            ADD_FRIENDS_BY_TWITTER - NOT FINISHED YET
            {/*<input type="text" name="email_address"
                   className="form-control"
                   onChange={this.cacheTwitterHandles.bind(this)}
                   placeholder="Enter twitter handles here, separated by commas" />
            {this.state.twitter_handles ?
              <span>
                <label htmlFor="last-name">Include a Message <span className="small">(Optional)</span></label><br />
                <input type="text" name="add_friends_message"
                       className="form-control"
                       onChange={this.cacheAddFriendsByTwitterMessage.bind(this)}
                       defaultValue="Please join me in preparing for the upcoming election." />
              </span> :
              null } */}
          </div>
          </form>

          <div>
              <span style={floatRight}>
                <Button
                  tabIndex="0"
                  onKeyDown={this.onKeyDown.bind(this)}
                  onClick={this.AddFriendsByTwitterStepsManager.bind(this)}
                  bsStyle="primary"
                  disabled={!this.state.twitter_handles}
                >
                  { this.hasValidEmail() ?
                    <span>Send &gt;</span> :
                    <span>Next &gt;</span>
                  }
                </Button>
              </span>
              <p>
                These friends will see what you support, oppose, and which opinions you follow.
              </p>
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
