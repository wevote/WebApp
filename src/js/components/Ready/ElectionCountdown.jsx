import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import BallotStore from '../../stores/BallotStore';
import { convertToInteger, formatDateToMonthDayYear } from '../../utils/textFormat';

class ElectionCountdown extends React.Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      electionDate: null,
    };
    this.setNewTime = this.setNewTime.bind(this);
  }

  componentDidMount () {
    this.onBallotStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  }

  onBallotStoreChange () {
    const electionDayText = BallotStore.currentBallotElectionDate;
    // console.log('electionDayText:', electionDayText);
    if (electionDayText) {
      // const electionDayTextFormatted = electionDayText ? moment(electionDayText).format('MMM Do, YYYY') : '';
      const electionDayTextDateFormatted = electionDayText ? moment(electionDayText).format('MM/DD/YYYY') : '';
      // console.log('electionDayTextFormatted: ', electionDayTextFormatted, ', electionDayTextDateFormatted:', electionDayTextDateFormatted);
      const electionDate = new Date(electionDayTextDateFormatted);
      this.setState({
        electionDate,
      });
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
      }
      this.timeInterval = setInterval(() => this.setNewTime(electionDate), 1000);
    }
  }

  setNewTime (electionDate) {
    if (electionDate) {
      const electionTime = new Date(electionDate).getTime();
      const currentTime = new Date().getTime();

      const distance = electionTime - currentTime;

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      days = `${days}`;
      if (numbersToAddZeroTo.includes(hours)) {
        hours = `0${hours}`;
      } else if (numbersToAddZeroTo.includes(minutes)) {
        minutes = `0${minutes}`;
      } else if (numbersToAddZeroTo.includes(seconds)) {
        seconds = `0${seconds}`;
      }

      this.setState({ days, hours, minutes, seconds });
    }
  }

  render () {
    const { days, hours, minutes, seconds, electionDate } = this.state;

    if (!electionDate || (!days || days === '0' || convertToInteger(days) <= 0)) {
      return null;
    }

    return (
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
                  {days || '0'}
                </Time>
                <Small>Days</Small>
              </TimeSection>
              <TimeSection><Time>:</Time></TimeSection>
              <TimeSection>
                <Time>
                  {hours || '00'}
                </Time>
                <Small>Hours</Small>
              </TimeSection>
              <TimeSection><Time>:</Time></TimeSection>
              <TimeSection>
                <Time>
                  {minutes || '00'}
                </Time>
                <Small>Minutes</Small>
              </TimeSection>
              <TimeSection><Time>:</Time></TimeSection>
              <TimeSection>
                <Time>
                  {seconds || '00'}
                </Time>
                <Small>Seconds</Small>
              </TimeSection>
            </TimeFlex>
          </div>
          <div className="d-md-none">
            <CardSubTitle center>
              until your next election on
              {' '}
              {formatDateToMonthDayYear(electionDate)}
              .
            </CardSubTitle>
          </div>
          <div className="d-none d-md-block">
            <CardSubTitle center desktopMode>
              until your next election on
              {' '}
              {formatDateToMonthDayYear(electionDate)}
              .
            </CardSubTitle>
          </div>
        </div>
      </Card>
    );
  }
}

const Card = styled.div`
`;

const CardTitle = styled.h1`
  color: #2E3C5D !important;
  font-size: 64px;
  font-weight: 900;
  margin-bottom: 8px;
  margin-top: 0;
  text-align: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 60px;
  }
`;

const CardSubTitle = styled.h3`
  font-size: ${props => (props.desktopMode ? '18px' : '22px')};
  font-weight: 700;
  color: #2E3C5D !important;
  width: fit-content;
  padding-bottom: 8px;
  margin-top: ${props => (props.desktopMode ? '24px' : null)};
  width: 100%;
  text-align: ${props => (props.center ? 'center' : 'left')};
  // border-bottom: 1px solid #2E3C5D;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 13px;
  }
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
  color: #2E3C5D !important;
`;

const Time = styled.h1`
  margin: 0;
  font-size: 60px !important;
  font-weight: 800 !important;
`;

const Small = styled.small`
  font-size: 18px !important;
`;

export default ElectionCountdown;
