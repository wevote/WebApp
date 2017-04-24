import React, {Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import CheckBox from "../components/Connect/CheckBox";
import ImageHandler from "../components/ImageHandler";
import FacebookActions from "../actions/FacebookActions";
import FriendActions from "../actions/FriendActions";
import FacebookStore from "../stores/FacebookStore";
import Helmet from "react-helmet";

export default class FacebookInvitableFriends extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
      isChecked: false,
      facebook_invitable_friends_list: FacebookStore.facebookInvitableFriendsList(),
      facebook_invitable_friends_image_width: 48,
      facebook_invitable_friends_image_height: 48,
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
    if (this.state.facebook_invitable_friends_list) {
      FacebookActions.getFacebookInvitableFriendsList(this.state.facebook_invitable_friends_image_width,
        this.state.facebook_invitable_friends_image_height);
    }
  }

  componentWillMount () {
    this.selectedCheckBoxes = [];
  }

  componentWillUnmount (){
    this.facebookStoreListener.remove();
  }

  _onFacebookStoreChange () {
    this.setState({
      facebook_invitable_friends_list: FacebookStore.facebookInvitableFriendsList()
    });
  }

  getCurrentRoute (){
    var current_route = "/facebook_invitable_friends";
    return current_route;
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
        redirect_uri: "http://localhost:3000/ballot",
        method: "apprequests",
        message: "Invite your Facebook Friends to join WeVote",
        to: selected_facebook_friends_ids,
      }, function (response) {
        if ( response.error_code === 4201 ) {
          console.log("User Canceled the request");
        } else if ( response ) {
          console.log("Successfully Invited", response, selected_facebook_friends_names);
          const data = {request_id: response.request, recipients_facebook_id_array: response.to, recipients_facebook_name_array: selected_facebook_friends_names};
          console.log("Final data for all invitations", data);
          FriendActions.friendInvitationByFacebookSend(data);
        } else {
          console.log("Failed To Invite");
        }
      });
  }

  render () {

    const { facebook_invitable_friends_list } = this.state;
    const facebook_friend_list_for_display = facebook_invitable_friends_list.map( (friend) => {
      return <div key={friend.id} className="card-child card-child--not-followed">
        <CheckBox
          friendId={friend.id}
          friendName={friend.name}
          handleCheckboxChange={this.toggleCheckBox.bind(this)}
        />
        &nbsp;
        <div className="card-main__media-object-anchor">
          <ImageHandler imageUrl={friend.picture.data.url}
                      className="" sizeClassName="icon-lg" />
        </div>
        <div className="card-main__media-object-content">
          {friend.name}
        </div>
      </div>;
    });

    return <div className="facebook-friends-view">
      <Helmet title="Your Facebook Friends - We Vote" />
      <h1 className="h1">Build Your Network - We Vote</h1>
      <h4 className="h4">Add Friends from Facebook</h4>
      <div>
        <p>
            See how your friends are voting and who they recommend.
            The friends you invite to We Vote will see what you support and oppose.
            We recommend you only invite friends that you would like to talk politics with.
        </p>
        <span className="u-bold">Select: </span>
        <form onSubmit={this.sendInviteRequestToFacebookFriends.bind(this)}>
          <div className="card">
            <div className="card-child__list-group">
              {facebook_friend_list_for_display}
            </div>
          </div>
          <br />
          <Button bsStyle="primary" type="submit">Send</Button>
        </form>
      </div>
    </div>;
  }
}
