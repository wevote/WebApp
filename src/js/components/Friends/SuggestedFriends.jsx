import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import SuggestedFriendList from './SuggestedFriendList';
import MessageCard from '../Widgets/MessageCard';
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
    const { displayedOnDedicatedPage } = this.props;
    const { suggestedFriendList } = this.state;
    if (displayedOnDedicatedPage && (!suggestedFriendList || suggestedFriendList.length === 0)) {
      return (
        <>
          <SectionTitle>
            People You May Know
          </SectionTitle>
          <MessageCard
            mainText="You currently have no suggested friends. Invite your friends to connect!"
            buttonText="Invite Friends"
            buttonURL="/friends/invite"
          />
        </>
      );
    }

    return (
      <>
        {(suggestedFriendList && suggestedFriendList.length > 0) && (
          <SuggestedFriendsWrapper>
            <SectionTitle>
              People You May Know
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
  displayedOnDedicatedPage: PropTypes.bool,
};

const SuggestedFriendsWrapper = styled('div')`
  margin-bottom: 48px;
`;
