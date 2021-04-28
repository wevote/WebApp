import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import TestimonialPhoto from '../../img/global/photos/Dale_McGrew-200x200.jpg';
import AnalyticsActions from '../actions/AnalyticsActions';
import IssueActions from '../actions/IssueActions';
import LoadingWheel from '../components/LoadingWheel';
import Testimonial from '../components/Widgets/Testimonial';
import IssueStore from '../stores/IssueStore';
import VoterStore from '../stores/VoterStore';
import { cordovaDot } from '../utils/cordovaUtils';
import { renderLog } from '../utils/logging';

const AddEndorsements = React.lazy(() => import('../components/Widgets/AddEndorsements'));
const AddFriendsByEmail = React.lazy(() => import('../components/Friends/AddFriendsByEmail'));
const BrowserPushMessage = React.lazy(() => import('../components/Widgets/BrowserPushMessage'));
const FindOpinionsForm = React.lazy(() => import('../components/Ready/FindOpinionsForm'));
const FirstAndLastNameRequiredAlert = React.lazy(() => import('../components/Widgets/FirstAndLastNameRequiredAlert'));
const NetworkOpinionsFollowed = React.lazy(() => import('../components/Values/NetworkOpinionsFollowed'));
const OrganizationsToFollowPreview = React.lazy(() => import('../components/Values/OrganizationsToFollowPreview'));
const PublicFiguresFollowedPreview = React.lazy(() => import('../components/Values/PublicFiguresFollowedPreview'));
const PublicFiguresToFollowPreview = React.lazy(() => import('../components/Values/PublicFiguresToFollowPreview'));
const SuggestedFriendsPreview = React.lazy(() => import('../components/Friends/SuggestedFriendsPreview'));
const TwitterSignInCard = React.lazy(() => import('../components/Twitter/TwitterSignInCard'));
const ValuesFollowedPreview = React.lazy(() => import('../components/Values/ValuesFollowedPreview'));
const ValuesToFollowPreview = React.lazy(() => import('../components/Values/ValuesToFollowPreview'));

// const facebookInfoText = "By signing into Facebook here, you can choose which friends you want to talk politics with, and avoid the trolls (or that guy from work who rambles on)! You control who is in your We Vote network.";

const testimonialAuthor = 'Dale M., Oakland, California';
const imageUrl = cordovaDot(TestimonialPhoto);
const testimonial = 'I like seeing the opinions of people who share my values.';

export default class Values extends Component {
  constructor (props) {
    super(props);
    this.state = {
      issuesDisplayDecisionHasBeenMade: false,
      issuesToFollowShouldBeDisplayed: false,
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onIssueStoreChange();
    this.onVoterStoreChange();
    IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
    IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());
  }

  componentDidCatch (error, info) {
    console.log('Values.jsx caught: ', error, info.componentStack);
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
    this.setState({
      voter: VoterStore.getVoter(),
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    });
  }

  render () {
    renderLog('Values');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.voter) {
      return LoadingWheel;
    }
    const { issuesFollowedCount, issuesToFollowShouldBeDisplayed, voterIsSignedIn } = this.state;

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
            {voterIsSignedIn && (
              <FirstAndLastNameRequiredAlert />
            )}
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
Values.propTypes = {
};

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
