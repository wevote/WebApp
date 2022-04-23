import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { isAndroidSizeMD } from '../../common/utils/cordovaUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';

const SettingsAccount = React.lazy(() => import(/* webpackChunkName: 'SettingsAccount' */ './SettingsAccount'));

class SignInModalSimple extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isSignedIn: null,
      showSignInModalSimple: false,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setState({
      showSignInModalSimple: true,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const { is_signed_in: isSignedIn } = voter;
    this.setState({
      isSignedIn,
    }, () => this.uponSuccessfulSignInLocal(isSignedIn));
  }

  uponSuccessfulSignInLocal = (isSignedIn) => {
    if (this.props.uponSuccessfulSignIn && isSignedIn) {
      this.props.uponSuccessfulSignIn();
    }
  }

  toggleSignInModalSimple () {
    const { showSignInModalSimple } = this.state;
    this.setState({
      showSignInModalSimple: !showSignInModalSimple,
    });
    if (this.props.toggleOnClose) {
      this.props.toggleOnClose();
    }
  }

  render () {
    renderLog('SignInModalSimple');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      classes,
      settingsAccountIsSignedInTitle, settingsAccountIsSignedInSubTitle,
      settingsAccountSignInSubTitle, settingsAccountSignInTitle,
      signedInTitle, signedOutTitle,
    } = this.props;
    const { isSignedIn, showSignInModalSimple } = this.state;

    return (
      <SignInModalWrapper>
        { showSignInModalSimple && (
          <Dialog
            classes={{ paper: classes.dialogPaper, root: classes.dialogRoot }}
            open={showSignInModalSimple}
            onClose={() => { this.toggleSignInModalSimple(); }}
          >
            <DialogTitle>
              <Typography component="span" variant="h6" className="text-center">
                {isSignedIn ? (
                  <>
                    {signedInTitle}
                  </>
                ) : (
                  <>
                    {signedOutTitle}
                  </>
                )}
              </Typography>
              <IconButton
                aria-label="Close"
                classes={{ root: classes.closeButton }}
                id="signInModalSimpleCloseIcon"
                onClick={() => { this.toggleSignInModalSimple(); }}
                size="large"
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent classes={{ root: classes.dialogContent }}>
              {isSignedIn ? (
                <div className="text-center">
                  <div className="u-f3">
                    {settingsAccountIsSignedInTitle}
                  </div>
                  <br />
                  <div className="u-f6">
                    {settingsAccountIsSignedInSubTitle}
                  </div>
                </div>
              ) : (
                <div>
                  <Suspense fallback={<></>}>
                    <SettingsAccount
                      pleaseSignInTitle={settingsAccountSignInTitle}
                      pleaseSignInSubTitle={settingsAccountSignInSubTitle}
                      inModal
                    />
                  </Suspense>
                </div>
              )}
              <br />
              <br />
            </DialogContent>
          </Dialog>
        )}
      </SignInModalWrapper>
    );
  }
}
SignInModalSimple.propTypes = {
  classes: PropTypes.object,
  settingsAccountIsSignedInSubTitle: PropTypes.node,
  settingsAccountIsSignedInTitle: PropTypes.node,
  settingsAccountSignInTitle: PropTypes.string,
  settingsAccountSignInSubTitle: PropTypes.string,
  signedInTitle: PropTypes.node,
  signedOutTitle: PropTypes.node,
  toggleOnClose: PropTypes.func,
  uponSuccessfulSignIn: PropTypes.func,
};

const styles = (theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  dialogRoot: isCordova() ? {
    height: '100%',
    position: 'absolute !important',
    top: '-15%',
    left: '0% !important',
    right: 'unset !important',
    bottom: 'unset !important',
    width: '100%',
  } : {},
  dialogPaper: isWebApp() ? {
    [theme.breakpoints.down('sm')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      maxHeight: '90%',
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
  radioPrimary: {
    padding: '.1rem',
    margin: '.1rem .1rem .6rem .6rem',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
  },
  radioLabel: {
    fontSize: '14px',
    // bottom: '4px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      fontSize: '11px',
    },
    marginRight: isAndroidSizeMD() ? '2px' : '',
  },
  formControl: {
    width: '100%',
  },
});

const SignInModalWrapper = styled('div')`
  width: fit-content;
`;

export default withStyles(styles)(SignInModalSimple);
