import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../common/utils/logging';
import FriendInvitationList from './FriendInvitationList';

export default class FriendInvitationsSentByMePreview extends Component {
  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentByMe: [],
    };
  }

  componentDidMount () {
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

  render () {
    renderLog('FriendInvitationsSentByMePreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendInvitationsSentByMe } = this.state;
    if (!friendInvitationsSentByMe || !(friendInvitationsSentByMe.length > 0)) {
      return null;
    }

    const FRIENDS_TO_SHOW = 1;
    const friendInvitationsSentByMeLimited = friendInvitationsSentByMe.slice(0, FRIENDS_TO_SHOW);

    return (!!(friendInvitationsSentByMeLimited && friendInvitationsSentByMeLimited.length > 0) && (
      <div className="opinion-view">
        <section className="card">
          <div className="card-main">
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
      </div>
    ));
  }
}

const SectionTitle = styled.h2`
  width: fit-content;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;
