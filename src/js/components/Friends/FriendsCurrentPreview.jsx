import styled from 'styled-components';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';
import FriendList from './FriendList';

export default class FriendsCurrentPreview extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentFriendList: [],
    };
  }

  componentDidMount () {
    const currentFriendListUnsorted = FriendStore.currentFriends();
    const currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
    this.setState({
      currentFriendList,
    });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
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

  goToCurrentFriends = () => {
    historyPush('/friends/current');
  }

  render () {
    renderLog('FriendsCurrentPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { currentFriendList } = this.state;
    if (!currentFriendList || !(currentFriendList.length > 0)) {
      return null;
    }

    const FRIENDS_TO_SHOW = 3;
    const currentFriendListLimited = currentFriendList.slice(0, FRIENDS_TO_SHOW);

    return ((currentFriendListLimited && currentFriendListLimited.length > 0) && (
      <YourFriendsPreviewWrapper>
        <section>
          <div>
            <SectionTitle className="u-cursor--pointer" onClick={this.goToCurrentFriends}>
              Your Friends
              {' '}
              (
              {currentFriendList.length}
              )
            </SectionTitle>
            <div>
              <FriendList
                friendList={currentFriendListLimited}
                friendToggleOff
                previewMode
              />
              {currentFriendList.length > FRIENDS_TO_SHOW && <Link to="/friends/current">See All</Link>}
            </div>
          </div>
        </section>
      </YourFriendsPreviewWrapper>
    ));
  }
}

const SectionTitle = styled('h2')`
  width: fit-content;  font-weight: bolder;
  font-size: 18px;
  margin-bottom: 16px;
`;

const YourFriendsPreviewWrapper = styled('div')`
  margin-bottom: 48px;
`;
