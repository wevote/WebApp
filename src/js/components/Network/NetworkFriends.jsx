import React, {Component, PropTypes } from "react";
import { Link } from "react-router";
import FriendList from "../Friends/FriendList";
import FriendActions from "../../actions/FriendActions";
import FriendStore from "../../stores/FriendStore";
import Helmet from "react-helmet";
var _ = require("lodash");

export default class NetworkFriends extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
      current_friend_list: [],
      search_filter: false,
      search_term: "",
      current_friend_list_filtered_by_search: [],
    };
  }

  componentDidMount () {
    if (!this.state.current_friend_list) {
      FriendActions.currentFriends();
    }
    this.setState({
      current_friend_list: FriendStore.currentFriends()
    });
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

  searchFriends (event) {
    let search_term = event.target.value;
    if (search_term.length === 0) {
      this.setState({
        search_filter: false,
        search_term: "",
        current_friend_list_filtered_by_search: [],
      });
    } else {
      let search_term_lowercase = search_term.toLowerCase();
      var searched_friend_list = _.filter(this.state.current_friend_list,
        function (user) {
            return user.voter_display_name.toLowerCase().includes(search_term_lowercase);
          });

      this.setState({
        search_filter: true,
        search_term: search_term,
        current_friend_list_filtered_by_search: searched_friend_list,
      });
    }
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
    var current_friend_list = [];
    if (!this.state.search_filter) {
      let current_friend_list_complete = this.state.current_friend_list;
      const FRIENDS_TO_SHOW = 3;
      current_friend_list = current_friend_list_complete.slice(0, FRIENDS_TO_SHOW);
    } else {
      current_friend_list = this.state.current_friend_list_filtered_by_search;
    }

    return <div className="opinion-view">
      <Helmet title="Your Friends - We Vote" />
      <section className="card">
        <div className="card-main">
          <h1 className="h4">Your Friends</h1>
          <div>
            { this.state.current_friend_list && this.state.current_friend_list.length > 0 ?
              <span>
                <div className="card">
                  <FriendList friendList={current_friend_list}
                          editMode={this.state.editMode}
                          />
                </div>
                <Link to="/friends">See All</Link>
              </span> :
              <p>You have not added any friends yet.</p>
            }
          </div>
        </div>
      </section>
    </div>;
  }
}
