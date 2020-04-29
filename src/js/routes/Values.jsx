import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AddEndorsements from '../components/Widgets/AddEndorsements';
import AnalyticsActions from '../actions/AnalyticsActions';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import { cordovaDot } from '../utils/cordovaUtils';
import IssueStore from '../stores/IssueStore';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import NetworkOpinionsFollowed from '../components/Values/NetworkOpinionsFollowed';
import OrganizationsToFollowPreview from '../components/Values/OrganizationsToFollowPreview';
import PublicFiguresFollowedPreview from '../components/Values/PublicFiguresFollowedPreview';
import PublicFiguresToFollowPreview from '../components/Values/PublicFiguresToFollowPreview';
import Testimonial from '../components/Widgets/Testimonial';
import TestimonialPhoto from '../../img/global/photos/Dale_McGrew-200x200.jpg';
import TwitterSignInCard from '../components/Twitter/TwitterSignInCard';
import ValuesFollowedPreview from '../components/Values/ValuesFollowedPreview';
import ValuesToFollowPreview from '../components/Values/ValuesToFollowPreview';
import VoterStore from '../stores/VoterStore';

// const facebookInfoText = "By signing into Facebook here, you can choose which friends you want to talk politics with, and avoid the trolls (or that guy from work who rambles on)! You control who is in your We Vote network.";

const testimonialAuthor = 'Dale M., Oakland, California';
const imageUrl = cordovaDot(TestimonialPhoto);
const testimonial = 'Following values that are important to me lets me see the opinions of other people who share my values.';

export default class Values extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      issuesFollowedCount: 0,
    };
  }

  componentDidMount () {
    this.onIssueStoreChange();
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onIssueStoreChange () {
    this.setState({
      issuesFollowedCount: IssueStore.getIssuesVoterIsFollowingLength(),
    });
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  componentDidCatch (error, info) {
    console.log('Values.jsx caught: ', error, info.componentStack);
  }

  render () {
    renderLog('Values');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.voter) {
      return LoadingWheel;
    }
    const { issuesFollowedCount } = this.state;

    let publicFiguresBlockToDisplay = null;
    const publicFiguresFollowedCount = 0;
    if (publicFiguresFollowedCount > 0) {
      // console.log('PublicFiguresFollowedPreview');
      publicFiguresBlockToDisplay = <PublicFiguresFollowedPreview />;
    } else {
      // console.log('PublicFiguresToFollowPreview');
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
        <Helmet title="Values, Public Figures & Organizations - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="row">
          <div id="mainContentColumn" className="col-sm-12 col-md-8">
            {issuesFollowedCount ? (
              <ValuesFollowedPreview />
            ) : (
              <div className="d-md-none d-block">
                <div className="card">
                  <div className="card-main">
                    <Testimonial
                      imageUrl={imageUrl}
                      testimonialAuthor={testimonialAuthor}
                      testimonial={testimonial}
                    />
                  </div>
                </div>
              </div>
            )}
            {(issuesFollowedCount) ? null : <ValuesToFollowPreview />}
            {publicFiguresBlockToDisplay}
            {organizationsBlockToDisplay}
          </div>
          <div className="col-md-4 d-none d-md-block">
            <div className="card">
              <div className="card-main">
                <Testimonial
                  imageUrl={imageUrl}
                  testimonialAuthor={testimonialAuthor}
                  testimonial={testimonial}
                />
              </div>
            </div>
            {this.state.voter.signed_in_twitter ? null : (
              <TwitterSignInCard />
            )}
            <AddEndorsements />
          </div>
        </div>
      </span>
    );
  }
}
