import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import ActivityActions from '../actions/ActivityActions';
import AnalyticsActions from '../actions/AnalyticsActions';
import AppActions from '../actions/AppActions';
import BallotActions from '../actions/BallotActions';
import FriendActions from '../actions/FriendActions';
import IssueActions from '../actions/IssueActions';
import ReadyActions from '../actions/ReadyActions';
import EditAddressOneHorizontalRow from '../components/Ready/EditAddressOneHorizontalRow';
import ElectionCountdown from '../components/Ready/ElectionCountdown';
import FindOpinionsForm from '../components/Ready/FindOpinionsForm';
import ReadyInformationDisclaimer from '../components/Ready/ReadyInformationDisclaimer';
import ReadyIntroduction from '../components/Ready/ReadyIntroduction';
import ReadyTaskBallot from '../components/Ready/ReadyTaskBallot';
import ReadyTaskFriends from '../components/Ready/ReadyTaskFriends';
import ReadyTaskPlan from '../components/Ready/ReadyTaskPlan';
import ReadyTaskRegister from '../components/Ready/ReadyTaskRegister';
import ShareButtonDesktopTablet from '../components/Share/ShareButtonDesktopTablet';
import ValuesToFollowPreview from '../components/Values/ValuesToFollowPreview';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import SnackNotifier from '../components/Widgets/SnackNotifier';
import webAppConfig from '../config';
import AppStore from '../stores/AppStore';
import BallotStore from '../stores/BallotStore';
import IssueStore from '../stores/IssueStore';
import VoterStore from '../stores/VoterStore';
import cookies from '../utils/cookies';
import { historyPush, isAndroid, isIOS, isWebApp } from '../utils/cordovaUtils';
import initializejQuery from '../utils/initializejQuery';
import lazyWithPreload from '../utils/lazyWithPreload';
import { renderLog } from '../utils/logging';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../components/Widgets/ReadMore'));
const FirstAndLastNameRequiredAlert = React.lazy(() => import(/* webpackChunkName: 'FirstAndLastNameRequiredAlert' */ '../components/Widgets/FirstAndLastNameRequiredAlert'));
// import PledgeToVote from '../components/Ready/PledgeToVote';

// Preloads to avoid Suspense/fallback
const Ballot = lazyWithPreload(() => import(/* webpackChunkName: 'ballot' */ '../routes/Ballot/Ballot'));

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class Ready extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenReadyIntroductionText: '',
      chosenReadyIntroductionTitle: '',
      issuesDisplayDecisionHasBeenMade: false,
      issuesQueriesMade: false,
      issuesShouldBeDisplayed: false,
      textForMapSearch: '',
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onAppStoreChange();
    this.onIssueStoreChange();
    this.onVoterStoreChange();
    initializejQuery(() => {
      this.positionItemTimer = setTimeout(() => {
        // This is a performance killer, so let's delay it for a few seconds
        if (!BallotStore.ballotFound) {
          // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
          BallotActions.voterBallotItemsRetrieve(0, '', '');
        }
      }, 5000);  // April 19, 2021: Tuned to keep performance above 83.  LCP at 597ms

      // this.positionItemTimer2 = setTimeout(() => {
      ReadyActions.voterPlansForVoterRetrieve();
      ActivityActions.activityNoticeListRetrieve();
      FriendActions.suggestedFriendList();
      // }, 2500);


      let modalToShow = '';
      let sharedItemCode = '';
      if (this.props.match) {
        const { match: { params: { modal_to_show: mts, shared_item_code: sic } } } = this.props;
        modalToShow = mts;
        sharedItemCode = sic;
      }
      modalToShow = modalToShow || '';
      // console.log('componentDidMount modalToOpen:', modalToOpen);
      if (modalToShow === 'share') {
        this.modalOpenTimer = setTimeout(() => {
          AppActions.setShowShareModal(true);
        }, 1000);
      } else if (modalToShow === 'sic') { // sic = Shared Item Code
        sharedItemCode = sharedItemCode || '';
        // console.log('componentDidMount sharedItemCode:', sharedItemCode);
        if (sharedItemCode) {
          this.modalOpenTimer = setTimeout(() => {
            AppActions.setShowSharedItemModal(sharedItemCode);
          }, 1000);
        }
      } else {
        AppActions.setEvaluateHeaderDisplay();
      }

      this.analyticsTimer = setTimeout(() => {
        AnalyticsActions.saveActionReadyVisit(VoterStore.electionId());
      }, 8000);

      this.setState({
        locationGuessClosed: cookies.getItem('location_guess_closed'),
        textForMapSearch: VoterStore.getTextForMapSearch(),
      });
    });
    this.preloadTimer = setTimeout(() => {
      Ballot.preload();
    }, 2000);
  }

  componentDidCatch (error, info) {
    console.log('Ready.jsx caught: ', error, info.componentStack);
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.issueStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.modalOpenTimer) {
      clearTimeout(this.modalOpenTimer);
      this.modalOpenTimer = null;
    }
    if (this.positionItemTimer) {
      clearTimeout(this.positionItemTimer);
      this.positionItemTimer = null;
    }
    if (this.preloadTimer) {
      clearTimeout(this.preloadTimer);
      this.preloadTimer = null;
    }
  }

  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    console.log('Error in Ready: ', error);
    return { hasError: true };
  }

  onAppStoreChange () {
    this.setState({
      chosenReadyIntroductionText: AppStore.getChosenReadyIntroductionText(),
      chosenReadyIntroductionTitle: AppStore.getChosenReadyIntroductionTitle(),
    });
  }

  onIssueStoreChange () {
    const { issuesDisplayDecisionHasBeenMade } = this.state;
    // console.log('Ready, onIssueStoreChange, issuesDisplayDecisionHasBeenMade: ', issuesDisplayDecisionHasBeenMade);
    if (!issuesDisplayDecisionHasBeenMade) {
      const areIssuesLoadedFromAPIServer = IssueStore.areIssuesLoadedFromAPIServer();
      const areIssuesFollowedLoadedFromAPIServer = IssueStore.areIssuesFollowedLoadedFromAPIServer();
      // console.log('areIssuesLoadedFromAPIServer: ', areIssuesLoadedFromAPIServer, ', areIssuesFollowedLoadedFromAPIServer:', areIssuesFollowedLoadedFromAPIServer);
      if (areIssuesLoadedFromAPIServer && areIssuesFollowedLoadedFromAPIServer) {
        const issuesFollowedCount = IssueStore.getIssuesVoterIsFollowingLength();
        // console.log('issuesFollowedCount: ', issuesFollowedCount);
        this.setState({
          issuesDisplayDecisionHasBeenMade: true,
          issuesShouldBeDisplayed: (issuesFollowedCount < 3),
        });
      }
    }
  }

  onVoterStoreChange () {
    const textForMapSearch = VoterStore.getTextForMapSearch();
    const { issuesQueriesMade } = this.state;
    if (!issuesQueriesMade) {
      // this.delayIssuesTimer = setTimeout(() => {
      // April 18, 2021: TODO: These API calls are always executed in pairs, they probably should be a single API
      // They take 1.15 seconds to complete! (in parallel)
      IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
      IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
      // }, 400);
    }
    this.setState({
      textForMapSearch,
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
      issuesQueriesMade: true,
    });
  }

  goToBallot = () => {
    historyPush('/ballot');
  }

  getTopPadding = () => {
    if (isWebApp()) {
      return { paddingTop: '0 !important' };
    } else if (isIOS()) {
      // TODO: This is a bad place to set a top padding: Move it to Application__Wrapper on the next iOS pass
      return { paddingTop: '56px !important' };  // SE2: 56px, 11 Pro Max: 56px
    } else if (isAndroid()) {
      return { paddingTop: 'unset' };
    }
    return {};
  }

  render () {
    renderLog('Ready');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      chosenReadyIntroductionText, chosenReadyIntroductionTitle, issuesShouldBeDisplayed,
      locationGuessClosed, textForMapSearch, voterIsSignedIn,
    } = this.state;

    const showAddressVerificationForm = !locationGuessClosed || !textForMapSearch;
    // console.log('locationGuessClosed:', locationGuessClosed, ', textForMapSearch:', textForMapSearch, ', showAddressVerificationForm:', showAddressVerificationForm);
    return (
      <Wrapper className="page-content-container">
        <PageContainer className="container-fluid" style={this.getTopPadding()}>
          <SnackNotifier />
          <Helmet title="Ready to Vote? - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="row">
            {(showAddressVerificationForm) && (
              <EditAddressWrapper className="col-12">
                <EditAddressOneHorizontalRow saveUrl="/ready" />
              </EditAddressWrapper>
            )}
            <div className="col-sm-12 col-lg-8">
              <MobileTabletCountdownWrapper className="u-show-mobile-tablet">
                <ShareButtonTabletWrapper>
                  <ShareButtonInnerWrapper className="u-show-tablet">
                    <ShareButtonDesktopTablet readyShare shareButtonText="Share" />
                  </ShareButtonInnerWrapper>
                </ShareButtonTabletWrapper>
                <ElectionCountdownMobileTabletWrapper
                  className="u-cursor--pointer u-show-mobile-tablet"
                  onClick={this.goToBallot}
                >
                  <ElectionCountdown daysOnlyMode initialDelay={4000} />
                </ElectionCountdownMobileTabletWrapper>
              </MobileTabletCountdownWrapper>
              {(chosenReadyIntroductionTitle || chosenReadyIntroductionText) && (
                <Card className="card u-show-mobile-tablet">
                  <div className="card-main">
                    <Title>
                      {chosenReadyIntroductionTitle}
                    </Title>
                    <Paragraph>
                      <ReadMore
                        textToDisplay={chosenReadyIntroductionText}
                        numberOfLines={3}
                      />
                    </Paragraph>
                  </div>
                </Card>
              )}
              <ReadyInformationDisclaimer top />
              <ReadyTaskBallot
                arrowsOn
              />
              <Card className="card u-show-mobile">
                <div className="card-main">
                  <FindOpinionsForm
                    introHeaderLink="/values"
                    searchTextLarge
                    showVoterGuidePhotos
                    uniqueExternalId="showMobile"
                  />
                </div>
              </Card>
              <Card className="card u-show-mobile">
                <div className="card-main">
                  <ReadyIntroduction />
                </div>
              </Card>
              <IntroAndFindTabletWrapper className="u-show-tablet">
                <IntroductionWrapper>
                  <Card className="card">
                    <div className="card-main">
                      <ReadyIntroduction />
                    </div>
                  </Card>
                </IntroductionWrapper>
                <IntroAndFindTabletSpacer />
                <FindWrapper>
                  <Card className="card">
                    <div className="card-main">
                      <FindOpinionsForm
                        introHeaderLink="/values"
                        searchTextLarge
                        showVoterGuidePhotos
                        uniqueExternalId="showTablet"
                      />
                    </div>
                  </Card>
                </FindWrapper>
              </IntroAndFindTabletWrapper>
              {nextReleaseFeaturesEnabled && (
                <ReadyTaskRegister
                  arrowsOn
                />
              )}
              <ReadyTaskPlan
                arrowsOn
              />
              <ReadyInformationDisclaimer bottom />
              {voterIsSignedIn && (
                <FirstAndLastNameRequiredAlert />
              )}
              {nextReleaseFeaturesEnabled && (
                <ReadyTaskFriends
                  arrowsOn
                />
              )}
              <div className="u-show-mobile-tablet">
                {(issuesShouldBeDisplayed) && (
                  <ValuesListWrapper>
                    <ValuesToFollowPreview
                      followToggleOnItsOwnLine
                      includeLinkToIssue
                    />
                  </ValuesListWrapper>
                )}
              </div>
            </div>
            <div className="col-lg-4 d-none d-lg-block">
              <Card className="card">
                <div className="card-main">
                  <ShareButtonDesktopWrapper>
                    <ShareButtonDesktopTablet readyShare shareButtonText="Share Page" />
                  </ShareButtonDesktopWrapper>
                </div>
              </Card>
              <div className="u-cursor--pointer" onClick={this.goToBallot}>
                <Suspense fallback={<SuspenseCard>&nbsp;</SuspenseCard>}>
                  <ElectionCountdown daysOnlyMode initialDelay={4000} />
                </Suspense>
              </div>
              {(chosenReadyIntroductionTitle || chosenReadyIntroductionText) && (
                <Card className="card">
                  <div className="card-main">
                    <Title>
                      {chosenReadyIntroductionTitle}
                    </Title>
                    <Paragraph>
                      {chosenReadyIntroductionText}
                    </Paragraph>
                  </div>
                </Card>
              )}
              <Card className="card">
                <div className="card-main">
                  <FindOpinionsForm
                    introHeaderLink="/values"
                    searchTextLarge
                    showVoterGuidePhotos
                    uniqueExternalId="showDesktopRightColumn"
                  />
                </div>
              </Card>
              <Card className="card">
                <div className="card-main">
                  <ReadyIntroduction
                    showStep3WhenCompressed
                  />
                </div>
              </Card>
              {(issuesShouldBeDisplayed) && (
                <ValuesListWrapper>
                  <ValuesToFollowPreview
                    followToggleOnItsOwnLine
                    includeLinkToIssue
                  />
                </ValuesListWrapper>
              )}
              {/* nextReleaseFeaturesEnabled && <PledgeToVote /> */}
            </div>
          </div>
        </PageContainer>
      </Wrapper>
    );
  }
}
Ready.propTypes = {
  match: PropTypes.object,
};

const styles = (theme) => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const Card = styled.div`
  padding-bottom: 4px;
`;

const EditAddressWrapper = styled.div`
  margin-bottom: 8px !important;
  margin-left: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
`;

const ElectionCountdownMobileTabletWrapper = styled.div`
  margin-top: -37px; // 29px for height of ShareButtonDesktopTablet - 8px for margin-top
`;

const SuspenseCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 290px;
  height: 138px;
`;

const FindWrapper = styled.div`
  width: 40%;
`;

const IntroductionWrapper = styled.div`
  width: 60%;
`;

const IntroAndFindTabletWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const IntroAndFindTabletSpacer = styled.div`
  width: 20px;
`;

const MobileTabletCountdownWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const PageContainer = styled.div`
// This is a bad place to set a top padding for the scrollable pane, it should be in Application__Wrapper
`;

const Paragraph = styled.div`
`;

const ShareButtonInnerWrapper = styled.div`
  z-index: 2;
`;

const ShareButtonDesktopWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ShareButtonTabletWrapper = styled.div`
  display: flex;
  height: 29px;
  justify-content: flex-end;
  margin-top: 8px;
  margin-right: 8px;
  z-index: 2;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 12px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 14px;
    margin: 0 0 4px;
  }
`;

const ValuesListWrapper = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(Ready);
