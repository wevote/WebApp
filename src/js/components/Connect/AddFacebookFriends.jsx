import React, { Component } from "react";
import PropTypes from "prop-types";
import BrowserPushMessage from "../Widgets/BrowserPushMessage";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import FacebookSignIn from "../Facebook/FacebookSignIn";
import LoadingWheel from "../LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";
import FacebookFriendsDisplay from "./FacebookFriendsDisplay";

export default class AddFacebookFriends extends Component {
  static propTypes = {
    maximumFriendDisplay: PropTypes.number,
    facebookInvitableFriendsImageWidth: PropTypes.number,
    facebookInvitableFriendsImageHeight: PropTypes.number,
  };

  constructor (props) {
    super(props);
    this.state = {
      facebookInvitableFriendsList: FacebookStore.facebookInvitableFriends(),
      maximumFriendDisplay: this.props.maximumFriendDisplay,
      facebookInvitableFriendsImageWidth: this.props.facebookInvitableFriendsImageWidth,
      facebookInvitableFriendsImageHeight: this.props.facebookInvitableFriendsImageHeight,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    if (this.state.facebookInvitableFriendsList) {
      FacebookActions.getFacebookInvitableFriendsList(this.state.facebookInvitableFriendsImageWidth,
        this.state.facebookInvitableFriendsImageHeight);
    }
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  onFacebookStoreChange () {
    this.setState({
      facebookInvitableFriendsList: FacebookStore.facebookInvitableFriends(),
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.voter === undefined) {
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    }

    let yourAccountExplanation = "";
    if (!this.state.voter.signed_in_facebook) {
      yourAccountExplanation = "Sign in so that you can easily invite specific friends from Facebook. You choose who you want to invite.";
    } else {
      yourAccountExplanation = "We found some of your friends from Facebook. Choose the friends to invite to We Vote to see what they support.";
    }

    return (
      <div className="">
        <BrowserPushMessage incomingProps={this.props} />
        <div>
          <span>{yourAccountExplanation}</span>
          <br />
          <br />
          {!this.state.voter.signed_in_facebook ? (
            <div>
              <FacebookSignIn />
            </div>
          ) :
            null }

          {this.state.voter.signed_in_facebook ? (
            <div>
              <FacebookFriendsDisplay
                facebookInvitableFriendsList={this.state.facebookInvitableFriendsList}
                facebookInvitableFriendsImageWidth={this.state.facebookInvitableFriendsImageWidth}
                facebookInvitableFriendsImageHeight={this.state.facebookInvitableFriendsImageHeight}
                maximumFriendDisplay={this.state.maximumFriendDisplay}
              />
            </div>
          ) :
            null }

        </div>
        {/* <Main /> */}

      </div>
    );
  }
}
