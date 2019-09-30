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
          <Title>SMS Verification</Title>
          <Subtitle>A 6-digit code has been sent to</Subtitle>
          <PhoneSubtitle>{voterPhoneNumber}</PhoneSubtitle>
          <InputContainer>
            <div
              style={{
                overflow: 'hidden',
                width: '50px',
                minWidth: '50px',
                // minHeight: '42px',
                // height: '42px',
                maxWidth: '132px !important',
                // maxHeight: '42px !important',
                marginRight: 'auto',
                textAlign: 'left',
              }}
            >
              <OutlinedInput classes={{ root: classes.input }} />
            </div>
            <div
              style={{
                overflow: 'hidden',
                width: '50px',
                minWidth: '50px',
                // minHeight: '42px',
                // height: '42px',
                maxWidth: '132px !important',
                // maxHeight: '42px !important',
                marginRight: 'auto',
                textAlign: 'left',
              }}
            >
              <OutlinedInput classes={{ root: classes.input }} />
            </div>
            <div
              style={{
                overflow: 'hidden',
                width: '50px',
                minWidth: '50px',
                // minHeight: '42px',
                // height: '42px',
                maxWidth: '132px !important',
                // maxHeight: '42px !important',
                marginRight: 'auto',
                textAlign: 'left',
              }}
            >
              <OutlinedInput classes={{ root: classes.input }} />
            </div>
            <div
              style={{
                overflow: 'hidden',
                width: '50px',
                minWidth: '50px',
                // minHeight: '42px',
                // height: '42px',
                maxWidth: '132px !important',
                // maxHeight: '42px !important',
                marginRight: 'auto',
                textAlign: 'left',
              }}
            >
              <OutlinedInput classes={{ root: classes.input }} />
            </div>
            <div
              style={{
                overflow: 'hidden',
                width: '50px',
                minWidth: '50px',
                // minHeight: '42px',
                // height: '42px',
                maxWidth: '132px !important',
                // maxHeight: '42px !important',
                marginRight: 'auto',
                textAlign: 'left',
              }}
            >
              <OutlinedInput classes={{ root: classes.input }} />
            </div>
            <div
              style={{
                overflow: 'hidden',
                width: '50px',
                minWidth: '50px',
                // minHeight: '42px',
                // height: '42px',
                maxWidth: '132px !important',
                // maxHeight: '42px !important',
                marginRight: 'auto',
                textAlign: 'left',
              }}
            >
              <OutlinedInput classes={{ root: classes.input }} />
            </div>
          </InputContainer>
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
  input: {
    // maxHeight: 50,
    // margin: '0 8px',
    width: 'auto',
    height: '100%',
  },
});

const ModalTitleArea = styled.div`
  width: 100%;
  padding: 12px;
  box-shadow: 0 20px 40px -25px #999;
  z-index: 999;
  display: flex;
  justify-content: flex-start;
  @media (min-width: 769px) {
    text-align: center;
    border-bottom: 2px solid #f7f7f7;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-evenly;
  justify-content: center;
  height: 100%;
  max-width: 769px;
  margin: 0 auto;
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
  color: #ddd;
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
  flex: auto;
  max-height: 60px;
`;

export default withStyles(styles)(SettingsSMSVerify);

