import React, { Component } from "react";
import { Link } from "react-router";
import { Button } from "react-bootstrap";
import AddFriendsByEmail from "../components/Friends/AddFriendsByEmail";
import CurrentFriends from "../components/Connect/CurrentFriends";
import GuideActions from "../actions/GuideActions";
import GuideStore from "../stores/GuideStore";
import FriendActions from "../actions/FriendActions";
import FriendStore from "../stores/FriendStore";
import Helmet from "react-helmet";
import OrganizationsFollowedOnTwitter from "../components/Connect/OrganizationsFollowedOnTwitter";
import ItemTinyOpinionsToFollow from "../components/VoterGuide/ItemTinyOpinionsToFollow";

/* VISUAL DESIGN HERE: https://invis.io/E45246B2C */

export default class Connect extends Component {
	static propTypes = {

	};

	constructor (props) {
		super(props);
    this.state = {
      add_friends_type: "ADD_FRIENDS_BY_EMAIL",
      current_friends_list: FriendStore.currentFriends(),
      organizations_to_follow_list: GuideStore.toFollowList(),
      organizations_followed_on_twitter_list: GuideStore.followedOnTwitterList(),
      maximum_organization_display: 5
    };
	}

  componentDidMount () {
    if (this.state.organizations_followed_on_twitter_list) {
      GuideActions.organizationsFollowedRetrieve();
    }
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));

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

  _onGuideStoreChange (){
    var organizations_followed_on_twitter_list = GuideStore.followedOnTwitterList();
    var organizations_to_follow_list = GuideStore.toFollowList();
    if (organizations_followed_on_twitter_list !== undefined && organizations_followed_on_twitter_list.length > 0){
      this.setState({ organizations_followed_on_twitter_list: GuideStore.followedOnTwitterList() });
    }
    if (organizations_to_follow_list !== undefined && organizations_to_follow_list.length > 0){
      this.setState({ organizations_to_follow_list: GuideStore.toFollowList() });
    }
  }

  componentWillUnmount (){
    this.friendStoreListener.remove();
    this.guideStoreListener.remove();
  }

	static getProps () {
		return {};
	}

  changeAddFriendsType (event) {
    this.setState({add_friends_type: event.target.id});
  }

  getCurrentRoute (){
    var current_route = "/more/connect";
    return current_route;
  }

  toggleEditMode (){
    this.setState({editMode: !this.state.editMode});
  }

	onKeyDownEditMode (event) {
		let enterAndSpaceKeyCodes = [13, 32];
		let scope = this;
		if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
			scope.setState({editMode: !this.state.editMode});
		}
	}

  getFollowingType (){
    switch (this.getCurrentRoute()) {
      case "/more/connect":
      default :
        return "YOUR_FRIENDS";
    }
  }

	render () {
		return <div>
			<Helmet title="Build Your We Vote Network" />
      <h1 className="h1">Build Your We Vote Network</h1>

      { this.state.organizations_to_follow_list && this.state.organizations_to_follow_list.length ?
        <div className="container-fluid well u-stack--md u-inset--md">
          <h4 className="text-left">Organizations to Follow</h4>
          <p>Follow organizations to see what they recommend</p>
          <div className="card-child__list-group">
            {
              <ItemTinyOpinionsToFollow
                    organizationsToFollow={this.state.organizations_to_follow_list}
                    maximumOrganizationDisplay={this.state.maximum_organization_display} />
            }
            <Link className="pull-right" to="/opinions">See all</Link>
          </div>
        </div> : null }


      { this.state.organizations_followed_on_twitter_list && this.state.organizations_followed_on_twitter_list.length ?
        <div className="container-fluid well u-stack--md u-inset--md">
          <h4 className="text-left">Organizations you follow on Twitter</h4>
          <div className="card-child__list-group">
            {
              <OrganizationsFollowedOnTwitter
                    organizationsFollowedOnTwitter={this.state.organizations_followed_on_twitter_list}
                    maximumOrganizationDisplay={this.state.maximum_organization_display} />
            }
            <Link className="pull-right" to="/opinions_followed">See all organizations you follow </Link>
          </div>
        </div> : null }

			<div className="container-fluid well u-stack--md u-inset--md">
        <h4 className="text-left">Add Friends by Email</h4>
        <AddFriendsByEmail />
      </div>

      { this.state.current_friends_list && this.state.current_friends_list.length ?
        <div className="container-fluid well u-stack--md u-inset--md">
          <h4 className="text-left">Your Current Friends</h4>
          <div className="card-child__list-group">
            {
              <CurrentFriends
                    currentFriendsList={this.state.current_friends_list}
                    maximumFriendDisplay={this.state.maximum_friend_display} />
            }
            <Link className="pull-right" to="/friends">See Full Friend List</Link>
          </div>
        </div> : null }

      <Link to="/requests">
        <Button bsStyle="link">
          See Friend Requests
        </Button>
      </Link>
		</div>;
	}
}
