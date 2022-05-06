import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import apiCalming from '../../common/utils/apiCalming';
import historyPush from '../../common/utils/historyPush';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';
import { renderLog } from '../../common/utils/logging';
import SuggestedFriendList from './SuggestedFriendList';

export default class SuggestedFriendsPreview extends Component {
  constructor (props) {
    super(props);
    this.state = {
      friendsToShowMax: 3,
      suggestedFriendList: [],
    };
  }

  componentDidMount () {
    const { friendsToShowMaxIncoming } = this.props;
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.onFriendStoreChange();
    if (apiCalming('friendList', 1500)) {
      FriendActions.suggestedFriendList();
    }
    const FRIENDS_TO_SHOW_MAX_DEFAULT = 3;
    const friendsToShowMax = friendsToShowMaxIncoming || FRIENDS_TO_SHOW_MAX_DEFAULT;
    this.setState({
      friendsToShowMax,
    });
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    const suggestedFriendListUnsorted = FriendStore.suggestedFriendList();
    const suggestedFriendList = sortFriendListByMutualFriends(suggestedFriendListUnsorted);
    // console.log('suggestedFriendList:', suggestedFriendList);
    this.setState({
      suggestedFriendList,
    });
  }

  goToSuggestedFriends = () => {
    historyPush('/friends/suggested');
  }

  render () {
    renderLog('SuggestedFriendsPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { inSideColumn } = this.props;
    const { friendsToShowMax, suggestedFriendList } = this.state;
    if (!suggestedFriendList || !(suggestedFriendList.length > 0)) {
      return null;
    }

    const suggestedFriendListLimited = suggestedFriendList.slice(0, friendsToShowMax);

    return (!!(suggestedFriendListLimited && suggestedFriendListLimited.length > 0) && (
      <SuggestedFriendsPreviewWrapper>
        <section>
          <div>
            <SectionTitle className="u-cursor--pointer" onClick={this.goToSuggestedFriends}>
              People You May Know
              {' '}
              (
              {suggestedFriendList.length}
              )
            </SectionTitle>
            <SectionDescription>
              Add friends you feel comfortable talking politics with.
            </SectionDescription>
            <div>
              <SuggestedFriendList
                friendList={suggestedFriendListLimited}
                inSideColumn={inSideColumn}
                previewMode
              />
              {suggestedFriendList.length > friendsToShowMax && <Link to="/friends/suggested">See All</Link>}
            </div>
          </div>
        </section>
      </SuggestedFriendsPreviewWrapper>
    ));
  }
}
SuggestedFriendsPreview.propTypes = {
  friendsToShowMaxIncoming: PropTypes.number,
  inSideColumn: PropTypes.bool,
};

const SectionDescription = styled('div')`
  margin-bottom: 16px;
  width: fit-content;
`;

const SectionTitle = styled('h2')`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 4px;
  width: fit-content;
`;

const SuggestedFriendsPreviewWrapper = styled('div')`
  margin-bottom: 48px;
`;
