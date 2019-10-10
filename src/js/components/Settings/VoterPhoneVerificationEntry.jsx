import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Phone from '@material-ui/icons/Phone';
import InputBase from '@material-ui/core/InputBase';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import SettingsVerifySecretCode from './SettingsVerifySecretCode';
// import { Alert } from 'react-bootstrap';
// import {FormHelperText} from "@material-ui/core";

class VoterPhoneVerificationEntry extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      disablePhoneVerificationButton: true,
      displayPhoneVerificationButton: false,
      showVerifyModal: false,
      showError: false,
      voterPhoneNumber: '',
      voterPhoneNumberIsValid: false,
    };

    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.closeVerifyModal = this.closeVerifyModal.bind(this);
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  onPhoneNumberChange (e) {
    const invomingVoterPhoneNumber = e.target.value;
    const voterPhoneNumberWithPlus = `+${invomingVoterPhoneNumber}`;
    const voterPhoneNumberWithPlusAndOne = `+1${invomingVoterPhoneNumber}`;

    const voterPhoneNumberIsValidRaw = isValidPhoneNumber(invomingVoterPhoneNumber);
    const voterPhoneNumberIsValidWithPlus = isValidPhoneNumber(voterPhoneNumberWithPlus);
    const voterPhoneNumberIsValidWithPlusAndOne = isValidPhoneNumber(voterPhoneNumberWithPlusAndOne);
    const voterPhoneNumberIsValid = voterPhoneNumberIsValidRaw || voterPhoneNumberIsValidWithPlus || voterPhoneNumberIsValidWithPlusAndOne;
    // console.log('onPhoneNumberChange, invomingVoterPhoneNumber: ', invomingVoterPhoneNumber, ', voterPhoneNumberIsValid:', voterPhoneNumberIsValid);
    // console.log('voterPhoneNumberWithPlus:', voterPhoneNumberWithPlus);
    // console.log('voterPhoneNumberWithPlusAndOne:', voterPhoneNumberWithPlusAndOne);
    this.setState({
      disablePhoneVerificationButton: !voterPhoneNumberIsValid,
      voterPhoneNumber: invomingVoterPhoneNumber,
      voterPhoneNumberIsValid,
    });
  }

  displayPhoneVerificationButton = () => {
    this.setState({
      displayPhoneVerificationButton: true,
    });
  }

  hidePhoneVerificationButton = () => {
    const { voterPhoneNumber } = this.state;
    if (!voterPhoneNumber) {
      // Only hide if no number entered
      this.setState({
        displayPhoneVerificationButton: false,
      });
    }
  }

  onSubmit () {
    // console.log('onSubmit');
    const { voterPhoneNumber, voterPhoneNumberIsValid } = this.state;
    if (voterPhoneNumberIsValid) {
      VoterActions.sendSignInCodeSMS(voterPhoneNumber);
      this.setState({ showVerifyModal: true, showError: false });
    } else {
      this.setState({ showError: true });
    }
  }

  closeVerifyModal () {
    this.setState({ showVerifyModal: false });
  }

  render () {
    renderLog(__filename);
    if (this.state.loading) {
      return LoadingWheel;
    }

    const { classes } = this.props;
    const { disablePhoneVerificationButton, displayPhoneVerificationButton, showError, showVerifyModal, voterPhoneNumber } = this.state;

    return (
      <Wrapper>
        <div className="u-stack--sm u-tl">
          <strong>
            Sign in with SMS Phone Number
          </strong>
          {showError ? (
            <Error>
              Please enter a valid phone number.
            </Error>
          ) : null}
          {' '}
        </div>
        <form className="form-inline">
          <Paper className={classes.root} elevation={1}>
            <Phone />
            <InputBase
              className={classes.input}
              type="phone"
              name="voter_phone_number"
              id="enterVoterPhone"
              onBlur={this.hidePhoneVerificationButton}
              onChange={this.onPhoneNumberChange}
              onFocus={this.displayPhoneVerificationButton}
              placeholder="Type phone number here..."
            />
          </Paper>
          {displayPhoneVerificationButton && (
            <Button
              className={classes.button}
              color="primary"
              disabled={disablePhoneVerificationButton}
              id="voterPhoneSendSMS"
              onClick={this.onSubmit}
              variant="contained"
            >
              Send Verification Code
            </Button>
          )}
        </form>
        {showVerifyModal && (
          <SettingsVerifySecretCode
            show={showVerifyModal}
            toggleFunction={this.closeVerifyModal}
            voterPhoneNumber={voterPhoneNumber}
          />
        )}
      </Wrapper>
    );
  }
}

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 8,
    marginBottom: 8,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    padding: 8,
  },
  button: {
    width: '100%',
    padding: '12px',
  },
};

const Wrapper = styled.div`
  margin-top: 32px;
`;

const Error = styled.div`
  color: rgb(255, 73, 34);
  font-size: 14px;
`;

export default withStyles(styles)(VoterPhoneVerificationEntry);
