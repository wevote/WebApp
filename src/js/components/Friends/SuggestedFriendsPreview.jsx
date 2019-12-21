import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import SuggestedFriendList from './SuggestedFriendList';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';

export default class SuggestedFriendsPreview extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      suggestedFriendList: [],
    };
  }

  componentDidMount () {
    FriendActions.suggestedFriendList();
    this.setState({
      suggestedFriendList: FriendStore.suggestedFriendList(),
    });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      suggestedFriendList: FriendStore.suggestedFriendList(),
    });
  }

  render () {
    renderLog('SuggestedFriendsPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { suggestedFriendList } = this.state;
    if (!suggestedFriendList || !(suggestedFriendList.length > 0)) {
      return null;
    }

    const FRIENDS_TO_SHOW = 3;
    const suggestedFriendListLimited = suggestedFriendList.slice(0, FRIENDS_TO_SHOW);

    return (!!(suggestedFriendListLimited && suggestedFriendListLimited.length > 0) && (
      <div className="opinion-view">
        <section className="card">
          <div className="card-main">
            <SectionTitle>
              People You May Know
              {' '}
              (
              {suggestedFriendList.length}
              )
            </SectionTitle>
            <div>
              <SuggestedFriendList
                friendList={suggestedFriendListLimited}
                previewMode
              />
              {suggestedFriendList.length > FRIENDS_TO_SHOW && <Link to="/friends/suggested">See All</Link>}
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
