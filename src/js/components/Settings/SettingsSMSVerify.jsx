import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import {
  Dialog,
  // IconButton, DialogContent,
  Button,
  // InputBase,
  OutlinedInput,
} from '@material-ui/core';
import { hasIPhoneNotch, isIOS } from '../../utils/cordovaUtils';

class SettingsSMSVerify extends Component {
  static propTypes = {
    classes: PropTypes.object,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func,
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
    };
    this.onDigit1Change = this.onDigit1Change.bind(this);
    this.onDigit2Change = this.onDigit2Change.bind(this);
    this.onDigit3Change = this.onDigit3Change.bind(this);
    this.onDigit4Change = this.onDigit4Change.bind(this);
    this.onDigit5Change = this.onDigit5Change.bind(this);
    this.onDigit6Change = this.onDigit6Change.bind(this);
    this.onDigit1KeyDown = this.onDigit1KeyDown.bind(this);
    this.onDigit2KeyDown = this.onDigit2KeyDown.bind(this);
    this.onDigit3KeyDown = this.onDigit3KeyDown.bind(this);
    this.onDigit4KeyDown = this.onDigit4KeyDown.bind(this);
    this.onDigit5KeyDown = this.onDigit5KeyDown.bind(this);
    this.onDigit6KeyDown = this.onDigit6KeyDown.bind(this);
  }

  componentDidMount () {
    const { voterPhoneNumber } = this.props;
    const newVoterPhoneNumber = voterPhoneNumber.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

    this.setState({ voterPhoneNumber: newVoterPhoneNumber });
  }

  shouldComponentUpdate (nextState) {
    if (this.state.voterPhoneNumber !== nextState.voterPhoneNumber) {
      return true;
    }
    return false;
  }

  onDigit1Change (e) {
    if (e.target.value !== '') {
      e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
    }
    this.setState({ digit1: e.target.value.charAt(e.target.value.length - 1) });
    e.target.value = e.target.value.charAt(e.target.value.length - 1);
  }

  onDigit1KeyDown (e) {
    console.log(e.key, e.keyCode);
  }

  onDigit2Change (e) {
    if (e.target.value !== '') {
      e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
    }
    this.setState({ digit2: e.target.value.charAt(e.target.value.length - 1) });
    e.target.value = e.target.value.charAt(e.target.value.length - 1);
  }

  onDigit2KeyDown (e) {
    if (e.keyCode === 8 && this.state.digit2 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.focus();
    } else {
      console.log('Digit6 is not empty');
    }
  }

  onDigit3Change (e) {
    if (e.target.value !== '') {
      e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
    }
    this.setState({ digit3: e.target.value.charAt(e.target.value.length - 1) });
    e.target.value = e.target.value.charAt(e.target.value.length - 1);
  }

  onDigit3KeyDown (e) {
    if (e.keyCode === 8 && this.state.digit3 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.focus();
    } else {
      console.log('Digit6 is not empty');
    }
  }

  onDigit4Change (e) {
    if (e.target.value !== '') {
      e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
    }
    this.setState({ digit4: e.target.value.charAt(e.target.value.length - 1) });
    e.target.value = e.target.value.charAt(e.target.value.length - 1);
  }

  onDigit4KeyDown (e) {
    if (e.keyCode === 8 && this.state.digit4 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.focus();
    } else {
      console.log('Digit6 is not empty');
    }
  }

  onDigit5Change (e) {
    if (e.target.value !== '') {
      e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling.focus();
    }
    this.setState({ digit5: e.target.value.charAt(e.target.value.length - 1) });
    e.target.value = e.target.value.charAt(e.target.value.length - 1);
  }

  onDigit5KeyDown (e) {
    if (e.keyCode === 8 && this.state.digit5 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.focus();
    } else {
      console.log('Digit6 is not empty');
    }
  }

  onDigit6Change (e) {
    this.setState({ digit6: e.target.value.charAt(e.target.value.length - 1) });
    e.target.value = e.target.value.charAt(e.target.value.length - 1);
  }

  onDigit6KeyDown (e) {
    if (e.keyCode === 8 && this.state.digit6 === '') {
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.value = '';
      e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.focus();
    } else {
      console.log('Digit6 is not empty');
    }
  }

  handleFocus (e) {
    e.target.select();
  }

  render () {
    const { classes } = this.props;
    const { voterPhoneNumber } = this.state;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(); }}
      >
        <ModalTitleArea>
          <Button onClick={this.props.toggleFunction}>
            {isIOS() ? <ArrowBackIos /> : <ArrowBack />}
            {' '}
            Back
          </Button>
        </ModalTitleArea>
        <ModalContent>
          <TextContainer>
            <Title>SMS Verification</Title>
            <Subtitle>A 6-digit code has been sent to</Subtitle>
            <PhoneSubtitle>{voterPhoneNumber}</PhoneSubtitle>
            <InputContainer>
              <OutlinedInput
                maxLength={1}
                onKeyDown={this.onDigit1KeyDown}
                onChange={this.onDigit1Change}
                classes={{ root: classes.inputBase, input: classes.input }}
                onFocus={this.handleFocus}
              />
              <OutlinedInput
                maxLength={1}
                onKeyDown={this.onDigit2KeyDown}
                onChange={this.onDigit2Change}
                classes={{ root: classes.inputBase, input: classes.input }}
                onFocus={this.handleFocus}
              />
              <OutlinedInput
                maxLength={1}
                onKeyDown={this.onDigit3KeyDown}
                onChange={this.onDigit3Change}
                classes={{ root: classes.inputBase, input: classes.input }}
                onFocus={this.handleFocus}
              />
              <OutlinedInput
                maxLength={1}
                onKeyDown={this.onDigit4KeyDown}
                onChange={this.onDigit4Change}
                classes={{ root: classes.inputBase, input: classes.input }}
                onFocus={this.handleFocus}
              />
              <OutlinedInput
                maxLength={1}
                onKeyDown={this.onDigit5KeyDown}
                onChange={this.onDigit5Change}
                classes={{ root: classes.inputBase, input: classes.input }}
                onFocus={this.handleFocus}
              />
              <OutlinedInput
                maxLength={1}
                onKeyDown={this.onDigit6KeyDown}
                onChange={this.onDigit6Change}
                classes={{ root: classes.inputBase, input: classes.input }}
                onFocus={this.handleFocus}
              />
            </InputContainer>
          </TextContainer>
          <ButtonsContainer>
            <Button classes={{ root: classes.button }} color="primary">VERIFY</Button>
            <Button classes={{ root: classes.button }} color="primary">RESEND SMS</Button>
            <Button classes={{ root: classes.button }} color="primary">CHANGE PHONE NUMBER</Button>
          </ButtonsContainer>
        </ModalContent>
      </Dialog>
    );
  }
}

const styles = () => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 769px)': {
      maxWidth: '720px',
      width: '85%',
      minHeight: '95%',
      maxHeight: '95%',
      height: '95%',
      margin: '0 auto',
    },
    '@media (max-width: 768px)': {
      minWidth: '100%',
      maxWidth: '100%',
      width: '100%',
      minHeight: '100%',
      maxHeight: '100%',
      height: '100%',
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
});

const ModalTitleArea = styled.div`
  width: 100%;
  padding: 12px;
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
  align-content: space-evenly;
  justify-content: center;
  height: 100%;
  width: 80%;
  max-width: 400px;
  margin: 0 auto;
  padding: 86px 0 72px 0;
`;

const TextContainer = styled.div`
  margin-bottom: auto;
`;

const ButtonsContainer = styled.div`
  margin-top: auto;
`;

const Title = styled.h3`
  font-weight: bold;
  font-size: 30px;
  padding: 0 10px;
  margin-bottom: 36px;
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
  // flex-wrap: wrap;
  justify-content: space-between;
  margin: auto;
  width: 100%;
  margin-top: 32px;
`;

export default withStyles(styles)(SettingsSMSVerify);

