import { filter } from 'lodash-es';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import { renderLog } from '../../common/utils/logging';
import FriendInvitationList from '../../components/Friends/FriendInvitationList';
import SearchBar from '../../components/Search/SearchBar';
import MessageCard from '../../components/Widgets/MessageCard';
import FriendStore from '../../stores/FriendStore';

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
    window.scrollTo(0, 0);
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
              <p>
                <Link className="u-link-color" to="/friends/requests">See friend requests you have received.</Link>
              </p>
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
            <>
              <MessageCard
                mainText="You haven't sent any requests. Invite your friends to connect!"
                buttonText="Invite Friends"
                buttonURL="/friends/invite"
              />
              <p>
                <Link to="/friends/requests">See invitations sent to you.</Link>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }
}

const SectionTitle = styled('h2')`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
  width: fit-content;
`;
