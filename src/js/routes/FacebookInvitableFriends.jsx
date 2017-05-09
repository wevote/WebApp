import React, {Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import { Button } from "react-bootstrap";
import CheckBox from "../components/Connect/CheckBox";
import LoadingWheel from "../components/LoadingWheel";
import FacebookActions from "../actions/FacebookActions";
import FriendActions from "../actions/FriendActions";
import FacebookStore from "../stores/FacebookStore";
import VoterStore from "../stores/VoterStore";
import Helmet from "react-helmet";
const web_app_config = require("../config");

export default class FacebookInvitableFriends extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
      isChecked: false,
      facebook_logged_in: false,
      facebook_auth_response: {},
      facebook_invitable_friends: FacebookStore.facebookInvitableFriends(),
      facebook_invitable_friends_image_width: 48,
      facebook_invitable_friends_image_height: 48,
      saving: false,
    };
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this._onFacebookStoreChange();
    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
  }

  componentWillMount () {
    this.selectedCheckBoxes = [];
  }

  componentWillUnmount (){
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  _onFacebookStoreChange () {
    this.setState({
      facebook_logged_in: FacebookStore.loggedIn,
      facebook_auth_response: FacebookStore.getFacebookAuthResponse(),
      facebook_invitable_friends: FacebookStore.facebookInvitableFriends(),
      saving: false
    });
  }

  facebookLogin () {
    FacebookActions.login();
  }

  getFacebookInvitableFriends () {
    FacebookActions.getFacebookInvitableFriendsList(this.state.facebook_invitable_friends_image_width,
      this.state.facebook_invitable_friends_image_height);
    this.setState({saving: true});
  }

  toggleCheckBox (facebook_invitable_friend_id, facebook_invitable_friend_name) {
    const friend_selected_checkbox = {id: facebook_invitable_friend_id, name: facebook_invitable_friend_name};
    if (this.selectedCheckBoxes.length === 0) {
      this.selectedCheckBoxes.push(friend_selected_checkbox);
    } else {
      for (const checkBox of this.selectedCheckBoxes) {
        var checkBoxNotAdded = false;
        if ( checkBox.id === facebook_invitable_friend_id ) {
          const index = this.selectedCheckBoxes.indexOf(checkBox);
          this.selectedCheckBoxes.splice(index, 1);
          break;
        } else {
          checkBoxNotAdded = true;
        }
      }
      if (checkBoxNotAdded) {
        this.selectedCheckBoxes.push(friend_selected_checkbox);
      }
    }
    console.log("Selected Check Boxes: ", this.selectedCheckBoxes);
  }

  sendInviteRequestToFacebookFriends = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    let selected_facebook_friends_ids = [];
    let selected_facebook_friends_names = [];
    for (const checkbox of this.selectedCheckBoxes) {
      selected_facebook_friends_ids.push(checkbox.id);
      selected_facebook_friends_names.push(checkbox.name);
    }
     this.sendFacebookAppRequest(selected_facebook_friends_ids, selected_facebook_friends_names);
  }

  sendFacebookAppRequest (selected_facebook_friends_ids, selected_facebook_friends_names) {
      window.FB.ui({
        title: "We Vote USA",
        redirect_uri: web_app_config.WE_VOTE_HOSTNAME + "/more/network",
        method: "apprequests",
        message: "Invite your Facebook Friends to join We Vote",
        to: selected_facebook_friends_ids,
      }, function (response) {
        if ( response.error_code === 4201 ) {
          console.log("User Canceled the request");
        } else if ( response ) {
          console.log("Successfully Invited", response, selected_facebook_friends_names);
          const data = {request_id: response.request, recipients_facebook_id_array: response.to, recipients_facebook_name_array: selected_facebook_friends_names};
          console.log("Final data for all invitations", data);
          FriendActions.friendInvitationByFacebookSend(data);
          browserHistory.push({
            pathname: "/more/network",
            state: {
              message: "You have successfully sent Invitation to your friends.",
              message_type: "success"
            }
          });
        } else {
          console.log("Failed To Invite");
        }
      });
  }

  render () {
    console.log("this.state.voter", this.state.voter);
    if (!this.state.voter || this.state.saving) {
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    }

    console.log("SignIn.jsx this.state.facebook_auth_response:", this.state.facebook_auth_response);
    if (!this.state.voter.signed_in_facebook && this.state.facebook_auth_response && this.state.facebook_auth_response.facebook_retrieve_attempted) {
      console.log("SignIn.jsx facebook_retrieve_attempted");
      browserHistory.push("/facebook_sign_in");
      // return <span>SignIn.jsx facebook_retrieve_attempted</span>;
      return LoadingWheel;
    } else {
      console.log("Voter is signed in through facebook: ", this.state.facebook_invitable_friends);
      if (!this.state.facebook_invitable_friends.facebook_invitable_friends_retrieved) {
        // If facebook log in finished successfully then get facebook invitable friends
        console.log("Get facebook invitable friends");
        this.getFacebookInvitableFriends();
        return LoadingWheel;
      }
    }

    console.log("facebook logged in: ", this.state.facebook_logged_in);
    if (!this.state.facebook_logged_in ) {
      console.log("Voter is not logged in through facebook");
      this.facebookLogin();
      return LoadingWheel;
    } else {
      console.log("Voter is signed in through facebook: ", this.state.facebook_invitable_friends);
      if (!this.state.facebook_invitable_friends.facebook_invitable_friends_retrieved) {
        // If facebook log in finished successfully then get facebook invitable friends
        console.log("Get facebook invitable friends");
        this.getFacebookInvitableFriends();
        return LoadingWheel;
      }
    }

    console.log("Facebook friends list", this.state.facebook_invitable_friends.facebook_invitable_friends_list);
    console.log("facebook friends not exist:", this.state.facebook_invitable_friends.facebook_friends_not_exist);
    if (this.state.facebook_invitable_friends.facebook_friends_not_exist) {
      browserHistory.push({
        pathname: "/more/network",
        state: {
          message: "You don't have friends on Facebook who are not on We Vote.",
          message_type: "success"
        }
      });
      return LoadingWheel;
    }


    const facebook_invitable_friends_list = this.state.facebook_invitable_friends.facebook_invitable_friends_list;
    const facebook_friend_list_for_display = facebook_invitable_friends_list.map( (friend) => {
      return <div key={friend.id} className="card-child card-child--not-followed">
        <CheckBox
          friendId={friend.id}
          friendName={friend.name}
          friendImage={friend.picture.data.url}
          handleCheckboxChange={this.toggleCheckBox.bind(this)}
        />
      </div>;
    });

    return <div className="opinion-view">
      <Helmet title="Your Facebook Friends - We Vote" />
      <section className="card">
        <div className="card-main">
          <h1 className="h1">Build Your Network - We Vote</h1>
          <h4 className="h4">Add Friends from Facebook</h4>
          <div>
            <p>
                See how your friends are voting and who they recommend.
                The friends you invite to We Vote will see what you support and oppose.
                We recommend you only invite friends that you would like to talk politics with.
            </p>
            <form onSubmit={this.sendInviteRequestToFacebookFriends.bind(this)}>
              {facebook_friend_list_for_display}
              <br />
              <Button bsStyle="primary" type="submit">Send</Button>
            </form>
          </div>
        </div>
      </section>
    </div>;
  }
}
