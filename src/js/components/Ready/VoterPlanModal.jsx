import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogContent, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import VoterPlan from './VoterPlan';
import AnalyticsActions from '../../actions/AnalyticsActions';
import ReadyActions from '../../actions/ReadyActions';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { formatDateToMonthDayYear } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';
import ReadyStore from '../../stores/ReadyStore';
import VoterStore from '../../stores/VoterStore';

class VoterPlanModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      approximateTime: '8:00 AM',
      // approximateTimeSavedValue: '8:00 AM',
      electionDateMonthYear: '',
      locationToDeliverBallot: 'polling place',
      // locationToDeliverBallotSavedValue: 'polling place',
      modeOfTransport: 'walk',
      // modeOfTransportSavedValue: 'walk',
      savedVoterPlanFound: false,
      showToPublic: false,
      // showToPublicSavedValue: false,
      voterPlanChangedLocally: false,
      voterPlanDataSerialized: '',
      voterPlanDataSerializedCalculatedFirstTime: false,
      voterPlanText: '',
      votingLocationAddress: '',
      // votingLocationAddressSavedValue: '',
      votingRoughDate: 'on-day',
      // votingRoughDateSavedValue: 'on-day',
    };

    this.closeVoterPlanModal = this.closeVoterPlanModal.bind(this);
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.readyStoreListener = ReadyStore.addListener(this.onReadyStoreChange.bind(this));

    const googleCivicElectionId = VoterStore.electionId();
    const savedVoterPlan = ReadyStore.getVoterPlanForVoterByElectionId(googleCivicElectionId);
    // console.log('componentDidMount savedVoterPlan: ', savedVoterPlan);
    let savedVoterPlanFound = false;
    if (savedVoterPlan.google_civic_election_id === undefined) {
      ReadyActions.voterPlansForVoterRetrieve();
    } else {
      savedVoterPlanFound = true;
    }

    const ballotElectionDate = BallotStore.currentBallotElectionDate;
    if (ballotElectionDate) {
      this.setState({
        electionDateMonthYear: formatDateToMonthDayYear(ballotElectionDate),
      });
    }
    this.setState({
      savedVoterPlanFound,
    });
    this.setVoterPlanSavedStates(savedVoterPlan, true);
    AnalyticsActions.saveActionModalVoterPlan(VoterStore.electionId());
  }

  componentDidUpdate (prevProps, prevState) {
    // Update the Json that we save with all of the settings
    const {
      approximateTime, electionDateMonthYear, locationToDeliverBallot,
      modeOfTransport, showToPublic, voterPlanDataSerializedCalculatedFirstTime,
      votingLocationAddress, votingRoughDate,
    } = this.state;
    const voterPlanText = this.generateVoterPlanText();
    const {
      approximateTime: previousApproximateTime,
      electionDateMonthYear: previousElectionDateMonthYear,
      locationToDeliverBallot: previousLocationToDeliverBallot,
      modeOfTransport: previousModeOfTransport,
      showToPublic: previousShowToPublic,
      voterPlanText: previousVoterPlanText,
      votingLocationAddress: previousVotingLocationAddress,
      votingRoughDate: previousVotingRoughDate,
    } = prevState;
    if ((approximateTime !== previousApproximateTime) ||
        (electionDateMonthYear !== previousElectionDateMonthYear) ||
        (locationToDeliverBallot !== previousLocationToDeliverBallot) ||
        (modeOfTransport !== previousModeOfTransport) ||
        (voterPlanText !== previousVoterPlanText) ||
        (showToPublic !== previousShowToPublic) ||
        (votingLocationAddress !== previousVotingLocationAddress) ||
        (votingRoughDate !== previousVotingRoughDate)) {
      // Don't mark the voterPlan as changed the first time we load the data
      let voterPlanChangedLocally = false;
      if (voterPlanDataSerializedCalculatedFirstTime && previousVoterPlanText) {
        voterPlanChangedLocally = true;
      }
      const voterPlanDataSerialized = JSON.stringify({
        approximateTime,
        electionDateMonthYear,
        locationToDeliverBallot,
        modeOfTransport,
        votingLocationAddress,
        votingRoughDate,
      });
      // console.log('voterPlanDataSerialized:', voterPlanDataSerialized);
      this.setState({
        voterPlanChangedLocally,
        voterPlanDataSerialized,
        voterPlanDataSerializedCalculatedFirstTime: true,
        voterPlanText,
      });
    }
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.readyStoreListener.remove();
  }

  onBallotStoreChange () {
    const ballotElectionDate = BallotStore.currentBallotElectionDate;
    if (ballotElectionDate) {
      this.setState({
        electionDateMonthYear: formatDateToMonthDayYear(ballotElectionDate),
      });
    }
  }

  onReadyStoreChange () {
    const googleCivicElectionId = VoterStore.electionId();
    const savedVoterPlan = ReadyStore.getVoterPlanForVoterByElectionId(googleCivicElectionId);
    this.setVoterPlanSavedStates(savedVoterPlan);
    const voterPlansForVoterRetrieved = ReadyStore.getVoterPlansForVoterRetrieved();
    let savedVoterPlanFound = false;
    if (!voterPlansForVoterRetrieved) {
      ReadyActions.voterPlansForVoterRetrieve();
    } else if (savedVoterPlan.google_civic_election_id) {
      savedVoterPlanFound = true;
    }
    this.setState({
      savedVoterPlanFound,
    });
  }

  getVotingRoughDateString (votingRoughDate) {
    if (votingRoughDate === 'on-day') {
      return 'On election day';
    } else if (votingRoughDate === 'day-before') {
      return 'The day before election day';
    } else if (votingRoughDate === 'two-days-before') {
      return 'Two days before election day';
    } else if (votingRoughDate === 'week-before') {
      return 'One week before election day';
    } else if (votingRoughDate === 'two-weeks-before') {
      return 'Two weeks before election day';
    } else if (votingRoughDate === 'asap') {
      return 'On the day my ballot arrives';
    }
    return '';
  }

  onSaveVoterPlanButton = (event) => {
    // console.log('onSaveVoterPlanButton');
    const { location: { pathname } } = window;
    const { showToPublic, stateCode, voterPlanDataSerialized, voterPlanText } = this.state;
    const googleCivicElectionId = VoterStore.electionId();
    ReadyActions.voterPlanSave(googleCivicElectionId, showToPublic, stateCode, voterPlanDataSerialized, voterPlanText);
    this.setState({
      voterPlanChangedLocally: false,
    });
    event.preventDefault();
    this.props.toggleFunction(pathname);
  }

  setVoterPlanSavedStates = (voterPlan, firstTime = false) => {
    // console.log('setVoterPlanSavedStates: ', voterPlan);
    if (voterPlan) {
      const { voter_plan_data_serialized: voterPlanDataSerialized } = voterPlan;
      if (voterPlanDataSerialized && voterPlanDataSerialized.length > 0) {
        try {
          const voterPlanDataAsDict = JSON.parse(voterPlanDataSerialized);
          const { voterPlanChangedLocally } = this.state;
          const updateFormValues = firstTime || !voterPlanChangedLocally;
          if (updateFormValues) {
            this.setState({
              approximateTime: voterPlanDataAsDict.approximateTime,
              electionDateMonthYear: voterPlanDataAsDict.electionDateMonthYear,
              locationToDeliverBallot: voterPlanDataAsDict.locationToDeliverBallot,
              modeOfTransport: voterPlanDataAsDict.modeOfTransport,
              showToPublic: voterPlanDataAsDict.showToPublic,
              votingLocationAddress: voterPlanDataAsDict.votingLocationAddress,
              votingRoughDate: voterPlanDataAsDict.votingRoughDate,
            });
          }
        } catch (err) {
          console.log('CANNOT_SEE_voterPlanDataAsDict: ', err);
        }
      }
    }
  }

  generateVoterPlanText () {
    const {
      approximateTime, electionDateMonthYear, locationToDeliverBallot, modeOfTransport,
      votingLocationAddress, votingRoughDate,
    } = this.state;
    const votingRoughDateString = this.getVotingRoughDateString(votingRoughDate);
    let voterPlanText;
    if (electionDateMonthYear) {
      voterPlanText = `My upcoming election day is ${electionDateMonthYear}.`;
    } else {
      voterPlanText = ''; // 'This is how I will cast my vote.';
    }
    voterPlanText += ` ${votingRoughDateString} around ${approximateTime} I will ${modeOfTransport}`;
    voterPlanText += ` with my ballot to my ${locationToDeliverBallot}`;
    if (votingLocationAddress) {
      voterPlanText += ` at ${votingLocationAddress}`;
    }
    voterPlanText += '.';
    return voterPlanText;
  }

  closeVoterPlanModal () {
    const { location: { pathname } } = window;
    this.props.toggleFunction(pathname);
  }

  render () {
    renderLog('VoterPlanModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { location: { pathname } } = window;
    const {
      savedVoterPlanFound, voterPlanChangedLocally,
    } = this.state;
    const showSaveButton = voterPlanChangedLocally || !savedVoterPlanFound;
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(pathname); }}
      >
        <ModalTitleArea>
          <div>
            <Title>
              Your Plan for Voting
            </Title>
          </div>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            id="closeVoterPlanModal"
            onClick={this.closeVoterPlanModal}
            size="large"
          >
            <Close />
          </IconButton>
        </ModalTitleArea>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <VoterPlan toggleFunction={this.props.toggleFunction} />
        </DialogContent>
        <ModalFooter>
          <Button
            id="yourPlanForVotingSaveButton"
            color="primary"
            disabled={!showSaveButton}
            fullWidth
            onClick={this.onSaveVoterPlanButton}
            variant="contained"
          >
            Save
          </Button>
        </ModalFooter>
      </Dialog>
    );
  }
}
VoterPlanModal.propTypes = {
  classes: PropTypes.object,
  show: PropTypes.bool,
  toggleFunction: PropTypes.func.isRequired,
};

const styles = () => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 576px)': {
      maxWidth: '600px',
      width: '90%',
      height: 'fit-content',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      transitionDuration: '.25s',
    },
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: hasIPhoneNotch() ? '84%' : '90%',
    maxHeight: hasIPhoneNotch() ? '84%' : '90%',
    height: hasIPhoneNotch() ? '84%' : '90%',
    margin: '0 auto',
  },
  dialogContent: {
    padding: '0 24px 26px',
    background: '#f7f7f7',
    display: 'flex',
    justifyContent: 'center',
  },
  closeButton: {
    marginLeft: 'auto',
  },
});

/* eslint no-nested-ternary: ["off"] */
const ModalTitleArea = styled('div', {
  shouldForwardProp: (prop) => !['firstslide'].includes(prop),
})(({ firstslide }) => (`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: ${firstslide ? '24px 24px 12px 24px' : '10px 14px'};
  z-index: 999;
  box-shadow: 0 0 25px 0 #ddd;
  @media (min-width: 769px) {
    // border-bottom: 2px solid #f7f7f7;
    box-shadow: 0 0 25px 0 #ddd;
  }
  display: flex;
`));

const ModalFooter = styled('div')`
  box-shadow: 0 0 25px 0 #ddd;
  margin-bottom: 12px !important;
  padding: 12px 12px 0 12px;
  position: sticky;
  bottom: 0;
  button {
    margin: 0 !important;
  }
  width: 100%;
`;

const Title = styled('h3')`
  font-size: 24px;
  color: black;
  margin-top: 0;
  margin-bottom: 0;
  font-weight: bold;
`;

export default withTheme(withStyles(styles)(VoterPlanModal));
