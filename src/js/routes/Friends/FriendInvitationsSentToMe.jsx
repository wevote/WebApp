import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import filter from 'lodash-es/filter';
import FriendInvitationList from '../../components/Friends/FriendInvitationList';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';
import SearchBar from '../../components/Search/SearchBar';
import MessageCard from '../../components/Widgets/MessageCard';

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
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
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
      const searchedFriendList = filter(friendInvitationsSentToMe,
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

    // console.log(this.state.suggestedFriends);

    return (
      <div className="opinion-view">
        <Helmet title="Friend Requests - We Vote" />
        <div>
          { friendInvitationsSentToMe && friendInvitationsSentToMe.length > 0 ? (
            <span>
              <SectionTitle>
                Friend Requests
                { friendInvitationsSentToMe && friendInvitationsSentToMe.length > 0 && (
                  <>
                    {' '}
                    (
                    {friendInvitationsSentToMe.length}
                    )
                  </>
                )}
              </SectionTitle>
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
            <MessageCard
              mainText="You currently have no incoming requests. Send some invites to connect with your friends!"
              buttonText="Invite Friends"
              buttonURL="/friends/invite"
            />
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
