import React, { Component } from "react";
import { Link } from "react-router";
import { Button } from "react-bootstrap";
import AddFriendsByEmail from "../components/Friends/AddFriendsByEmail";
import AddFriendsByFacebook from "../components/Friends/AddFriendsByFacebook";
import AddFriendsByTwitter from "../components/Friends/AddFriendsByTwitter";
import AddFriendsFilter from "../components/Navigation/AddFriendsFilter";
import FollowingFilter from "../components/Navigation/FollowingFilter";
import FriendActions from "../actions/FriendActions";
import FriendList from "../components/Friends/FriendList";
import FriendStore from "../stores/FriendStore";
import Helmet from "react-helmet";

/* VISUAL DESIGN HERE: https://invis.io/E45246B2C */

export default class Connect extends Component {
	static propTypes = {

	};

	constructor (props) {
		super(props);
    this.state = {
      add_friends_type: "ADD_FRIENDS_BY_EMAIL",
      current_friend_list: FriendStore.currentFriends()
    };
	}

  componentDidMount () {
    if (this.state.current_friend_list) {
      FriendActions.currentFriends();
    }
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
  }

  _onFriendStoreChange () {
    this.setState({
      current_friend_list: FriendStore.currentFriends()
    });
  }

  componentWillUnmount (){
    this.friendStoreListener.remove();
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

  getFollowingType (){
    switch (this.getCurrentRoute()) {
      case "/more/connect":
      default :
        return "YOUR_FRIENDS";
    }
  }

	render () {
		var floatRight = {
			float: "right"
		};
    const { current_friend_list } = this.state;
    let add_friends_header;
    let add_friends_html;
    if (this.state.add_friends_type === "ADD_FRIENDS_BY_TWITTER") {
      add_friends_header = "Add Friends By Twitter Handle";
      add_friends_html = <AddFriendsByTwitter />;
    } else if (this.state.add_friends_type === "ADD_FRIENDS_BY_FACEBOOK") {
      add_friends_header = "Add Friends From Facebook";
      add_friends_html = <AddFriendsByFacebook />;
    } else {
      add_friends_header = "Add Friends By Email";
      add_friends_html = <AddFriendsByEmail />;
    }

		return <div>
			<Helmet title={add_friends_header} />
      <h1 className="h1">Build Your Network</h1>
      <FollowingFilter following_type={this.getFollowingType()} />
			<div className="container-fluid well u-gutter__top--small fluff-full1">
        <h4 className="text-left">{add_friends_header}</h4>
        <div className="ballot__filter"><AddFriendsFilter add_friends_type={this.state.add_friends_type}
                                                          changeAddFriendsTypeFunction={this.changeAddFriendsType.bind(this)} /></div>
        {add_friends_html}
      </div>

			<div className="container-fluid well u-gutter__top--small fluff-full1">
        <a className="fa-pull-right"
           onClick={this.toggleEditMode.bind(this)}>
          {this.state.editMode ? "Done Editing" : "Edit"}
        </a>
        <div>
          <p>Your Friends</p>
          <div className="card">
            <FriendList friendList={current_friend_list}
                        editMode={this.state.editMode}
                        />
          </div>
        </div>
      </div>
      <Link to="/requests">
        <Button bsStyle="link">
          See Friend Requests
        </Button>
      </Link>
		</div>;
	}
}
