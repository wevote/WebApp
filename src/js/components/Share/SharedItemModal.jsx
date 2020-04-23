import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Dialog from '@material-ui/core/Dialog';
import { renderLog } from '../../utils/logging';
import { hasIPhoneNotch, isIPhone4in, isIOS, isCordova, isWebApp } from '../../utils/cordovaUtils';
import VoterStore from '../../stores/VoterStore';

class SharedItemModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    show: PropTypes.bool,
    closeSharedItemModal: PropTypes.func,
    sharedItemCode: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      condensed: false,
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
  }

  componentDidMount () {
    // console.log('SharedItemModal componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { sharedItemCode } = this.props;
    // const newVoterPhoneNumber = voterPhoneNumber.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    // console.log('sharedItemCode:', sharedItemCode);
    this.setState({
      sharedItemCode,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.incorrectSecretCodeEntered !== nextState.incorrectSecretCodeEntered) return true;
    if (this.state.numberOfTriesRemaining !== nextState.numberOfTriesRemaining) return true;
    if (this.state.secretCodeVerified !== nextState.secretCodeVerified) return true;
    if (this.state.sharedItemCode !== nextState.sharedItemCode) return true;
    if (this.state.voterMustRequestNewCode !== nextState.voterMustRequestNewCode) return true;
    if (this.state.voterSecretCodeRequestsLocked !== nextState.voterSecretCodeRequestsLocked) return true;
    if (this.state.condensed !== nextState.condensed) return true;
    // console.log('shouldComponentUpdate return false');
    return false;
  }

  componentWillUnmount () {
    // console.log('SharedItemModal componentWillUnmount');
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    // const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    // const { incorrectSecretCodeEntered, numberOfTriesRemaining, secretCodeVerified, voterMustRequestNewCode, voterSecretCodeRequestsLocked } = secretCodeVerificationStatus;
    // // console.log('onVoterStoreChange secretCodeVerified: ' + secretCodeVerified);
    // if (secretCodeVerified) {
    //   // console.log('onVoterStoreChange secretCodeVerified: yes');
    //   this.closeSharedItemModalLocal();
    // } else {
    //   let errorMessageToDisplay = '';
    //   let errorToDisplay = false;
    //   if (voterSecretCodeRequestsLocked) {
    //     errorToDisplay = true;
    //     const { sharedItemCode, voterPhoneNumber } = this.state;
    //     if (sharedItemCode) {
    //       errorMessageToDisplay = `Please contact We Vote support regarding ${sharedItemCode}.`;
    //     } else if (voterPhoneNumber) {
    //       errorMessageToDisplay = `Please contact We Vote support regarding ${voterPhoneNumber}.`;
    //     } else {
    //       errorMessageToDisplay = 'Please contact We Vote support. Your account is locked.';
    //     }
    //   } else if (voterMustRequestNewCode) {
    //     errorToDisplay = true;
    //     errorMessageToDisplay = 'You\'ve reached the maximum number of tries.';
    //   } else if (incorrectSecretCodeEntered || numberOfTriesRemaining <= 4) {
    //     errorToDisplay = true;
    //     errorMessageToDisplay = 'Incorrect code entered.';
    //   }
    //   this.setState({
    //     errorMessageToDisplay,
    //     errorToDisplay,
    //     incorrectSecretCodeEntered,
    //     numberOfTriesRemaining,
    //     secretCodeVerified,
    //     voterMustRequestNewCode,
    //     voterSecretCodeRequestsLocked,
    //     voterVerifySecretCodeSubmitted: false,
    //   });
    // }
  }

  closeSharedItemModalLocal = () => {
    // console.log('voterVerifySecretCode this.props.closeSharedItemModal:', this.props.closeSharedItemModal);
    if (this.props.closeSharedItemModal) {
      this.props.closeSharedItemModal();
    }
  };

  render () {
    renderLog('SharedItemModal');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('SharedItemModal render');
    const { classes } = this.props;
    const {
      condensed, errorMessageToDisplay, errorToDisplay,
      digit1, digit2, digit3, digit4, digit5, digit6,
      sharedItemCode, voterMustRequestNewCode, voterPhoneNumber, voterSecretCodeRequestsLocked,
      voterVerifySecretCodeSubmitted,
    } = this.state;

    if (!sharedItemCode) {
      // We get a weird extra ghost version of SharedItemModal, and this is how we block it.
      return null;
    }

    return (
      <Dialog
        id="codeVerificationDialog"
        open={this.props.show}
        onClose={this.closeSharedItemModalLocal}
        classes={{
          paper: clsx(classes.dialogPaper, {
            [classes.codeVerifyCordova]: isCordova(),
          }),
          root: classes.dialogRoot,
        }}
      >
        <ModalTitleArea condensed={condensed}>
        </ModalTitleArea>
        <ModalContent condensed={condensed} style={{ padding: `${isWebApp() ? 'undefined' : '37px 0 2px 0'}` }}>
          <TextContainer condensed={condensed}>
            <Title condensed={condensed}>Code Verification</Title>
            <Subtitle>A 6-digit code has been sent to</Subtitle>
            <PhoneSubtitle>{sharedItemCode}</PhoneSubtitle>
            <InputContainer condensed={condensed}>
            </InputContainer>
            {errorToDisplay && (
              <ErrorMessage>{errorMessageToDisplay}</ErrorMessage>
            )}
          </TextContainer>
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
  dialogRoot: {
    zIndex: '9010 !important',
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
  height: isWebApp() ? 100% : 'unset';
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

export default withTheme(withStyles(styles)(SharedItemModal));

