import { MailOutline, Message } from '@mui/icons-material';
import { Dialog, DialogContent } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import VoterActions from '../../actions/VoterActions';
import SplitIconButton from '../../common/components/Widgets/SplitIconButton';
import { isIPhone3p5in, isIPhone4in, isIPhone4p7in } from '../../common/utils/cordovaUtils';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import VoterEmailAddressEntry from './VoterEmailAddressEntry';
import VoterPhoneVerificationEntry from './VoterPhoneVerificationEntry';


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
    // console.log('VoterPhoneEmailCordovaEntryModal closeSignInModalLocal');
    this.setState({
      showDialog: false,
    });
    // This is a hack that handles a dialog calling a dialog, there probably is a better way, but...
    // It is also a hack that prevents "Cannot dispatch in the middle of a dispatch" and "React state update on an unmounted component"
    const { $ } = window;
    $("div[class*='MuiBackdrop-root']").remove();  // Shouldn't be needed, but this clears the background outside the dialog
    VoterActions.voterRetrieve();  // Shouldn't be necessary, but encourages a refresh of the header, to update the Avatar.  Just for Cordova.
  }

  render () {
    renderLog('VoterPhoneEmailCordovaEntryModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { doNotRender } = this.props;
    if (doNotRender) {
      return null;
    }
    const { showDialog } = this.state;
    const { classes, isPhone } = this.props;
    const isSmallApple = isIPhone3p5in() || isIPhone4in() || isIPhone4p7in();

    return (
      <>
        <div id="signInPhoneEmailModal" className="u-stack--md">
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
  doNotRender: PropTypes.bool,
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
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
});

export default withTheme(withStyles(styles)(VoterPhoneEmailCordovaEntryModal));
