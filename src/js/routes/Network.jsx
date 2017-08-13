import React, {Component, PropTypes } from "react";
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
  static propTypes = {
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      edit_mode: "",
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
    this.setState({
      edit_mode: this.props.params.edit_mode || "organizations",
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      edit_mode: nextProps.params.edit_mode || "organizations",
    });
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

    let network_component_to_display = null;
    switch (this.state.edit_mode) {
      default:
      case "organizations":
        network_component_to_display = <NetworkOpinions />;
        break;
      case "friends":
        network_component_to_display = <NetworkFriendRequests />;
        break;
      case "issues":
        network_component_to_display = <NetworkIssuesToFollow />;
        break;
    }

    return <span>
      <Helmet title="Your Network - We Vote" />
      <BrowserPushMessage incomingProps={this.props} />
      <section className="card">
        <div className="card-main">
          <h3 className="h3">Build Your We Vote Network</h3>

          {/* Desktop view */}
          <span className="hidden-xs">
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
          </span>

          {/* Mobile view */}
          <span className="visible-xs">
            { this.state.voter.signed_in_twitter ?
              null :
              <span>
                <TwitterSignIn buttonText="Find" buttonSizeClass="btn-md" />
                &nbsp;
              </span>
            }
            <Link to="/facebook_invitable_friends" className="btn btn-social btn-md btn-facebook">
              <i className="fa fa-facebook" />Choose
            </Link>
            &nbsp;
            <Link to="/friends/invitebyemail" className="btn btn-social btn-md btn--email">
              <i className="fa fa-envelope" />Invite
            </Link>
            <div>Get advice from your social networks about your voting decisions.</div>
          </span>
        </div>
      </section>
      <div className="row">
        <div className="col-sm-12 col-md-8">
          <div className="network__network-tabs-container">
            <div className="network__network-tabs hidden-print">
              <ul className="nav network__tabs">
                <li className="tab-item">
                  <Link to="/more/network/organizations" className={this.state.edit_mode === "organizations" ? "tab tab-active" : "tab tab-default"}>
                    <span>Organizations to Follow</span>
                  </Link>
                </li>

                <li className="tab-item">
                  <Link to={{ pathname: "/more/network/friends" }} className={this.state.edit_mode === "friends" ? "tab tab-active" : "tab tab-default"}>
                    <span>Friend Requests</span>
                  </Link>
                </li>

                <li className="tab-item">
                  <Link to={{ pathname: "/more/network/issues" }} className={this.state.edit_mode === "issues" ? "tab tab-active" : "tab tab-default"}>
                    <span>Issues to Follow</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {network_component_to_display}
        </div>

        <div className="col-md-4 hidden-xs">
          <NetworkOpinionsFollowed />
          <NetworkFriends />
          <NetworkIssuesFollowed />
        </div>
      </div>
    </span>;
  }
}
