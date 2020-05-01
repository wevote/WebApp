import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
// import AnalyticsActions from '../actions/AnalyticsActions';
import AppStore from '../stores/AppStore';
import BallotActions from '../actions/BallotActions';
import BallotStore from '../stores/BallotStore';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import { historyPush } from '../utils/cordovaUtils';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import VoterStore from '../stores/VoterStore';
import EditAddressOneHorizontalRow from '../components/Ready/EditAddressOneHorizontalRow';
import ElectionCountdown from '../components/Ready/ElectionCountdown';
import PledgeToVote from '../components/Ready/PledgeToVote';
import ReadyTaskCard from '../components/Ready/ReadyTaskCard';
import webAppConfig from '../config';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class Ready extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      chosenReadyIntroductionText: '',
      chosenReadyIntroductionTitle: '',
    };
  }

  componentDidMount () {
    this.onAppStoreChange();
    this.onVoterStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (!BallotStore.ballotFound) {
      // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }    // AnalyticsActions.saveActionNetwork(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
    this.setState({
      chosenReadyIntroductionText: AppStore.getChosenReadyIntroductionText(),
      chosenReadyIntroductionTitle: AppStore.getChosenReadyIntroductionTitle(),
    });
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
    const { chosenReadyIntroductionText, chosenReadyIntroductionTitle, voter } = this.state;
    if (!voter) {
      return LoadingWheel;
    }

    const globalCompleted = true;

    return (
      <div className="page-content-container">
        <PageContainer className="container-fluid">
          <Helmet title="Ready to Vote? - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="row">
            <EditAddressWrapper className="col-12">
              <EditAddressOneHorizontalRow saveUrl="/ready" />
            </EditAddressWrapper>
            <div className="col-sm-12 col-md-8">
              <div className="u-cursor--pointer" onClick={this.goToBallot}>
                <ElectionCountdown />
              </div>
              <Card className="card">
                <div className="card-main">
                  <Title>
                    {chosenReadyIntroductionTitle || 'Get Ready to Vote in Minutes!'}
                  </Title>
                  <Paragraph>
                    {chosenReadyIntroductionText || (
                      <>
                        <div>
                          We&apos;ve all been there. Election day is almost here,
                          {' '}
                          but besides the President and a few other choices we&apos;ve made,
                          {' '}
                          we don&apos;t know how we&apos;re going to vote.
                          {' '}
                          There has to be a better way. Now, there is!
                        </div>
                        <div>
                          <br />
                          <Link to="/ballot">
                            <span className="u-link-color u-underline u-cursor--pointer">
                              View Your Ballot
                            </span>
                          </Link>
                        </div>
                      </>
                    )}
                  </Paragraph>
                </div>
              </Card>
              <ReadyTaskCard
                ballotMode
                completed={globalCompleted}
                buttonText="Get Started"
                completedTitle="Your Ballot"
                completedSubtitle="Review your decisions"
                completedButtonText="Your Ballot"
                title="Voting?"
                subtitle="Start deciding how you are going to vote."
              />
              <ReadyTaskCard
                              completed={globalCompleted}

                makeAPlanMode
                buttonText="Make a Plan Now"
                completedTitle="Your Voting Plan"
                completedSubtitle="Review your plans"
                completedButtonText="Your Plans"
                title="When Will You Vote?"
                subtitle="Write your own adventure and cast your vote."
              />
              <ReadyTaskCard
                              completed={globalCompleted}

                registerToVotePlan
                buttonText="Register Now"
                completedTitle="You've Registered!"
                completedSubtitle="You are successfully registered to vote."
                completedButtonText="Your Plans"
                title="Registered to Vote Yet?"
                subtitle="Register to vote to cast your ballot."
              />
              {/* <div className="u-show-mobile">
                <ReadyTaskCard
                  ballotMode
                  buttonText="Get Started"
                  completedTitle="Your Ballot"
                  completedSubtitle="Review your decisions"
                  completedButtonText="Your Ballot"
                  title="Voting?"
                  subtitle="Start deciding how you are going to vote."
                />
              </div>
              {nextReleaseFeaturesEnabled && (
                <ReadyTaskCard
                  makeAPlanMode
                  buttonText="Make a Plan Now"
                  completedTitle="Your Voting Plan"
                  completedSubtitle="Review your decisions"
                  completedButtonText="Your Ballot"
                  title="When Will You Vote?"
                  subtitle="Write your own adventure and cast your vote."
                />
              )} */}
            </div>
            <div className="col-md-4 d-none d-md-block">
              {nextReleaseFeaturesEnabled && <PledgeToVote />}
              <ReadyTaskCard
                ballotMode
                buttonText="Your Ballot"
                completedTitle="Your Ballot"
                completedSubtitle="Review your decisions"
                completedButtonText="Your Ballot"
                subtitle="Start deciding how you are going to vote."
                title="Voting?"
              />
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }
}

const Card = styled.div`
`;

const EditAddressWrapper = styled.div`
  margin-bottom: 8px !important;
  margin-left: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
`;

const PageContainer = styled.div`
  padding-top: 0 !important;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 16px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 20px;
  }
`;


const Paragraph = styled.div`

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
