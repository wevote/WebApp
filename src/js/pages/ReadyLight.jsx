import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import ActivityActions from '../actions/ActivityActions';
import AnalyticsActions from '../actions/AnalyticsActions';
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
import {
  ElectionCountdownInnerWrapper,
  ElectionCountdownOuterWrapper,
  IntroAndFindTabletSpacer,
  IntroAndFindTabletWrapper,
  PrepareForElectionOuterWrapper,
  ReadyIntroductionDesktopWrapper,
  ReadyIntroductionMobileWrapper,
  ReadyPageContainer,
  ReadyParagraph,
  ReadyTitle,
  ViewBallotButtonWrapper,
} from '../components/Style/ReadyPageCommonStyles';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import webAppConfig from '../config';
import AppObservableStore, { messageService } from '../stores/AppObservableStore';
import VoterStore from '../stores/VoterStore';
import { cordovaSimplePageContainerTopOffset } from '../utils/cordovaCalculatedOffsets';
import lazyPreloadPages from '../utils/lazyPreloadPages';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../common/components/Widgets/DelayedLoad'));
const ElectionCountdown = React.lazy(() => import(/* webpackChunkName: 'ElectionCountdown' */ '../components/Ready/ElectionCountdown'));
const FirstAndLastNameRequiredAlert = React.lazy(() => import(/* webpackChunkName: 'FirstAndLastNameRequiredAlert' */ '../components/Widgets/FirstAndLastNameRequiredAlert'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../common/components/Widgets/ReadMore'));
const ReadyPageValuesList = React.lazy(() => import(/* webpackChunkName: 'ReadyPageValuesList' */ '../components/Values/ReadyPageValuesList'));
const ViewUpcomingBallotButton = React.lazy(() => import(/* webpackChunkName: 'ViewUpcomingBallotButton' */ '../components/Ready/ViewUpcomingBallotButton'));

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;
const futureFeaturesDisabled = true;

class ReadyLight extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenReadyIntroductionText: '',
      chosenReadyIntroductionTitle: '',
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    this.onAppObservableStoreChange();
    ReadyActions.voterPlansForVoterRetrieve();
    if (apiCalming('activityNoticeListRetrieve', 10000)) {
      ActivityActions.activityNoticeListRetrieve();
    }
    AppObservableStore.setEvaluateHeaderDisplay();

    this.analyticsTimer = setTimeout(() => {
      AnalyticsActions.saveActionReadyVisit(VoterStore.electionId());
    }, 8000);

    this.preloadTimer = setTimeout(() => lazyPreloadPages(), 3000);
  }

  componentDidCatch (error, info) {
    console.log('ReadyLight.jsx caught: ', error, info.componentStack);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    clearTimeout(this.analyticsTimer);
    clearTimeout(this.preloadTimer);

    const { showReadyHeavy } = this.props;
    showReadyHeavy();
  }

  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    console.log('Error in ReadyLight: ', error);
    return { hasError: true };
  }

  onAppObservableStoreChange () {
    this.setState({
      chosenReadyIntroductionText: AppObservableStore.getChosenReadyIntroductionText(),
      chosenReadyIntroductionTitle: AppObservableStore.getChosenReadyIntroductionTitle(),
    });
  }

  goToBallot = () => {
    console.log('goToBallot ENTRY from ready light');
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
    renderLog('ReadyLight');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      chosenReadyIntroductionText, chosenReadyIntroductionTitle, voterIsSignedIn,
    } = this.state;

    return (
      <PageContentContainer>
        <ReadyPageContainer className="container-fluid" style={this.getTopPadding()}>
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
                <ReadyIntroductionMobileWrapper className="u-show-mobile">
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
                    <ReadyPageValuesList sortByNumberOfAdvocates />
                  </DelayedLoad>
                </Suspense>
              </PrepareForElectionOuterWrapper>
              <ReadyIntroductionMobileWrapper className="u-show-mobile">
                <Suspense fallback={<></>}>
                  <DelayedLoad waitBeforeShow={700}>
                    <ReadyIntroduction showStep3WhenCompressed />
                  </DelayedLoad>
                </Suspense>
              </ReadyIntroductionMobileWrapper>
              {!isAndroid() && (
                <ReadyIntroductionMobileWrapper className="u-show-mobile">
                  <Suspense fallback={<></>}>
                    <DelayedLoad waitBeforeShow={700}>
                      <ReadyFinePrint showStep3WhenCompressed />
                    </DelayedLoad>
                  </Suspense>
                </ReadyIntroductionMobileWrapper>
              )}
              <IntroAndFindTabletWrapper className="u-show-tablet">
                <IntroAndFindTabletSpacer />
              </IntroAndFindTabletWrapper>
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
              {!futureFeaturesDisabled && (
              <ReadyTaskPlan
                arrowsOn
              />
              )}
              <ViewBallotButtonWrapper className="col-12 u-show-mobile">
                <Suspense fallback={<></>}>
                  <ViewUpcomingBallotButton onClickFunction={this.goToBallot} />
                </Suspense>
              </ViewBallotButtonWrapper>
            </div>
            <div className="col-lg-4 d-none d-lg-block">
              {(chosenReadyIntroductionTitle || chosenReadyIntroductionText) && (
                <ReadyCard className="card">
                  <div className="card-main">
                    <ReadyTitle>
                      {chosenReadyIntroductionTitle}
                    </ReadyTitle>
                    <ReadyParagraph>
                      {chosenReadyIntroductionText}
                    </ReadyParagraph>
                  </div>
                </ReadyCard>
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
ReadyLight.propTypes = {
  // match: PropTypes.object,
  showReadyHeavy: PropTypes.func,
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

export default withTheme(withStyles(styles)(ReadyLight));
