import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import ActivityActions from '../actions/ActivityActions';
import AnalyticsActions from '../actions/AnalyticsActions';
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
import AppObservableStore from '../stores/AppObservableStore';
import VoterStore from '../stores/VoterStore';
import { historyPush, isAndroid, isIOS, isWebApp } from '../utils/cordovaUtils';
import isMobileScreenSize from '../utils/isMobileScreenSize';
import lazyPreloadPages from '../utils/lazyPreloadPages';
import { renderLog } from '../utils/logging';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../components/Widgets/ReadMore'));
const FirstAndLastNameRequiredAlert = React.lazy(() => import(/* webpackChunkName: 'FirstAndLastNameRequiredAlert' */ '../components/Widgets/FirstAndLastNameRequiredAlert'));
// import PledgeToVote from '../components/Ready/PledgeToVote';

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
    ReadyActions.voterPlansForVoterRetrieve();
    ActivityActions.activityNoticeListRetrieve();
    AppObservableStore.setEvaluateHeaderDisplay();

    this.analyticsTimer = setTimeout(() => {
      AnalyticsActions.saveActionReadyVisit(VoterStore.electionId());
    }, 8000);

    this.preloadTimer = setTimeout(() => lazyPreloadPages(), 3000);

    this.setState({
      chosenReadyIntroductionText: AppObservableStore.getChosenReadyIntroductionText(),
      chosenReadyIntroductionTitle: AppObservableStore.getChosenReadyIntroductionTitle(),
    });
  }

  componentDidCatch (error, info) {
    console.log('ReadyLight.jsx caught: ', error, info.componentStack);
  }

  componentWillUnmount () {
    clearTimeout(this.analyticsTimer);
    clearTimeout(this.preloadTimer);

    const { showReadyHeavy } = this.props;
    showReadyHeavy();
  }

  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    console.log('Error in ReadyLight: ', error);
    return { hasError: true };
  }

  goToBallot = () => {
    console.log('goToBallot ENTRY from ready light');
    historyPush('/ballot');
  }

  getTopPadding = () => {
    if (isWebApp()) {
      if (isMobileScreenSize()) {
        return '36px !important';
      } else {
        return '0 !important';
      }
    } else if (isIOS()) {
      return '56px !important';  // SE2: 56px, 11 Pro Max: 56px
    } else if (isAndroid()) {
      return 'unset';
    }
    return '';
  }

  render () {
    renderLog('ReadyLight');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      chosenReadyIntroductionText, chosenReadyIntroductionTitle, voterIsSignedIn,
    } = this.state;

    return (
      <Wrapper className="page-content-container">
        <PageContainer topPadding={this.getTopPadding()}>
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
  // Was className="container-fluid"
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  padding-top: ${({ topPadding }) => topPadding};
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
