import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import SettingsAccount from '../Settings/SettingsAccount';
import VoterStore from '../../stores/VoterStore';

class SignInModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // When this modal is opened, set a cookie with the current path (done in Application.js)
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    if (secretCodeVerified) {
      this.props.toggleFunction();
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

    // This modal is shown when the voter wants to sign in.
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(); }}
      >
        <DialogTitle>
          <Typography className="text-center">
            <span className="h2">Sign In</span>
          </Typography>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.props.toggleFunction(); }}
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
                    toggleSignInModal={this.props.toggleFunction}
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

const styles = theme => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
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
