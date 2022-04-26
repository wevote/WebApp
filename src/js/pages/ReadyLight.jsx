import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import ActivityActions from '../actions/ActivityActions';
import AnalyticsActions from '../actions/AnalyticsActions';
import ReadyActions from '../actions/ReadyActions';
import apiCalming from '../common/utils/apiCalming';
import { isAndroid, isIOS } from '../common/utils/cordovaUtils';
import historyPush from '../common/utils/historyPush';
import { isWebApp } from '../common/utils/isCordovaOrWebApp';
import { renderLog } from '../common/utils/logging';
import ReadyFinePrint from '../components/Ready/ReadyFinePrint';
import ReadyIntroduction from '../components/Ready/ReadyIntroduction';
import ReadyTaskPlan from '../components/Ready/ReadyTaskPlan';
import ReadyTaskRegister from '../components/Ready/ReadyTaskRegister';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import webAppConfig from '../config';
import AppObservableStore, { messageService } from '../stores/AppObservableStore';
import VoterStore from '../stores/VoterStore';
import lazyPreloadPages from '../utils/lazyPreloadPages';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../common/components/Widgets/DelayedLoad'));
const ElectionCountdown = React.lazy(() => import(/* webpackChunkName: 'ElectionCountdown' */ '../components/Ready/ElectionCountdown'));
const FirstAndLastNameRequiredAlert = React.lazy(() => import(/* webpackChunkName: 'FirstAndLastNameRequiredAlert' */ '../components/Widgets/FirstAndLastNameRequiredAlert'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../common/components/Widgets/ReadMore'));
const ReadyPageValuesList = React.lazy(() => import(/* webpackChunkName: 'ReadyPageValuesList' */ '../components/Values/ReadyPageValuesList'));

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
    } else if (isIOS()) {
      // TODO: This is a bad place to set a top padding: Move it to Application__Wrapper on the next iOS pass
      return { paddingTop: '56px !important' };  // SE2: 56px, 11 Pro Max: 56px
    } else if (isAndroid()) {
      return { paddingTop: 'unset' };
    }
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

const Card = styled('div')`
  padding-bottom: 4px;
`;

const ElectionCountdownInnerWrapper = styled('div')`
  margin-top: -37px;
`;

const ElectionCountdownOuterWrapper = styled('div')`
  height: 180px;
  position: relative;
  z-index: 1;
`;

const IntroAndFindTabletWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const IntroAndFindTabletSpacer = styled('div')`
  width: 20px;
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

const Title = styled('h2')(({ theme }) => (`
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 12px;
  ${theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin: 0 0 4px;
  }
`));

export default withTheme(withStyles(styles)(ReadyLight));
