import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import {
  isCordova,
  isAndroidSizeSM, isAndroidSizeMD, isAndroidSizeLG, isAndroidSizeXL,
  isIPhone3p5in, isIPhone4in, isIPhone4p7in, isIPhone5p5in, isIPhone5p8in, isIPhone6p1in, isIPhone6p5in,
  isWebAppHeight0to568, isWebAppHeight569to667, isWebAppHeight668to736, isWebAppHeight737to896,
  isWebApp,
} from '../../utils/cordovaUtils';
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
      focusedOnSingleInputToggle: false,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
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

  focusedOnSingleInputToggle = (focusedInputName) => {
    const { focusedOnSingleInputToggle } = this.state;
    // console.log('focusedInputName:', focusedInputName);
    const incomingInputName = focusedInputName === 'email' ? 'email' : 'phone';
    this.setState({
      focusedInputName: incomingInputName,
      focusedOnSingleInputToggle: !focusedOnSingleInputToggle,
    });
  };

  closeFunction = () => {
    if (this.props.closeFunction) {
      this.props.closeFunction();
    }
  };

  onKeyDown = (event) => {
    event.preventDefault();
    // const ENTER_KEY_CODE = 13;
    // const enterAndReturnKeyCodes = [ENTER_KEY_CODE];
    // if (enterAndReturnKeyCodes.includes(event.keyCode)) {
    //   this.closeFunction();
    // }
  };

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('SignInModal caught error: ', `${error} with info: `, info);
  }

  render () {
    renderLog('SignInModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;

    const { focusedInputName, focusedOnSingleInputToggle, voter, voterIsSignedIn } = this.state;
    if (!voter) {
      // console.log('SignInModal render voter NOT found');
      return <div className="undefined-props" />;
    }
    // console.log('SignInModal render voter found');

    if (voter && voterIsSignedIn && isCordova()) {
      return false;
    }

    // This modal is shown when the voter wants to sign in.
    // console.log('window.screen.height:', window.screen.height);
    return (
      <Dialog
        classes={{
          paper: clsx(classes.dialogPaper, {
            [classes.focusedOnSingleInput]: focusedOnSingleInputToggle,
            // iPhone 5 / SE
            [classes.emailInputWebApp0to568]: isWebAppHeight0to568() && focusedOnSingleInputToggle && focusedInputName === 'email',
            [classes.phoneInputWebApp0to568]: isWebAppHeight0to568() && focusedOnSingleInputToggle && focusedInputName === 'phone',
            // iPhone6/7/8, iPhone8Plus
            [classes.emailInputWebApp569to736]: (isWebAppHeight569to667() || isWebAppHeight668to736()) && focusedOnSingleInputToggle && focusedInputName === 'email',
            [classes.phoneInputWebApp569to736]: (isWebAppHeight569to667() || isWebAppHeight668to736()) && focusedOnSingleInputToggle && focusedInputName === 'phone',
            // iPhoneX/iPhone11 Pro Max
            [classes.emailInputWebApp737to896]: isWebAppHeight737to896() && focusedOnSingleInputToggle && focusedInputName === 'email',
            [classes.phoneInputWebApp737to896]: isWebAppHeight737to896() && focusedOnSingleInputToggle && focusedInputName === 'phone',
            // 2020-01-20 These are to be configured and are placeholders
            [classes.emailInputCordovaSmall]: (isIPhone3p5in() || isAndroidSizeSM()) && focusedOnSingleInputToggle && focusedInputName === 'email',
            [classes.phoneInputCordovaSmall]: (isIPhone3p5in() || isAndroidSizeSM()) && focusedOnSingleInputToggle && focusedInputName === 'phone',
            [classes.emailInputCordovaMedium]: (isIPhone4in() || isIPhone4p7in() || isIPhone5p5in() || isIPhone5p8in() || isIPhone6p1in() || isAndroidSizeMD()) && focusedOnSingleInputToggle && focusedInputName === 'email',
            [classes.phoneInputCordovaMedium]: (isIPhone4in() || isIPhone4p7in() || isIPhone5p5in() || isIPhone5p8in() || isIPhone6p1in() || isAndroidSizeMD()) && focusedOnSingleInputToggle && focusedInputName === 'phone',
            [classes.emailInputCordovaLarge]: (isIPhone6p5in() || isAndroidSizeLG() || isAndroidSizeXL()) && focusedOnSingleInputToggle && focusedInputName === 'email',
            [classes.phoneInputCordovaLarge]: (isIPhone6p5in() || isAndroidSizeLG() || isAndroidSizeXL()) && focusedOnSingleInputToggle && focusedInputName === 'phone',
          }),
          root: classes.dialogRoot,
        }}
        open={this.props.show}
        onClose={() => { this.closeFunction(); }}
      >
        <DialogTitle>
          <Typography className="text-center">
            <span className="h2">Sign In</span>
          </Typography>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.closeFunction(); }}
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
                    closeSignInModal={this.closeFunction}
                    focusedOnSingleInputToggle={this.focusedOnSingleInputToggle}
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
  dialogRoot: isWebApp() ? {
    height: '100%',
    // position: 'absolute !important', // Causes problem on Firefox
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
  focusedOnSingleInput: isWebApp() ? {
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: '75%',
      left: '73%',
    },
  } : {},
  emailInputWebApp0to568: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(-75%, -50%)',
    },
  },
  phoneInputWebApp0to568: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(-75%, -60%)',
    },
  },
  emailInputWebApp569to736: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(-75%, -55%)',
    },
  },
  phoneInputWebApp569to736: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(-75%, -55%)',
    },
  },
  emailInputWebApp737to896: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(-75%, -40%)',
    },
  },
  phoneInputWebApp737to896: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(-75%, -55%)',
    },
  },
  emailInputCordovaSmall: {
    transform: 'translate(-75%, 47%)', // Works ok
  },
  phoneInputCordovaSmall: {
    transform: 'translate(-75%, -25%)', // Works ok.  Verify is modal and needs to be scrolled to see the confirmation area.
  },
  emailInputCordovaMedium: {
    transform: 'translate(-50%, -25%)', // Looks ok, verify page is full screen, and works well.  This does throw "Unable to simultaneously satisfy constraints", but does not crash iPhone 8
  },
  phoneInputCordovaMedium: {
    transform: 'translate(-50%, -25%)', // Looks ok. dialog layout is a bit off.  Verify is modal and needs to be scrolled to see the confirmation area. This does throw "Unable to simultaneously satisfy constraints", but does not crash iPhone 8
  },
  emailInputCordovaLarge: {
    transform: 'translate(-50%, 0%)', // Works ok.
  },
  phoneInputCordovaLarge: {
    transform: 'translate(-50%, 0%)', // Looks ok. dialog layout is a bit off.  Verify is modal and needs to be scrolled to see the confirmation area. This does throw "Unable to simultaneously satisfy constraints", but does not crash iPhone XsMax
  },                                  // On the iPad, Verify is modal and needs to be scrolled to see the confirmation area.
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
