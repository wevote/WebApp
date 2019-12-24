import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/esm/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/esm/Button';
import Dialog from '@material-ui/core/esm/Dialog';
import OutlinedInput from '@material-ui/core/esm/OutlinedInput';
import { renderLog } from '../../utils/logging';
import { hasIPhoneNotch, isIPhone4in, isIOS, isCordova } from '../../utils/cordovaUtils';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';

class SettingsVerifySecretCode extends Component {
  static propTypes = {
    classes: PropTypes.object,
    show: PropTypes.bool,
    closeVerifyModal: PropTypes.func,
    voterEmailAddress: PropTypes.string,
    voterPhoneNumber: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      digit1: '',
      digit2: '',
      digit3: '',
      digit4: '',
      digit5: '',
      digit6: '',
      condensed: false,
      errorToDisplay: false,
      errorMessageToDisplay: '',
      incorrectSecretCodeEntered: false,
      numberOfTriesRemaining: 5,
      secretCodeVerified: false,
      voterMustRequestNewCode: false,
      voterPhoneNumber: '',
      voterSecretCodeRequestsLocked: false,
    };
    this.onDigit1Change = this.onDigit1Change.bind(this);
    this.onDigit2Change = this.onDigit2Change.bind(this);
    this.onDigit3Change = this.onDigit3Change.bind(this);
    this.onDigit4Change = this.onDigit4Change.bind(this);
    this.onDigit5Change = this.onDigit5Change.bind(this);
    this.onDigit6Change = this.onDigit6Change.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.onPaste = this.onPaste.bind(this);
  }

  componentDidMount () {
    // console.log('SettingsVerifySecretCode componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { voterEmailAddress, voterPhoneNumber } = this.props;
    // const newVoterPhoneNumber = voterPhoneNumber.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    // console.log('voterEmailAddress:', voterEmailAddress);
    this.setState({
      voterEmailAddress,
      voterPhoneNumber,
    });
    const delayBeforeClearingVerificationStatus = 200;
    this.timer = setTimeout(() => {
      VoterActions.clearSecretCodeVerificationStatus();
    }, delayBeforeClearingVerificationStatus);

    window.addEventListener('paste', this.onPaste);
  }

  shouldComponentUpdate (nextState) {
    if (this.state.incorrectSecretCodeEntered !== nextState.incorrectSecretCodeEntered) return true;
    if (this.state.numberOfTriesRemaining !== nextState.numberOfTriesRemaining) return true;
    if (this.state.secretCodeVerified !== nextState.secretCodeVerified) return true;
    if (this.state.voterEmailAddress !== nextState.voterEmailAddress) return true;
    if (this.state.voterMustRequestNewCode !== nextState.voterMustRequestNewCode) return true;
    if (this.state.voterPhoneNumber !== nextState.voterPhoneNumber) return true;
    if (this.state.voterSecretCodeRequestsLocked !== nextState.voterSecretCodeRequestsLocked) return true;
    if (this.state.condensed !== nextState.condensed) return true;
    if (this.state.digit1 !== nextState.digit1) return true;
    if (this.state.digit2 !== nextState.digit2) return true;
    if (this.state.digit3 !== nextState.digit3) return true;
    if (this.state.digit4 !== nextState.digit4) return true;
    if (this.state.digit5 !== nextState.digit5) return true;
    if (this.state.digit6 !== nextState.digit6) return true;
    // console.log('shouldComponentUpdate return false');
    return false;
  }

  componentWillUnmount () {
    // console.log('SettingsVerifySecretCode componentWillUnmount');
    this.timer = null;
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { incorrectSecretCodeEntered, numberOfTriesRemaining, secretCodeVerified, voterMustRequestNewCode, voterSecretCodeRequestsLocked } = secretCodeVerificationStatus;
    if (secretCodeVerified) {
      this.closeVerifyModalLocal();
    } else {
      let errorMessageToDisplay = '';
      let errorToDisplay = false;
      if (voterSecretCodeRequestsLocked) {
        errorToDisplay = true;
        const { voterEmailAddress, voterPhoneNumber } = this.state;
        if (voterEmailAddress) {
          errorMessageToDisplay = `Please contact We Vote support regarding ${voterEmailAddress}.`;
        } else if (voterPhoneNumber) {
          errorMessageToDisplay = `Please contact We Vote support regarding ${voterPhoneNumber}.`;
        } else {
          errorMessageToDisplay = 'Please contact We Vote support. Your account is locked.';
        }
      } else if (voterMustRequestNewCode) {
        errorToDisplay = true;
        errorMessageToDisplay = 'You\'ve reached the maximum number of tries.';
      } else if (incorrectSecretCodeEntered || numberOfTriesRemaining <= 4) {
        errorToDisplay = true;
        errorMessageToDisplay = 'Incorrect code entered.';
      }
      this.setState({
        errorMessageToDisplay,
        incorrectSecretCodeEntered,
        numberOfTriesRemaining,
        secretCodeVerified,
        voterMustRequestNewCode,
        voterSecretCodeRequestsLocked,
        errorToDisplay,
      });
    }
  }

  onDigit1Change (e) {
    const regex = /^[0-9]$/;
    const digit = String.fromCharCode((e.keyCode >= 96 && e.keyCode <= 105) ? e.keyCode - 48  : e.keyCode);
    if (e.keyCode === 8 && this.state.digit1 === '') {
      e.target.value = '';
    } else if (e.keyCode !== 8 && regex.test(digit)) {
      if (e.target.value !== '') {
        e.target.blur();
        e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
      }
      this.setState({
        digit1: digit,
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
      e.target.value = digit;
      e.target.blur();
      e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
    } else {
      e.target.value = '';
      this.setState({
        digit1: '',
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
    }
  }

  onDigit2Change (e) {
    const regex = /^[0-9]$/;
    const digit = String.fromCharCode((e.keyCode >= 96 && e.keyCode <= 105) ? e.keyCode - 48  : e.keyCode);
    if (e.keyCode === 8 && this.state.digit2 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.focus();
      this.setState({ digit1: '' });
    } else if (e.keyCode !== 8 && regex.test(digit)) {
      if (e.target.value !== '') {
        e.target.blur();
        e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
      }
      this.setState({
        digit2: digit,
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
      e.target.value = digit;
      e.target.blur();
      e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
    } else {
      e.target.value = '';
      this.setState({
        digit2: '',
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
    }
  }

  onDigit3Change (e) {
    const regex = /^[0-9]$/;
    const digit = String.fromCharCode((e.keyCode >= 96 && e.keyCode <= 105) ? e.keyCode - 48  : e.keyCode);
    if (e.keyCode === 8 && this.state.digit3 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.focus();
      this.setState({ digit2: '' });
    } else if (e.keyCode !== 8 && regex.test(digit)) {
      if (e.target.value !== '') {
        e.target.blur();
        e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
      }
      this.setState({
        digit3: digit,
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
      e.target.value = digit;
      e.target.blur();
      e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
    } else {
      e.target.value = '';
      this.setState({
        digit3: '',
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
    }
  }

  onDigit4Change (e) {
    const regex = /^[0-9]$/;
    const digit = String.fromCharCode((e.keyCode >= 96 && e.keyCode <= 105) ? e.keyCode - 48  : e.keyCode);
    if (e.keyCode === 8 && this.state.digit4 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.focus();
      this.setState({ digit3: '' });
    } else if (e.keyCode !== 8 && regex.test(digit)) {
      if (e.target.value !== '') {
        e.target.blur();
        e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
      }
      this.setState({
        digit4: digit,
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
      e.target.value = digit;
      e.target.blur();
      e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
    } else {
      e.target.value = '';
      this.setState({
        digit4: '',
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
    }
  }

  onDigit5Change (e) {
    const regex = /^[0-9]$/;
    const digit = String.fromCharCode((e.keyCode >= 96 && e.keyCode <= 105) ? e.keyCode - 48  : e.keyCode);
    if (e.keyCode === 8 && this.state.digit5 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.focus();
      this.setState({ digit4: '' });
    } else if (e.keyCode !== 8 && regex.test(digit)) {
      if (e.target.value !== '') {
        e.target.blur();
        e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
      }
      this.setState({
        digit5: digit,
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
      e.target.value = digit;
      e.target.blur();
      e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
    } else {
      e.target.value = '';
      this.setState({
        digit5: '',
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
    }
  }

  onDigit6Change (e) {
    const regex = /^[0-9]$/;
    const digit = String.fromCharCode((e.keyCode >= 96 && e.keyCode <= 105) ? e.keyCode - 48  : e.keyCode);
    if (e.keyCode === 8 && this.state.digit6 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.focus();
      this.setState({ digit5: '' });
    } else if (e.keyCode !== 8 && regex.test(digit)) {
      this.setState({
        digit6: digit,
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
      e.target.value = digit;
    } else {
      e.target.value = '';
      this.setState({
        digit6: '',
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
    }
  }

  // eslint-disable-next-line react/sort-comp
  onPaste (e) {
    // console.log(e.clipboardData.getData('Text'));

    const pastedInputArray = e.clipboardData.getData('Text').split('');
    // console.log(pastedInputArray);

    const regex = /^[0-9]$/;

    const allDigits = pastedInputArray.filter(digit => regex.test(digit));

    if (allDigits[5]) {
      this.setState({
        digit1: allDigits[0],
        digit2: allDigits[1],
        digit3: allDigits[2],
        digit4: allDigits[3],
        digit5: allDigits[4],
        digit6: allDigits[5],
      });
      document.getElementById('digit6').focus();
      this.setState({
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });
    } else {
      this.setState({
        digit1: '',
        digit2: '',
        digit3: '',
        digit4: '',
        digit5: '',
        digit6: '',
        errorToDisplay: true,
        errorMessageToDisplay: 'Please enter a six-digit code',
      });
    }
  }

  voterVerifySecretCode = () => {
    const { digit1, digit2, digit3, digit4, digit5, digit6, voterPhoneNumber } = this.state;
    // console.log('voterVerifySecretCode local function, voterPhoneNumber:', voterPhoneNumber);
    const secretCode = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;
    const codeSentToSMSPhoneNumber = !!voterPhoneNumber;
    VoterActions.voterVerifySecretCode(secretCode, codeSentToSMSPhoneNumber);
  };

  closeVerifyModalLocal = () => {
    // console.log('SettingsVerifySecretCode closeVerifyModalLocal');
    if (this.props.closeVerifyModal) {
      this.props.closeVerifyModal();
    }
  };

  handleDigit6Blur = () => {
    const { digit1, digit2, digit3, digit4, digit5, digit6, voterPhoneNumber } = this.state;
    this.setState({ condensed: false });
    if (digit6 && isCordova()) {
      // When their is a voterEmailAddress value and the keyboard closes, submit
      const secretCode = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;
      const codeSentToSMSPhoneNumber = !!voterPhoneNumber;
      VoterActions.voterVerifySecretCode(secretCode, codeSentToSMSPhoneNumber);
    }
  };

  handleBlur () {
    this.setState({ condensed: false });
  }

  handleFocus (e) {
    e.target.select();
    if (isCordova()) {
      this.setState({ condensed: true });
    }
  }

  render () {
    renderLog('SettingsVerifySecretCode');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { condensed, errorMessageToDisplay, errorToDisplay, digit1, digit2, digit3, digit4, digit5, digit6, voterEmailAddress, voterMustRequestNewCode, voterPhoneNumber, voterSecretCodeRequestsLocked } = this.state;

    if (!voterEmailAddress && !voterPhoneNumber) {
      // We get a weird extra ghost version of SettingsVerifySecretCode, and this is how we block it.
      return null;
    }

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={this.closeVerifyModalLocal}
      >
        <ModalTitleArea condensed={condensed}>
          <Button onClick={this.closeVerifyModalLocal}>
            {isIOS() ? <ArrowBackIos /> : <ArrowBack />}
            {' '}
            Back
          </Button>
        </ModalTitleArea>
        <ModalContent condensed={condensed}>
          <TextContainer condensed={condensed}>
            <Title condensed={condensed}>Code Verification</Title>
            <Subtitle>A 6-digit code has been sent to</Subtitle>
            <PhoneSubtitle>{voterPhoneNumber || voterEmailAddress}</PhoneSubtitle>
            <InputContainer condensed={condensed}>
              <OutlinedInput
                classes={{ root: classes.inputBase, input: classes.input }}
                disabled={this.state.numberOfTriesRemaining === 0}
                error={errorToDisplay}
                id="digit1"
                maxLength={1}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onKeyDown={this.onDigit1Change}
                onPaste={this.onPaste}
                type="tel"
                value={this.state.digit1}
              />
              <OutlinedInput
                classes={{ root: classes.inputBase, input: classes.input }}
                disabled={this.state.numberOfTriesRemaining === 0}
                error={errorToDisplay}
                id="digit2"
                maxLength={1}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onKeyDown={this.onDigit2Change}
                onPaste={this.onPaste}
                type="tel"
                value={this.state.digit2}
              />
              <OutlinedInput
                classes={{ root: classes.inputBase, input: classes.input }}
                disabled={this.state.numberOfTriesRemaining === 0}
                error={errorToDisplay}
                id="digit3"
                maxLength={1}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onKeyDown={this.onDigit3Change}
                onPaste={this.onPaste}
                type="tel"
                value={this.state.digit3}
              />
              <OutlinedInput
                classes={{ root: classes.inputBase, input: classes.input }}
                disabled={this.state.numberOfTriesRemaining === 0}
                error={errorToDisplay}
                id="digit4"
                maxLength={1}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onKeyDown={this.onDigit4Change}
                onPaste={this.onPaste}
                type="tel"
                value={this.state.digit4}
              />
              <OutlinedInput
                classes={{ root: classes.inputBase, input: classes.input }}
                disabled={this.state.numberOfTriesRemaining === 0}
                error={errorToDisplay}
                id="digit5"
                maxLength={1}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onKeyDown={this.onDigit5Change}
                onPaste={this.onPaste}
                type="tel"
                value={this.state.digit5}
              />
              <OutlinedInput
                classes={{ root: classes.inputBase, input: classes.input }}
                disabled={this.state.numberOfTriesRemaining === 0}
                error={errorToDisplay}
                id="digit6"
                maxLength={1}
                onKeyDown={this.onDigit6Change}
                onFocus={this.handleFocus}
                onBlur={this.handleDigit6Blur}
                onPaste={this.onPaste}
                type="tel"
                value={this.state.digit6}
              />
            </InputContainer>
            {errorToDisplay && (
              <ErrorMessage>{errorMessageToDisplay}</ErrorMessage>
            )}
          </TextContainer>
          <ButtonsContainer condensed={condensed}>
            <Button
              disabled={digit1 === '' || digit2 === '' || digit3 === '' || digit4 === '' || digit5 === '' || digit6 === '' || voterMustRequestNewCode || voterSecretCodeRequestsLocked}
              classes={{ root: classes.verifyButton }}
              fullWidth
              color="primary"
              onClick={this.voterVerifySecretCode}
              variant="contained"
            >
              Verify
            </Button>
            {/* We will make this button work later
            <Button
              classes={{ root: classes.button }}
              color="primary"
              variant={voterMustRequestNewCode ? 'contained' : ''}
            >
              Resend SMS
            </Button>
            */}
            <Button
              classes={{ root: classes.button }}
              color="primary"
              onClick={this.closeVerifyModalLocal}
              variant={voterMustRequestNewCode ? 'contained' : 'outlined'}
            >
              {voterPhoneNumber ? 'Change Phone Number' : 'Change Email Address'}
            </Button>
          </ButtonsContainer>
        </ModalContent>
      </Dialog>
    );
  }
}

const styles = theme => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    [theme.breakpoints.up('sm')]: {
      maxWidth: '720px',
      width: '85%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
  },
  inputBase: {
    alignContent: 'center',
    display: 'flex',
    // flex: '0 0 1',
    justifyContent: 'center',
    margin: '0 4px',
    // maintain aspect ratio
    width: '10vw',
    height: '10vw',
    maxWidth: 53,
    maxHeight: 53,
    fontSize: 22,
    '@media(min-width: 569px)': {
      margin: '0 8px',
      fontSize: 35,
    },
    '&:first-child': {
      marginLeft: 0,
    },
    '&:last-child': {
      marginRight: 0,
    },
    background: '#f7f7f7',
  },
  input: {
    textAlign: 'center',
    padding: '8px 0',

  },
  button: {
    width: '100%',
    border: '1px solid #ddd',
    fontWeight: 'bold',
    margin: '6px 0',
  },
  verifyButton: {
    margin: '6px 0',
  },
});

const ModalTitleArea = styled.div`
  width: 100%;
  padding: ${props => (props.condensed ? '8px' : '12px')};
  box-shadow: 0 20px 40px -25px #999;
  z-index: 999;
  display: flex;
  justify-content: flex-start;
  position: absolute;
  top: 0;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.condensed ? 'flex-start' : 'space-evenly')};
  height: 100%;
  width: 80%;
  max-width: 400px;
  margin: 0 auto;
  padding: 86px 0 72px 0;
  padding: ${props => (props.condensed ? '66px 0 0 0' : '86px 0 72px 0')};
`;

const TextContainer = styled.div`
`;

const ButtonsContainer = styled.div`
  margin-top: ${props => (props.condensed ? '16px' : 'auto')};
`;

const Title = styled.h3`
  font-weight: bold;
  font-size: ${() => (isIPhone4in() ? '26px' : '30px')};
  padding: 0 10px;
  margin-bottom: ${props => (props.condensed ? '16px' : '36px')};
  color: black;
  text-align: center;
  media(min-width: 569px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.h4`
  color: #ccc;
  font-weight: bold;
  text-align: center;
`;

const PhoneSubtitle = styled.h4`
  color: black;
  font-weight: bold;
  text-align: center;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: auto;
  width: 100%;
  margin-top: ${props => (props.condensed ? '16px' : '32px')};
`;

const ErrorMessage = styled.div`
  color: red;
  margin: 12px 0;
  text-align: center;
  font-size: 14px;
`;

export default withTheme(withStyles(styles)(SettingsVerifySecretCode));

