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
import { formatDateToYearMonthDay } from '../utils/textFormat';

class Ready extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      electionDate: new Date('10/07/2020'),
    };

    this.setNewTime = this.setNewTime.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());

    setInterval(() => this.setNewTime(), 1000);
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

  setNewTime () {
    const electionTime = new Date(this.state.electionDate).getTime();
    const currentTime = new Date().getTime();

    const distance = electionTime - currentTime;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    if (numbersToAddZeroTo.includes(days)) {
      days = `0${days}`;
    } else if (numbersToAddZeroTo.includes(hours)) {
      hours = `0${hours}`;
    } else if (numbersToAddZeroTo.includes(minutes)) {
      minutes = `0${minutes}`;
    } else if (numbersToAddZeroTo.includes(seconds)) {
      seconds = `0${seconds}`;
    }

    this.setState({ days, hours, minutes, seconds });
  }

  render () {
    renderLog('Ready');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.voter) {
      return LoadingWheel;
    }

    const { days, hours, minutes, seconds, electionDate } = this.state;

    return (
      <div className="page-content-container">
        <div className="container-fluid">
          <Helmet title="Ready to Vote? - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="row">
            <div className="col-sm-12 col-md-8">
              <Card className="card">
                <div className="card-main">
                  <div className="d-md-none">
                    <CardTitle>
                      {days}
                      {' '}
                      days
                    </CardTitle>
                  </div>
                  <div className="d-md-block d-none">
                    <TimeFlex>
                      <TimeSection>
                        <Time>
                          {days}
                        </Time>
                        <Small>Days</Small>
                      </TimeSection>
                      <TimeSection><Time>:</Time></TimeSection>
                      <TimeSection>
                        <Time>
                          {hours}
                        </Time>
                        <Small>Hours</Small>
                      </TimeSection>
                      <TimeSection><Time>:</Time></TimeSection>
                      <TimeSection>
                        <Time>
                          {minutes}
                        </Time>
                        <Small>Minutes</Small>
                      </TimeSection>
                      <TimeSection><Time>:</Time></TimeSection>
                      <TimeSection>
                        <Time>
                          {seconds}
                        </Time>
                        <Small>Seconds</Small>
                      </TimeSection>
                    </TimeFlex>
                  </div>
                  <div className="d-md-none">
                    <CardSubTitle>
                    until your next election on
                      {' '}
                      {formatDateToYearMonthDay(electionDate)}
                    .
                    </CardSubTitle>
                  </div>
                  <div className="d-none d-md-block">
                    <CardSubTitle center>
                    until your next election on
                      {' '}
                      {formatDateToYearMonthDay(electionDate)}
                    .
                    </CardSubTitle>
                  </div>
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
  font-size: ${props => (props.center ? '18px' : '22px')};
  font-weight: 700;
  color: #2E3C5D !important;
  width: fit-content;
  padding-bottom: 16px;
  margin-top: ${props => (props.center ? '24px' : null)};
  width: 100%;
  text-align: ${props => (props.center ? 'center' : 'left')};
  // border-bottom: 1px solid #2E3C5D;
`;

const Title = styled.h2`
  font-size: 26px;
  margin: 36px 0 16px;
  font-weight: 800;
`;

const TimeFlex = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 0 -8px 0 -8px;
`;

const TimeSection = styled.div`
  padding: 0px 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const Time = styled.h1`
  margin: 0;
  font-size: 60px !important;
  font-weight: 800 !important;
`;

const Small = styled.small`
  font-size: 18px !important;
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
