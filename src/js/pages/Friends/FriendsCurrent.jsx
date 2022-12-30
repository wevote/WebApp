import { filter } from 'lodash-es';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import FriendList from '../../components/Friends/FriendList';
import SearchBar from '../../components/Search/SearchBar';
import FriendStore from '../../stores/FriendStore';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';

export default class FriendsCurrent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentFriendList: [],
      currentFriendListFilteredBySearch: [],
      searchFilterOn: false,
      searchTerm: '',
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.searchFriends = this.searchFriends.bind(this);
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    if (apiCalming('friendListsAll', 3000)) {
      FriendActions.friendListsAll();
    }
    const currentFriendListUnsorted = FriendStore.currentFriends();
    const currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
    this.setState({
      currentFriendList,
    });
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    const currentFriendListUnsorted = FriendStore.currentFriends();
    const currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
    this.setState({
      currentFriendList,
    });
  }

  searchFriends (searchTerm) {
    if (searchTerm.length === 0) {
      this.setState({
        currentFriendListFilteredBySearch: [],
        searchFilterOn: false,
        searchTerm: '',
      });
    } else {
      const searchTermLowercase = searchTerm.toLowerCase();
      const { currentFriendList } = this.state;
      const searchedFriendList = filter(currentFriendList,
        (voter) => voter.voter_display_name.toLowerCase().includes(searchTermLowercase));

      this.setState({
        currentFriendListFilteredBySearch: searchedFriendList,
        searchFilterOn: true,
        searchTerm,
      });
    }
  }

  clearSearch () {
    this.setState({
      searchFilterOn: false,
      searchTerm: '',
      currentFriendListFilteredBySearch: [],
    });
  }

  render () {
    renderLog('FriendsCurrent');  // Set LOG_RENDER_EVENTS to log all renders
    const { currentFriendListFilteredBySearch, searchFilterOn, searchTerm } = this.state;
    const { currentFriendList } = this.state;
    let { currentFriendList: friendListForDisplay } = this.state;
    if (searchFilterOn) {
      friendListForDisplay = currentFriendListFilteredBySearch;
    }
    const messageToFriendType = 'remindContacts';
    return (
      <FriendsCurrentWrapper>
        <Helmet title="Your Friends - We Vote" />
        {(currentFriendList && currentFriendList.length > 0) && (
          <>
            <SectionTitle>
              Your Friends
              {' '}
              (
              {currentFriendList.length}
              )
            </SectionTitle>
            <SearchBar
              clearButton
              searchButton
              placeholder="Search by name"
              searchFunction={this.searchFriends}
              clearFunction={this.clearSearch}
              searchUpdateDelayTime={250}
            />
            <br />
            { (searchFilterOn && friendListForDisplay.length === 0) && (
              <p>
                &quot;
                {searchTerm}
                &quot; not found
              </p>
            )}
          </>
        )}
        <div>
          <FriendList
            friendList={friendListForDisplay}
            messageToFriendType={messageToFriendType}
          />
        </div>
      </FriendsCurrentWrapper>
    );
  }
}

const FriendsCurrentWrapper = styled('div')`
`;

const SectionTitle = styled('h2')`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;
