import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import FriendInvitationList from './FriendInvitationList';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';

export default class FriendInvitationsSentToMePreview extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsSentToMe: [],
    };
  }

  componentDidMount () {
    FriendActions.friendInvitationsSentToMe();
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
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
    renderLog('FriendInvitationsSentToMePreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendInvitationsSentToMe } = this.state;
    if (!friendInvitationsSentToMe || !(friendInvitationsSentToMe.length > 0)) {
      return null;
    }

    const FRIENDS_TO_SHOW = 3;
    const friendInvitationsSentToMeLimited = friendInvitationsSentToMe.slice(0, FRIENDS_TO_SHOW);

    return (!!(friendInvitationsSentToMeLimited && friendInvitationsSentToMeLimited.length > 0) && (
      <div className="opinion-view">
        <section className="card">
          <div className="card-main">
            <SectionTitle>
              Friend Requests
              {' '}
              (
              {friendInvitationsSentToMe.length}
              )
            </SectionTitle>
            <div>
              <FriendInvitationList
                friendList={friendInvitationsSentToMeLimited}
                previewMode
              />
              {friendInvitationsSentToMe.length > FRIENDS_TO_SHOW && <Link to="/friends/requests">See All</Link>}
            </div>
          </div>
        </section>
      </div>
    ));
  }
}

const SectionTitle = styled.h2`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;
