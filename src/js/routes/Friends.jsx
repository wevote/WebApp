import React, { Component } from "react";
import PropTypes from "prop-types";
import FriendList from "../components/Friends/FriendList";
import FriendActions from "../actions/FriendActions";
import FriendStore from "../stores/FriendStore";
import Helmet from "react-helmet";
var _ = require("lodash");

export default class Friends extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
      current_friend_list: FriendStore.currentFriends(),
      search_filter: false,
      search_term: "",
      current_friend_list_filtered_by_search: [],
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
      current_friend_list = this.state.current_friend_list;
    } else {
      current_friend_list = this.state.current_friend_list_filtered_by_search;
    }

    return <div className="opinion-view">
      <Helmet title="Your Friends - We Vote" />
      <section className="card">
        <div className="card-main">
          <h1 className="h1">Your Friends</h1>
          <div>
            { this.state.current_friend_list && this.state.current_friend_list.length > 0 ?
              <span>
                <a className="fa-pull-right"
                  onClick={this.toggleEditMode.bind(this)}>
                  {this.state.editMode ? "Done Editing" : "Edit"}
                </a>
                <p>
                  Your friends see what you support, oppose, and which opinions you listen to.
                </p>
                <input type="text"
                    className="form-control"
                    name="search_friends_text"
                    placeholder="Search by name..."
                    onChange={this.searchFriends.bind(this)} />
                <br />
                { this.state.search_filter && current_friend_list.length === 0 ?
                  <p>"{this.state.search_term}" not found</p> : null
                }
                <div className="card">
                  <FriendList friendList={current_friend_list}
                          editMode={this.state.editMode}
                          />
                </div>
              </span> :
              <p>You don't have any Friends.</p>
            }
          </div>
        </div>
      </section>
    </div>;
  }
}
