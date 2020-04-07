import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AnalyticsActions from '../actions/AnalyticsActions';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import LoadingWheel from '../components/LoadingWheel';
import { renderLog } from '../utils/logging';
import VoterStore from '../stores/VoterStore';

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
      <span>
        <Helmet title="Ready to Vote? - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <PageTitle>
          Get Ready to Vote in Minutes
        </PageTitle>
        <div className="row">
          <div className="col-sm-12 col-md-8">
            233 Days
          </div>
          <div className="col-md-4 d-none d-md-block">
            <div className="card">
              <div className="card-main">
                Hello
              </div>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

const PageTitle = styled.div`
  margin: 20px 0;
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
