import React, { Component } from "react";
import { Link } from "react-router";
import AddFriendsByEmail from "../components/Friends/AddFriendsByEmail";
import CurrentFriends from "../components/Connect/CurrentFriends";
import GuideActions from "../actions/GuideActions";
import GuideStore from "../stores/GuideStore";
import FriendActions from "../actions/FriendActions";
import FriendStore from "../stores/FriendStore";
import FacebookActions from "../actions/FacebookActions";
import FacebookStore from "../stores/FacebookStore";
import Helmet from "react-helmet";
import OrganizationsFollowedOnTwitter from "../components/Connect/OrganizationsFollowedOnTwitter";
import AddFacebookFriends from "../components/Connect/AddFacebookFriends";
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
    if (this.state.organizations_followed_on_twitter_list) {
      GuideActions.organizationsFollowedRetrieve();
    }
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));

    if (this.state.current_friends_list) {
      FriendActions.currentFriends();
    }
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));

    this._onFacebookStoreChange.bind(this);
    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
    if (this.state.facebook_invitable_friends_list) {
      FacebookActions.getFacebookInvitableFriendsList(this.state.facebook_invitable_friends_image_width,
        this.state.facebook_invitable_friends_image_height);
    }
  }

  _onFriendStoreChange () {
    this.setState({
      current_friends_list: FriendStore.currentFriends()
    });
  }

  _onGuideStoreChange (){
    var organizations_followed_on_twitter_list = GuideStore.followedOnTwitterList();
    var voter_guides_to_follow_all = GuideStore.getVoterGuidesToFollowAll();
    if (organizations_followed_on_twitter_list !== undefined && organizations_followed_on_twitter_list.length > 0){
      this.setState({ organizations_followed_on_twitter_list: GuideStore.followedOnTwitterList() });
    }
    if (voter_guides_to_follow_all !== undefined && voter_guides_to_follow_all.length > 0){
      this.setState({ voter_guides_to_follow_all: GuideStore.getVoterGuidesToFollowAll() });
    }
  }

  _onFacebookStoreChange () {
    this.setState({
      facebook_invitable_friends_list: FacebookStore.facebookInvitableFriends(),
    });
  }

  componentWillUnmount (){
    this.friendStoreListener.remove();
    this.guideStoreListener.remove();
    this.facebookStoreListener.remove();
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

      { this.state.voter_guides_to_follow_all && this.state.voter_guides_to_follow_all.length ?
        <div className="container-fluid well u-stack--md u-inset--md">
          <Link className="u-cursor--pointer u-no-underline" to="/opinions">
            <h4 className="text-left">Organizations to Follow</h4>
            <p>Follow organizations to see what they recommend</p>
          </Link>
          <div className="card-child__list-group">
            {
              <ItemTinyOpinionsToFollow
                    organizationsToFollow={this.state.voter_guides_to_follow_all}
                    maximumOrganizationDisplay={this.state.maximum_organization_display} />
            }
            <Link className="pull-right" to="/opinions">See all</Link>
          </div>
        </div> : null }

      <div className="container-fluid well u-stack--md u-inset--md">
        <h4 className="text-left">Add Friends from Facebook</h4>
        <div className="card-child__list-group">
          {
            <AddFacebookFriends
                    facebookInvitableFriendsList={this.state.facebook_invitable_friends_list}
                    facebookInvitableFriendsImageWidth={this.state.facebook_invitable_friends_image_width}
                    facebookInvitableFriendsImageHeight={this.state.facebook_invitable_friends_image_height}
                    maximumFriendDisplay={this.state.maximum_friend_display} />
          }
          <Link className="pull-right" to="/facebook_invitable_friends">See all</Link>
        </div>
      </div>

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
