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
        add_friends_message: "",
        email_addresses: "",
        redirect_url_upon_save: "/friends/sign_in",
        loading: false,
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
      email_addresses: e.target.value
    });
  }

  cacheAddFriendsMessage (e) {
    this.setState({
      add_friends_message: e.target.value
    });
  }

  friendInvitationByEmailSend (e) {
    e.preventDefault();
    var { email_addresses, add_friends_message } = this.state;
    VoterActions.friendInvitationByEmailSend(email_addresses, add_friends_message);
    this.setState({loading: true});
  }

	render () {
    var { loading, voter } = this.state;
    if (loading){
      return LoadingWheel;
    }
    var floatRight = {
        float: "right"
    };
    let has_valid_email = voter !== undefined ? voter.has_valid_email : false;

		return <div>
      <form onSubmit={this.friendInvitationByEmailSend.bind(this)}>
      <div>
        <Input type="text" addonBefore="@" name="email_address"
               className="form-control"
               onChange={this.cacheEmailAddresses.bind(this)}
               placeholder="Enter email addresses here, separated by commas" />
        <label htmlFor="last-name">Include a Message <span className="small">(Optional)</span></label><br />
        <Input type="text" name="add_friends_message"
               className="form-control"
               onChange={this.cacheAddFriendsMessage.bind(this)}
               defaultValue="Please join me in preparing for the upcoming election." />
      </div>
      </form>

      <div className="u-gutter__top--small">
        <ButtonToolbar bsClass="btn-toolbar">
          <span style={floatRight}>
            <Button
              onClick={this.friendInvitationByEmailSend.bind(this)}
              bsStyle="primary">
              { has_valid_email ?
                <span>Send &gt;</span> :
                <span>Next &gt;</span>
              }
            </Button>
          </span>
          <span>These friends will see what you support, oppose, and which opinions you follow.
            We will never sell your email.</span>
        </ButtonToolbar>
      </div>
		</div>;
	}
}
