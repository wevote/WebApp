import styled from 'styled-components';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FriendActions from '../../actions/FriendActions';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import FriendStore from '../../stores/FriendStore';
import FriendInvitationList from './FriendInvitationList';

export default class FriendInvitationsSentByMePreview extends Component {
  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentByMe: [],
    };
  }

  componentDidMount () {
    this.setState({
      friendInvitationsSentByMe: FriendStore.friendInvitationsSentByMe(),
    });
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
      friendInvitationsSentByMe: FriendStore.friendInvitationsSentByMe(),
    });
  }

  render () {
    renderLog('FriendInvitationsSentByMePreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendInvitationsSentByMe } = this.state;
    if (!friendInvitationsSentByMe || !(friendInvitationsSentByMe.length > 0)) {
      return null;
    }
    // console.log('friendInvitationsSentByMe:', friendInvitationsSentByMe);

    const FRIENDS_TO_SHOW = 1;
    const friendInvitationsSentByMeLimited = friendInvitationsSentByMe.slice(0, FRIENDS_TO_SHOW);

    return (!!(friendInvitationsSentByMeLimited && friendInvitationsSentByMeLimited.length > 0) && (
      <FriendInvitationsSentByMePreviewWrapper>
        <section>
          <div>
            <SectionTitle>
              Friend Requests Sent
              {' '}
              (
              {friendInvitationsSentByMe.length}
              )
            </SectionTitle>
            <div>
              <FriendInvitationList
                friendList={friendInvitationsSentByMeLimited}
                invitationsSentByMe
                previewMode
              />
              {friendInvitationsSentByMe.length > FRIENDS_TO_SHOW && <Link to="/friends/sent-requests">See All</Link>}
            </div>
          </div>
        </section>
      </FriendInvitationsSentByMePreviewWrapper>
    ));
  }
}

const SectionTitle = styled('h2')`
  width: fit-content;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;

const FriendInvitationsSentByMePreviewWrapper = styled('div')`
  margin-bottom: 48px;
`;
