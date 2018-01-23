import React, {Component, PropTypes } from "react";
import { Link } from "react-router";
import AnalyticsActions from "../actions/AnalyticsActions";
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
import ReadMore from "../components/Widgets/ReadMore";

const twitter_info_text = "Signing into Twitter is the fastest way to find voter guides related to the issues you care about. When you sign into Twitter, We Vote will find the voter guides for everyone you are following.";

const facebook_info_text = "By signing into Facebook here, you can choose which friends you want to talk politics with, and avoid the trolls (or that guy from work who rambles on)! You control who is in your We Vote network.";

const email_info_text = "Send email invitations to your friends. Share your vision, and get help from your friends as you make decisions about how to vote.";

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
    AnalyticsActions.saveActionNetwork(VoterStore.election_id());
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
      <section className="card network__card">
        <div className="card-main">
          <h3 className="h3 text-center">Build Your We Vote Network</h3>

          {/* Desktop view */}
          <div className="hidden-xs buttons-container">
            { this.state.voter.signed_in_twitter ?
              null :
              <div className="network-btn">
                <TwitterSignIn className="text-center" buttonText="Find Voter Guides" />
                <ReadMore
                  className="social-btn-description"
                  text_to_display={twitter_info_text}
                  num_of_lines={2}
                />
              </div>
            }
            <div className="network-btn">
              <Link to="/facebook_invitable_friends" className="btn btn-social btn-lg btn-facebook text-center">
                <i className="fa fa-facebook" />Choose Friends
              </Link>
              <ReadMore
                className="social-btn-description"
                text_to_display={facebook_info_text}
                num_of_lines={2}
              />
              </div>
            <div className="network-btn">
            <Link to="/friends/invitebyemail" className="btn btn-social btn-lg btn--email text-center">
              <i className="fa fa-envelope" />Invite Friends
            </Link>
            <ReadMore
              className="social-btn-description"
              text_to_display={email_info_text}
              num_of_lines={2}
            />
            </div>
          </div>

          {/* Mobile view */}
          <div className="mobile-container">
            { this.state.voter.signed_in_twitter ?
              null :
              <div className="network-btn">
                <TwitterSignIn className="text-center" buttonText="Find" buttonSizeClass="btn-md" />
              </div>
            }
            <div className="network-btn">
              <Link to="/facebook_invitable_friends" className="btn btn-social btn-md btn-facebook">
                <i className="fa fa-facebook" />Choose
              </Link>
            </div>
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
                  <Link to="/more/network/organizations" className={this.state.edit_mode === "organizations" ? "tab tab-active" : "tab tab-default"}>
                    <span className="visible-xs">Organizations</span>
                    <span className="hidden-xs">Listen to Organizations</span>
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
