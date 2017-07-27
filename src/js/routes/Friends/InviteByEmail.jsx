import React, { Component } from "react";
import { Link } from "react-router";
import AddFriendsByEmail from "../../components/Friends/AddFriendsByEmail";
import CurrentFriends from "../../components/Connect/CurrentFriends";
import GuideStore from "../../stores/GuideStore";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import FacebookStore from "../../stores/FacebookStore";
import Helmet from "react-helmet";

export default class InviteByEmail extends Component {
	static propTypes = {

	};

	constructor (props) {
		super(props);
    this.state = {
      add_friends_type: "ADD_FRIENDS_BY_EMAIL",
      current_friends_list: FriendStore.currentFriends(),
      facebook_invitable_friends_list: FacebookStore.facebookInvitableFriends(),
      voter_guides_to_follow_all: GuideStore.getVoterGuidesToFollowAll(),
      organizations_followed_on_twitter_list: GuideStore.followedOnTwitterList(),
      maximum_organization_display: 25,
      maximum_friend_display: 25,
      facebook_invitable_friends_image_width: 24,
      facebook_invitable_friends_image_height: 24,
    };
	}

  componentDidMount () {
    if (this.state.current_friends_list) {
      FriendActions.currentFriends();
    }
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
  }

  _onFriendStoreChange () {
    this.setState({
      current_friends_list: FriendStore.currentFriends()
    });
  }

  componentWillUnmount (){
    this.friendStoreListener.remove();
  }

	static getProps () {
		return {};
	}

  getCurrentRoute (){
    var current_route = "/more/connect";
    return current_route;
  }

	onKeyDownEditMode (event) {
		let enterAndSpaceKeyCodes = [13, 32];
		let scope = this;
		if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
			scope.setState({editMode: !this.state.editMode});
		}
	}

	render () {
		return <div>
			<Helmet title="Build Your We Vote Network" />
      <h1 className="h1">Add Friends by Email</h1>

			<div className="container-fluid well u-stack--md u-inset--md">
        <AddFriendsByEmail />
      </div>

      { this.state.current_friends_list && this.state.current_friends_list.length ?
        <div className="container-fluid well u-stack--md u-inset--md">
          <Link className="u-cursor--pointer u-no-underline" to="/friends">
            <h4 className="text-left">Your Current Friends</h4>
          </Link>
          <div className="card-child__list-group">
            {
              <CurrentFriends
                    currentFriendsList={this.state.current_friends_list}
                    maximumFriendDisplay={this.state.maximum_friend_display} />
            }
            <Link className="pull-right" to="/friends">See Full Friend List</Link>
          </div>
        </div> : null }

		</div>;
	}
}
