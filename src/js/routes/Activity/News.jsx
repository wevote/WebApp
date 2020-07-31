import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import AnalyticsActions from '../../actions/AnalyticsActions';
import BrowserPushMessage from '../../components/Widgets/BrowserPushMessage';
import { cordovaDot } from '../../utils/cordovaUtils';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import Testimonial from '../../components/Widgets/Testimonial';
import VoterStore from '../../stores/VoterStore';

class News extends Component {
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
    console.log('News.jsx caught: ', error, info.componentStack);
  }

  render () {
    renderLog('News');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.voter) {
      return LoadingWheel;
    }

    const testimonialAuthor = 'Alissa B., Oakland, California';
    const imageUrl = cordovaDot('/img/global/photos/Alissa_B-128x128.jpg');
    const testimonial = 'Great way to sort through my ballot! My husband and I used We Vote during the last election to learn more about our ballots and make some tough choices. Between following various organizations, and friending a couple of trusted friends, we felt like we had an excellent pool of information to draw from.';
    return (
      <span>
        <Helmet title="Ready to Vote? - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="row">
          <div className="col-sm-12 col-md-8">
            <Card className="card">
              <div className="card-main">
                <PageTitle>
                  {LoadingWheel}
                </PageTitle>
              </div>
            </Card>
          </div>
          <div className="col-md-4 d-none d-md-block">
            <div className="card">
              <div className="card-main">
                <Testimonial
                  imageUrl={imageUrl}
                  testimonialAuthor={testimonialAuthor}
                  testimonial={testimonial}
                />
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

export default withStyles(styles)(News);
