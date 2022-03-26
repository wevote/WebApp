import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import { renderLog } from '../../common/utils/logging';
import FriendInvitationList from '../../components/Friends/FriendInvitationList';
import MessageCard from '../../components/Widgets/MessageCard';
import FriendStore from '../../stores/FriendStore';

class FriendInvitationsSentToMe extends Component {
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
    renderLog('FriendInvitationsSentToMe');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendInvitationsSentToMe } = this.state;
    // console.log(this.state.suggestedFriends);
    return (
      <div className="opinion-view">
        <Helmet title="Friend Requests - We Vote" />
        <div>
          { friendInvitationsSentToMe && friendInvitationsSentToMe.length > 0 ? (
            <span>
              <SectionTitle>
                <>
                  Friend Requests
                  {' '}
                  (
                  {friendInvitationsSentToMe.length}
                  )
                </>
              </SectionTitle>
              <p>
                <Link className="u-link-color" to="/friends/sent-requests">See invitations you have sent to friends.</Link>
              </p>
              <FriendInvitationList
                editMode
                friendList={friendInvitationsSentToMe}
              />
            </span>
          ) : (
            <>
              <MessageCard
                mainText="You have no incoming friend requests. Invite your friends to connect!"
                buttonText="Invite Friends"
                buttonURL="/friends/invite"
              />
              <p>
                <Link to="/friends/sent-requests">See invitations you have sent to friends.</Link>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }
}

const SectionTitle = styled('h2')`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
  width: fit-content;
`;

export default FriendInvitationsSentToMe;
