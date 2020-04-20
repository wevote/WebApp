import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AnalyticsActions from '../actions/AnalyticsActions';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import VoterStore from '../stores/VoterStore';
import ElectionCountdown from '../components/Ready/ElectionCountdown';
import PledgeToVote from '../components/Ready/PledgeToVote';

class Ready extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  componentDidCatch (error, info) {
    console.log('Ready.jsx caught: ', error, info.componentStack);
  }

  render () {
    renderLog('Ready');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.voter) {
      return LoadingWheel;
    }

    const { days, hours, minutes, seconds, electionDate } = this.state;

    return (
      <div className="page-content-container">
        <PageContainer className="container-fluid">
          <Helmet title="Ready to Vote? - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="row">
            <div className="col-sm-12 col-md-8">
              <ElectionCountdown />
              <Title>Get Ready to Vote in Minutes!</Title>
              <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Paragraph>
            </div>
            <div className="col-md-4 d-none d-md-block">
              <PledgeToVote />
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }
}

const PageContainer = styled.div`
  padding-top: 26px !important;;
`;

const Title = styled.h2`
  font-size: 26px;
  margin: 36px 0 16px;
  font-weight: 800;
`;


const Paragraph = styled.p`

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
