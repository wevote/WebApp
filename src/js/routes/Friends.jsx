import { Button } from "react-bootstrap";
import FollowingFilter from "../components/Navigation/FollowingFilter";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";
import FriendList from "../components/Friends/FriendList";
import { Link } from "react-router";
import React, {Component, PropTypes } from "react";

export default class Friends extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
        current_friend_list: VoterStore.currentFriends()
    };
  }

  componentDidMount () {
    if (this.state.current_friend_list)
    VoterActions.currentFriends();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  _onVoterStoreChange () {
    this.setState({
      current_friend_list: VoterStore.currentFriends()
    });
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  getCurrentRoute (){
    var current_route = "/friends";
    return current_route;
  }

  getFollowingType (){
    switch (this.getCurrentRoute()) {
      case "/friends":
      default :
        return "YOUR_FRIENDS";
    }
  }

  render () {
    const { current_friend_list } = this.state;

    return <div className="opinion-view">
      <h1>Build Your Network</h1>
      <FollowingFilter following_type={this.getFollowingType()} />
      <div>
        <p>
          These friends see what you support, oppose, and which opinions you follow.
        </p>
        <div className="card">
          <FriendList friendList={current_friend_list} />
        </div>
      </div>
    </div>;
  }
}
