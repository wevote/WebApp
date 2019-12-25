import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import FriendInvitationList from '../../components/Friends/FriendInvitationList';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';
import MessageCard from '../../components/Widgets/MessageCard';

export default class FriendInvitationsSentToMe extends Component {
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
                Friend Requests
                { friendInvitationsSentToMe && friendInvitationsSentToMe.length > 0 && (
                  <>
                    {' '}
                    (
                    {friendInvitationsSentToMe.length}
                    )
                  </>
                )}
              </SectionTitle>
              <FriendInvitationList
                editMode
                friendList={friendInvitationsSentToMe}
              />
            </span>
          ) : (
            <MessageCard
              mainText="You currently have no incoming requests. Send some invites to connect with your friends!"
              buttonText="Invite Friends"
              buttonURL="/friends/invite"
            />
          )}
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
