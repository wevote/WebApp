import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogContent, IconButton } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import {
  ContinueButtonType1Wrapper,
  ExplanationTextLighterType1,
  ExplanationTextType1,
  ModalTitleAreaType1,
  ModalTitleType1,
} from '../Style/ModalType1Styles';

class AskFriendsModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.setState({
    });
  }

  componentWillUnmount () {
  }

  closeThisModal = () => {
    this.props.toggleFunction();
  }

  submitAskFriends = () => {
    // this.props.toggleFunction(pathname);
  }

  render () {
    renderLog('AskFriendsModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { location: { pathname } } = window;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(pathname); }}
      >
        <ModalTitleAreaType1>
          <div>
            <ModalTitleType1>
              &nbsp;
            </ModalTitleType1>
          </div>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={this.closeThisModal}
            id="closeAskFriendsModal"
            size="large"
          >
            <Close />
          </IconButton>
        </ModalTitleAreaType1>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <div className="full-width">
            <ExplanationTextType1>
              Coming soon! We are working on a way for you to ask your friends.
            </ExplanationTextType1>
            <ExplanationTextLighterType1>
              For now you can add We Vote friends by going to &apos;Friends&apos;.
            </ExplanationTextLighterType1>
            <AskFriendsModalWrapper>
              &nbsp;
            </AskFriendsModalWrapper>
            <ContinueButtonType1Wrapper>
              <Button
                classes={{ root: classes.continueButtonRoot }}
                color="primary"
                disabled
                id="askFriendsModalNext"
                onClick={this.submitAskFriends}
                variant="contained"
              >
                Continue
              </Button>
            </ContinueButtonType1Wrapper>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
AskFriendsModal.propTypes = {
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
    minHeight: '100%',
    maxHeight: '100%',
    height: '100%',
    margin: '0 0 64px 0',
  },
  dialogContent: {
    margin: '0 auto',
    paddingBottom: '24px',
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  continueButtonRoot: {
    width: '100%',
  },
});

const AskFriendsModalWrapper = styled('div')`
`;

export default withTheme(withStyles(styles)(AskFriendsModal));
