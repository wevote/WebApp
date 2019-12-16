import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import _ from 'lodash';
import FriendList from '../../components/Friends/FriendList';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';
import SearchBar from '../../components/Search/SearchBar';

export default class FriendsCurrent extends Component {
  static propTypes = {
  };

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
    FriendActions.currentFriends();
    this.setState({
      currentFriendList: FriendStore.currentFriends(),
    });

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
      const searchedFriendList = _.filter(currentFriendList,
        voter => voter.voter_display_name.toLowerCase().includes(searchTermLowercase));

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
    let { currentFriendList } = this.state;
    if (this.state.searchFilterOn) {
      currentFriendList = this.state.currentFriendListFilteredBySearch;
    }

    return (
      <div className="opinion-view">
        <Helmet title="Your Friends - We Vote" />
        <SectionTitle>Your Friends</SectionTitle>
        <div>
          { currentFriendList && currentFriendList.length > 0 ? (
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
              { this.state.searchFilterOn && currentFriendList.length === 0 ? (
                <p>
                  &quot;
                  {this.state.searchTerm}
                  &quot; not found
                </p>
              ) : null
              }
              <FriendList
                friendList={currentFriendList}
                editMode
              />
            </span>
          ) : (
            <MessageCard 
              mainText="You currently have no friends on We Vote. Send some invites to connect with your friends!"
              buttonText="Invite Friends"
              buttonURL="/friends/invite"
            />
          )
          }
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
