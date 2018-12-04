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
      facebook_invitable_friends_list: FacebookStore.facebookInvitableFriends(),
      maximum_friend_display: this.props.maximumFriendDisplay,
      facebook_invitable_friends_image_width: this.props.facebookInvitableFriendsImageWidth,
      facebook_invitable_friends_image_height: this.props.facebookInvitableFriendsImageHeight,
    };
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));

    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
    if (this.state.facebook_invitable_friends_list) {
      FacebookActions.getFacebookInvitableFriendsList(this.state.facebook_invitable_friends_image_width,
        this.state.facebook_invitable_friends_image_height);
    }
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  _onFacebookStoreChange () {
    this.setState({
      facebook_invitable_friends_list: FacebookStore.facebookInvitableFriends(),
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.voter === undefined) {
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    }

    let your_account_explanation = "";
    if (!this.state.voter.signed_in_facebook) {
      your_account_explanation = "Sign in so that you can easily invite specific friends from Facebook. You choose who you want to invite.";
    } else {
      your_account_explanation = "We found some of your friends from Facebook. Choose the friends to invite to We Vote to see what they support.";
    }

    return (
      <div className="">
        <BrowserPushMessage incomingProps={this.props} />
        <div>
          <span>{your_account_explanation}</span>
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
                facebookInvitableFriendsList={this.state.facebook_invitable_friends_list}
                facebookInvitableFriendsImageWidth={this.state.facebook_invitable_friends_image_width}
                facebookInvitableFriendsImageHeight={this.state.facebook_invitable_friends_image_height}
                maximumFriendDisplay={this.state.maximum_friend_display}
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
