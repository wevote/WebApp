import { Button, Checkbox, Dialog, DialogContent, FormControlLabel, IconButton, InputBase, Paper, Select } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import { Close, EditLocation } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from '@mui/material/styles/styled';
import AnalyticsActions from '../../actions/AnalyticsActions';
import ReadyActions from '../../actions/ReadyActions';
import webAppConfig from '../../config';
import BallotStore from '../../stores/BallotStore';
import ReadyStore from '../../stores/ReadyStore';
import VoterStore from '../../stores/VoterStore';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { formatDateToMonthDayYear } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

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
    this.handleVotingRoughDateChange = this.handleVotingRoughDateChange.bind(this);
    this.handleVotingRoughDateClick = this.handleVotingRoughDateClick.bind(this);
    this.handleApproximateTimeChange = this.handleApproximateTimeChange.bind(this);
    this.handleModeOfTransportChange = this.handleModeOfTransportChange.bind(this);
    this.handleLocationToDeliverBallotChange = this.handleLocationToDeliverBallotChange.bind(this);
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


  handleVotingLocationAddressChange = (event) => {
    this.setState({ votingLocationAddress: event.target.value });
  };

  handleLocationToDeliverBallotChange (event) {
    this.setState({ locationToDeliverBallot: event.target.value });
  }

  handleModeOfTransportChange (event) {
    this.setState({ modeOfTransport: event.target.value });
  }

  handleApproximateTimeChange (event) {
    this.setState({ approximateTime: event.target.value });
  }

  handleVotingRoughDateChange (event) {
    this.setState({ votingRoughDate: event.target.value });
  }

  handleVotingRoughDateClick (event) {
    console.log(event.target.value);
    this.setState({ votingRoughDate: event.target.value });
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
      approximateTime, electionDateMonthYear, locationToDeliverBallot, modeOfTransport,
      savedVoterPlanFound, voterPlanChangedLocally, votingLocationAddress, votingRoughDate,
    } = this.state;
    const getPollingLocationUrl = 'https://gttp.votinginfoproject.org/';
    const voterPlanText = this.generateVoterPlanText();
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
          <div className="full-width">
            <CreatePlanWrapper>
              {(electionDateMonthYear) && (
                <span>
                  My upcoming election day is
                  {' '}
                  {electionDateMonthYear}
                  .
                  {' '}
                </span>
              )}
              <Select
                id="selectVotingRoughDate"
                input={<InputBase classes={{ root: classes.selectDefault, input: classes.selectInput }} label="What day will you fill out ballot?" />}
                native
                value={votingRoughDate}
                onChange={this.handleVotingRoughDateChange}
                onClick={this.handleVotingRoughDateClick}
                inputProps={{
                  placeholder: 'select when',
                }}
              >
                {/* <option value="select-when" className="emphasize">select when</option> */}
                <option value="on-day">On election day</option>
                <option value="day-before">The day before election day</option>
                <option value="two-days-before">Two days before election day</option>
                <option value="week-before">One week before election day</option>
                <option value="two-weeks-before">Two weeks before election day</option>
                <option value="asap">On the day my ballot arrives</option>
              </Select>
              {' '}
              around
              {' '}
              <Select
                id="selectApproximateTime"
                input={<InputBase classes={{ root: classes.selectDefault, input: classes.selectInput }} label="What time will you fill out ballot?" />}
                native
                value={approximateTime}
                onChange={this.handleApproximateTimeChange}
                inputProps={{
                  placeholder: 'select time',
                }}
              >
                {/* <option value="select-time" className="emphasize">select time</option> */}
                <option value="8:00 AM">8:00 AM</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="Noon">Noon</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
                <option value="5:00 PM">5:00 PM</option>
                <option value="6:00 PM">6:00 PM</option>
                <option value="7:00 PM">7:00 PM</option>
              </Select>
              {' '}
              I will
              {' '}
              {' '}
              <Select
                id="selectModeOfTransport"
                input={<InputBase classes={{ root: classes.selectDefault, input: classes.selectInput }} label="Mode of transport for delivering your ballot?" />}
                native
                value={modeOfTransport}
                onChange={this.handleModeOfTransportChange}
                inputProps={{
                  placeholder: 'select transport',
                }}
              >
                {/* <option value="select-mode-of-transport" className="emphasize">select transport</option> */}
                <option value="walk">walk</option>
                <option value="run">run</option>
                <option value="bike">bike</option>
                <option value="drive">drive</option>
                <option value="take a bus">take a bus</option>
                <option value="carpool">carpool</option>
                <option value="take subway">take subway</option>
                <option value="jetpack">jetpack</option>
                <option value="ride a giraffe">ride a giraffe</option>
              </Select>
              {' '}
              with my ballot to my
              {' '}
              {' '}
              <Select
                id="selectLocationToDeliverBallot"
                input={<InputBase classes={{ root: classes.selectDefault, input: classes.selectInput }} label="Where will you deliver your ballot?" />}
                native
                value={locationToDeliverBallot}
                onChange={this.handleLocationToDeliverBallotChange}
                inputProps={{
                  placeholder: 'select location',
                }}
              >
                {/* <option value="select-location" className="emphasize">select location</option> */}
                <option value="polling place">polling place</option>
                <option value="voting center">voting center</option>
                <option value="mailbox">mailbox</option>
                <option value="post office">post office</option>
              </Select>
              {((locationToDeliverBallot === 'polling place') || (locationToDeliverBallot === 'voting center')) ? (
                <span>
                  {' '}
                  at:
                  {' '}
                  <div>
                    <InternalFormWrapper>
                      <Paper className={classes.paperInputForm} elevation={2}>
                        <EditLocation className="ion-input-icon" />
                        <InputBase
                          aria-label="Address"
                          className={classes.inputBase}
                          id="enterVotingLocationAddress"
                          name="votingLocationAddress"
                          onChange={this.handleVotingLocationAddressChange}
                          placeholder={(locationToDeliverBallot === 'voting center') ? 'Address of Voting Center' : 'Address of Polling Location'}
                          value={votingLocationAddress}
                        />
                        <Suspense fallback={<></>}>
                          <OpenExternalWebSite
                            linkIdAttribute="getPollingLocationVoterPlanModal"
                            url={getPollingLocationUrl}
                            target="_blank"
                            className="u-gray-mid"
                            body={(
                              <Button
                                id="findPollingLocationButton"
                                classes={{ root: classes.saveButton }}
                                color="primary"
                                fullWidth
                                variant="contained"
                              >
                                <div className="u-show-mobile">
                                  Find
                                </div>
                                <div className="u-show-desktop-tablet">
                                  {(locationToDeliverBallot === 'polling place') && 'Find Polling Location'}
                                  {(locationToDeliverBallot === 'voting center') && 'Find Voting Center'}
                                </div>
                              </Button>
                            )}
                          />
                        </Suspense>
                      </Paper>
                    </InternalFormWrapper>
                  </div>
                </span>
              ) : (
                <span>.</span>
              )}
            </CreatePlanWrapper>
            <VoterPlanPreview>
              {voterPlanText}
            </VoterPlanPreview>

            {nextReleaseFeaturesEnabled && (
              <HowWillIRememberWrapper style={{
                marginTop: 48,
              }}
              >
                <Bold>How will I remember to do this?</Bold>
                <AddToMyCalendarWrapper>
                  <FormControlLabel
                    classes={{ root: classes.formControlLabel }}
                    id="addedToCalendar"
                    control={(
                      <Checkbox
                        // checked={state.checkedB}
                        // onChange={handleChange}
                        name="addedToCalendar"
                        color="primary"
                      />
                    )}
                    label="I added this to my calendar."
                  />
                </AddToMyCalendarWrapper>
                <TextReminderWrapper>
                  <FormControlLabel
                    classes={{ root: classes.formControlLabel }}
                    id="textMeReminder"
                    control={(
                      <Checkbox
                        // checked={state.checkedB}
                        // onChange={handleChange}
                        name="textMeReminder"
                        color="primary"
                      />
                    )}
                    label="Please text me a reminder at:"
                  />
                  {/* <InputItem> */}
                  <Paper className={classes.paperInputForm} elevation={2}>
                    <InputBase
                      className={classes.inputBase}
                      name="textMeReminderPhoneNumber"
                      aria-label="phone"
                      placeholder="Phone Number"
                    />
                  </Paper>
                </TextReminderWrapper>
                <EmailReminderWrapper>
                  {/* </InputItem> */}
                  <FormControlLabel
                    classes={{ root: classes.formControlLabel }}
                    id="emailMeReminder"
                    control={(
                      <Checkbox
                        // checked={state.checkedB}
                        // onChange={handleChange}
                        name="emailMeReminder"
                        color="primary"
                      />
                    )}
                    label="Please email me a reminder at:"
                  />
                  {/* <InputItem> */}
                  <Paper className={classes.paperInputForm} elevation={2}>
                    <InputBase
                      className={classes.inputBase}
                      name="emailMeReminderEmailAddress"
                      aria-label="email"
                      placeholder="Email Address"
                    />
                  </Paper>
                </EmailReminderWrapper>
              </HowWillIRememberWrapper>
            )}
          </div>
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

const styles = (theme) => ({
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
  closeButtonAbsolute: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  selectDefault: {
    position: 'relative',
    background: '#e8e8e8 !important',
    border: 'none',
    borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
    color: '#2E3C5D',
    fontSize: 16,
    fontWeight: 'bold',
    padding: '0 0 0 0',
    marginLeft: '0px',
    width: 'fit-content !important',
    // padding: '10px 26px 10px 12px',
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      background: '#00000030 !important',
    },
  },
  selectInput: {
    paddingBottom: '1px',
    paddingLeft: '6px',
  },
  paperInputForm: {
    padding: '0 0 0 .7rem',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxShadow: 'none',
    border: '2px solid #e8e8e8',
  },
  saveButton: {
    height: 'fit-content',
    marginLeft: 8,
    margin: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  inputBase: {
    flex: 1,
    [theme.breakpoints.up('sm')]: {
      width: 210,
    },
    [theme.breakpoints.up('md')]: {
      width: 250,
    },
  },
  formControlLabel: {
    marginBottom: 4,
    marginTop: 10,
  },
});

const AddToMyCalendarWrapper = styled('div')`
`;

const CreatePlanWrapper = styled('div')`
  line-height: 2;
`;

const HowWillIRememberWrapper = styled('div')`
`;

const EmailReminderWrapper = styled('div')`
`;

const TextReminderWrapper = styled('div')`
`;

const VoterPlanPreview = styled('div')`
  padding: 8px;
  background: #e8e8e8;
  font-size: 16px;
  border-radius: 5px;
  margin-top: 32px;
`;

const Bold = styled('h3')`
  font-weight: bold;
  font-size: 18px;
`;

const InternalFormWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 4px;
`;

/* eslint no-nested-ternary: ["off"] */
const ModalTitleArea = styled('div')`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: ${(props) => (props.firstslide ? '24px 24px 12px 24px' : '10px 14px')};
  z-index: 999;
  box-shadow: 0 0 25px 0 #ddd;
  @media (min-width: 769px) {
    // border-bottom: 2px solid #f7f7f7;
    box-shadow: 0 0 25px 0 #ddd;
  }
  display: flex;
`;

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
