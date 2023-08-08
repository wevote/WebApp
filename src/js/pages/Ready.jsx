import { Card } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import ActivityActions from '../actions/ActivityActions';
import AnalyticsActions from '../actions/AnalyticsActions';
import BallotActions from '../actions/BallotActions';
import FriendActions from '../actions/FriendActions';
import ReadyActions from '../actions/ReadyActions';
import apiCalming from '../common/utils/apiCalming';
import { isAndroid } from '../common/utils/cordovaUtils';
import historyPush from '../common/utils/historyPush';
import { isWebApp } from '../common/utils/isCordovaOrWebApp';
import { renderLog } from '../common/utils/logging';
import ReadyFinePrint from '../components/Ready/ReadyFinePrint';
import ReadyIntroduction from '../components/Ready/ReadyIntroduction';
import ReadyTaskPlan from '../components/Ready/ReadyTaskPlan';
import ReadyTaskRegister from '../components/Ready/ReadyTaskRegister';
import { ReadyCard } from '../components/Ready/ReadyTaskStyles';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import { ElectionCountdownInnerWrapper, ElectionCountdownOuterWrapper, PrepareForElectionOuterWrapper, ReadyIntroductionDesktopWrapper, ReadyIntroductionMobileWrapper, ReadyPageContainer, ReadyParagraph, ReadyTitle, ViewBallotButtonWrapper } from '../components/Style/ReadyPageCommonStyles';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import SnackNotifier, { openSnackbar } from '../common/components/Widgets/SnackNotifier';
import webAppConfig from '../config';
import AppObservableStore, { messageService } from '../common/stores/AppObservableStore';
import BallotStore from '../stores/BallotStore';
import VoterStore from '../stores/VoterStore';
import { cordovaSimplePageContainerTopOffset } from '../utils/cordovaCalculatedOffsets';
// Lint is not smart enough to know that lazyPreloadPages will not attempt to preload/reload this page
// eslint-disable-next-line import/no-cycle
import lazyPreloadPages from '../utils/lazyPreloadPages';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../common/components/Widgets/DelayedLoad'));
const ElectionCountdown = React.lazy(() => import(/* webpackChunkName: 'ElectionCountdown' */ '../components/Ready/ElectionCountdown'));
const FirstAndLastNameRequiredAlert = React.lazy(() => import(/* webpackChunkName: 'FirstAndLastNameRequiredAlert' */ '../components/Widgets/FirstAndLastNameRequiredAlert'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../common/components/Widgets/ReadMore'));
const ReadyPageValuesList = React.lazy(() => import(/* webpackChunkName: 'ReadyPageValuesList' */ '../components/Values/ReadyPageValuesList'));
const ReadyTaskFriends = React.lazy(() => import(/* webpackChunkName: 'ReadyTaskFriends' */ '../components/Ready/ReadyTaskFriends'));
const ViewUpcomingBallotButton = React.lazy(() => import(/* webpackChunkName: 'ViewUpcomingBallotButton' */ '../components/Ready/ViewUpcomingBallotButton'));
// import PledgeToVote from '../components/Ready/PledgeToVote';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;
const futureFeaturesDisabled = true;

class Ready extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenReadyIntroductionText: '',
      chosenReadyIntroductionTitle: '',
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onAppObservableStoreChange();
    this.onVoterStoreChange();
    this.positionItemTimer = setTimeout(() => {
      // This is a performance killer, so let's delay it for a few seconds
      if (!BallotStore.ballotFound) {
        // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
        if (apiCalming('voterBallotItemsRetrieve', 3000)) {
          BallotActions.voterBallotItemsRetrieve(0, '', '');
        }
      }
    }, 5000);  // April 19, 2021: Tuned to keep performance above 83.  LCP at 597ms

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

    this.preloadTimer = setTimeout(() => {
      if (apiCalming('activityNoticeListRetrieve', 10000)) {
        ActivityActions.activityNoticeListRetrieve();
      }
      if (apiCalming('friendListsAll', 30000)) {
        FriendActions.friendListsAll();
      }
      lazyPreloadPages();
    }, 5000);

    this.voterPlansTimer = setTimeout(() => {
      ReadyActions.voterPlansForVoterRetrieve();
    }, 6000);

    this.analyticsTimer = setTimeout(() => {
      AnalyticsActions.saveActionReadyVisit(VoterStore.electionId());
    }, 8000);
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
    this.voterStoreListener.remove();
    clearTimeout(this.analyticsTimer);
    clearTimeout(this.modalOpenTimer);
    clearTimeout(this.positionItemTimer);
    clearTimeout(this.preloadTimer);
    clearTimeout(this.voterPlansTimer);
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

  onVoterStoreChange () {
    // console.log('Ready, onVoterStoreChange voter: ', VoterStore.getVoter());
    this.setState({
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    });
  }

  goToBallot = () => {
    historyPush('/ballot');
  }

  getTopPadding = () => {
    if (isWebApp()) {
      return { paddingTop: '0 !important' };
    }
    cordovaSimplePageContainerTopOffset(VoterStore.getVoterIsSignedIn());
    return {};
  }

  render () {
    renderLog('Ready');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      chosenReadyIntroductionText, chosenReadyIntroductionTitle,
      voterIsSignedIn,
    } = this.state;

    return (
      <PageContentContainer>
        <ReadyPageContainer className="container-fluid" style={this.getTopPadding()}>
          <SnackNotifier />
          <Helmet>
            <title>Ready to Vote? - We Vote</title>
            <link rel="canonical" href="https://wevote.us/ready" />
          </Helmet>
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
              <Suspense fallback={<></>}>
                <ViewUpcomingBallotButton onClickFunction={this.goToBallot} />
              </Suspense>
            </ViewBallotButtonWrapper>

            <div className="col-sm-12 col-lg-8">
              {(chosenReadyIntroductionTitle || chosenReadyIntroductionText) && (
                <ReadyCard className="card u-show-mobile-tablet">
                  <div className="card-main">
                    <ReadyTitle>
                      {chosenReadyIntroductionTitle}
                    </ReadyTitle>
                    <ReadyParagraph>
                      <Suspense fallback={<></>}>
                        <ReadMore
                          textToDisplay={chosenReadyIntroductionText}
                          numberOfLines={3}
                        />
                      </Suspense>
                    </ReadyParagraph>
                  </div>
                </ReadyCard>
              )}
              {isAndroid() && (
                <ReadyIntroductionMobileWrapper className="u-show-mobile-tablet">
                  <Suspense fallback={<></>}>
                    <DelayedLoad waitBeforeShow={10}>
                      <ReadyFinePrint showStep3WhenCompressed />
                    </DelayedLoad>
                  </Suspense>
                </ReadyIntroductionMobileWrapper>
              )}
              <PrepareForElectionOuterWrapper>
                <Suspense fallback={<></>}>
                  <DelayedLoad waitBeforeShow={10}>
                    <ReadyPageValuesList sortByForcedSortOrder sortByNumberOfAdvocates />
                  </DelayedLoad>
                </Suspense>
              </PrepareForElectionOuterWrapper>
              <ReadyIntroductionMobileWrapper className="u-show-mobile-tablet">
                <Suspense fallback={<></>}>
                  <DelayedLoad waitBeforeShow={700}>
                    <ReadyIntroduction showStep3WhenCompressed />
                  </DelayedLoad>
                </Suspense>
              </ReadyIntroductionMobileWrapper>
              <ViewBallotButtonWrapper className="col-12 u-show-mobile-tablet">
                <Suspense fallback={<></>}>
                  <ViewUpcomingBallotButton onClickFunction={this.goToBallot} />
                </Suspense>
              </ViewBallotButtonWrapper>
              {!isAndroid() && (
                <ReadyIntroductionMobileWrapper className="u-show-mobile-tablet">
                  <Suspense fallback={<></>}>
                    <DelayedLoad waitBeforeShow={700}>
                      <ReadyFinePrint showStep3WhenCompressed />
                    </DelayedLoad>
                  </Suspense>
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
              {(voterIsSignedIn && nextReleaseFeaturesEnabled && !futureFeaturesDisabled) && (
                <Suspense fallback={<></>}>
                  <DelayedLoad waitBeforeShow={500}>
                    <ReadyTaskFriends
                      arrowsOn
                    />
                  </DelayedLoad>
                </Suspense>
              )}
              {nextReleaseFeaturesEnabled && (
                <ReadyTaskPlan
                  arrowsOn
                />
              )}
            </div>
            <div className="col-lg-4 d-none d-lg-block">
              {(chosenReadyIntroductionTitle || chosenReadyIntroductionText) && (
                <Card className="card">
                  <div className="card-main">
                    <ReadyTitle>
                      {chosenReadyIntroductionTitle}
                    </ReadyTitle>
                    <ReadyParagraph>
                      {chosenReadyIntroductionText}
                    </ReadyParagraph>
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


export default withTheme(withStyles(styles)(Ready));
