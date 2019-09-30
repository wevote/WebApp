import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import { Dialog, IconButton, DialogContent, Button, InputBase, OutlinedInput } from '@material-ui/core';
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

    };
  }

  componentDidMount () {

  }

  shouldComponentUpdate () {

  }

  render () {
    const { classes, voterPhoneNumber } = this.props;

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
              <OutlinedInput classes={{ root: classes.inputBase, input: classes.input }} />
              <OutlinedInput classes={{ root: classes.inputBase, input: classes.input }} />
              <OutlinedInput classes={{ root: classes.inputBase, input: classes.input }} />
              <OutlinedInput classes={{ root: classes.inputBase, input: classes.input }} />
              <OutlinedInput classes={{ root: classes.inputBase, input: classes.input }} />
              <OutlinedInput classes={{ root: classes.inputBase, input: classes.input }} />
            </InputContainer>
          </TextContainer>
          <ButtonsContainer>
            <Button classes={{ root: classes.button }} color="primary">RESEND SMS</Button>
            <Button classes={{ root: classes.button }} color="primary">CHANGE PHONE NUMBER</Button>
            <Button classes={{ root: classes.button }} color="primary">VERIFY</Button>
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

