import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent } from '@material-ui/core';
import { MailOutline, Message } from '@material-ui/icons';
import clsx from 'clsx';
import { withStyles, withTheme } from '@material-ui/core/styles';
import SplitIconButton from '../Widgets/SplitIconButton';
import VoterEmailAddressEntry from './VoterEmailAddressEntry';
import VoterPhoneVerificationEntry from './VoterPhoneVerificationEntry';
import { isCordova, restoreStylesAfterCordovaKeyboard, isIPhone3p5in, isIPhone4in, isIPhone4p7in } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';


// Work around for dialog placement in Cordova when virtual keyboard appears
class VoterPhoneEmailCordovaEntryModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showDialog: false,
    };
  }

  setDialogVisible = () => {
    console.log('VoterPhoneEmailCordovaEntryModal setDialogVisible');
    this.setState({
      showDialog: true,
    });
    this.props.hideDialogForCordova();
  }

  closeSignInModalLocal = () => {
    console.log('VoterPhoneEmailCordovaEntryModal closeSignInModalLocal showDialog false ======================================');
    // Because there are multiple listeners on the voterStore, some dispatching will occur for the underlying ballot page,
    // which totally messes us up here, and leaves this modal on the screen after it should've been dismissed, especially on the iPhone 5.
    // So as a workaround we close this modal when we detect that they have signed in successfully with the email,
    // which requires this further hack, Which is sensitive to checking whether the modal actually still exists.
    restoreStylesAfterCordovaKeyboard('VoterPhoneEmailCordovaEntryModal');
    this.setState({
      showDialog: false,
    });
  }

  render () {
    renderLog('VoterPhoneEmailCordovaEntryModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { showDialog } = this.state;
    const { classes, isPhone } = this.props;
    const isSmallApple = isIPhone3p5in() || isIPhone4in() || isIPhone4p7in();

    return (
      <>
        <div className="u-stack--md">
          <SplitIconButton
            backgroundColor="#2E3C5D"
            buttonText={isPhone ? 'Sign in with a text' : 'Sign in with an Email'}
            externalUniqueId={isPhone ? 'smsSignIn' : 'emailSignIn'}
            icon={isPhone ? <Message /> : <MailOutline />}
            id={isPhone ? 'smsSignIn' : 'emailSignIn'}
            onClick={this.setDialogVisible}
            separatorColor="rgba(250, 250, 250, .6)"
            title={isPhone ? 'Sign in by SMS' : 'Sign in by email'}
          />
        </div>
        <Dialog
          open={showDialog}
          id="textOrEmailEntryDialog"
          classes={{
            paper: clsx(classes.dialogPaper, {
              [classes.phoneInputCordovaSmallApples]: isSmallApple && isPhone,
              [classes.emailInputCordovaSmallApples]: isSmallApple && !isPhone,
              [classes.phoneInputCordovaLargerApples]: !isSmallApple && isPhone,
              [classes.emailInputCordovaLargerApples]: !isSmallApple && !isPhone,
            }),
            root: classes.dialogRoot,
          }}
        >
          <DialogContent
            id="textOrEmailEntryContent"
            style={{ paddingTop: `${isCordova() ? 'unset' : 'undefined'}`, bottom: `${isCordova() ? 'unset' : 'undefined'}` }}
          >
            {isPhone ? (
              <VoterPhoneVerificationEntry
                cancelShouldCloseModal
                closeSignInModal={this.closeSignInModalLocal}
                hideEverythingButSignInWithPhoneForm
                lockOpenPhoneVerificationButton
              />
            ) : (
              <VoterEmailAddressEntry
                cancelShouldCloseModal
                closeSignInModal={this.closeSignInModalLocal}
                hideEverythingButSignInWithEmailForm
                lockOpenEmailVerificationButton
              />
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }
}
VoterPhoneEmailCordovaEntryModal.propTypes = {
  classes: PropTypes.object,
  isPhone: PropTypes.bool,
  hideDialogForCordova: PropTypes.func,
};

const styles = (theme) => ({
  dialogPaper: {
    marginTop: 48,
    [theme.breakpoints.down('xs')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
  },
  phoneInputCordovaSmallApples: {
    margin: '32px 32px 0 32px',
    height: 'unset',
    minHeight: 'unset',
  },
  emailInputCordovaSmallApples: {
    margin: '32px 32px 0 32px',
    height: 'unset',
    minHeight: 'unset',
    top: '-25%',
  },
  phoneInputCordovaLargerApples: {
    height: 'unset',
    minHeight: 'unset',
    top: '-5%',
  },
  emailInputCordovaLargerApples: {
    height: 'unset',
    minHeight: 'unset',
    top: '-5%',
  },
  dialogContent: {
    [theme.breakpoints.down('md')]: {
      padding: '0 8px 8px',
    },
  },
  closeButton: {
    position: 'absolute',
    right: `${theme.spacing(1)}px`,
    top: `${theme.spacing(1)}px`,
  },
});

export default withTheme(withStyles(styles)(VoterPhoneEmailCordovaEntryModal));
