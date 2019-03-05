import React, { Component } from 'react';
import { Link } from 'react-router';
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
    renderLog(__filename);
    const { friendInvitationsSentToMe } = this.state;
    if (!friendInvitationsSentToMe || !(friendInvitationsSentToMe.length > 0)) {
      return null;
    }

    const FRIENDS_TO_SHOW = 3;
    const friendInvitationsSentToMeLimited = friendInvitationsSentToMe.slice(0, FRIENDS_TO_SHOW);

    return (friendInvitationsSentToMeLimited && friendInvitationsSentToMeLimited.length > 0 ? (
      <div className="opinion-view">
        <section className="card">
          <div className="card-main">
            <h1 className="h4">Friend Requests</h1>
            <div>
              <FriendInvitationList
                friendList={friendInvitationsSentToMeLimited}
              />
              <Link to="/friends/requests">See All</Link>
            </div>
          </div>
        </section>
      </div>
    ) :
      null
    );
  }
}
