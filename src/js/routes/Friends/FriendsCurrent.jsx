import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { _ } from 'lodash';
import FriendList from '../../components/Friends/FriendList';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';

export default class FriendsCurrent extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      currentFriendList: [],
      currentFriendListFilteredBySearch: [],
      editMode: false,
      searchFilterOn: false,
      searchTerm: '',
    };
  }

  componentDidMount () {
    if (this.state.currentFriendList) {
      FriendActions.currentFriends();
    }

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      currentFriendList: FriendStore.currentFriends(),
    });
  }

  getCurrentRoute () {
    const currentRoute = '/friends/current';
    return currentRoute;
  }

  getFollowingType () {
    switch (this.getCurrentRoute()) {
      case '/friends/current':
      default:
        return 'YOUR_FRIENDS';
    }
  }

  toggleEditMode () {
    const { editMode } = this.state;
    this.setState({ editMode: !editMode });
  }

  searchFriends (event) {
    const searchTerm = event.target.value;
    if (searchTerm.length === 0) {
      this.setState({
        searchFilterOn: false,
        searchTerm: '',
        currentFriendListFilteredBySearch: [],
      });
    } else {
      const searchTermLowercase = searchTerm.toLowerCase();
      const { currentFriendList } = this.state;
      const searchedFriendList = _.filter(currentFriendList,
        user => user.voter_display_name.toLowerCase().includes(searchTermLowercase));

      this.setState({
        currentFriendListFilteredBySearch: searchedFriendList,
        searchFilterOn: true,
        searchTerm,
      });
    }
  }

  render () {
    renderLog(__filename);
    let currentFriendList;
    if (!this.state.searchFilterOn) {
      currentFriendList  = this.state.currentFriendList;
    } else {
      currentFriendList = this.state.currentFriendListFilteredBySearch;
    }

    return (
      <div className="opinion-view">
        <Helmet title="Your Friends - We Vote" />
        <section className="card">
          <div className="card-main">
            <h1 className="h1">Your Friends</h1>
            <div>
              { currentFriendList && currentFriendList.length > 0 ? (
                <span>
                  <a
                    className="fa-pull-right"
                    onClick={this.toggleEditMode.bind(this)}
                  >
                    {this.state.editMode ? 'Done Editing' : 'Edit'}
                  </a>
                  <p>
                    Your friends see what you support, oppose, and which opinions you follow.
                  </p>
                  <input
                    type="text"
                    className="form-control"
                    name="search_friends_text"
                    placeholder="Search by name..."
                    onChange={this.searchFriends.bind(this)}
                  />
                  <br />
                  { this.state.searchFilterOn && currentFriendList.length === 0 ? (
                    <p>
                      &quot;
                      {this.state.searchTerm}
                      &quot; not found
                    </p>
                  ) : null
                  }
                  <div className="card">
                    <FriendList
                      friendList={currentFriendList}
                      editMode={this.state.editMode}
                    />
                  </div>
                </span>
              ) :
                <p>Your friends will be shown here.</p>
              }
            </div>
          </div>
        </section>
      </div>
    );
  }
}
