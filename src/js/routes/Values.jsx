import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AnalyticsActions from '../actions/AnalyticsActions';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import OrganizationsToFollowPreview from '../components/Values/OrganizationsToFollowPreview';
import PublicFiguresFollowedPreview from '../components/Values/PublicFiguresFollowedPreview';
import PublicFiguresToFollowPreview from '../components/Values/PublicFiguresToFollowPreview';
import ValuesFollowedPreview from '../components/Values/ValuesFollowedPreview';
import ValuesToFollowPreview from '../components/Values/ValuesToFollowPreview';
import NetworkOpinionsFollowed from '../components/Network/NetworkOpinionsFollowed';
import VoterStore from '../stores/VoterStore';
import TwitterSignInCard from "../components/Twitter/TwitterSignInCard";

// const facebookInfoText = "By signing into Facebook here, you can choose which friends you want to talk politics with, and avoid the trolls (or that guy from work who rambles on)! You control who is in your We Vote network.";

export default class Values extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(
      this.onVoterStoreChange.bind(this),
    );
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

    let valuesBlockToDisplay = null;
    const valuesFollowedCount = 0;
    if (valuesFollowedCount > 0) {
      valuesBlockToDisplay = <ValuesFollowedPreview />;
    } else {
      valuesBlockToDisplay = <ValuesToFollowPreview />;
    }

    let publicFiguresBlockToDisplay = null;
    const publicFiguresFollowedCount = 0;
    if (publicFiguresFollowedCount > 0) {
      publicFiguresBlockToDisplay = <PublicFiguresFollowedPreview />;
    } else {
      publicFiguresBlockToDisplay = <PublicFiguresToFollowPreview />;
    }

    let organizationsBlockToDisplay = null;
    const organizationsFollowedCount = 0;
    if (organizationsFollowedCount > 0) {
      organizationsBlockToDisplay = <NetworkOpinionsFollowed />;
    } else {
      organizationsBlockToDisplay = <OrganizationsToFollowPreview />;
    }

    return (
      <span>
        <Helmet title="Your Network - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="row">
          <div className="col-sm-12 col-md-8">
            {valuesBlockToDisplay}
            {publicFiguresBlockToDisplay}
            {organizationsBlockToDisplay}
          </div>
          <div className="col-md-4 d-none d-md-block">
            {this.state.voter.signed_in_twitter ? null : (
              <TwitterSignInCard />
            )}
          </div>
        </div>
      </span>
    );
  }
}
