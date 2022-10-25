import React, { Component } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import SuggestedFriendList from './SuggestedFriendList';
import FriendStore from '../../stores/FriendStore';
import { SectionDescription, SectionTitle } from '../Style/friendStyles';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';

export default class SuggestedFriends extends Component {
  constructor (props) {
    super(props);
    this.state = {
      suggestedFriendList: [],
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.onFriendStoreChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    const suggestedFriendListUnsorted = FriendStore.suggestedFriendList();
    const suggestedFriendList = sortFriendListByMutualFriends(suggestedFriendListUnsorted);
    this.setState({
      suggestedFriendList,
    });
  }

  render () {
    renderLog('SuggestedFriends');  // Set LOG_RENDER_EVENTS to log all renders
    const { suggestedFriendList } = this.state;

    return (
      <>
        {(suggestedFriendList && suggestedFriendList.length > 0) && (
          <SuggestedFriendsWrapper>
            <SectionTitle>
              People you may know
            </SectionTitle>
            <SectionDescription>
              Add friends you feel comfortable talking politics with.
            </SectionDescription>
            <SuggestedFriendList
              friendList={suggestedFriendList}
              editMode
            />
          </SuggestedFriendsWrapper>
        )}
      </>
    );
  }
}
SuggestedFriends.propTypes = {
};

const SuggestedFriendsWrapper = styled('div')`
  margin-bottom: 48px;
`;
