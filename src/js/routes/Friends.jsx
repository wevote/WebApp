import React, {Component, PropTypes } from "react";
import FriendList from "../components/Friends/FriendList";
import FriendActions from "../actions/FriendActions";
import FriendStore from "../stores/FriendStore";
import Helmet from "react-helmet";

export default class Friends extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
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

  getCurrentRoute (){
    var current_route = "/friends";
    return current_route;
  }

  toggleEditMode (){
    this.setState({editMode: !this.state.editMode});
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
      <Helmet title="Your Friends - We Vote" />
      <section className="card">
        <div className="card-main">
          <h1 className="h1">Your Friends</h1>
          <a className="fa-pull-right"
             onClick={this.toggleEditMode.bind(this)}>
            {this.state.editMode ? "Done Editing" : "Edit"}
          </a>
          <div>
            <p>
              Your friends see what you support, oppose, and which opinions you follow.
            </p>
            <div className="card">
              <FriendList friendList={current_friend_list}
                          editMode={this.state.editMode}
                          />
            </div>
          </div>
        </div>
      </section>
    </div>;
  }
}
