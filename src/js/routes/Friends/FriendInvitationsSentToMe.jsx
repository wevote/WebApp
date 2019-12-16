import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import _ from 'lodash';
import FriendInvitationList from '../../components/Friends/FriendInvitationList';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';
import SearchBar from '../../components/Search/SearchBar';
import AddFriendsByEmail from '../../components/Friends/AddFriendsByEmail';
import { historyPush } from '../../utils/cordovaUtils';

export default class FriendInvitationsSentToMe extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentToMe: [],
      friendInvitationsSentToMeFilteredBySearch: [],
      searchFilterOn: false,
      searchTerm: '',
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.searchFriends = this.searchFriends.bind(this);
  }

  componentDidMount () {
    FriendActions.friendInvitationsSentToMe();
    FriendActions.suggestedFriendList();
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      suggestedFriends: FriendStore.suggestedFriendList(),
    });

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      suggestedFriendList: FriendStore.suggestedFriendList(),
    });
  }

  searchFriends (searchTerm) {
    if (searchTerm.length === 0) {
      this.setState({
        friendInvitationsSentToMeFilteredBySearch: [],
        searchFilterOn: false,
        searchTerm: '',
      });
    } else {
      const searchTermLowercase = searchTerm.toLowerCase();
      const { friendInvitationsSentToMe } = this.state;
      const searchedFriendList = _.filter(friendInvitationsSentToMe,
        voter => voter.voter_display_name.toLowerCase().includes(searchTermLowercase));

      this.setState({
        friendInvitationsSentToMeFilteredBySearch: searchedFriendList,
        searchFilterOn: true,
        searchTerm,
      });
    }
  }

  clearSearch () {
    this.setState({
      searchFilterOn: false,
      searchTerm: '',
      friendInvitationsSentToMeFilteredBySearch: [],
    });
  }

  render () {
    renderLog('FriendInvitationsSentToMe');  // Set LOG_RENDER_EVENTS to log all renders
    let { friendInvitationsSentToMe } = this.state;
    if (this.state.searchFilterOn) {
      friendInvitationsSentToMe = this.state.friendInvitationsSentToMeFilteredBySearch;
    }

    console.log(this.state.suggestedFriends);

    return (
      <div className="opinion-view">
        <Helmet title="Your Friends - We Vote" />
        <div>
          { friendInvitationsSentToMe && friendInvitationsSentToMe.length > 0 ? (
            <span>
              <SectionTitle>Friend Requests</SectionTitle>
              <SearchBar
                clearButton
                searchButton
                placeholder="Search by name"
                searchFunction={this.searchFriends}
                clearFunction={this.clearSearch}
                searchUpdateDelayTime={0}
              />
              <br />
              { this.state.searchFilterOn && friendInvitationsSentToMe.length === 0 ? (
                <p>
                  &quot;
                  {this.state.searchTerm}
                  &quot; not found
                </p>
              ) : null
              }
              <FriendInvitationList
                editMode
                friendList={friendInvitationsSentToMe}
              />
            </span>
          ) : (
            <>
              <div className="card">
                <div className="card-main">
                  <p>You currently have no incoming requests. Send some invites to connect with your friends!</p>
                  <Button variant="contained" color="primary" onClick={() => historyPush('/friends/invite')}>
                    Invite Friends
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

const SectionTitle = styled.h2`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;
