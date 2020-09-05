import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import AddEndorsements from '../components/Widgets/AddEndorsements';
import AddFriendsByEmail from '../components/Friends/AddFriendsByEmail';
import AnalyticsActions from '../actions/AnalyticsActions';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import { cordovaDot } from '../utils/cordovaUtils';
import FindOpinionsForm from '../components/ReadyNoApi/FindOpinionsForm';
import IssueActions from '../actions/IssueActions';
import IssueStore from '../stores/IssueStore';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import NetworkOpinionsFollowed from '../components/Values/NetworkOpinionsFollowed';
import OrganizationsToFollowPreview from '../components/Values/OrganizationsToFollowPreview';
import PublicFiguresFollowedPreview from '../components/Values/PublicFiguresFollowedPreview';
import PublicFiguresToFollowPreview from '../components/Values/PublicFiguresToFollowPreview';
import SuggestedFriendsPreview from '../components/Friends/SuggestedFriendsPreview';
import Testimonial from '../components/Widgets/Testimonial';
import TestimonialPhoto from '../../img/global/photos/Dale_McGrew-200x200.jpg';
import TwitterSignInCard from '../components/Twitter/TwitterSignInCard';
import ValuesFollowedPreview from '../components/Values/ValuesFollowedPreview';
import ValuesToFollowPreview from '../components/Values/ValuesToFollowPreview';
import VoterStore from '../stores/VoterStore';

// const facebookInfoText = "By signing into Facebook here, you can choose which friends you want to talk politics with, and avoid the trolls (or that guy from work who rambles on)! You control who is in your We Vote network.";

const testimonialAuthor = 'Dale M., Oakland, California';
const imageUrl = cordovaDot(TestimonialPhoto);
const testimonial = 'I like seeing the opinions of people who share my values.';

export default class Values extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      issuesDisplayDecisionHasBeenMade: false,
      issuesToFollowShouldBeDisplayed: false,
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onIssueStoreChange();
    this.onVoterStoreChange();
    if (!IssueStore.issueDescriptionsRetrieveCalled()) {
      IssueActions.issueDescriptionsRetrieve();
    }
    IssueActions.issuesFollowedRetrieve();
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onIssueStoreChange () {
    const { issuesDisplayDecisionHasBeenMade } = this.state;
    const issuesFollowedCount = IssueStore.getIssuesVoterIsFollowingLength();
    this.setState({
      issuesFollowedCount,
    });
    // console.log('Values, onIssueStoreChange, issuesDisplayDecisionHasBeenMade: ', issuesDisplayDecisionHasBeenMade);
    if (!issuesDisplayDecisionHasBeenMade) {
      const areIssuesLoadedFromAPIServer = IssueStore.areIssuesLoadedFromAPIServer();
      const areIssuesFollowedLoadedFromAPIServer = IssueStore.areIssuesFollowedLoadedFromAPIServer();
      // console.log('areIssuesLoadedFromAPIServer: ', areIssuesLoadedFromAPIServer, ', areIssuesFollowedLoadedFromAPIServer:', areIssuesFollowedLoadedFromAPIServer);
      if (areIssuesLoadedFromAPIServer && areIssuesFollowedLoadedFromAPIServer) {
        // console.log('issuesFollowedCount: ', issuesFollowedCount);
        this.setState({
          issuesDisplayDecisionHasBeenMade: true,
          issuesToFollowShouldBeDisplayed: (issuesFollowedCount <= 3),
        });
      }
    }
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
    const { issuesFollowedCount, issuesToFollowShouldBeDisplayed } = this.state;

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
        <Helmet title="Endorsements - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="row">
          <div id="mainContentColumn" className="col-sm-12 col-md-8">
            <div className="card u-show-mobile-tablet">
              <div className="card-main">
                <FindOpinionsForm
                  headerText="Find Opinions or Endorsements"
                  searchTextLarge
                  uniqueExternalId="showMobileTablet"
                />
              </div>
            </div>
            {publicFiguresBlockToDisplay}
            {organizationsBlockToDisplay}
            {!!(issuesToFollowShouldBeDisplayed) && (
              <div className="u-show-mobile">
                <div className="card">
                  <div className="card-main">
                    <Testimonial
                      imageUrl={imageUrl}
                      testimonialAuthor={testimonialAuthor}
                      testimonial={testimonial}
                    />
                  </div>
                </div>
                <ValuesToFollowPreview
                  includeLinkToIssue
                />
              </div>
            )}
            {!!(issuesFollowedCount) && <ValuesFollowedPreview /> }
            <SuggestedFriendsPreview />
            <div className="card">
              <div className="card-main">
                <SectionTitle>
                  Voting Is Better with Friends
                </SectionTitle>
                <SectionDescription>
                  Add friends you feel comfortable talking politics with.
                </SectionDescription>
                <AddFriendsByEmail uniqueExternalId="ValuesPage" />
              </div>
            </div>
          </div>
          <div className="col-md-4 d-none d-md-block">
            <div className="card u-show-desktop">
              <div className="card-main">
                <FindOpinionsForm
                  headerText="Find Opinions / Endorsements"
                  searchTextLarge
                  uniqueExternalId="showDesktop"
                />
              </div>
            </div>
            {this.state.voter.signed_in_twitter ? null : (
              <TwitterSignInCard />
            )}
            <div className="card">
              <div className="card-main">
                <Testimonial
                  imageUrl={imageUrl}
                  testimonialAuthor={testimonialAuthor}
                  testimonial={testimonial}
                />
              </div>
            </div>
            <ValuesToFollowPreview
              followToggleOnItsOwnLine
              includeLinkToIssue
            />
            <AddEndorsements />
          </div>
        </div>
      </span>
    );
  }
}


const SectionDescription = styled.div`
  color: #999;
  font-size: 14px;
  margin-bottom: 4px;
`;

const SectionTitle = styled.h2`
  width: fit-content;
  font-weight: bolder;
  font-size: 18px;
  margin-bottom: 4px;
  display: inline;
`;
