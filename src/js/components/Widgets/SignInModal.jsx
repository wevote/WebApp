import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/esm/Dialog';
import DialogContent from '@material-ui/core/esm/DialogContent';
import DialogTitle from '@material-ui/core/esm/DialogTitle';
import IconButton from '@material-ui/core/esm/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/esm/Typography';
import { withStyles, withTheme } from '@material-ui/core/esm/styles';
import { renderLog } from '../../utils/logging';
import { isCordova, isWebApp } from '../../utils/cordovaUtils';
import SettingsAccount from '../Settings/SettingsAccount';
import VoterStore from '../../stores/VoterStore';

class SignInModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    show: PropTypes.bool,
    closeFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    if (secretCodeVerified) {
      this.props.closeFunction();
    } else {
      const voter = VoterStore.getVoter();
      this.setState({
        voter,
        voterIsSignedIn: voter.is_signed_in,
      });
    }
  }

  render () {
    renderLog('SignInModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { voter, voterIsSignedIn } = this.state;
    if (!voter) {
      // console.log('SignInModal render voter NOT found');
      return <div className="undefined-props" />;
    }
    // console.log('SignInModal render voter found');

    if (voter && voterIsSignedIn && isCordova()) {
      return false;
    }

    // This modal is shown when the voter wants to sign in.
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper, root: classes.dialogRoot }}
        open={this.props.show}
        onClose={() => { this.props.closeFunction(); }}
      >
        <DialogTitle>
          <Typography className="text-center">
            <span className="h2">Sign In</span>
          </Typography>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.props.closeFunction(); }}
            id="profileCloseSignInModal"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <section>
            <div className="text-center">
              {voter && voterIsSignedIn ? (
                <div>
                  <div className="u-f2">You are signed in.</div>
                </div>
              ) : (
                <div>
                  <SettingsAccount
                    closeSignInModal={this.props.closeFunction}
                    inModal
                  />
                </div>
              )}
            </div>
          </section>
        </DialogContent>
      </Dialog>
    );
  }
}

/*
This modal dialog floats up in the DOM, to just below the body, so no styles from the app are inherited.
In Cordova, when you click into a text entry field, the phone OS reduces the size of the JavaScript DOM by
the size of the keyboard, and if the DOM is overconstrained, i.e  has hard coded vertical sizes that can't
be honored, Cordova tries to do the best it can, but sometimes it crashes and locks up the instance.
For Cordova eliminate as many fixed vertical dimensions as needed to avoid overconstraint.
*/
const styles = theme => ({
  dialogRoot: isCordova() ? {
    height: '100%',
    position: 'absolute !important',
    top: '-15%',
    left: '0% !important',
    right: 'unset !important',
    bottom: 'unset !important',
    width: '100%',
  } : {
    height: '100%',
    position: 'absolute !important',
    top: '-15%',
    left: '0% !important',
    right: 'unset !important',
    bottom: 'unset !important',
    width: '100%',
  },
  dialogPaper: isWebApp() ? {
    [theme.breakpoints.down('sm')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      // minHeight: '90%',
      maxHeight: '90%',
      height: 'unset',
      margin: '0 auto',
    },
  } : {
    margin: '0 !important',
    width: '95%',
    height: 'unset',
    maxHeight: '90%',
    offsetHeight: 'unset !important',
    top: '50%',
    left: '50%',
    right: 'unset !important',
    bottom: 'unset !important',
    position: 'absolute',
    transform: 'translate(-50%, -25%)',
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


export default withTheme(withStyles(styles)(SignInModal));
