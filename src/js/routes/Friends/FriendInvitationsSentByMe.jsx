import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { _ } from 'lodash';
import FriendInvitationList from '../../components/Friends/FriendInvitationList';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';
import SearchBar from '../../components/Search/SearchBar';

export default class FriendInvitationsSentByMe extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentByMe: [],
      friendInvitationsSentByMeFilteredBySearch: [],
      searchFilterOn: false,
      searchTerm: '',
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.searchFriends = this.searchFriends.bind(this);
  }

  componentDidMount () {
    FriendActions.friendInvitationsSentByMe();
    this.setState({
      friendInvitationsSentByMe: FriendStore.friendInvitationsSentByMe(),
    });

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      friendInvitationsSentByMe: FriendStore.friendInvitationsSentByMe(),
    });
  }

  searchFriends (searchTerm) {
    if (searchTerm.length === 0) {
      this.setState({
        friendInvitationsSentByMeFilteredBySearch: [],
        searchFilterOn: false,
        searchTerm: '',
      });
    } else {
      const searchTermLowercase = searchTerm.toLowerCase();
      const { friendInvitationsSentByMe } = this.state;
      const searchedFriendList = _.filter(friendInvitationsSentByMe,
        voter => voter.voter_display_name.toLowerCase().includes(searchTermLowercase));

      this.setState({
        friendInvitationsSentByMeFilteredBySearch: searchedFriendList,
        searchFilterOn: true,
        searchTerm,
      });
    }
  }

  clearSearch () {
    this.setState({
      searchFilterOn: false,
      searchTerm: '',
      friendInvitationsSentByMeFilteredBySearch: [],
    });
  }

  render () {
    renderLog(__filename);
    let { friendInvitationsSentByMe } = this.state;
    if (this.state.searchFilterOn) {
      friendInvitationsSentByMe = this.state.friendInvitationsSentByMeFilteredBySearch;
    }

    return (
      <div className="opinion-view">
        <Helmet title="Your Friends - We Vote" />
        <h1 className="h1">Your Invitations</h1>
        <div>
          { friendInvitationsSentByMe && friendInvitationsSentByMe.length > 0 ? (
            <span>
              <SearchBar
                clearButton
                searchButton
                placeholder="Search by name"
                searchFunction={this.searchFriends}
                clearFunction={this.clearSearch}
                searchUpdateDelayTime={0}
              />
              <br />
              { this.state.searchFilterOn && friendInvitationsSentByMe.length === 0 ? (
                <p>
                  &quot;
                  {this.state.searchTerm}
                  &quot; not found
                </p>
              ) : null
              }
              <FriendInvitationList
                editMode
                friendList={friendInvitationsSentByMe}
                invitationsSentByMe
              />
            </span>
          ) :
            <p>Your friends will be shown here.</p>
          }
        </div>
      </div>
    );
  }
}
