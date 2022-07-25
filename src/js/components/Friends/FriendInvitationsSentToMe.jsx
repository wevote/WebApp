import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import FriendInvitationList from './FriendInvitationList';
import FriendStore from '../../stores/FriendStore';

class FriendInvitationsSentToMe extends Component {
  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentToMe: [],
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.onFriendStoreChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    if (apiCalming('friendListsAll', 5000)) {
      FriendActions.friendListsAll();
    }
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });
  }

  render () {
    renderLog('FriendInvitationsSentToMe');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendInvitationsSentToMe } = this.state;
    // console.log(this.state.suggestedFriends);
    return (
      <>
        {(friendInvitationsSentToMe && friendInvitationsSentToMe.length > 0) && (
          <FriendInvitationsWrapper>
            <SectionTitle>
              <>
                Friend Requests
              </>
            </SectionTitle>
            <FriendInvitationList
              editMode
              friendList={friendInvitationsSentToMe}
            />
            <AlignRight>
              <Link className="u-link-color" to="/friends/sent-requests">See invitations you&apos;ve sent to friends</Link>
            </AlignRight>
          </FriendInvitationsWrapper>
        )}
      </>
    );
  }
}

const AlignRight = styled('div')`
  display: flex;
  justify-content: flex-end;
`;

const FriendInvitationsWrapper = styled('div')`
  margin-bottom: 48px;
`;

const SectionTitle = styled('h2')`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
  width: fit-content;
`;

export default FriendInvitationsSentToMe;
