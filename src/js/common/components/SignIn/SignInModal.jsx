import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { isAndroid, isAndroidSizeMD, isAndroidSizeWide } from '../../utils/cordovaUtils';
import { isCordova, isWebApp } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../../stores/VoterStore';
import initializeAppleSDK from '../../../utils/initializeAppleSDK';
import initializeFacebookSDK from '../../../utils/initializeFacebookSDK';

const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ './SignInOptionsPanel'));

class SignInModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isSignedIn: null,
      showSignInModalSimple: false,
    };
    this.toggleSignInModalSimple = this.toggleSignInModalSimple.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setState({
      showSignInModalSimple: true,
    });
    const { FB, AppleID } = window;
    if (!FB) {
      initializeFacebookSDK();
    }
    if (!AppleID) {
      initializeAppleSDK();
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const isSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      isSignedIn,
    }, () => this.uponSuccessfulSignInLocal(isSignedIn));
  }

  uponSuccessfulSignInLocal = (isSignedIn) => {
    if (this.props.uponSuccessfulSignIn && isSignedIn) {
      this.props.uponSuccessfulSignIn();
      // TODO Discuss this
      // this.setState({
      //   showSignInModalSimple: false,
      // });
    }
  }

  toggleSignInModalSimple () {
    // console.log('SignInModal  toggleSignInModalSimple');
    const { showSignInModalSimple } = this.state;
    this.setState({
      showSignInModalSimple: !showSignInModalSimple,
    });
    if (this.props.toggleOnClose) {
      this.props.toggleOnClose();
    }
  }

  render () {
    renderLog('SignInModal');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      classes,
      signedInContentHeader = (<></>),
      signedInContentSubHeader = (<></>),
      signInSubTitle = '',
      signInTitle = '',
      signedInTitle = (<></>),
      signedOutTitle = (<></>),
    } = this.props;
    const { isSignedIn, showSignInModalSimple } = this.state;

    return (
      <SignInModalWrapper>
        { showSignInModalSimple && (
          <Dialog
            className="u-z-index-9020"
            classes={{ paper: classes.dialogPaper, root: classes.dialogRoot }}
            open={showSignInModalSimple}
            onClose={() => { this.toggleSignInModalSimple(); }}
          >
            <DialogTitle classes={{ root: classes.dialogTitle }}>
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
                    {signedInContentHeader}
                  </div>
                  <br />
                  <div className="u-f6">
                    {signedInContentSubHeader}
                  </div>
                </div>
              ) : (
                <div>
                  <Suspense fallback={<></>}>
                    <SignInOptionsPanel
                      pleaseSignInTitle={signInTitle}
                      pleaseSignInSubTitle={signInSubTitle}
                      closeSignInModal={this.toggleSignInModalSimple}
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
SignInModal.propTypes = {
  classes: PropTypes.object,
  signedInContentHeader: PropTypes.node,
  signedInContentSubHeader: PropTypes.node,
  signInSubTitle: PropTypes.string,
  signInTitle: PropTypes.string,
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
    top: isAndroid() && !isAndroidSizeWide() ? '-26%' : '-15%',
    left: '0% !important',
    right: 'unset !important',
    bottom: 'unset !important',
    width: '100%',
    zIndex: '1300 !important',          // Added August 7, 2022, dialog was behind the Backdrop
  } : {},
  dialogPaper: isWebApp() ? {
    minWidth: '55%',
    [theme.breakpoints.down('lg')]: {
      minWidth: '65%',
    },
    [theme.breakpoints.down('md')]: {
      minWidth: '75%',
    },
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
  dialogContent: {
    [theme.breakpoints.down('md')]: {
      padding: '0 8px 8px',
    },
  },
  dialogTitle: {
    minHeight: '55px',
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
  ${() => (isAndroidSizeMD() ? 'overflow-y: scroll' : '')};
`;

export default withStyles(styles)(SignInModal);
