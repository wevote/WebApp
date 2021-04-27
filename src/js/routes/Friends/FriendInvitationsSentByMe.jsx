import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';

const filter = React.lazy(() => import('lodash-es/filter'));
const FriendInvitationList = React.lazy(() => import('../../components/Friends/FriendInvitationList'));
const SearchBar = React.lazy(() => import('../../components/Search/SearchBar'));
const MessageCard = React.lazy(() => import('../../components/Widgets/MessageCard'));

export default class FriendInvitationsSentByMe extends Component {
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
      const searchedFriendList = filter(friendInvitationsSentByMe,
        (voter) => voter.voter_display_name.toLowerCase().includes(searchTermLowercase));

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
    renderLog('FriendInvitationsSentByMe');  // Set LOG_RENDER_EVENTS to log all renders
    let { friendInvitationsSentByMe } = this.state;
    if (this.state.searchFilterOn) {
      friendInvitationsSentByMe = this.state.friendInvitationsSentByMeFilteredBySearch;
    }

    return (
      <div className="opinion-view">
        <Helmet title="Friend Requests Sent - We Vote" />
        <div>
          { friendInvitationsSentByMe && friendInvitationsSentByMe.length > 0 ? (
            <span>
              <SectionTitle>
                Friend Requests Sent
                { friendInvitationsSentByMe && friendInvitationsSentByMe.length > 0 && (
                  <>
                    {' '}
                    (
                    {friendInvitationsSentByMe.length}
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
              { this.state.searchFilterOn && friendInvitationsSentByMe.length === 0 ? (
                <p>
                  &quot;
                  {this.state.searchTerm}
                  &quot; not found
                </p>
              ) : null}
              <FriendInvitationList
                editMode
                friendList={friendInvitationsSentByMe}
                invitationsSentByMe
              />
            </span>
          ) : (
            <MessageCard
              mainText="You currently have no sent requests. Send some invites to connect with your friends!"
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
  width: fit-content;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;
