import React, { Component } from "react";
import FriendInvitationList from "../components/Friends/FriendInvitationList";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";

export default class RequestsPage extends Component {
  constructor (props) {
      super(props);
      this.state = {
        friend_invitations_sent_by_me: VoterStore.friendInvitationsSentByMe(),
        friend_invitations_sent_to_me: VoterStore.friendInvitationsSentToMe()
      };
  }

  componentDidMount () {
    VoterActions.currentFriends();
    VoterActions.friendInvitationsSentByMe();
    VoterActions.friendInvitationsSentToMe();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({
      friend_invitations_sent_by_me: VoterStore.friendInvitationsSentByMe(),
      friend_invitations_sent_to_me: VoterStore.friendInvitationsSentToMe()
    });
  }

	render () {
    return <section className="card">
			<h3 className="text-center">Friend Requests</h3>
			<p>Friends will be able to reach out to you so you can collaborate on how to vote.</p>
      <div className="card__additional">
        {/* Invitations you have received */}
        { this.state.friend_invitations_sent_to_me ?
          <div>
            <FriendInvitationList friendList={this.state.friend_invitations_sent_to_me} />
          </div> :
          null
        }
        {/* Invitations you have sent */}
        { this.state.friend_invitations_sent_by_me.length ?
          <div><h3 className="card__additional-heading">Invitations You Have Sent</h3>
            <FriendInvitationList friendList={this.state.friend_invitations_sent_by_me}
                                  invitationsSentByMe />
          </div> :
          null
        }
      </div>
    </section>;

	}
}
