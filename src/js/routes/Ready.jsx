import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AnalyticsActions from '../actions/AnalyticsActions';
import AppStore from '../stores/AppStore';
import BallotActions from '../actions/BallotActions';
import BallotStore from '../stores/BallotStore';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import EditAddressOneHorizontalRow from '../components/Ready/EditAddressOneHorizontalRow';
import ElectionCountdown from '../components/Ready/ElectionCountdown';
import FriendInvitationOnboardingValuesList from '../components/Values/FriendInvitationOnboardingValuesList';
import { historyPush, isWebApp } from '../utils/cordovaUtils';
import IssueStore from '../stores/IssueStore';
import LoadingWheel from '../components/LoadingWheel';
import ReadMore from '../components/Widgets/ReadMore';
import ReadyActions from '../actions/ReadyActions';
import ReadyIntroduction from '../components/Ready/ReadyIntroduction';
import ReadyTaskBallot from '../components/Ready/ReadyTaskBallot';
import ReadyTaskPlan from '../components/Ready/ReadyTaskPlan';
import ReadyTaskRegister from '../components/Ready/ReadyTaskRegister';
import { renderLog } from '../utils/logging';
import VoterStore from '../stores/VoterStore';
import webAppConfig from '../config';
import IssueActions from "../actions/IssueActions";
// import PledgeToVote from '../components/Ready/PledgeToVote';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class Ready extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      chosenReadyIntroductionText: '',
      chosenReadyIntroductionTitle: '',
      issuesDisplayDecisionHasBeenMade: false,
      issuesShouldBeDisplayed: false,
    };
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onAppStoreChange();
    this.onIssueStoreChange();
    this.onVoterStoreChange();
    if (!IssueStore.issueDescriptionsRetrieveCalled()) {
      IssueActions.issueDescriptionsRetrieve();
    }
    IssueActions.issuesFollowedRetrieve();
    if (!BallotStore.ballotFound) {
      // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }
    ReadyActions.voterPlansForVoterRetrieve();
    AnalyticsActions.saveActionReadyVisit(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.issueStoreListener.remove();
    this.voterStoreListener.remove();
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
    this.setState({ voter: VoterStore.getVoter() });
  }

  goToBallot = () => {
    historyPush('/ballot');
  }

  componentDidCatch (error, info) {
    console.log('Ready.jsx caught: ', error, info.componentStack);
  }

  render () {
    renderLog('Ready');  // Set LOG_RENDER_EVENTS to log all renders
    const { chosenReadyIntroductionText, chosenReadyIntroductionTitle, issuesShouldBeDisplayed, voter } = this.state;
    if (!voter) {
      return LoadingWheel;
    }
    const defaultIntroductionText = 'Make sure you\'re ready to vote ' +
      '(registered to vote, have a plan, etc.) ' +
      'See who\'s running for office. What do they stand for? ' +
      'Learn from people you trust.';

    return (
      <div className="page-content-container">
        <PageContainer className="container-fluid" isWeb={isWebApp()}>
          <Helmet title="Ready to Vote? - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="row">
            <EditAddressWrapper className="col-12">
              <EditAddressOneHorizontalRow saveUrl="/ready" />
            </EditAddressWrapper>
            <div className="col-sm-12 col-lg-8">
              <div className="u-cursor--pointer" onClick={this.goToBallot}>
                <ElectionCountdown />
              </div>
              <div className="u-show-mobile-tablet">
                <Card className="card">
                  <div className="card-main">
                    <Title>
                      {chosenReadyIntroductionTitle || 'We Vote makes being a voter easier'}
                    </Title>
                    <Paragraph>
                      <ReadMore
                        textToDisplay={chosenReadyIntroductionText || defaultIntroductionText}
                        numberOfLines={3}
                      />
                    </Paragraph>
                  </div>
                </Card>
              </div>
              <ReadyTaskBallot
                arrowsOn
              />
              {nextReleaseFeaturesEnabled && (
                <ReadyTaskRegister
                  arrowsOn
                />
              )}
              <ReadyTaskPlan
                arrowsOn
              />
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
              <Card className="card">
                <div className="card-main">
                  <ReadyIntroduction />
                </div>
              </Card>
              {(issuesShouldBeDisplayed) && (
                <ValuesListWrapper>
                  <div className="card">
                    <FriendInvitationOnboardingValuesList
                      displayOnlyIssuesNotFollowedByVoter
                      followToggleOnItsOwnLine
                      oneColumn
                    />
                  </div>
                </ValuesListWrapper>
              )}
              {/* {nextReleaseFeaturesEnabled && <PledgeToVote />} */}
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }
}

const Card = styled.div`
  padding-bottom: 4px;
`;

const EditAddressWrapper = styled.div`
  margin-bottom: 8px !important;
  margin-left: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
`;

const PageContainer = styled.div`
  padding-top: ${({ isWeb }) => (isWeb ? '0 !important' : '56px !important')};  // SE2: 56px, 11 Pro Max: 56px
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

const Paragraph = styled.div`

`;

const ValuesListWrapper = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;

const styles = theme => ({
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

export default withStyles(styles)(Ready);
