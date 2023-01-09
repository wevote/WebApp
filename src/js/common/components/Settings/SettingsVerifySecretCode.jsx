import { ArrowBack, ArrowBackIos } from '@mui/icons-material';
import { Button, Dialog, OutlinedInput } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import VoterActions from '../../../actions/VoterActions';
import { hasIPhoneNotch, isIOS, isIPhone4in } from '../../utils/cordovaUtils';
import { isCordova, isWebApp } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../../stores/VoterStore';

/* global $ */

class SettingsVerifySecretCode extends Component {
  constructor (props) {
    super(props);
    this.state = {
      cancelingVerifyModal: false,
      condensed: false,
      digit1: '',
      digit2: '',
      digit3: '',
      digit4: '',
      digit5: '',
      digit6: '',
      errorToDisplay: false,
      errorMessageToDisplay: '',
      incorrectSecretCodeEntered: false,
      numberOfTriesRemaining: 5,
      secretCodeVerified: false,
      voterMustRequestNewCode: false,
      voterPhoneNumber: '',
      voterSecretCodeRequestsLocked: false,
      voterVerifySecretCodeSubmitted: false,
    };
    this.onDigit1Change = this.onDigit1Change.bind(this);
    this.onDigit2Change = this.onDigit2Change.bind(this);
    this.onDigit3Change = this.onDigit3Change.bind(this);
    this.onDigit4Change = this.onDigit4Change.bind(this);
    this.onDigit5Change = this.onDigit5Change.bind(this);
    this.onDigit6Change = this.onDigit6Change.bind(this);
    this.handleKeyDown2 = this.handleKeyDown2.bind(this);
    this.handleKeyDown3 = this.handleKeyDown3.bind(this);
    this.handleKeyDown4 = this.handleKeyDown4.bind(this);
    this.handleKeyDown5 = this.handleKeyDown5.bind(this);
    this.handleKeyDown6 = this.handleKeyDown6.bind(this);
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
    this.clearSecretCodeVerificationStatusTimer = setTimeout(() => {
      VoterActions.clearSecretCodeVerificationStatus();
    }, delayBeforeClearingVerificationStatus);

    window.addEventListener('paste', this.onPaste);

    if (isCordova()) {
      $('#textOrEmailEntryDialog').css('display', 'none');  // Hide the entry dialog
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.incorrectSecretCodeEntered !== nextState.incorrectSecretCodeEntered) return true;
    if (this.state.numberOfTriesRemaining !== nextState.numberOfTriesRemaining) return true;
    if (this.state.secretCodeVerified !== nextState.secretCodeVerified) return true;
    if (this.state.voterEmailAddress !== nextState.voterEmailAddress) return true;
    if (this.state.voterMustRequestNewCode !== nextState.voterMustRequestNewCode) return true;
    if (this.state.voterPhoneNumber !== nextState.voterPhoneNumber) return true;
    if (this.state.voterSecretCodeRequestsLocked !== nextState.voterSecretCodeRequestsLocked) return true;
    if (this.state.voterVerifySecretCodeSubmitted !== nextState.voterVerifySecretCodeSubmitted) return true;
    if (this.state.cancelingVerifyModal !== nextState.cancelingVerifyModal) return true;
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
    this.voterStoreListener.remove();
    if (this.closeVerifyModalLocalTimer) {
      clearTimeout(this.closeVerifyModalLocalTimer);
    }
    if (this.clearSecretCodeVerificationStatusTimer) {
      clearTimeout(this.clearSecretCodeVerificationStatusTimer);
    }
    window.removeEventListener('paste', this.onPaste);
    this.closeVerifyModalLocal();
  }

  handleDigit6Blur = () => {
    // 2022-09-29 NOTE: Submitting the code on blur can cause some weird behavior.
    // One case is this: clicking "Try a different number" after you have entered a full and correct
    //  verification code, signs you in. But attempts to change/remove
    //  this "handleDigit6Blur" function caused other, worse problems.
    const {
      cancelingVerifyModal, digit1, digit2, digit3, digit4, digit5, digit6,
      voterPhoneNumber, voterVerifySecretCodeSubmitted,
    } = this.state;
    this.setState({ condensed: false });
    if (digit6) {
      // Jan 2020 this comment looks wrong, but might still contain a clue:  When there is a voterEmailAddress value and the keyboard closes, submit
      const secretCode = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;
      const codeSentToSMSPhoneNumber = !!voterPhoneNumber;
      if (!voterVerifySecretCodeSubmitted && !cancelingVerifyModal) {
        VoterActions.voterVerifySecretCode(secretCode, codeSentToSMSPhoneNumber);
        this.setState({ voterVerifySecretCodeSubmitted: true });
      }
    }
  };

  handleKeyDown2 (e) {
    if (e.keyCode === 8 && this.state.digit2 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.focus();
      this.setState({ digit1: '' });
    }
  }

  handleKeyDown3 (e) {
    if (e.keyCode === 8 && this.state.digit3 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.focus();
      this.setState({ digit2: '' });
    }
  }

  handleKeyDown4 (e) {
    if (e.keyCode === 8 && this.state.digit4 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.focus();
      this.setState({ digit3: '' });
    }
  }

  handleKeyDown5 (e) {
    if (e.keyCode === 8 && this.state.digit5 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.focus();
      this.setState({ digit4: '' });
    }
  }

  handleKeyDown6 (e) {
    const ENTER_KEY_CODE = 13;
    const BACKSPACE_KEY_CODE = 8;
    if (e.keyCode === BACKSPACE_KEY_CODE && this.state.digit6 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.focus();
      this.setState({ digit5: '' });
    }
    const keyCodesForSubmit = [ENTER_KEY_CODE];
    if (keyCodesForSubmit.includes(e.keyCode)) {
      e.preventDefault();
      this.voterVerifySecretCode(e);
    }
  }

  handleBlur () {
    this.setState({ condensed: false });
  }

  handleFocus (e) {
    e.target.select();
    if (isCordova()) {
      this.setState({ condensed: true });
    }
  }

  onVoterStoreChange () {
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { incorrectSecretCodeEntered, numberOfTriesRemaining, secretCodeVerified, voterMustRequestNewCode, voterSecretCodeRequestsLocked } = secretCodeVerificationStatus;
    // console.log(`onVoterStoreChange secretCodeVerified: ${secretCodeVerified}`);
    if (secretCodeVerified) {
      // console.log('SettingsVerifySecretCode -- onVoterStoreChange secretCodeVerified: yes');
      this.closeSignInModalLocal();
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
        errorToDisplay,
        incorrectSecretCodeEntered,
        numberOfTriesRemaining,
        secretCodeVerified,
        voterMustRequestNewCode,
        voterSecretCodeRequestsLocked,
        voterVerifySecretCodeSubmitted: false,
      });
    }
  }

  onDigit1Change (e) {
    const regex = /^[0-9]$/;
    const regex2 = /^[0-9]{7}$/;
    const digit = e.target.value;

    if (regex2.test(digit)) { // change is fired on paste, resulting in multiple digits
      return;
    }

    if (regex.test(digit)) {
      e.target.blur();
      e.target.parentElement.nextElementSibling.firstElementChild.focus();
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
    const regex2 = /^[0-9]{7}$/;
    const digit = e.target.value;

    if (regex2.test(digit)) { // change is fired on paste, resulting in multiple digits
      return;
    }

    if (regex.test(digit)) {
      e.target.blur();
      e.target.parentElement.nextElementSibling.firstElementChild.focus();
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
    const regex2 = /^[0-9]{7}$/;
    const digit = e.target.value;

    if (regex2.test(digit)) { // change is fired on paste, resulting in multiple digits
      return;
    }

    if (regex.test(digit)) {
      e.target.blur();
      e.target.parentElement.nextElementSibling.firstElementChild.focus();
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
    const regex2 = /^[0-9]{7}$/;
    const digit = e.target.value;

    if (regex2.test(digit)) { // change is fired on paste, resulting in multiple digits
      return;
    }

    if (regex.test(digit)) {
      e.target.blur();
      e.target.parentElement.nextElementSibling.firstElementChild.focus();
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
    const regex2 = /^[0-9]{7}$/;
    const digit = e.target.value;

    if (regex2.test(digit)) { // change is fired on paste, resulting in multiple digits
      return;
    }

    if (regex.test(digit)) {
      e.target.blur();
      e.target.parentElement.nextElementSibling.firstElementChild.focus();
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
    const regex2 = /^[0-9]{7}$/;
    const digit = e.target.value;

    if (regex2.test(digit)) { // change is fired on paste, resulting in multiple digits
      return;
    }

    if (regex.test(digit)) {
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

    const allDigits = pastedInputArray.filter((digit) => regex.test(digit));

    if (allDigits[5]) {
      this.setState({
        digit1: allDigits[0],
        digit2: allDigits[1],
        digit3: allDigits[2],
        digit4: allDigits[3],
        digit5: allDigits[4],
        digit6: allDigits[5],
        errorToDisplay: false,
        errorMessageToDisplay: '',
      });

      document.getElementById('digit1').blur(); // prevents change from firing on chrome
      document.getElementById('digit2').blur(); // prevents change from firing on chrome
      document.getElementById('digit3').blur(); // prevents change from firing on chrome
      document.getElementById('digit4').blur(); // prevents change from firing on chrome
      document.getElementById('digit5').blur(); // prevents change from firing on chrome
      document.getElementById('digit6').blur(); // prevents change from firing on chrome
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
    const { digit1, digit2, digit3, digit4, digit5, digit6, voterPhoneNumber, voterVerifySecretCodeSubmitted } = this.state;
    // console.log('voterVerifySecretCode local function, voterPhoneNumber:', voterPhoneNumber);
    const secretCode = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;
    const codeSentToSMSPhoneNumber = !!voterPhoneNumber;
    if (!voterVerifySecretCodeSubmitted) {
      VoterActions.voterVerifySecretCode(secretCode, codeSentToSMSPhoneNumber);
      this.setState({ voterVerifySecretCodeSubmitted: true });
    }
  };

  closeSignInModalLocal = () => {
    // console.log('voterVerifySecretCode this.props.closeVerifyModal:', this.props.closeVerifyModal);
    if (this.props.closeSignInModal) {
      this.props.closeSignInModal();
    }
  };

  closeVerifyModalLocal = () => {
    // console.log('voterVerifySecretCode this.props.closeVerifyModal:', this.props.closeVerifyModal);
    this.setState({ cancelingVerifyModal: true });
    if (this.props.closeVerifyModal) {
      this.props.closeVerifyModal();
    }
  };

  render () {
    renderLog('SettingsVerifySecretCode');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('SettingsVerifySecretCode render');
    const { classes } = this.props;
    const {
      condensed, errorMessageToDisplay, errorToDisplay,
      voterEmailAddress, voterMustRequestNewCode, voterPhoneNumber, voterSecretCodeRequestsLocked,
      voterVerifySecretCodeSubmitted,
    } = this.state;

    if (!voterEmailAddress && !voterPhoneNumber) {
      // We get a weird extra ghost version of SettingsVerifySecretCode, and this is how we block it.
      return null;
    }

    return (
      <Dialog
        id="codeVerificationDialog"
        open={this.props.show}
        onClose={this.closeVerifyModalLocal}
        className="u-z-index-9030"
        // Leaving classes.dialogRoot in place with a zIndex value of 9030
        // until 2023 to prevent problems with main.css caching,
        // since this is such a critical modal
        classes={{
          paper: clsx(classes.dialogPaper, {
            [classes.codeVerifyCordova]: isCordova(),
          }),
          root: classes.dialogRoot,
        }}
      >
        <ModalTitleArea condensed={condensed}>
          {isWebApp() && (
            <Button onClick={this.closeVerifyModalLocal} id="emailVerificationBackButton">
              {isIOS() ? <ArrowBackIos /> : <ArrowBack />}
              {' '}
              Back
            </Button>
          )}
        </ModalTitleArea>
        <ModalContent condensed={condensed} style={{ padding: `${isWebApp() ? 'undefined' : '37px 0 2px 0'}` }}>
          <TextContainer>
            <Title condensed={condensed}>Code Verification</Title>
            <Subtitle>A 6-digit code has been sent to</Subtitle>
            <PhoneSubtitle>{voterPhoneNumber || voterEmailAddress}</PhoneSubtitle>
            {(voterEmailAddress) && (
              <Subtitle>If you haven&apos;t received the code in 30 seconds, please check your spam folder and mark the email as &apos;Not Spam&apos;.</Subtitle>
            )}
            <InputContainer condensed={condensed}>
              <OutlinedInput
                classes={{ root: classes.inputBase, input: classes.input }}
                disabled={(this.state.numberOfTriesRemaining === 0) || voterVerifySecretCodeSubmitted}
                error={errorToDisplay}
                id="digit1"
                label={false}
                maxLength={1}
                notched={false}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChange={this.onDigit1Change}
                onPaste={this.onPaste}
                type="tel"
                value={this.state.digit1}
                autoFocus
              />
              <OutlinedInput
                classes={{ root: classes.inputBase, input: classes.input }}
                disabled={(this.state.numberOfTriesRemaining === 0) || voterVerifySecretCodeSubmitted}
                error={errorToDisplay}
                id="digit2"
                label={false}
                maxLength={1}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChange={this.onDigit2Change}
                onPaste={this.onPaste}
                onKeyDown={this.handleKeyDown2}
                type="tel"
                value={this.state.digit2}
              />
              <OutlinedInput
                classes={{ root: classes.inputBase, input: classes.input }}
                disabled={(this.state.numberOfTriesRemaining === 0) || voterVerifySecretCodeSubmitted}
                error={errorToDisplay}
                id="digit3"
                label={false}
                maxLength={1}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChange={this.onDigit3Change}
                onPaste={this.onPaste}
                onKeyDown={this.handleKeyDown3}
                type="tel"
                value={this.state.digit3}
              />
              <OutlinedInput
                classes={{ root: classes.inputBase, input: classes.input }}
                disabled={(this.state.numberOfTriesRemaining === 0) || voterVerifySecretCodeSubmitted}
                error={errorToDisplay}
                id="digit4"
                label={false}
                maxLength={1}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChange={this.onDigit4Change}
                onPaste={this.onPaste}
                onKeyDown={this.handleKeyDown4}
                type="tel"
                value={this.state.digit4}
              />
              <OutlinedInput
                classes={{ root: classes.inputBase, input: classes.input }}
                disabled={(this.state.numberOfTriesRemaining === 0) || voterVerifySecretCodeSubmitted}
                error={errorToDisplay}
                id="digit5"
                label={false}
                maxLength={1}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChange={this.onDigit5Change}
                onPaste={this.onPaste}
                onKeyDown={this.handleKeyDown5}
                type="tel"
                value={this.state.digit5}
              />
              <OutlinedInput
                classes={{ root: classes.inputBase, input: classes.input }}
                disabled={(this.state.numberOfTriesRemaining === 0) || voterVerifySecretCodeSubmitted}
                error={errorToDisplay}
                id="digit6"
                label={false}
                maxLength={1}
                onChange={this.onDigit6Change}
                onFocus={this.handleFocus}
                onBlur={this.handleDigit6Blur}
                onPaste={this.onPaste}
                onKeyDown={this.handleKeyDown6}
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
              classes={{ root: classes.verifyButton }}
              id="emailVerifyButton"
              color="primary"
              disabled={this.state.digit1 === '' || this.state.digit2 === '' || this.state.digit3 === '' || this.state.digit4 === '' || this.state.digit5 === '' || this.state.digit6 === '' || voterMustRequestNewCode || voterSecretCodeRequestsLocked || voterVerifySecretCodeSubmitted}
              fullWidth
              onClick={this.voterVerifySecretCode}
              variant="contained"
            >
              {voterVerifySecretCodeSubmitted ? 'Verifying...' : 'Verify'}
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
              id="tryADifferentEmailOrNumber"
              classes={{ root: classes.button }}
              color="primary"
              disabled={voterVerifySecretCodeSubmitted}
              onClick={this.closeVerifyModalLocal}
              variant={voterMustRequestNewCode ? 'contained' : 'outlined'}
            >
              {voterPhoneNumber ? 'Try a different number' : 'Try a different email'}
            </Button>
          </ButtonsContainer>
        </ModalContent>
      </Dialog>
    );
  }
}
SettingsVerifySecretCode.propTypes = {
  classes: PropTypes.object,
  show: PropTypes.bool,
  closeSignInModal: PropTypes.func,
  closeVerifyModal: PropTypes.func,
  voterEmailAddress: PropTypes.string,
  voterPhoneNumber: PropTypes.string,
};

const styles = (theme) => ({
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
  dialogRoot: {
    zIndex: '9030 !important',
  },
  codeVerifyCordova: {
    top: '9%',
    bottom: 'unset',
    height: 'unset',
    minHeight: 'unset',
    margin: '5px',
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

const ModalTitleArea = styled('div', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  width: 100%;
  padding: ${condensed ? '8px' : '12px'};
  box-shadow: 0 20px 40px -25px #999;
  z-index: 999;
  display: flex;
  justify-content: flex-start;
  position: absolute;
  top: 0;
`));

const ModalContent = styled('div', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  display: flex;
  flex-direction: column;
  align-items: ${condensed ? 'flex-start' : 'space-evenly'};
  height: ${isWebApp() ?  '100%' : 'unset'};
  width: 80%;
  max-width: 400px;
  margin: 0 auto;
  padding: ${condensed ? '66px 0 0 0' : '86px 0 72px 0'};
`));

const TextContainer = styled('div')`
`;

const ButtonsContainer = styled('div', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  margin-top: ${condensed ? '16px' : 'auto'};
`));

const Title = styled('h3', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  font-weight: bold;
  font-size: ${() => (isIPhone4in() ? '26px' : '30px')};
  padding: 0 10px;
  margin-bottom: ${condensed ? '16px' : '36px'};
  color: black;
  text-align: center;
  @media(min-width: 569px) {
    font-size: 36px;
  }
`));

const Subtitle = styled('h4')`
  color: #424242;
  text-align: center;
`;

const PhoneSubtitle = styled('h4')`
  color: black;
  font-weight: bold;
  text-align: center;
`;

const InputContainer = styled('div', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  display: flex;
  justify-content: space-between;
  margin: auto;
  width: 100%;
  margin-top: ${condensed ? '16px' : '32px'};
`));

const ErrorMessage = styled('div')`
  color: red;
  margin: 12px 0;
  text-align: center;
  font-size: 14px;
`;

export default withTheme(withStyles(styles)(SettingsVerifySecretCode));

