import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AnalyticsActions from '../actions/AnalyticsActions';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import VoterStore from '../stores/VoterStore';
import { cordovaBallotFilterTopMargin } from '../utils/cordovaOffsets';

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

    return (
      <div className="page-content-container">
        <div className="container-fluid">
          <Helmet title="Ready to Vote? - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="row">
            <div className="col-sm-12 col-md-8">
              <Card className="card">
                <div className="card-main">
                  {' '}
                  <CardTitle>214 Days</CardTitle>
                  <CardSubTitle>until your next election on November 2, 2020.</CardSubTitle>
                </div>
              </Card>
              <Title>Get Ready to Vote in Minutes!</Title>
              <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</Paragraph>
            </div>
            <div className="col-md-4 d-none d-md-block">
              <div className="card">
                <div className="card-main">
                Hello
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Card = styled.div`
  margin-top: 26px;
`;

const CardTitle = styled.h1`
  font-size: 64px;
  color: #2E3C5D !important;
  font-weight: 900;
  margin-top: 0;
  margin-bottom: 8px;
`;

const CardSubTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #2E3C5D !important;
  width: fit-content;
  padding-bottom: 16px;
  // border-bottom: 1px solid #2E3C5D;
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
