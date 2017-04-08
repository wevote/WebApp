import React, {Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import CheckBox from "../components/Connect/CheckBox";
import ImageHandler from "../components/ImageHandler";
import FacebookActions from "../actions/FacebookActions";
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
    if (this.state.facebook_friends_list) {
      FacebookActions.getFacebookInvitableFriendsList(this.state.facebook_invitable_friends_image_width,
        this.state.facebook_invitable_friends_image_height);
    }
  }

  componentWillMount () {
    this.selectedCheckBoxes = new Set();
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

  toggleCheckBox (facebook_invitable_friend_id) {
    if (this.selectedCheckBoxes.has(facebook_invitable_friend_id)) {
      this.selectedCheckBoxes.delete(facebook_invitable_friend_id);
    } else {
      this.selectedCheckBoxes.add(facebook_invitable_friend_id);
    }
  }

  sendInviteRequestToFacebookFriends = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    let to_selected_facebook_friends = [];
    for (const checkbox of this.selectedCheckBoxes) {
      to_selected_facebook_friends.push(checkbox);
    }
     this.sendFacebookAppRequest(to_selected_facebook_friends);
  }

  sendFacebookAppRequest (to_selected_facebook_friends) {
      window.FB.ui({
        method: "apprequests",
        message: "Invite your Facebook Friends to join WeVote",
        to: to_selected_facebook_friends,
      }, function (response) {
        if ( response.error_code === 4201 ) {
          console.log("User Canceled the request");
        } else if ( response ) {
          console.log("Successfully Invited", response);
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
            value={friend.id}
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
