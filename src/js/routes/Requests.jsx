import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import BrowserPushMessage from "../components/Widgets/BrowserPushMessage";
import FriendInvitationList from "../components/Friends/FriendInvitationList";
// import FriendInvitationProcessedList from "../components/Friends/FriendInvitationProcessedList";
import FriendActions from "../actions/FriendActions";
import FriendStore from "../stores/FriendStore";
import Helmet from "react-helmet";

export default class RequestsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      friend_invitations_sent_by_me: [],
      friend_invitations_sent_to_me: [],
      friend_invitations_processed: []
    };
  }

  componentDidMount () {
    FriendActions.currentFriends();
    FriendActions.friendInvitationsSentByMe();
    FriendActions.friendInvitationsSentToMe();
    FriendActions.friendInvitationsProcessed();
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.friendStoreListener.remove();
  }

  _onFriendStoreChange () {
    this.setState({
      friend_invitations_sent_by_me: FriendStore.friendInvitationsSentByMe(),
      friend_invitations_sent_to_me: FriendStore.friendInvitationsSentToMe(),
      friend_invitations_processed: FriendStore.friendInvitationsProcessed()
    });
  }

  render () {
    return <span>
      <Helmet title="Friend Requests - We Vote" />
      <BrowserPushMessage incomingProps={this.props} />
      <section className="card">
        <div className="card-main">
          <h3 className="h3">Friend Requests</h3>
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
              <p>These are invitations you have sent. Your friends have not replied to them yet.</p>
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
    </span>;
  }
}
