import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import AnalyticsActions from '../actions/AnalyticsActions';
import IssueActions from '../actions/IssueActions';
import LoadingWheelComp from '../common/components/Widgets/LoadingWheelComp';
import apiCalming from '../common/utils/apiCalming';
import { displayNoneIfSmallerThanDesktop } from '../common/utils/isMobileScreenSize';
import { renderLog } from '../common/utils/logging';
import normalizedImagePath from '../common/utils/normalizedImagePath';
import AddFriendsByEmail from '../components/Friends/AddFriendsByEmail';
import SuggestedFriendsPreview from '../components/Friends/SuggestedFriendsPreview';
import FindOpinionsForm from '../components/Ready/FindOpinionsForm';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import TwitterSignInCard from '../components/Twitter/TwitterSignInCard';
import NetworkOpinionsFollowed from '../components/Values/NetworkOpinionsFollowed';
import OrganizationsToFollowPreview from '../components/Values/OrganizationsToFollowPreview';
import PublicFiguresFollowedPreview from '../components/Values/PublicFiguresFollowedPreview';
import PublicFiguresToFollowPreview from '../components/Values/PublicFiguresToFollowPreview';
import ValuesFollowedPreview from '../components/Values/ValuesFollowedPreview';
import ValuesToFollowPreview from '../components/Values/ValuesToFollowPreview';
import AddEndorsements from '../components/Widgets/AddEndorsements';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import SnackNotifier, { openSnackbar } from '../common/components/Widgets/SnackNotifier';
import Testimonial from '../components/Widgets/Testimonial';
import AppObservableStore from '../common/stores/AppObservableStore';
import IssueStore from '../stores/IssueStore';
import VoterStore from '../stores/VoterStore';
// Lint is not smart enough to know that lazyPreloadPages will not attempt to preload/reload this page
// eslint-disable-next-line import/no-cycle
import lazyPreloadPages from '../utils/lazyPreloadPages';

const FirstAndLastNameRequiredAlert = React.lazy(() => import(/* webpackChunkName: 'FirstAndLastNameRequiredAlert' */ '../components/Widgets/FirstAndLastNameRequiredAlert'));

const testimonialPhoto = '../../img/global/photos/Dale_McGrew-48x48.jpg';

// const facebookInfoText = "By signing into Facebook here, you can choose which friends you want to talk politics with, and avoid the trolls (or that guy from work who rambles on)! You control who is in your We Vote network.";
const testimonialAuthor = 'Dale M., Oakland, California';
const imageUrl = normalizedImagePath(testimonialPhoto);
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
    if (apiCalming('issueDescriptionsRetrieve', 3600000)) { // Only once per 60 minutes
      IssueActions.issueDescriptionsRetrieve();
    }
    if (apiCalming('issuesFollowedRetrieve', 60000)) { // Only once per minute
      IssueActions.issuesFollowedRetrieve();
    }
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());
    this.preloadTimer = setTimeout(() => lazyPreloadPages(), 2000);
  }

  componentDidUpdate () {
    if (AppObservableStore.isSnackMessagePending()) openSnackbar({});
  }

  componentDidCatch (error, info) {
    console.log('!!!Values.jsx caught: ', error, info.componentStack);
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterStoreListener.remove();
    clearTimeout(this.preloadTimer);
  }

  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    console.log('!!!Error in Values: ', error);
    return { hasError: true };
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
      return <LoadingWheelComp />;
    }
    const { issuesFollowedCount, issuesToFollowShouldBeDisplayed, voterIsSignedIn } = this.state;

    let publicFiguresBlockToDisplay;
    const publicFiguresFollowedCount = 0;
    if (publicFiguresFollowedCount > 0) {
      // console.log('PublicFiguresFollowedPreview');
      publicFiguresBlockToDisplay = <PublicFiguresFollowedPreview />;
    } else {
      // console.log('PublicFiguresToFollowPreview');
      publicFiguresBlockToDisplay = <PublicFiguresToFollowPreview />;
    }

    let organizationsBlockToDisplay;
    const organizationsFollowedCount = 0;
    if (organizationsFollowedCount > 0) {
      organizationsBlockToDisplay = <NetworkOpinionsFollowed />;
    } else {
      organizationsBlockToDisplay = <OrganizationsToFollowPreview />;
    }

    return (
      <PageContentContainer>
        <Suspense fallback={<LoadingWheelComp />}>
          <div className="container-fluid">
            <SnackNotifier />
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
                  <Suspense fallback={<></>}>
                    <FirstAndLastNameRequiredAlert />
                  </Suspense>
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
                <ValuesCard>
                  <div className="card-main">
                    <FindOpinionsForm
                      headerText="Find Opinions / Endorsements"
                      searchTextLarge
                      uniqueExternalId="showDesktop"
                    />
                  </div>
                </ValuesCard>
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
          </div>
        </Suspense>
      </PageContentContainer>
    );
  }
}
Values.propTypes = {
};

const ValuesCard = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  ${() => displayNoneIfSmallerThanDesktop()};
`;

const SectionDescription = styled('div')`
  color: #999;
  font-size: 14px;
  margin-bottom: 4px;
`;

const SectionTitle = styled('h2')`
  width: fit-content;
  font-weight: bolder;
  font-size: 18px;
  margin-bottom: 4px;
  display: inline;
`;
