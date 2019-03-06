import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AnalyticsActions from '../actions/AnalyticsActions';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import AddFriendsByEmail from '../components/Friends/AddFriendsByEmail';
import FriendsCurrentPreview from '../components/Friends/FriendsCurrentPreview';
import FriendInvitationsSentByMePreview from '../components/Friends/FriendInvitationsSentByMePreview';
import FriendInvitationsSentToMePreview from '../components/Friends/FriendInvitationsSentToMePreview';
import SuggestedFriendsPreview from '../components/Friends/SuggestedFriendsPreview';
import TwitterSignIn from '../components/Twitter/TwitterSignIn';
import VoterStore from '../stores/VoterStore';

const twitterInfoText = 'Signing into Twitter is the fastest way to find voter guides related to your values and the issues you care about. When you sign into Twitter, We Vote will find the voter guides for everyone you are following.';

// const facebookInfoText = "By signing into Facebook here, you can choose which friends you want to talk politics with, and avoid the trolls (or that guy from work who rambles on)! You control who is in your We Vote network.";

export default class Friends extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    return (
      <span>
        <Helmet title="Friends - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="row">
          <div className="col-sm-12 col-md-8">
            <FriendInvitationsSentToMePreview />
            <SuggestedFriendsPreview />
            <section className="card">
              <div className="card-main">
                <h1 className="h4">
                  Add Friends by Email
                </h1>
                <AddFriendsByEmail />
              </div>
            </section>
            <FriendsCurrentPreview />
            <FriendInvitationsSentByMePreview />
          </div>

          <div className="col-md-4 d-none d-sm-block">
            { this.state.voter.signed_in_twitter ?
              null : (
                <div className="network-btn">
                  <TwitterSignIn className="btn btn-social btn-lg btn-twitter text-center" buttonText="Sign In to Find Voter Guides" />
                  {twitterInfoText}
                </div>
              )
            }
          </div>
        </div>
      </span>
    );
  }
}
