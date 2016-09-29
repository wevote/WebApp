import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import FriendInvitationList from "../components/Friends/FriendInvitationList";
import FriendActions from "../actions/FriendActions";
import FriendStore from "../stores/FriendStore";

export default class RequestsPage extends Component {
  constructor (props) {
      super(props);
      this.state = {
        friend_invitations_sent_by_me: FriendStore.friendInvitationsSentByMe(),
        friend_invitations_sent_to_me: FriendStore.friendInvitationsSentToMe()
      };
  }

  componentDidMount () {
    FriendActions.currentFriends();
    FriendActions.friendInvitationsSentByMe();
    FriendActions.friendInvitationsSentToMe();
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.friendStoreListener.remove();
  }

  _onFriendStoreChange () {
    this.setState({
      friend_invitations_sent_by_me: FriendStore.friendInvitationsSentByMe(),
      friend_invitations_sent_to_me: FriendStore.friendInvitationsSentToMe()
    });
  }

	render () {
    return <section className="card">
      <div className="card-main">
        <h3 className="text-center">Friend Requests</h3>
        { this.state.friend_invitations_sent_to_me.length ?
          <p>Accept invitations from your friends so you can collaborate on how to vote.</p> :
          <p><span>Invitations from your friends will be shown here. </span>
            { this.state.friend_invitations_sent_by_me.length ?
              null :
              <span>
                <Link to="/more/connect">Send invitations</Link> to your friends so you can collaborate on how to vote.
              </span> }
            <span> <Link to="/friends">See your friends.</Link></span>
          </p> }
      </div>
      <div className="card__additional">
        {/* Invitations you have received */}
        { this.state.friend_invitations_sent_to_me.length ?
          <div>
            <FriendInvitationList friendList={this.state.friend_invitations_sent_to_me} />
          </div> :
          null
        }
        {/* Invitations you have sent */}
        { this.state.friend_invitations_sent_by_me.length ?
          <div>
            <h3 className="card__additional-heading">Invitations From You</h3>
            <FriendInvitationList friendList={this.state.friend_invitations_sent_by_me}
                                  invitationsSentByMe />
            <Link to="/more/connect">
              <Button bsStyle="link">
                Invite More Friends
              </Button>
            </Link>
          </div> :
          null
        }
      </div>
    </section>;
	}
}
