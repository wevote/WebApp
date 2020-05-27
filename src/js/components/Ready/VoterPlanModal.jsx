import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Select, InputBase, Button, Paper, FormControlLabel, Checkbox } from '@material-ui/core';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';
import HowItWorks from '../../routes/HowItWorks';
import { hideZenDeskHelpVisibility, setZenDeskHelpVisibility } from '../../utils/applicationUtils';

class VoterPlanModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      pathname: '',
      date: 'select-date',
      time: 'select-time',
      transport: 'select-transport',
      location: 'select-location',
    };

    this.closeVoterPlanModal = this.closeVoterPlanModal.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleTransportChange = this.handleTransportChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    FriendActions.currentFriends();

    this.setState({
      pathname: this.props.pathname,
      currentFriendsList: FriendStore.currentFriends(),
    });
    if (this.props.show) {
      hideZenDeskHelpVisibility();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.show) {
      hideZenDeskHelpVisibility();
    } else {
      setZenDeskHelpVisibility(this.props.pathname);
    }
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    setZenDeskHelpVisibility(this.props.pathname);
  }

  onFriendStoreChange () {
    const { currentFriendsList } = this.state;
    if (currentFriendsList.length !== FriendStore.currentFriends().length) {
      this.setState({ currentFriendsList: FriendStore.currentFriends() });
    }
  }

  closeVoterPlanModal () {
    this.props.toggleFunction(this.state.pathname);
  }

  handleDateChange (e) {
    this.setState({ date: e.target.value });
  }

  handleTimeChange (e) {
    this.setState({ time: e.target.value });
  }

  handleTransportChange (e) {
    this.setState({ transport: e.target.value });
  }

  handleLocationChange (e) {
    this.setState({ location: e.target.value });
  }

  getDateString (date) {
    if (date === 'on-day') {
      return 'on election day.';
    } else if (date === 'day-before') {
      return 'the day before the election.';
    } else if (date === 'two-days-before') {
      return 'two days before the election.';
    } else if (date === 'week-before') {
      return 'one week before the election.';
    } else if (date === 'two-week-before') {
      return 'two weeks before the election.';
    } else if (date === 'asap') {
      return 'as soon as I get my ballot.';
    }
  }

  render () {
    renderLog('VoterPlanModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { date, time, transport, location } = this.state;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(this.state.pathname); }}
      >
        <ModalTitleArea>
          <div>
            <Title>
              My Plan for Voting
            </Title>
          </div>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={this.closeVoterPlanModal}
            id="profileCloseVoterPlanModal"
          >
            <CloseIcon />
          </IconButton>
        </ModalTitleArea>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <div className="full-width">
            <Bold>Create Plan</Bold>
            <Select
              input={<InputBase classes={{ root: classes.selectNoMargin }} />}
              native
              value={date}
              onChange={this.handleDateChange}
              inputProps={{
                placeholder: 'select when',
              }}
            >
              <option value="select-when" className="emphasize">select when</option>
              <option value="on-day">On election day</option>
              <option value="day-before">The day before</option>
              <option value="two-days-before">Two days before</option>
              <option value="week-before">One week before</option>
              <option value="two-weeks-before">Two weeks before</option>
              <option value="asap">As soon as I get my ballot</option>
            </Select>
            {' '}
November 3rd
            {' '}
, 2020 around
            {' '}
            <Select
              input={<InputBase classes={{ root: classes.select }} />}
              native
              value={time}
              onChange={this.handleTimeChange}
              inputProps={{
                placeholder: 'select time',
              }}
            >
              <option value="select-time" className="emphasize">select time</option>
              <option value="8:00 AM">8:00 AM</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 AM</option>
              <option value="1:00 PM">1:00 AM</option>
              <option value="2:00 PM">2:00 AM</option>
              <option value="3:00 PM">3:00 AM</option>
              <option value="4:00 PM">4:00 AM</option>
              <option value="5:00 PM">5:00 AM</option>
              <option value="6:00 PM">6:00 AM</option>
              <option value="7:00 PM">7:00 AM</option>
            </Select>
            {' '}
I will
            {' '}
            {' '}
            <Select
              input={<InputBase classes={{ root: classes.select }} />}
              native
              value={transport}
              onChange={this.handleTransportChange}
              inputProps={{
                placeholder: 'select transport',
              }}
            >
              <option value="select-transport" className="emphasize">select transport</option>
              <option value="drive">drive</option>
              <option value="walk">walk</option>
              <option value="skip">skip</option>
              <option value="hop">hop</option>
              <option value="fly">fly</option>
              <option value="jetpack">jetpack</option>
              <option value="bus">take a bus</option>
              <option value="giraffe">ride a giraffe</option>
              <option value="swim">swim</option>
            </Select>
            {' '}
to my
            {' '}
            {' '}
            <Select
              input={<InputBase classes={{ root: classes.select }} />}
              native
              value={location}
              onChange={this.handleLocationChange}
              inputProps={{
                placeholder: 'select location',
              }}
            >
              <option value="select-location" className="emphasize">select location</option>
              <option value="polling place">polling place</option>
              <option value="voting center">voting center</option>
              <option value="mailbox">mailbox</option>
              <option value="post office">post office</option>
            </Select>
            {' '}
at
            {' '}
            <div>
              <InternalFormWrapper>
                <Paper className={classes.paperInputForm} elevation={2}>
                  <EditLocationIcon className="ion-input-icon" />
                  <InputBase
                    className={classes.inputBase}
                    name="date"
                    aria-label="Address"
                    placeholder={`Enter ${location} address...`}
                    // value={}
                    // inputRef={(autocomplete) => { this.autoComplete = autocomplete; }}
                    // inputProps={{
                    //   onChange: this.updateVoterAddress,
                    //   onKeyDown: this.handleKeyPress,
                    // }}
                    id="editAddressOneHorizontalRowTextForMapSearch"
                  />
                  <Button
                    classes={{ root: classes.saveButton }}
                    color="primary"
                    fullWidth
                    id="editAddressOneHorizontalRowSaveButton"
                    onClick={this.voterAddressSave}
                    variant="contained"
                  >
                    Confirm
                  </Button>
                </Paper>
              </InternalFormWrapper>
            </div>
            {(location !== 'select-location' || date !== 'select-date' || time !== 'select-time') && (
              <Preview>
                I will drop off my ballot at my
                {' '}
                {location !== 'select-location' ? location : '__________'}
                {' '}
                {date !== 'asap' && `around ${time !== 'select-time' ? time : '__________'} ${date === 'select-date' ? 'on' : ''} `}
                {' '}
                {date !== 'select-date' ? this.getDateString(date) : '__________'}
              </Preview>
            )}

            <div style={{
              marginTop: 48,
            }}
            >
              <Bold>How will I remember to do this?</Bold>
              <FormControlLabel
                classes={{ root: classes.formControlLabel }}
                control={(
                  <Checkbox
                    // checked={state.checkedB}
                    // onChange={handleChange}
                    name="calendar"
                    color="primary"
                  />
                )}
                label="I just added this to my calendar for"
              />

              <InputFlex>
                <InputItem>
                  <Paper className={classes.paperInputForm} elevation={2}>
                    <InputBase
                    className={classes.inputBase}
                    name="date"
                    aria-label="date"
                    placeholder="Date"
                    />
                  </Paper>
                </InputItem>
                <InputItem>
                  <Paper className={classes.paperInputForm} elevation={2}>
                    <InputBase
                    className={classes.inputBase}
                    name="time"
                    aria-label="time"
                    placeholder="Time"
                    />
                  </Paper>
                </InputItem>
              </InputFlex>
              <FormControlLabel
                classes={{ root: classes.formControlLabel }}
                control={(
                  <Checkbox
                    // checked={state.checkedB}
                    // onChange={handleChange}
                    name="calendar"
                    color="primary"
                  />
                )}
                label="Please text me a reminder at:"
              />
              {/* <InputItem> */}
              <Paper className={classes.paperInputForm} elevation={2}>
                <InputBase
                  className={classes.inputBase}
                  name="phone"
                  aria-label="phone"
                  placeholder="Phone Number"
                />
              </Paper>
              {/* </InputItem> */}
              <FormControlLabel
                classes={{ root: classes.formControlLabel }}
                control={(
                  <Checkbox
                    // checked={state.checkedB}
                    // onChange={handleChange}
                    name="calendar"
                    color="primary"
                  />
                )}
                label="Please email me a reminder at:"
              />
              {/* <InputItem> */}
              <Paper className={classes.paperInputForm} elevation={2}>
                <InputBase
                  className={classes.inputBase}
                  name="email"
                  aria-label="email"
                  placeholder="Email Address"
                />
              </Paper>
            </div>
          </div>
        </DialogContent>
        <ModalFooter>
          <Button fullWidth variant="contained" color="primary">Save</Button>
        </ModalFooter>
      </Dialog>
    );
  }
}
const styles = theme => ({
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
    minHeight: '100%',
    maxHeight: '100%',
    height: '100%',
    margin: '0 auto',
  },
  dialogContent: {
    padding: '16px 24px 26px',
    background: '#f7f7f7',
    display: 'flex',
    justifyContent: 'center',
  },
  backButton: {
    // marginBottom: 6,
    // marginLeft: -8,
    paddingTop: 0,
    paddingBottom: 0,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  selectNoMargin: {
    borderRadius: 4,
    position: 'relative',
    border: 'none',
    fontSize: 16,
    // margin: '0px 8px',
    padding: '0 0 0 0',
    // background: '#00000010',
    fontWeight: 'bold',
    marginLeft: 0,
    color: '#2E3C5D',
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
  select: {
    borderRadius: 4,
    position: 'relative',
    border: 'none',
    fontSize: 16,
    // margin: '0px 8px',
    padding: '0 0 0 0',
    // background: '#00000010',
    fontWeight: 'bold',
    marginLeft: '6px',
    '::first-child': {
      marginLeft: '0px !important',
    },
    color: '#2E3C5D',
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
    width: 120,
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

const Preview = styled.div`
  padding: 8px;
  background: #e8e8e8;
  font-size: 16px;
  border-radius: 5px;
  margin: 16px 0 0;
`;

const Bold = styled.h3`
  font-weight: bold;
  font-size: 18px;
`;

const InternalFormWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

/* eslint no-nested-ternary: ["off"] */
const ModalTitleArea = styled.div`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: ${props => (props.firstSlide ? '24px 24px 12px 24px' : '10px 14px')};
  z-index: 999;
  box-shadow: 0px 0px 25px 0px #ddd;
  @media (min-width: 769px) {
    // border-bottom: 2px solid #f7f7f7;
    box-shadow: 0px 0px 25px 0px #ddd;
  }
  display: flex;
`;

const ModalFooter = styled.div`
  width: 100%;
  padding 24px;
  position: sticky;
  bottom: 0;
  button {
    margin: 0 !important;
  }
  box-shadow: 0px 0px 25px 0px #ddd;
`;

const Title = styled.h3`
  font-size: 24px;
  color: black;
  margin-top: 0;
  margin-bottom: 0;
  font-weight: bold;
`;

const InputFlex = styled.div`
  @media(min-width: 769px) {
    display: flex;
    align-items: center;
    justify-content: center;
    align-items: center;
    margin: -12px;
  }
`;

const InputItem = styled.div`
  padding: 12px;
`;

export default withTheme(withStyles(styles)(VoterPlanModal));
