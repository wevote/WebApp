import React, { Component } from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";
import FriendInvitationList from "../Friends/FriendInvitationList";
import FriendStore from "../../stores/FriendStore";
import LoadingWheel from "../LoadingWheel";
import { renderLog } from "../../utils/logging";
import SuggestedFriendList from "../Friends/SuggestedFriendList";
import VoterStore from "../../stores/VoterStore";

export default class NetworkFriendRequests extends Component {
  constructor (props) {
    super(props);
    this.state = {
      current_friend_list: [],
      friend_invitations_sent_by_me: [],
      friend_invitations_sent_to_me: [],
      friend_invitations_processed: [],
      suggested_friend_list: []
    };
  }

  componentDidMount () {
    // These are all called from js/routes/Network.jsx
    // FriendActions.currentFriends();
    // FriendActions.friendInvitationsSentByMe();
    // FriendActions.friendInvitationsSentToMe();
    // FriendActions.friendInvitationsProcessed();
    // FriendActions.suggestedFriendList();
    this._onFriendStoreChange();
    this._onVoterStoreChange();
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onFriendStoreChange () {
    this.setState({
      current_friend_list: FriendStore.currentFriends(),
      friend_invitations_sent_by_me: FriendStore.friendInvitationsSentByMe(),
      friend_invitations_sent_to_me: FriendStore.friendInvitationsSentToMe(),
      friend_invitations_processed: FriendStore.friendInvitationsProcessed(),
      suggested_friend_list: FriendStore.suggestedFriendList()
    });
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    let floatRight = {
      float: "right",
    };

    return <div className="opinions-followed__container">
      <Helmet title="Friend Requests - We Vote" />
      <section className="card">
        <div className="card-main">
          { this.state.current_friend_list.length ?
            <span style={floatRight}>
              <Link to="/friends" className="u-margin-left--md">See all of your friends</Link>
            </span> :
            null
          }
          { this.state.friend_invitations_sent_to_me.length ?
            <p>Accept invitations from your friends so you can collaborate on how to vote.</p> :
            <p><span>Invitations from your friends will be shown here. </span></p>
          }
        </div>
        <div className="card__additional">
          {/* Invitations you have received */}
          { this.state.friend_invitations_sent_to_me.length ?
            <div>
              <FriendInvitationList friendList={this.state.friend_invitations_sent_to_me} />
            </div> :
            null
          }
          {/* Suggested Friends */}
          { this.state.suggested_friend_list.length ?
            <div>
              <h3 className="card__additional-heading">People You May Know</h3>
              <SuggestedFriendList friendList={this.state.suggested_friend_list} />
            </div> :
            null
          }
          {/* Invitations you have sent */}
          { this.state.friend_invitations_sent_by_me.length ?
            <div>
              <h3 className="card__additional-heading">Invitations From You</h3>
              <p>These are invitations you have sent. Your friends have not replied to them yet.</p>
              <FriendInvitationList friendList={this.state.friend_invitations_sent_by_me}
                                    invitationsSentByMe />
            </div> :
            null
          }
          {/* Invitations you have processed */}
          {/* DALE NOTE 2016-10-19 I don't know how useful this is. Hidden for now.
          { this.state.friend_invitations_processed.length ?
            <div>
              <h3 className="card__additional-heading">Prior Invitations</h3>
              <p>These are invitations that have been accepted.</p>
              <FriendInvitationProcessedList friendList={this.state.friend_invitations_processed} />
            </div> :
            null
          }
          */}
        </div>
      </section>
    </div>;
  }
}
