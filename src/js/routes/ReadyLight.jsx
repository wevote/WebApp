import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import ActivityActions from '../actions/ActivityActions';
import AnalyticsActions from '../actions/AnalyticsActions';
import AppActions from '../actions/AppActions';
import ReadyActions from '../actions/ReadyActions';
import ElectionCountdown from '../components/Ready/ElectionCountdown';
import ReadyInformationDisclaimer from '../components/Ready/ReadyInformationDisclaimer';
import ReadyIntroduction from '../components/Ready/ReadyIntroduction';
import ReadyTaskBallot from '../components/Ready/ReadyTaskBallot';
import ReadyTaskFriends from '../components/Ready/ReadyTaskFriends';
import ReadyTaskPlan from '../components/Ready/ReadyTaskPlan';
import ReadyTaskRegister from '../components/Ready/ReadyTaskRegister';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import webAppConfig from '../config';
import AppStore from '../stores/AppStore';
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
    this.onAppStoreChange();
    initializejQuery(() => {
      // TODO: May4, 2021 10am, removing this has no effect if signed in -- voterBallotItemsRetrieve still gets called
      // this.positionItemTimer = setTimeout(() => {
      //   // This is a performance killer, so let's delay it for a few seconds
      //   if (!BallotStore.ballotFound) {
      //     // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
      //     BallotActions.voterBallotItemsRetrieve(0, '', '');
      //   }
      // }, 5000);  // April 19, 2021: Tuned to keep performance above 83.  LCP at 597ms

      // this.positionItemTimer2 = setTimeout(() => {
      ReadyActions.voterPlansForVoterRetrieve();
      ActivityActions.activityNoticeListRetrieve();
      // }, 2500);
      AppActions.setEvaluateHeaderDisplay();


      // let modalToShow = '';
      // if (this.props.match) {
      //   const { match: { params: { modal_to_show: mts } } } = this.props;
      //   modalToShow = mts;
      // }
      // modalToShow = modalToShow || '';
      // console.log('componentDidMount modalToOpen:', modalToOpen);

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
    }, 3000);
  }

  componentDidCatch (error, info) {
    console.log('ReadyLight.jsx caught: ', error, info.componentStack);
  }

  componentWillUnmount () {
    if (this.modalOpenTimer) {
      clearTimeout(this.modalOpenTimer);
      this.modalOpenTimer = null;
    }
    if (this.preloadTimer) {
      clearTimeout(this.preloadTimer);
      this.preloadTimer = null;
    }
    const { showReadyHeavy } = this.props;
    showReadyHeavy();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    console.log('Error in ReadyLight: ', error);
    return { hasError: true };
  }

  onAppStoreChange () {
    this.setState({
      chosenReadyIntroductionText: AppStore.getChosenReadyIntroductionText(),
      chosenReadyIntroductionTitle: AppStore.getChosenReadyIntroductionTitle(),
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
      <Wrapper className="page-content-container">
        <PageContainer className="container-fluid" style={this.getTopPadding()}>
          <Helmet title="Ready to Vote? - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="row">
            <div className="col-sm-12 col-lg-8">
              <MobileTabletCountdownWrapper className="u-show-mobile-tablet">
                <ElectionCountdownMobileTabletWrapper
                  className="u-cursor--pointer u-show-mobile-tablet"
                  // onClick={this.goToBallot}
                >
                  <ElectionCountdown daysOnlyMode initialDelay={0} />
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
            </div>
            <div className="col-lg-4 d-none d-lg-block">
              <div className="u-cursor--pointer">
                <Suspense fallback={<SuspenseCard>&nbsp;</SuspenseCard>}>
                  <ElectionCountdown daysOnlyMode initialDelay={0} />
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
                  <ReadyIntroduction
                    showStep3WhenCompressed
                  />
                </div>
              </Card>
            </div>
          </div>
        </PageContainer>
      </Wrapper>
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

const Card = styled.div`
  padding-bottom: 4px;
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

const Title = styled.h2`
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 12px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 14px;
    margin: 0 0 4px;
  }
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(ReadyLight);
