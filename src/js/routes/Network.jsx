import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import BrowserPushMessage from "../components/Widgets/BrowserPushMessage";
import FriendInvitationList from "../components/Friends/FriendInvitationList";
import FriendActions from "../actions/FriendActions";
import FriendStore from "../stores/FriendStore";
import Helmet from "react-helmet";
import LoadingWheel from "../components/LoadingWheel";
import SuggestedFriendList from "../components/Friends/SuggestedFriendList";
import TwitterSignIn from "../components/Twitter/TwitterSignIn";
import VoterStore from "../stores/VoterStore";

export default class Network extends Component {
  constructor (props) {
    super(props);
    this.state = {
      friend_invitations_sent_by_me: [],
      friend_invitations_sent_to_me: [],
      friend_invitations_processed: [],
      suggested_friend_list: []
    };
  }

  componentDidMount () {
    FriendActions.currentFriends();
    FriendActions.friendInvitationsSentByMe();
    FriendActions.friendInvitationsSentToMe();
    FriendActions.friendInvitationsProcessed();
    FriendActions.suggestedFriendList();
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
    if (!this.state.voter){
      return LoadingWheel;
    }
    return <span>
      <Helmet title="Your Network - We Vote" />
      <BrowserPushMessage incomingProps={this.props} />
      <section className="card">
        <div className="card-main">
          <h3 className="h3">Build Your We Vote Network</h3>

          { this.state.voter.signed_in_twitter ?
            null :
            <span>
              <TwitterSignIn buttonText="Find Voter Guides" />
              &nbsp;&nbsp;&nbsp;
            </span>
          }

          <Link to="/facebook_invitable_friends" className="btn btn-social btn-lg btn-facebook">
            <i className="fa fa-facebook" />Choose Friends&nbsp;&nbsp;&nbsp;
          </Link>
          &nbsp;&nbsp;&nbsp;

          <Link to="/friends/invitebyemail" className="btn btn-social btn-lg btn--email">
            <i className="fa fa-envelope" />Invite Friends&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </Link>
          <div className="u-inset__v--md">
            <Link to="/opinions_followed" className="u-push--lg">Organizations you are following</Link>
            <Link to="/issues_followed" className="u-push--lg">Issues you are following</Link>
          </div>
        </div>
      </section>
      <section className="card">
        <div className="card-main">
          <h3 className="h3">Friend Requests</h3>
          { this.state.friend_invitations_sent_to_me.length ?
            <p>Accept invitations from your friends so you can collaborate on how to vote.</p> :
            <p><span>Invitations from your friends are shown here. </span>
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
