import React, { Component } from 'react';
import { Link } from 'react-router';
import FriendInvitationList from './FriendInvitationList';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';

export default class FriendInvitationsSentByMePreview extends Component {
  static propTypes = {
  };

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
    renderLog(__filename);
    const { friendInvitationsSentByMe } = this.state;
    if (!friendInvitationsSentByMe || !(friendInvitationsSentByMe.length > 0)) {
      return null;
    }

    const FRIENDS_TO_SHOW = 3;
    const friendInvitationsSentByMeLimited = friendInvitationsSentByMe.slice(0, FRIENDS_TO_SHOW);

    return (friendInvitationsSentByMeLimited && friendInvitationsSentByMeLimited.length > 0 ? (
      <div className="opinion-view">
        <section className="card">
          <div className="card-main">
            <h1 className="h4">Your Invitations</h1>
            <div>
              <FriendInvitationList
                friendList={friendInvitationsSentByMeLimited}
              />
              <Link to="/friends/invitationsbyme">See All</Link>
            </div>
          </div>
        </section>
      </div>
    ) :
      null
    );
  }
}
