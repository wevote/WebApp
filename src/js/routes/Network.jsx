import React, { Component } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { Link } from "react-router";
import BrowserPushMessage from "../components/Widgets/BrowserPushMessage";
import FriendActions from "../actions/FriendActions";
import FriendStore from "../stores/FriendStore";
import Helmet from "react-helmet";
import LoadingWheel from "../components/LoadingWheel";
import NetworkFriendRequests from "../components/Network/NetworkFriendRequests";
import NetworkFriends from "../components/Network/NetworkFriends";
import NetworkIssuesFollowed from "../components/Network/NetworkIssuesFollowed";
import NetworkIssuesToFollow from "../components/Network/NetworkIssuesToFollow";
import NetworkOpinions from "../components/Network/NetworkOpinions";
import NetworkOpinionsFollowed from "../components/Network/NetworkOpinionsFollowed";
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
        </div>
      </section>
          <div className="row">
            <div className="col-sm-12 col-md-8">
              <Tabs defaultActiveKey={1} id="tabbed_voter_guide_details">
                <Tab eventKey={1} title={"Friend Requests"}>
                  <NetworkFriendRequests />
                </Tab>

                <Tab eventKey={2} title={"Organizations to Follow"}>
                  <NetworkOpinions />
                </Tab>

                <Tab eventKey={3} title={"Issues to Follow"}>
                  <NetworkIssuesToFollow />
                </Tab>
              </Tabs>
            </div>

            <div className="col-md-4 hidden-xs">
              <NetworkFriends />
              <NetworkOpinionsFollowed />
              <NetworkIssuesFollowed />
            </div>
          </div>
    </span>;
  }
}
