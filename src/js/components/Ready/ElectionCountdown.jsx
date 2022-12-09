import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import BallotTitleHeader from '../Ballot/BallotTitleHeader';
import BallotTitleHeaderNationalPlaceholder from '../Ballot/BallotTitleHeaderNationalPlaceholder';
import { formatDateToMonthDayYear } from '../../common/utils/dateFormat';
import apiCalming from '../../common/utils/apiCalming';
import daysUntil from '../../common/utils/daysUntil';
import getBooleanValue from '../../common/utils/getBooleanValue';
import historyPush from '../../common/utils/historyPush';
import initializeMoment from '../../common/utils/initializeMoment';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';
import AppObservableStore from '../../common/stores/AppObservableStore';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));

class ElectionCountdown extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      daysUntilNextElection: 0,
      daysUntilNextNationalElection: 0,
      electionDateMDY: '',
      electionIsToday: false,
      electionInPast: false,
      nextNationalElectionDateMDY: '',
      t0: performance.now(),
      showButton: false,
    };
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
    // console.log('ElectionCountdown onBallotStoreChange electionDayText:', electionDayText);
    if (electionDayText === undefined) {
      const { t0 } = this.state;
      let { initialDelay } = this.props;
      initialDelay = initialDelay || 0;
      if (initialDelay === 0) {
        if (apiCalming('voterBallotItemsRetrieve', 30000)) {
          BallotActions.voterBallotItemsRetrieve();
        }
      } else {
        const delay = initialDelay - performance.now() - t0;
        if (this.loadDelay) clearTimeout(this.loadDelay);
        this.loadDelay = setTimeout(() => {
          if (apiCalming('voterBallotItemsRetrieve', 30000)) {
            BallotActions.voterBallotItemsRetrieve();
          }
        }, delay);
      }
    }
    const nextNationalElectionDayText = `${BallotStore.nextNationalElectionDayText || '2024-11-05'}`;
    // console.log('nextNationalElectionDayText:', nextNationalElectionDayText);
    initializeMoment(() => {
      const { moment } = window;
      this.setNextNationalElectionDateFromDayText(nextNationalElectionDayText);
      const nextNationalElectionDayMDYSlash = moment(nextNationalElectionDayText, 'YYYY-MM-DD').format('MM/DD/YYYY');
      const nextNationalElectionDate = new Date(nextNationalElectionDayMDYSlash);
      const nextNationalElectionDateMDY = formatDateToMonthDayYear(nextNationalElectionDate);
      this.setState({
        nextNationalElectionDateMDY,
      });
      if (electionDayText) {
        this.setNextElectionDateFromDayText(electionDayText);
        const electionDayMDYSlash = moment(electionDayText, 'YYYY-MM-DD').format('MM/DD/YYYY');
        const electionDate = new Date(electionDayMDYSlash);
        const electionDateMDY = formatDateToMonthDayYear(electionDate);
        this.setState({
          electionDateMDY,
        });
        const refreshIntervalInMilliseconds = 3600000; // 1 hour of milliseconds
        clearInterval(this.timeInterval);
        this.timeInterval = setInterval(() => this.setNextElectionDateFromDayText(electionDayText), refreshIntervalInMilliseconds);
      }
    });
  }

  onClickFunctionLocal = () => {
    if (this.props.onClickFunction) {
      this.props.onClickFunction();
    }
  }

  setNextElectionDateFromDayText = (nextElectionDayText) => {
    const daysUntilNextElection = daysUntil(nextElectionDayText);
    // console.log('setNextElectionDateFromDayText nextElectionDayText:', nextElectionDayText, ', daysUntilNextElection:', daysUntilNextElection);
    if (daysUntilNextElection > 0) {
      this.setState({
        electionIsToday: false,
        electionInPast: false,
        daysUntilNextElection,
      });
    } else if (daysUntilNextElection === 0) {  // 86400000 is one day of milliseconds
      // Election is today
      this.setState({
        electionIsToday: true,
        electionInPast: false,
        daysUntilNextElection: 0,
      });
    } else {
      // Election was yesterday or earlier
      this.setState({
        electionIsToday: false,
        electionInPast: true,
        daysUntilNextElection: 0,
      });
    }
  }

  setNextNationalElectionDateFromDayText = (nextNationalElectionDayText) => {
    const daysUntilNextNationalElection = daysUntil(nextNationalElectionDayText);
    // console.log('setNextNationalElectionDateFromDayText nextNationalElectionDayText:', nextNationalElectionDayText, ', daysUntilNextNationalElection:', daysUntilNextNationalElection);
    if (daysUntilNextNationalElection > 0) {
      this.setState({
        daysUntilNextNationalElection,
      });
    } else {
      // Election was yesterday or earlier
      this.setState({
        daysUntilNextNationalElection: 0,
      });
    }
  }

  // eslint-disable-next-line no-unused-vars
  toggleSelectBallotModal (showSelectBallotModal, showEditAddress = true) {
    AppObservableStore.setShowSelectBallotModal(!showSelectBallotModal, getBooleanValue(showEditAddress));
  }

  render () {
    renderLog('ElectionCountdown');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      daysUntilNextElection, daysUntilNextNationalElection, electionIsToday, electionInPast,
      electionDateMDY, nextNationalElectionDateMDY, showButton,
    } = this.state;
    // console.log('nextNationalElectionDateMDY:', nextNationalElectionDateMDY);
    const electionIsUpcomingHtml = (
      <CardCountdownInternalWrapper>
        <div>
          <CardTitleUpcoming className="u-cursor--pointer" onClick={() => this.onClickFunctionLocal()}>
            {daysUntilNextElection ? (
              <>
                {daysUntilNextElection}
                <SpaceBetweenNumberAndWord />
                {daysUntilNextElection === 1 ? 'day' : 'days'}
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
          <CardSubTitle center className="u-cursor--pointer" onClick={() => this.onClickFunctionLocal()}>
            {(electionDateMDY) ? (
              <>
                until your next election on
                {' '}
                <span className="u-no-break">
                  {electionDateMDY}
                  .
                </span>
              </>
            ) : (<></>)}
          </CardSubTitle>
        </div>
        <CountdownTitleHeaderWrapper>
          <BallotTitleHeader
            centerText
            electionDateBelow
            toggleSelectBallotModal={this.toggleSelectBallotModal}
            turnOffVoteByBelow
          />
        </CountdownTitleHeaderWrapper>
      </CardCountdownInternalWrapper>
    );
    const electionIsTodayHtml = (
      <CardCountdownInternalWrapper>
        <div>
          <div>
            <CardTitleToday className="u-cursor--pointer" onClick={() => this.onClickFunctionLocal()}>
              Voting ends today!
            </CardTitleToday>
          </div>
          <div>
            <CardSubTitle center className="u-cursor--pointer" onClick={() => this.onClickFunctionLocal()}>
              {electionDateMDY || ''}
            </CardSubTitle>
          </div>
          <CountdownTitleHeaderWrapper>
            <BallotTitleHeader
              centerText
              electionDateBelow
              toggleSelectBallotModal={this.toggleSelectBallotModal}
            />
          </CountdownTitleHeaderWrapper>
        </div>
      </CardCountdownInternalWrapper>
    );
    const nextNationalElectionHtml = (
      <CardCountdownInternalWrapper>
        <div>
          <CardTitleUpcoming>
            {daysUntilNextNationalElection ? (
              <>
                {daysUntilNextNationalElection}
                <SpaceBetweenNumberAndWord />
                {daysUntilNextNationalElection === 1 ? 'day' : 'days'}
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
        <CountdownTitleHeaderWrapper>
          <BallotTitleHeaderNationalPlaceholder
            centerText
            electionDateBelow
            electionDateMDY={nextNationalElectionDateMDY}
            electionName="General Election"
            // toggleSelectBallotModal={this.toggleSelectBallotModal}
            turnOffVoteByBelow
          />
        </CountdownTitleHeaderWrapper>
      </CardCountdownInternalWrapper>
    );

    let htmlToShow = <></>;
    if (electionIsToday) {
      htmlToShow = electionIsTodayHtml;
    } else if (electionInPast || !daysUntilNextElection || daysUntilNextElection < 0) {
      htmlToShow = nextNationalElectionHtml;
    } else {
      htmlToShow = electionIsUpcomingHtml;
    }
    return (
      <CardCountdown>
        <Suspense fallback={<></>}>
          <DelayedLoad waitBeforeShow={250}>
            {htmlToShow}
          </DelayedLoad>
        </Suspense>
      </CardCountdown>
    );
  }
}
ElectionCountdown.propTypes = {
  initialDelay: PropTypes.number,
  onClickFunction: PropTypes.func,
};

const CountdownTitleHeaderWrapper = styled('div')(({ theme }) => (`
  margin-top: 60px;
  ${theme.breakpoints.down('sm')} {
    margin-top: 42px;
  }
`));

const CardCountdown = styled('div')(({ theme }) => (`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  min-height: 190px;
  padding-top: 4px;
  padding-bottom: 8px;
  ${theme.breakpoints.down('sm')} {
    min-height: 140px;
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
})(({ desktopMode, center }) => (`
  font-size: ${desktopMode ? '18px' : '22px'};
  font-weight: 700;
  color: #2E3C5D !important;
  margin-bottom: 0 !important;
  margin-top: ${desktopMode ? '24px' : null};
  width: 100%;
  text-align: ${center ? 'center' : 'left'};
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
