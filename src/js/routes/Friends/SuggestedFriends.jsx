import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import _ from 'lodash';
import SuggestedFriendList from '../../components/Friends/SuggestedFriendList';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';
import SearchBar from '../../components/Search/SearchBar';

export default class SuggestedFriends extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      suggestedFriendList: [],
      suggestedFriendListFilteredBySearch: [],
      searchFilterOn: false,
      searchTerm: '',
    };
    this.clearSearch = this.clearSearch.bind(this);
    this.searchFriends = this.searchFriends.bind(this);
  }

  componentDidMount () {
    FriendActions.suggestedFriendList();
    this.setState({
      suggestedFriendList: FriendStore.suggestedFriendList(),
    });

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      suggestedFriendList: FriendStore.suggestedFriendList(),
    });
  }

  searchFriends (searchTerm) {
    if (searchTerm.length === 0) {
      this.setState({
        suggestedFriendListFilteredBySearch: [],
        searchFilterOn: false,
        searchTerm: '',
      });
    } else {
      const searchTermLowercase = searchTerm.toLowerCase();
      const { suggestedFriendList } = this.state;
      const searchedFriendList = _.filter(suggestedFriendList,
        voter => voter.voter_display_name.toLowerCase().includes(searchTermLowercase));

      this.setState({
        suggestedFriendListFilteredBySearch: searchedFriendList,
        searchFilterOn: true,
        searchTerm,
      });
    }
  }

  clearSearch () {
    this.setState({
      searchFilterOn: false,
      searchTerm: '',
      suggestedFriendListFilteredBySearch: [],
    });
  }

  render () {
    renderLog('SuggestedFriend');  // Set LOG_RENDER_EVENTS to log all renders
    let { suggestedFriendList } = this.state;
    if (this.state.searchFilterOn) {
      suggestedFriendList = this.state.suggestedFriendListFilteredBySearch;
    }

    return (
      <div className="opinion-view">
        <Helmet title="Your Friends - We Vote" />
        <SectionTitle>Suggested Friends</SectionTitle>
        <div>
          { suggestedFriendList && suggestedFriendList.length > 0 ? (
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
              { this.state.searchFilterOn && suggestedFriendList.length === 0 ? (
                <p>
                  &quot;
                  {this.state.searchTerm}
                  &quot; not found
                </p>
              ) : null
              }
              <SuggestedFriendList
                friendList={suggestedFriendList}
                editMode
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

const SectionTitle = styled.h2`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;
