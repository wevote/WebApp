import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import BallotStore from '../../stores/BallotStore';
import { formatDateToMonthDayYear } from '../../utils/textFormat';

class ElectionCountdown extends React.Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      electionDate: null,
      electionIsToday: false,
      electionInPast: false,
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
      // These are unixtime
      const electionTime = new Date(electionDate).getTime();
      const currentTime = new Date().getTime();
      // console.log('electionTime: ', electionTime, ', currentTime: ', currentTime);
      const distance = electionTime - currentTime;
      // console.log('distance: ', distance);
      if (distance >= 0) {
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysMobile = `${days + 1}`;
        days = `${days}`;
        if (hours < 10 && hours >= 0) {
          hours = `0${hours}`;
        }
        if (minutes < 10 && minutes >= 0) {
          minutes = `0${minutes}`;
        }
        if (seconds < 10 && seconds >= 0) {
          seconds = `0${seconds}`;
        }

        this.setState({
          days,
          daysMobile,
          hours,
          minutes,
          seconds,
        });
      } else if (distance > -86400000) {  // 86400000 is one day of milliseconds
        // Election is today
        this.setState({
          electionIsToday: true,
          electionInPast: false,
          days: 0,
          daysMobile: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      } else {
        // Election was yesterday or earlier
        this.setState({
          electionIsToday: false,
          electionInPast: true,
          days: 0,
          daysMobile: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    }
  }

  render () {
    const { days, daysMobile, electionIsToday, electionInPast, hours, minutes, seconds, electionDate } = this.state;

    const electionIsUpcomingHtml = (
      <Card className="card">
        <div className="card-main">
          <div className="u-show-mobile">
            <div>
              <CardTitleUpcoming>
                {(daysMobile || hours || minutes || seconds) ? (
                  <>
                    {daysMobile}
                    {' '}
                    {daysMobile === '1' ? 'day' : 'days'}
                  </>
                ) : (
                  <>
                    Days...
                  </>
                )}
              </CardTitleUpcoming>
            </div>
            <div>
              <CardSubTitle center>
                {(electionDate) ? (
                  <>
                    until your next election on
                    {' '}
                    {formatDateToMonthDayYear(electionDate)}
                    .
                  </>
                ) : (
                  <>
                    until your next election on...
                  </>
                )}
              </CardSubTitle>
            </div>
          </div>
          <div className="u-show-desktop-tablet">
            <div>
              {(days || hours || minutes || seconds) ? (
                <TimeFlex>
                  <TimeSection>
                    <Time>
                      {days || '0'}
                    </Time>
                    <Small>
                      {days === '1' ? 'Day' : 'Days'}
                    </Small>
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
              ) : (
                <TimeFlex>
                  <TimeSection>
                    <Time>
                      Loading...
                    </Time>
                    <Small>Days</Small>
                  </TimeSection>
                </TimeFlex>
              )}
            </div>
            <div>
              <CardSubTitle center desktopMode>
                {(electionDate) ? (
                  <>
                    until your next election on
                    {' '}
                    {formatDateToMonthDayYear(electionDate)}
                    .
                  </>
                ) : (
                  <>
                    until your next election on...
                  </>
                )}
              </CardSubTitle>
            </div>
          </div>
        </div>
      </Card>
    );
    const electionIsTodayHtml = (
      <Card className="card">
        <div className="card-main">
          <div className="u-show-mobile">
            <div>
              <CardTitleToday>
                Vote Today!
              </CardTitleToday>
            </div>
            <div>
              <CardSubTitle center>
                {(electionDate) ? (
                  <>
                    Your election is today
                    {' '}
                    {formatDateToMonthDayYear(electionDate)}
                    .
                  </>
                ) : (
                  <>
                    &nbsp;
                  </>
                )}
              </CardSubTitle>
            </div>
          </div>
          <div className="u-show-desktop-tablet">
            <div>
              <TimeFlex>
                <TimeSection>
                  <Time>
                    Vote Today!
                  </Time>
                </TimeSection>
              </TimeFlex>
            </div>
            <div>
              <CardSubTitle center desktopMode>
                {(electionDate) ? (
                  <>
                    Your election is today
                    {' '}
                    {formatDateToMonthDayYear(electionDate)}
                    .
                  </>
                ) : (
                  <>
                    &nbsp;
                  </>
                )}
              </CardSubTitle>
            </div>
          </div>
        </div>
      </Card>
    );
    const electionInPastHtml = (
      <Card className="card">
        <div className="card-main">
          <div className="u-show-mobile">
            <div>
              <CardTitlePast>
                This Election Has Passed
              </CardTitlePast>
            </div>
            <div>
              <CardSubTitle center>
                {(electionDate) ? (
                  <>
                    This election was on
                    {' '}
                    {formatDateToMonthDayYear(electionDate)}
                    .
                  </>
                ) : (
                  <>
                    &nbsp;
                  </>
                )}
              </CardSubTitle>
            </div>
          </div>
          <div className="u-show-desktop-tablet">
            <div>
              <TimeFlex>
                <TimeSection>
                  <Time>
                    Election Has Passed
                  </Time>
                  <Small>Choose Next Election</Small>
                </TimeSection>
              </TimeFlex>
            </div>
            <div>
              <CardSubTitle center desktopMode>
                {(electionDate) ? (
                  <>
                    This election was on
                    {' '}
                    {formatDateToMonthDayYear(electionDate)}
                    .
                  </>
                ) : (
                  <>
                    &nbsp;
                  </>
                )}
              </CardSubTitle>
            </div>
          </div>
        </div>
      </Card>
    );

    if (electionIsToday) {
      return electionIsTodayHtml;
    } else if (electionInPast) {
      return electionInPastHtml;
    } else {
      return electionIsUpcomingHtml;
    }
  }
}

const Card = styled.div`
`;

const CardTitleUpcoming = styled.h1`
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

const CardTitleToday = styled.h1`
  color: #2E3C5D !important;
  font-size: 64px;
  font-weight: 900;
  margin-bottom: 8px;
  margin-top: 0;
  text-align: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 40px;
  }
`;

const CardTitlePast = styled.h1`
  color: #2E3C5D !important;
  font-size: 64px;
  font-weight: 900;
  margin-bottom: 8px;
  margin-top: 0;
  text-align: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 30px;
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
