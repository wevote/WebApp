import React, { Component } from 'react';
import { Link } from 'react-router';
import FriendListCompressed from './FriendListCompressed';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';

export default class FriendsCurrentPreview extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      currentFriendList: [],
    };
  }

  componentDidMount () {
    FriendActions.currentFriends();
    this.setState({
      currentFriendList: FriendStore.currentFriends(),
    });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      currentFriendList: FriendStore.currentFriends(),
    });
  }

  render () {
    renderLog(__filename);
    const { currentFriendList } = this.state;
    if (!currentFriendList || !(currentFriendList.length > 0)) {
      return null;
    }

    const FRIENDS_TO_SHOW = 3;
    const currentFriendListLimited = currentFriendList.slice(0, FRIENDS_TO_SHOW);

    return (currentFriendListLimited && currentFriendListLimited.length > 0 ? (
      <div className="opinion-view">
        <section className="card">
          <div className="card-main">
            <h1 className="h4">Your Friends</h1>
            <div>
              <FriendListCompressed
                friendList={currentFriendListLimited}
              />
              <Link to="/friends/current">See All</Link>
            </div>
          </div>
        </section>
      </div>
    ) :
      null
    );
  }
}
