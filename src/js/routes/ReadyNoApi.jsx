import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
// import AnalyticsActions from '../actions/AnalyticsActions';
// import AppStore from '../stores/AppStore';
// import BallotActions from '../actions/BallotActions';
// import BallotStore from '../stores/BallotStore';
// import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import cookies from '../utils/cookies';
// import EditAddressOneHorizontalRow from '../components/Ready/EditAddressOneHorizontalRow';
// import ElectionCountdown from '../components/Ready/ElectionCountdown';
// import { isWebApp } from '../utils/cordovaUtils';
// import IssueActions from '../actions/IssueActions';
// import IssueStore from '../stores/IssueStore';
// import LoadingWheel from '../components/LoadingWheel';
import ReadMore from '../components/Widgets/ReadMore';
// import ReadyActions from '../actions/ReadyActions';
import ReadyIntroduction from '../components/ReadyNoApi/ReadyIntroduction';
// import ReadyTaskBallotNoApi from '../components/ReadyNoApi/ReadyTaskBallotNoApi';
// import ReadyTaskFriends from '../components/Ready/ReadyTaskFriends';
// import ReadyTaskPlan from '../components/Ready/ReadyTaskPlan';
// import ReadyTaskRegister from '../components/Ready/ReadyTaskRegister';
import { renderLog } from '../utils/logging';
// import ValuesToFollowPreview from '../components/Values/ValuesToFollowPreview';
// import VoterStore from '../stores/VoterStore';
// import webAppConfig from '../config';
// import PledgeToVote from '../components/Ready/PledgeToVote';

// const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class ReadyNoApi extends Component {
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
    // DALE 2020-06 jQuery off
    // this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    // this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    // this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // this.onAppStoreChange();
    // this.onIssueStoreChange();
    // this.onVoterStoreChange();
    // if (!IssueStore.issueDescriptionsRetrieveCalled()) {
    //   IssueActions.issueDescriptionsRetrieve();
    // }
    // IssueActions.issuesFollowedRetrieve();
    // if (!BallotStore.ballotFound) {
    //   // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
    //   BallotActions.voterBallotItemsRetrieve(0, '', '');
    // }
    // ReadyActions.voterPlansForVoterRetrieve();
    // AnalyticsActions.saveActionReadyVisit(VoterStore.electionId());
    this.setState({
      locationGuessClosed: cookies.getItem('location_guess_closed'),
    });
  }

  componentWillUnmount () {
    // DALE 2020-06 jQuery off
    // this.appStoreListener.remove();
    // this.issueStoreListener.remove();
    // this.voterStoreListener.remove();
  }

  // onAppStoreChange () {
  //   this.setState({
  //     chosenReadyIntroductionText: AppStore.getChosenReadyIntroductionText(),
  //     chosenReadyIntroductionTitle: AppStore.getChosenReadyIntroductionTitle(),
  //   });
  // }

  // onIssueStoreChange () {
  //   const { issuesDisplayDecisionHasBeenMade } = this.state;
  //   // console.log('Ready, onIssueStoreChange, issuesDisplayDecisionHasBeenMade: ', issuesDisplayDecisionHasBeenMade);
  //   if (!issuesDisplayDecisionHasBeenMade) {
  //     const areIssuesLoadedFromAPIServer = IssueStore.areIssuesLoadedFromAPIServer();
  //     const areIssuesFollowedLoadedFromAPIServer = IssueStore.areIssuesFollowedLoadedFromAPIServer();
  //     // console.log('areIssuesLoadedFromAPIServer: ', areIssuesLoadedFromAPIServer, ', areIssuesFollowedLoadedFromAPIServer:', areIssuesFollowedLoadedFromAPIServer);
  //     if (areIssuesLoadedFromAPIServer && areIssuesFollowedLoadedFromAPIServer) {
  //       const issuesFollowedCount = IssueStore.getIssuesVoterIsFollowingLength();
  //       // console.log('issuesFollowedCount: ', issuesFollowedCount);
  //       this.setState({
  //         issuesDisplayDecisionHasBeenMade: true,
  //         issuesShouldBeDisplayed: (issuesFollowedCount < 3),
  //       });
  //     }
  //   }
  // }
  //
  // onVoterStoreChange () {
  //   this.setState({ voter: VoterStore.getVoter() });
  // }

  goToBallot = () => {
    // historyPush('/ballot');
  }

  componentDidCatch (error, info) {
    console.log('ReadyNoApi.jsx caught: ', error, info.componentStack);
  }

  render () {
    renderLog('ReadyNoApi');  // Set LOG_RENDER_EVENTS to log all renders
    console.log('ReadyNoApi render');
    const {
      chosenReadyIntroductionText, chosenReadyIntroductionTitle
    } = this.state;
    // if (!voter) {
    //   return LoadingWheel;
    // }
    // const defaultIntroductionText = 'Make sure you\'re ready to vote ' +
    //   '(registered to vote, have a plan, etc.) ' +
    //   'See who\'s running for office. What do they stand for? ' +
    //   'Learn from people you trust.';

    return (
      <Wrapper className="page-content-container">
        <PageContainer className="container-fluid" isWeb="true">
          <Helmet title="Ready to Vote? - We Vote" />
          <div className="row">
            {/* {!(locationGuessClosed) && ( */}
            {/*  <EditAddressWrapper className="col-12"> */}
            {/*    <EditAddressOneHorizontalRow saveUrl="/ready" /> */}
            {/*  </EditAddressWrapper> */}
            {/* )} */}
            <div className="col-sm-12 col-lg-8">
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
              <Card className="card u-show-mobile-tablet">
                <div className="card-main">
                  <ReadyIntroduction />
                </div>
              </Card>
              {/* <ReadyTaskBallotNoApi */}
              {/*  arrowsOn */}
              {/* /> */}
              {/* {nextReleaseFeaturesEnabled && ( */}
              {/*  <ReadyTaskRegister */}
              {/*    arrowsOn */}
              {/*  /> */}
              {/* )} */}
              {/* <ReadyTaskPlan */}
              {/*  arrowsOn */}
              {/* /> */}
              {/* {nextReleaseFeaturesEnabled && ( */}
              {/*  <ReadyTaskFriends */}
              {/*    arrowsOn */}
              {/*  /> */}
              {/* )} */}
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
                  <ReadyIntroduction
                    showStep3WhenCompressed
                  />
                </div>
              </Card>
              {/* {(issuesShouldBeDisplayed) && ( */}
              {/*  <ValuesListWrapper> */}
              {/*    <ValuesToFollowPreview */}
              {/*      followToggleOnItsOwnLine */}
              {/*    /> */}
              {/*  </ValuesListWrapper> */}
              {/* )} */}
              {/* {nextReleaseFeaturesEnabled && <PledgeToVote />} */}
            </div>
          </div>
        </PageContainer>
      </Wrapper>
    );
  }
}

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

const Card = styled.div`
  padding-bottom: 4px;
`;

// const EditAddressWrapper = styled.div`
//   margin-bottom: 8px !important;
//   margin-left: 0 !important;
//   padding-left: 0 !important;
//   padding-right: 0 !important;
// `;

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

// const ValuesListWrapper = styled.div`
//   margin-top: 12px;
//   margin-bottom: 12px;
// `;

const Wrapper = styled.div`
`;

export default withStyles(styles)(ReadyNoApi);
