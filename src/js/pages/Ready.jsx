import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import ActivityActions from '../actions/ActivityActions';
import AnalyticsActions from '../actions/AnalyticsActions';
import BallotActions from '../actions/BallotActions';
import FriendActions from '../actions/FriendActions';
import IssueActions from '../actions/IssueActions';
import ReadyActions from '../actions/ReadyActions';
import apiCalming from '../common/utils/apiCalming';
import { isAndroid, isIOS } from '../common/utils/cordovaUtils';
import daysUntil from '../common/utils/daysUntil';
import historyPush from '../common/utils/historyPush';
import { isWebApp } from '../common/utils/isCordovaOrWebApp';
import { renderLog } from '../common/utils/logging';
import ReadyFinePrint from '../components/Ready/ReadyFinePrint';
import ReadyIntroduction from '../components/Ready/ReadyIntroduction';
import ReadyTaskPlan from '../components/Ready/ReadyTaskPlan';
import ReadyTaskRegister from '../components/Ready/ReadyTaskRegister';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import SnackNotifier, { openSnackbar } from '../components/Widgets/SnackNotifier';
import webAppConfig from '../config';
import AppObservableStore, { messageService } from '../stores/AppObservableStore';
import BallotStore from '../stores/BallotStore';
import IssueStore from '../stores/IssueStore';
import VoterStore from '../stores/VoterStore';
// Lint is not smart enough to know that lazyPreloadPages will not attempt to preload/reload this page
// eslint-disable-next-line import/no-cycle
import lazyPreloadPages from '../utils/lazyPreloadPages';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../common/components/Widgets/DelayedLoad'));
const ElectionCountdown = React.lazy(() => import(/* webpackChunkName: 'ElectionCountdown' */ '../components/Ready/ElectionCountdown'));
const FirstAndLastNameRequiredAlert = React.lazy(() => import(/* webpackChunkName: 'FirstAndLastNameRequiredAlert' */ '../components/Widgets/FirstAndLastNameRequiredAlert'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../common/components/Widgets/ReadMore'));
const ReadyPageValuesList = React.lazy(() => import(/* webpackChunkName: 'ReadyPageValuesList' */ '../components/Values/ReadyPageValuesList'));
const ReadyTaskFriends = React.lazy(() => import(/* webpackChunkName: 'ReadyTaskFriends' */ '../components/Ready/ReadyTaskFriends'));
// import PledgeToVote from '../components/Ready/PledgeToVote';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;
const futureFeaturesDisabled = true;

class Ready extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenReadyIntroductionText: '',
      chosenReadyIntroductionTitle: '',
      electionDataExistsForUpcomingElection: false,
      issuesDisplayDecisionHasBeenMade: false,
      issuesQueriesMade: false,
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onAppObservableStoreChange();
    this.onBallotStoreChange();
    this.onIssueStoreChange();
    this.onVoterStoreChange();
    this.positionItemTimer = setTimeout(() => {
      // This is a performance killer, so let's delay it for a few seconds
      if (!BallotStore.ballotFound) {
        // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
        BallotActions.voterBallotItemsRetrieve(0, '', '');
      }
    }, 5000);  // April 19, 2021: Tuned to keep performance above 83.  LCP at 597ms

    ReadyActions.voterPlansForVoterRetrieve();
    if (apiCalming('activityNoticeListRetrieve', 10000)) {
      ActivityActions.activityNoticeListRetrieve();
    }
    if (apiCalming('friendListsAll', 30000)) {
      FriendActions.getAllFriendLists();
    }
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
        AppObservableStore.setShowShareModal(true);
      }, 1000);
    } else if (modalToShow === 'sic') { // sic = Shared Item Code
      sharedItemCode = sharedItemCode || '';
      // console.log('componentDidMount sharedItemCode:', sharedItemCode);
      if (sharedItemCode) {
        this.modalOpenTimer = setTimeout(() => {
          AppObservableStore.setShowSharedItemModal(sharedItemCode);
        }, 1000);
      }
    } else {
      AppObservableStore.setEvaluateHeaderDisplay();
    }

    this.analyticsTimer = setTimeout(() => {
      AnalyticsActions.saveActionReadyVisit(VoterStore.electionId());
    }, 8000);

    this.preloadTimer = setTimeout(() => lazyPreloadPages(), 2000);
    window.scrollTo(0, 0);
  }

  componentDidUpdate () {
    if (AppObservableStore.isSnackMessagePending()) openSnackbar({});
  }

  componentDidCatch (error, info) {
    console.log('!!!Ready.jsx caught: ', error, info.componentStack);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.ballotStoreListener.remove();
    this.issueStoreListener.remove();
    this.voterStoreListener.remove();
    clearTimeout(this.analyticsTimer);
    clearTimeout(this.modalOpenTimer);
    clearTimeout(this.positionItemTimer);
    clearTimeout(this.preloadTimer);
  }

  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    console.log('!!!Error in Ready: ', error);
    return { hasError: true };
  }

  onAppObservableStoreChange () {
    this.setState({
      chosenReadyIntroductionText: AppObservableStore.getChosenReadyIntroductionText(),
      chosenReadyIntroductionTitle: AppObservableStore.getChosenReadyIntroductionTitle(),
    });
  }

  onBallotStoreChange () {
    // console.log('Ready.jsx onBallotStoreChange');
    const nextElectionDayText = BallotStore.currentBallotElectionDate;
    if (nextElectionDayText) {
      const daysUntilNextElection = daysUntil(nextElectionDayText);
      if (daysUntilNextElection >= 0) {
        this.setState({
          electionDataExistsForUpcomingElection: true,
        });
      } else {
        // Election was yesterday or earlier
        this.setState({
          electionDataExistsForUpcomingElection: false,
        });
      }
    }
  }

  onIssueStoreChange () {
    const { issuesDisplayDecisionHasBeenMade } = this.state;
    // console.log('Ready, onIssueStoreChange, issuesDisplayDecisionHasBeenMade: ', issuesDisplayDecisionHasBeenMade);
    if (!issuesDisplayDecisionHasBeenMade) {
      const areIssuesLoadedFromAPIServer = IssueStore.areIssuesLoadedFromAPIServer();
      const areIssuesFollowedLoadedFromAPIServer = IssueStore.areIssuesFollowedLoadedFromAPIServer();
      // console.log('areIssuesLoadedFromAPIServer: ', areIssuesLoadedFromAPIServer, ', areIssuesFollowedLoadedFromAPIServer:', areIssuesFollowedLoadedFromAPIServer);
      if (areIssuesLoadedFromAPIServer && areIssuesFollowedLoadedFromAPIServer) {
        this.setState({
          issuesDisplayDecisionHasBeenMade: true,
        });
      }
    }
  }

  onVoterStoreChange () {
    // console.log('Ready, onVoterStoreChange voter: ', VoterStore.getVoter());
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
      chosenReadyIntroductionText, chosenReadyIntroductionTitle,
      electionDataExistsForUpcomingElection, voterIsSignedIn,
    } = this.state;

    return (
      <PageContentContainer>
        <Suspense fallback={<></>}>
          <ReadyPageContainer className="container-fluid" style={this.getTopPadding()}>
            <SnackNotifier />
            <Helmet title="Ready to Vote? - We Vote" />
            <BrowserPushMessage incomingProps={this.props} />
            <div className="row">
              <ElectionCountdownOuterWrapper className="col-12">
                <ElectionCountdownInnerWrapper>
                  <Suspense fallback={<></>}>
                    <ElectionCountdown onClickFunction={this.goToBallot} initialDelay={4000} />
                  </Suspense>
                </ElectionCountdownInnerWrapper>
              </ElectionCountdownOuterWrapper>
              <ViewBallotButtonWrapper className="col-12">
                {(voterIsSignedIn && electionDataExistsForUpcomingElection) && (
                  <Button
                    color="primary"
                    onClick={this.goToBallot}
                    style={{
                      boxShadow: 'none !important',
                      textTransform: 'none',
                      width: 250,
                    }}
                    variant="contained"
                  >
                    View ballot
                  </Button>
                )}
              </ViewBallotButtonWrapper>

              <div className="col-sm-12 col-lg-8">
                {(chosenReadyIntroductionTitle || chosenReadyIntroductionText) && (
                  <Card className="card u-show-mobile-tablet">
                    <div className="card-main">
                      <Title>
                        {chosenReadyIntroductionTitle}
                      </Title>
                      <Paragraph>
                        <Suspense fallback={<></>}>
                          <ReadMore
                            textToDisplay={chosenReadyIntroductionText}
                            numberOfLines={3}
                          />
                        </Suspense>
                      </Paragraph>
                    </div>
                  </Card>
                )}
                {isAndroid() && (
                  <ReadyIntroductionMobileWrapper className="u-show-mobile">
                    <DelayedLoad waitBeforeShow={10}>
                      <ReadyFinePrint showStep3WhenCompressed />
                    </DelayedLoad>
                  </ReadyIntroductionMobileWrapper>
                )}
                <PrepareForElectionOuterWrapper>
                  <Suspense fallback={<></>}>
                    <DelayedLoad waitBeforeShow={10}>
                      <ReadyPageValuesList sortByNumberOfAdvocates />
                    </DelayedLoad>
                  </Suspense>
                </PrepareForElectionOuterWrapper>
                <ReadyIntroductionMobileWrapper className="u-show-mobile">
                  <DelayedLoad waitBeforeShow={700}>
                    <ReadyIntroduction showStep3WhenCompressed />
                  </DelayedLoad>
                </ReadyIntroductionMobileWrapper>
                {!isAndroid() && (
                  <ReadyIntroductionMobileWrapper className="u-show-mobile">
                    <DelayedLoad waitBeforeShow={700}>
                      <ReadyFinePrint showStep3WhenCompressed />
                    </DelayedLoad>
                  </ReadyIntroductionMobileWrapper>
                )}
                {voterIsSignedIn && (
                  <Suspense fallback={<></>}>
                    <FirstAndLastNameRequiredAlert />
                  </Suspense>
                )}
                {(nextReleaseFeaturesEnabled && !futureFeaturesDisabled) && (
                  <ReadyTaskRegister
                    arrowsOn
                  />
                )}
                {(voterIsSignedIn && nextReleaseFeaturesEnabled) && (
                  <Suspense fallback={<></>}>
                    <DelayedLoad waitBeforeShow={500}>
                      <ReadyTaskFriends
                        arrowsOn
                      />
                    </DelayedLoad>
                  </Suspense>
                )}
                {!futureFeaturesDisabled && (
                <ReadyTaskPlan
                  arrowsOn
                />
                )}
              </div>
              <div className="col-lg-4 d-none d-lg-block">
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
                <ReadyIntroductionDesktopWrapper>
                  <ReadyIntroduction showStep3WhenCompressed />
                </ReadyIntroductionDesktopWrapper>
                <ReadyIntroductionDesktopWrapper>
                  <ReadyFinePrint showStep3WhenCompressed />
                </ReadyIntroductionDesktopWrapper>
                {/* nextReleaseFeaturesEnabled && <PledgeToVote /> */}
              </div>
            </div>
          </ReadyPageContainer>
        </Suspense>
      </PageContentContainer>
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

const Card = styled('div')`
  padding-bottom: 4px;
`;

const ElectionCountdownInnerWrapper = styled('div')`
  margin-top: -37px;
`;

const ElectionCountdownOuterWrapper = styled('div')`
  height: 280px;
  position: relative;
  z-index: 1;
`;

const Paragraph = styled('div')`
`;

const PrepareForElectionOuterWrapper = styled('div')`
  min-height: 150px;
  margin-bottom: 48px;
`;

const ReadyIntroductionDesktopWrapper = styled('div')`
  margin-bottom: 48px;
  margin-top: 31px;
`;

const ReadyIntroductionMobileWrapper = styled('div')`
  display: flex;
  justify-content: start;
  margin-bottom: 48px;
  margin-top: 31px;
`;

const ReadyPageContainer = styled('div')`
`;

const ViewBallotButtonWrapper = styled('div')`
  display: flex;
  height: 40px;
  justify-content: center;
  margin-bottom: 32px;
`;

const Title = styled('h2')(({ theme }) => (`
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 12px;
  ${theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin: 0 0 4px;
  }
`));

export default withTheme(withStyles(styles)(Ready));
