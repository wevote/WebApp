import { Button } from '@mui/material';
import styled from '@mui/material/styles/styled';
import PropTypes from 'prop-types';
import React from 'react';
import BallotActions from '../../actions/BallotActions';
import { formatDateToMonthDayYear } from '../../common/utils/dateFormat';
import historyPush from '../../common/utils/historyPush';
import initializeMoment from '../../common/utils/initializeMoment';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';


class ElectionCountdown extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      electionDateMDY: '',
      electionIsToday: false,
      electionInPast: false,
      nextNationalElectionDateMDY: '',
      t0: performance.now(),
      showButton: false,
    };
    this.setNewTime = this.setNewTime.bind(this);
  }

  componentDidMount () {
    this.onBallotStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.addressSuggestiontimer = setTimeout(() => {
      const { electionDateMDY } = this.state;
      const { location: { pathname } } = window;
      if (electionDateMDY.length === 0) {
        // console.log('history push or button appears');
        if (pathname === '' || pathname === '/' || pathname === '/ready') {
          this.setState({ showButton: true });
        }
      }
    }, 5000);
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    if (this.addressSuggestiontimer) clearTimeout(this.addressSuggestiontimer);
    clearInterval(this.timeInterval);
    if (this.loadDelay) clearTimeout(this.loadDelay);
  }

  onBallotStoreChange () {
    const electionDayText = BallotStore.currentBallotElectionDate;
    // console.log('electionDayText:', electionDayText);
    if (electionDayText === undefined) {
      const { t0 } = this.state;
      let { initialDelay } = this.props;
      initialDelay = initialDelay || 0;
      if (initialDelay === 0) {
        BallotActions.voterBallotItemsRetrieve();
      } else {
        const delay = initialDelay - performance.now() - t0;
        if (this.loadDelay) clearTimeout(this.loadDelay);
        this.loadDelay = setTimeout(() => {
          BallotActions.voterBallotItemsRetrieve();
        }, delay);
      }
    }
    const nextNationalElectionDayText = `${BallotStore.nextNationalElectionDayText || '2022-11-08'}`;
    // console.log('nextNationalElectionDayText:', nextNationalElectionDayText);
    initializeMoment(() => {
      const { moment } = window;
      const nextNationalElectionDayMDYSlash = moment(nextNationalElectionDayText, ['YYYY-MM-DD', 'MM/DD/YY', 'MM-DD-YY']).format('MM/DD/YYYY');
      const nextNationalElectionDateMDY = formatDateToMonthDayYear(nextNationalElectionDayMDYSlash);
      this.setState({
        nextNationalElectionDateMDY,
      });
      const nextNationalElectionDate = new Date(nextNationalElectionDayMDYSlash);
      this.setNextNationalElectionDate(nextNationalElectionDate);
      if (electionDayText) {
        const electionDayMDYSlash = moment(electionDayText).format('MM/DD/YYYY');
        const electionDateMDY = formatDateToMonthDayYear(electionDayMDYSlash);
        this.setState({
          electionDateMDY,
        });
        const electionDate = new Date(electionDayMDYSlash);
        this.setNewTime(electionDate);
        const refreshIntervalInMilliseconds = 3600000; // One hours worth of milliseconds
        clearInterval(this.timeInterval);
        this.timeInterval = setInterval(() => this.setNewTime(electionDate), refreshIntervalInMilliseconds);
      }
    });
  }

  onClickFunctionLocal = () => {
    if (this.props.onClickFunction) {
      this.props.onClickFunction();
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
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));

        const daysMobile = `${days + 1}`;

        this.setState({
          daysMobile,
        });
      } else if (distance > -86400000) {  // 86400000 is one day of milliseconds
        // Election is today
        this.setState({
          electionIsToday: true,
          electionInPast: false,
          daysMobile: 0,
        });
      } else {
        // Election was yesterday or earlier
        this.setState({
          electionIsToday: false,
          electionInPast: true,
          daysMobile: 0,
        });
      }
    }
  }

  setNextNationalElectionDate (nextNationalElectionDate) {
    if (nextNationalElectionDate) {
      // These are unixtime
      const electionTime = new Date(nextNationalElectionDate).getTime();
      const currentTime = new Date().getTime();
      // console.log('electionTime: ', electionTime, ', currentTime: ', currentTime);
      const distance = electionTime - currentTime;
      // console.log('distance: ', distance);
      if (distance >= 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));

        const daysUntilNextNationalElection = `${days + 1}`;

        this.setState({
          daysUntilNextNationalElection,
        });
      } else if (distance > -86400000) {  // 86400000 is one day of milliseconds
        // Election is today
        this.setState({
          daysUntilNextNationalElection: 0,
        });
      } else {
        // Election was yesterday or earlier
        this.setState({
          daysUntilNextNationalElection: 0,
        });
      }
    }
  }

  render () {
    renderLog('ElectionCountdown');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      daysMobile, daysUntilNextNationalElection, electionIsToday, electionInPast,
      electionDateMDY, nextNationalElectionDateMDY, showButton,
    } = this.state;
    const electionIsUpcomingHtml = (
      <CardCountdown className="card u-cursor--pointer" onClick={() => this.onClickFunctionLocal()}>
        <CardCountdownInternalWrapper>
          <div>
            <CardTitleUpcoming>
              {daysMobile ? (
                <>
                  {daysMobile}
                  <SpaceBetweenNumberAndWord />
                  {daysMobile === '1' ? 'day' : 'days'}
                </>
              ) : (
                <div style={{ margin: 26 }}>
                  { showButton ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      id="goToHeavyButton"
                      onClick={() => historyPush('/ballot')}
                    >
                      Choose Election
                    </Button>
                  ) : (
                    <DaysFindingText>
                      Finding election...
                    </DaysFindingText>
                  )}
                </div>
              )}
            </CardTitleUpcoming>
          </div>
          <div>
            <CardSubTitle center>
              {(electionDateMDY) ? (
                <>
                  until your next election on
                  {' '}
                  {electionDateMDY}
                  .
                </>
              ) : (<></>)}
            </CardSubTitle>
          </div>
        </CardCountdownInternalWrapper>
      </CardCountdown>
    );
    const electionIsTodayHtml = (
      <CardCountdown className="card u-cursor--pointer" onClick={() => this.onClickFunctionLocal()}>
        <CardCountdownInternalWrapper>
          <div>
            <div>
              <CardTitleToday>
                Vote Today!
              </CardTitleToday>
            </div>
            <div>
              <CardSubTitle center>
                {(electionDateMDY) ? (
                  <>
                    Your election is today
                    {' '}
                    {electionDateMDY}
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
        </CardCountdownInternalWrapper>
      </CardCountdown>
    );
    const nextNationalElectionHtml = (
      <CardCountdown className="card">
        <CardCountdownInternalWrapper>
          <div>
            <CardTitleUpcoming>
              {daysUntilNextNationalElection ? (
                <>
                  {daysUntilNextNationalElection}
                  <SpaceBetweenNumberAndWord />
                  {daysUntilNextNationalElection === '1' ? 'day' : 'days'}
                </>
              ) : (
                <div style={{ margin: 26 }}>
                  <DaysFindingText>
                    Loading election...
                  </DaysFindingText>
                </div>
              )}
            </CardTitleUpcoming>
          </div>
          <div>
            <CardSubTitle center>
              {(nextNationalElectionDateMDY) ? (
                <>
                  until national election on
                  {' '}
                  {nextNationalElectionDateMDY}
                  .
                </>
              ) : (<></>)}
            </CardSubTitle>
          </div>
        </CardCountdownInternalWrapper>
      </CardCountdown>
    );

    if (electionIsToday) {
      return electionIsTodayHtml;
    } else if (electionInPast) {
      return nextNationalElectionHtml;
    } else {
      return electionIsUpcomingHtml;
    }
  }
}
ElectionCountdown.propTypes = {
  initialDelay: PropTypes.number,
  onClickFunction: PropTypes.func,
};

const CardCountdown = styled('div')(({ theme }) => (`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  min-height: 190px;
  padding-top: 4px;
  padding-bottom: 8px;
  ${theme.breakpoints.down('sm')} {
    min-height: 10px;
  }
`));

const CardCountdownInternalWrapper = styled('div')`
`;

const CardTitleUpcoming = styled('h1')(({ theme }) => (`
  color: #2E3C5D !important;
  font-size: 64px;
  font-weight: 900;
  margin-bottom: 8px;
  margin-top: 0;
  text-align: center;
  ${theme.breakpoints.down('xs')} {
    font-size: 60px;
  }
`));

const CardTitleToday = styled('h1')(({ theme }) => (`
  color: #2E3C5D !important;
  font-size: 60px;
  font-weight: 900;
  margin-bottom: 8px;
  margin-top: 0;
  text-align: center;
  ${theme.breakpoints.down('xs')} {
    font-size: 40px;
  }
`));

const CardSubTitle = styled('h3', {
  shouldForwardProp: (prop) => !['desktopMode', 'center'].includes(prop),
})(({ desktopMode, center, theme }) => (`
  font-size: ${desktopMode ? '18px' : '22px'};
  font-weight: 700;
  color: #2E3C5D !important;
  // width: fit-content;
  margin-bottom: 0 !important;
  margin-top: ${desktopMode ? '24px' : null};
  width: 100%;
  text-align: ${center ? 'center' : 'left'};
  // border-bottom: 1px solid #2E3C5D;
  ${theme.breakpoints.down('md')} {
    font-size: 14px;
  }
  ${theme.breakpoints.down('xs')} {
    font-size: 13px;
  }
`));

const DaysFindingText = styled('div')`
  color: #ccc;
  font-size: 20px;
  margin-top: 20px;
`;

const SpaceBetweenNumberAndWord = styled('span')`
  margin-left: 8px;
`;

export default ElectionCountdown;
