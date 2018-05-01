import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import AnalyticsActions from "../actions/AnalyticsActions";
import BrowserPushMessage from "../components/Widgets/BrowserPushMessage";
import { isWebApp } from "../utils/cordovaUtils";
import FriendActions from "../actions/FriendActions";
import FriendStore from "../stores/FriendStore";
import Helmet from "react-helmet";
import LoadingWheel from "../components/LoadingWheel";
import { renderLog } from "../utils/logging";
import NetworkFriendRequests from "../components/Network/NetworkFriendRequests";
import NetworkFriends from "../components/Network/NetworkFriends";
import NetworkIssuesFollowed from "../components/Network/NetworkIssuesFollowed";
import NetworkIssuesToFollow from "../components/Network/NetworkIssuesToFollow";
import NetworkOpinions from "../components/Network/NetworkOpinions";
import NetworkOpinionsFollowed from "../components/Network/NetworkOpinionsFollowed";
import TwitterSignIn from "../components/Twitter/TwitterSignIn";
import VoterStore from "../stores/VoterStore";
import ReadMore from "../components/Widgets/ReadMore";

const twitterInfoText = "Signing into Twitter is the fastest way to find voter guides related to the issues you care about. When you sign into Twitter, We Vote will find the voter guides for everyone you are following.";

const facebookInfoText = "By signing into Facebook here, you can choose which friends you want to talk politics with, and avoid the trolls (or that guy from work who rambles on)! You control who is in your We Vote network.";

const EmailInfoText = "Send email invitations to your friends. Share your vision, and get help from your friends as you make decisions about how to vote.";

export default class Network extends Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      edit_mode: "",
      friend_invitations_sent_by_me: [],
      friend_invitations_sent_to_me: [],
      friend_invitations_processed: [],
      suggested_friend_list: [],
    };
  }

  componentDidMount () {
    FriendActions.currentFriends();
    FriendActions.friendInvitationsSentByMe();
    FriendActions.friendInvitationsSentToMe();
    FriendActions.friendInvitationsProcessed();
    FriendActions.suggestedFriendList();
    this.onFriendStoreChange();
    this.onVoterStoreChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setState({ pathname: this.props.location.pathname });
    AnalyticsActions.saveActionNetwork(VoterStore.election_id());
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.friend_invitations_sent_to_me.length > 0) {  // has invitations
      if (nextProps.location.pathname === "/more/network" || !nextProps.params.edit_mode) {
        this.setState({edit_mode: "friends"});
      } else {
        this.setState({edit_mode: nextProps.params.edit_mode});
      }
    } else if (this.state.suggested_friend_list.length > 0) {  // has suggested friends
      if (nextProps.location.pathname === "/more/network" || !nextProps.params.edit_mode) {
        this.setState({ edit_mode: "friends" });
      } else {
        this.setState({ edit_mode: nextProps.params.edit_mode });
      }
    } else if (nextProps.location.pathname === "/more/network" || !nextProps.params.edit_mode) {
      this.setState({ edit_mode: "issues" });
    } else {
      this.setState({ edit_mode: nextProps.params.edit_mode });
    }
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFriendStoreChange () {
    let newState = {
      friend_invitations_sent_by_me: FriendStore.friendInvitationsSentByMe(),
      friend_invitations_sent_to_me: FriendStore.friendInvitationsSentToMe(),
      friend_invitations_processed: FriendStore.friendInvitationsProcessed(),
      suggested_friend_list: FriendStore.suggestedFriendList(),
    };

    if (newState.friend_invitations_sent_to_me.length > 0) {  //has invitations
      if (this.state.pathname === "/more/network") {
        newState.edit_mode = "friends";
      } else {
        newState.edit_mode = this.props.params.edit_mode || "friends";
      }
    } else if (this.state.pathname === "/more/network") {  //no invitations
      newState.edit_mode = "issues";
    } else {
      newState.edit_mode = this.props.params.edit_mode || "issues";
    }

    this.setState(newState);
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    let networkComponentToDisplay = null;
    switch (this.state.edit_mode) {
      default:
      case "organizations":
        networkComponentToDisplay = <NetworkOpinions />;
        break;
      case "friends":
        networkComponentToDisplay = <NetworkFriendRequests />;
        break;
      case "issues":
        networkComponentToDisplay = <NetworkIssuesToFollow />;
        break;
    }

    return <span>
      <Helmet title="Your Network - We Vote" />
      <BrowserPushMessage incomingProps={this.props} />
      <section className="card network__card">
        <div className="card-main">
          <h3 className="h3 text-center">Build Your We Vote Network</h3>

          {/* Desktop view */}
          <div className="hidden-xs buttons-container">
            { this.state.voter.signed_in_twitter ?
              null :
              <div className="network-btn">
                <TwitterSignIn className="btn btn-social btn-lg btn-twitter text-center" buttonText="Find Voter Guides" />
                <ReadMore
                  className="social-btn-description"
                  text_to_display={twitterInfoText}
                  num_of_lines={2}
                />
              </div>
            }
            {/* February 2018, Facebook and Magic Email disabled for Cordova */}
            {isWebApp() &&
            <div className="network-btn">
              <Link to="/facebook_invitable_friends" className="btn btn-social btn-lg btn-facebook text-center">
                <i className="fa fa-facebook"/>Choose Friends
              </Link>
              <ReadMore
                className="social-btn-description"
                text_to_display={facebookInfoText}
                num_of_lines={2}
              />
            </div>
            }
            <div className="network-btn">
            <Link to="/friends/invitebyemail" className="btn btn-social btn-lg btn--email text-center">
              <i className="fa fa-envelope" />Invite Friends
            </Link>
            <ReadMore
              className="social-btn-description"
              text_to_display={EmailInfoText}
              num_of_lines={2}
            />
            </div>
          </div>

          {/* Mobile view */}
          <div className="mobile-container">
            { this.state.voter.signed_in_twitter ?
              null :
              <div className="network-btn">
                <TwitterSignIn buttonText="Find" className="btn btn-social btn-md btn-twitter" />
              </div>
            }
            {/* February 2018, Facebook and Magic Email disabled for Cordova */}
            {isWebApp() &&
              <div className="network-btn">
                <Link to="/facebook_invitable_friends" className="btn btn-social btn-md btn-facebook">
                  <i className="fa fa-facebook"/>Choose
                </Link>
              </div>
            }
            <div className="network-btn">
              <Link to="/friends/invitebyemail" className="btn btn-social btn-md btn--email">
                <i className="fa fa-envelope" />Invite
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="row">
        <div className="col-sm-12 col-md-8">
          <div className="tabs__tabs-container-wrap">
            <div className="tabs__tabs-container hidden-print">
              <ul className="nav tabs__tabs">
                <li className="tab-item">
                  <Link to={{ pathname: "/more/network/friends" }} className={this.state.edit_mode === "friends" ? "tab tab-active" : "tab tab-default"}>
                    <span className="visible-xs">Requests</span>
                    <span className="hidden-xs">Friend Requests</span>
                  </Link>
                </li>

                <li className="tab-item">
                  <Link to={{ pathname: "/more/network/issues" }} className={this.state.edit_mode === "issues" ? "tab tab-active" : "tab tab-default"}>
                    <span className="visible-xs">Issues</span>
                    <span className="hidden-xs">Issues to Follow</span>
                  </Link>
                </li>

                <li className="tab-item">
                  <Link to="/more/network/organizations" className={this.state.edit_mode === "organizations" ? "tab tab-active" : "tab tab-default"}>
                    <span className="visible-xs">Organizations</span>
                    <span className="hidden-xs">Listen to Organizations</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {networkComponentToDisplay}
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
