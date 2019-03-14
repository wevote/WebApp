import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import FriendInvitationList from '../Friends/FriendInvitationList';
import FriendStore from '../../stores/FriendStore';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import SuggestedFriendList from '../Friends/SuggestedFriendList';
import VoterStore from '../../stores/VoterStore';

export default class NetworkFriendRequests extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentFriendList: [],
      friendInvitationsSentByMe: [],
      friendInvitationsSentToMe: [],
      suggestedFriendList: [],
    };
  }

  componentDidMount () {
    // These are all called from js/routes/Network.jsx
    // FriendActions.currentFriends();
    // FriendActions.friendInvitationsSentByMe();
    // FriendActions.friendInvitationsSentToMe();
    // FriendActions.friendInvitationsProcessed();
    // FriendActions.suggestedFriendList();
    this.onFriendStoreChange();
    this.onVoterStoreChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      currentFriendList: FriendStore.currentFriends(),
      friendInvitationsSentByMe: FriendStore.friendInvitationsSentByMe(),
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      suggestedFriendList: FriendStore.suggestedFriendList(),
    });
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    const floatRight = {
      float: 'right',
    };

    return (
      <div className="opinions-followed__container">
        <Helmet title="Friend Requests - We Vote" />
        <section className="card">
          <div className="card-main">
            { this.state.currentFriendList.length ? (
              <span style={floatRight}>
                <Link to="/friends" className="u-margin-left--md">See all of your friends</Link>
              </span>
            ) : null
            }
            { this.state.friendInvitationsSentToMe.length ?
              <p>Accept invitations from your friends so you can collaborate on how to vote.</p> :
              <p><span>Invitations from your friends will be shown here. </span></p>
            }
          </div>
          <div className="card__additional">
            {/* Invitations you have received */}
            { this.state.friendInvitationsSentToMe.length ? (
              <div>
                <FriendInvitationList friendList={this.state.friendInvitationsSentToMe} />
              </div>
            ) : null
            }
            {/* Suggested Friends */}
            { this.state.suggestedFriendList.length ? (
              <div>
                <h3 className="card__additional-heading">People You May Know</h3>
                <SuggestedFriendList friendList={this.state.suggestedFriendList} />
              </div>
            ) : null
            }
            {/* Invitations you have sent */}
            { this.state.friendInvitationsSentByMe.length ? (
              <div>
                <h3 className="card__additional-heading">Invitations From You</h3>
                <div className="card__additional-text">These are invitations you have sent. Your friends have not replied to them yet.</div>
                <FriendInvitationList
                  friendList={this.state.friendInvitationsSentByMe}
                  invitationsSentByMe
                />
              </div>
            ) : null
            }
          </div>
        </section>
      </div>
    );
  }
}
