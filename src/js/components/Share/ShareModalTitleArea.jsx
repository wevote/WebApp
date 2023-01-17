import { Close } from '@mui/icons-material';
import { FormControl, FormControlLabel, IconButton, Radio } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { returnShareModalText } from './ShareModalText';
import { isAndroidSizeMD, isIPad } from '../../common/utils/cordovaUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';

// import { getApplicationViewBooleans } from '../../utils/applicationUtils';
const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../../common/components/SignIn/SignInModal'));

class ShareModalTitleArea extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showSignInModal: false,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const whatAndHowMuchToShare = AppObservableStore.getWhatAndHowMuchToShare();
    const {
      allOpinionsRadioButtonDescription,
      allOpinionsRadioButtonText,
      noOpinionsRadioButtonDescription,
      noOpinionsRadioButtonText,
      shareModalDescription,
      shareModalTitle,
    } = returnShareModalText(whatAndHowMuchToShare);
    this.setState({
      allOpinionsRadioButtonDescription,
      allOpinionsRadioButtonText,
      noOpinionsRadioButtonDescription,
      noOpinionsRadioButtonText,
      shareModalDescription,
      shareModalTitle,
      whatAndHowMuchToShare,
    });
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const whatAndHowMuchToShare = AppObservableStore.getWhatAndHowMuchToShare();
    this.setState({
      whatAndHowMuchToShare,
    });
  }

  onVoterStoreChange () {
    this.setState({});
  }

  handleShareAllOpinionsToggle = (evt) => {
    const { whatAndHowMuchToShare } = this.state;
    const { value } = evt.target;
    // console.log('handleShareAllOpinionsToggle value:', value, ', whatAndHowMuchToShare:', whatAndHowMuchToShare);
    if (value === 'AllOpinions') {
      this.includeOpinions(whatAndHowMuchToShare);
    } else {
      this.doNotIncludeOpinions(whatAndHowMuchToShare);
    }
  };

  setStep = (whatAndHowMuchToShare) => {
    const {
      allOpinionsRadioButtonDescription,
      allOpinionsRadioButtonText,
      noOpinionsRadioButtonDescription,
      noOpinionsRadioButtonText,
      shareModalTitle,
    } = returnShareModalText(whatAndHowMuchToShare);
    this.setState({
      allOpinionsRadioButtonDescription,
      allOpinionsRadioButtonText,
      noOpinionsRadioButtonDescription,
      noOpinionsRadioButtonText,
      shareModalTitle,
      whatAndHowMuchToShare,
    });
    AppObservableStore.setWhatAndHowMuchToShare(whatAndHowMuchToShare);
  }

  toggleShowSignInModal = () => {
    const { showSignInModal } = this.state;
    this.setState({
      showSignInModal: !showSignInModal,
    });
  }

  doNotIncludeOpinions (whatAndHowMuchToShare) {
    // console.log('doNotIncludeOpinions whatAndHowMuchToShare:', whatAndHowMuchToShare);
    if (stringContains('AllOpinions', whatAndHowMuchToShare)) {
      const newShareFooterStep = whatAndHowMuchToShare.replace('AllOpinions', '');
      this.setStep(newShareFooterStep);
    }
  }

  includeOpinions (whatAndHowMuchToShare) {
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    // console.log('includeOpinions whatAndHowMuchToShare:', whatAndHowMuchToShare, ', voterIsSignedIn:', voterIsSignedIn);
    if (!stringContains('AllOpinions', whatAndHowMuchToShare)) {
      if (voterIsSignedIn) {
        const newShareFooterStep = `${whatAndHowMuchToShare}AllOpinions`;
        this.setStep(newShareFooterStep);
      } else {
        this.setState({
          showSignInModal: true,
        });
      }
    }
  }

  render () {
    renderLog('ShareModalTitleArea');
    const { classes, firstSlide, handleCloseShareButtonDrawer } = this.props;
    const {
      allOpinionsRadioButtonDescription, allOpinionsRadioButtonText, noOpinionsRadioButtonDescription, noOpinionsRadioButtonText,
      shareModalDescription, shareModalTitle, showSignInModal, whatAndHowMuchToShare,
    } = this.state;
    // const { location: { pathname } } = window;
    // const { showFooterBar } = getApplicationViewBooleans(pathname);
    // console.log('whatAndHowMuchToShare:', whatAndHowMuchToShare);

    return (
      <ModalTitleArea firstSlide={firstSlide}>
        <div>
          <ShareButtonFooterTitle>
            {shareModalTitle}
          </ShareButtonFooterTitle>
          <ShareDescription>
            {shareModalDescription}
          </ShareDescription>
          <FormControl
            classes={{ root: classes.formControl }}
            style={isCordova() ? { display: 'none' } : {}}
          >
            <RadioGroup
              onChange={this.handleShareAllOpinionsToggle}
            >
              <RadioItem>
                <FormControlLabel
                  id="shareModalNoOpinionsRadioButton"
                  classes={{ label: classes.radioLabel }}
                  value="NoOpinions"
                  label={noOpinionsRadioButtonText}
                  labelPlacement="end"
                  control={
                    (
                      <Radio
                        classes={{ colorPrimary: classes.radioPrimary }}
                        color="primary"
                        checked={!stringContains('AllOpinions', whatAndHowMuchToShare)}
                      />
                    )
                  }
                />
                <RadioButtonText>
                  {noOpinionsRadioButtonDescription}
                </RadioButtonText>
              </RadioItem>
              <RadioItem>
                <FormControlLabel
                  classes={{ label: classes.radioLabel }}
                  id="shareModalAllOpinionsRadioButton"
                  value="AllOpinions"
                  label={(
                    <>
                      <div>
                        {allOpinionsRadioButtonText}
                      </div>
                    </>
                    )}
                  // label="Share my voter guide (coming in 2023)"
                  labelPlacement="end"
                  control={
                    (
                      <Radio
                        classes={{ colorPrimary: classes.radioPrimary }}
                        color="primary"
                        checked={stringContains('AllOpinions', whatAndHowMuchToShare)}
                      />
                    )
                  }
                  style={{ marginRight: `${isAndroidSizeMD() ? '10px' : ''}` }}
                />
                <RadioButtonText>
                  {allOpinionsRadioButtonDescription}
                </RadioButtonText>
              </RadioItem>
            </RadioGroup>
          </FormControl>
        </div>
        <IconButton
          aria-label="Close"
          className={classes.closeButtonAbsolute}
          onClick={handleCloseShareButtonDrawer}
          id="closeShareModal"
          size="large"
          style={isIPad() ? { top: 2 } : {}}
        >
          <Close />
        </IconButton>
        {(showSignInModal && !VoterStore.getVoterIsSignedIn()) && (
          <Suspense fallback={<></>}>
            <SignInModal
              signInTitle="Sign in to share your choices"
              signInSubTitle={shareModalDescription}
              toggleOnClose={this.toggleShowSignInModal}
              uponSuccessfulSignIn={this.toggleShowSignInModal}
            />
          </Suspense>
        )}
      </ModalTitleArea>
    );
  }
}
ShareModalTitleArea.propTypes = {
  classes: PropTypes.object,
  firstSlide: PropTypes.bool,
  handleCloseShareButtonDrawer: PropTypes.func,
};

const styles = () => ({
  buttonDefault: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    borderRadius: '0 !important',
    height: '45px !important',
  },
  buttonDefaultCordova: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    borderRadius: '0 !important',
    height: '35px !important',
  },
  backButton: {
    marginBottom: 6,
    marginLeft: -8,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 12,
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  informationIcon: {
    color: '#999',
    width: 20,
    height: 20,
    marginTop: '-3px',
    marginRight: 3,
  },
  informationIconInButton: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginLeft: 3,
  },
  menuItem: {
    zIndex: '9 !important',
    padding: '0 !important',
    marginBottom: '-2px !important',
    paddingBottom: '1px !important',
    '&:last-child': {
      paddingBottom: '0 !important',
      paddingTop: '1px !important',
    },
    '&:hover': {
      background: '#efefef',
    },
  },
  previewButton: {
    marginTop: 0,
  },
  shareIcon: {
    transform: 'scaleX(-1)',
    position: 'relative',
    top: -1,
  },
});

/* eslint no-nested-ternary: ["off"] */
const ModalTitleArea = styled('div', {
  shouldForwardProp: (prop) => !['firstSlide', 'onSignInSlide', 'noBoxShadowMode'].includes(prop),
})(({ firstSlide, onSignInSlide, noBoxShadowMode }) => (`
  text-align: left;
  width: 100%;
  // padding: 0;

  padding: ${isWebApp() ? (firstSlide ? '24px 24px 12px 24px' : (onSignInSlide ? '20px 14px 10px' : '10px 14px')) : '10px 14px 0 14px'};
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  ${noBoxShadowMode ? '@media (max-width: 376px) {\n    padding: 8px 6px;\n  }' : ''}
  display: ${onSignInSlide ? 'block' : 'flex'};
  text-align: ${onSignInSlide ? 'center' : 'left'};
`));

const RadioButtonText = styled('div')`
  color: #808080;
  margin-left: 32px;
  margin-top: 4px;
`;

const RadioGroup = styled('div', {
  shouldForwardProp: (prop) => !['preventStackedButtons'].includes(prop),
})(({ preventStackedButtons, theme }) => (`
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  width: 100%;
  ${theme.breakpoints.up('sm')} {
    flex-flow: row;
  }
  ${theme.breakpoints.down('md')} {
    margin-bottom: -10px;
  }
  ${theme.breakpoints.down('xs')} {
    ${preventStackedButtons ? '' : 'flex-flow: row wrap;'}
    margin-bottom: 0;
  }
`));

const RadioItem = styled('div', {
  shouldForwardProp: (prop) => !['preventStackedButtons'].includes(prop),
})(({ preventStackedButtons, theme }) => (`
  margin-bottom: 20px;
  ${!preventStackedButtons && theme.breakpoints.down('xs') ? (`
      // width: 100% !important;
      // min-width: 100% !important;
      // margin-bottom: -6px;
  `) : ''}
`));

const ShareButtonFooterTitle = styled('h3')(({ theme }) => (`
  font-weight: bold;
  font-size: 28px;
  color: black;
  margin-top: 0;
  margin-bottom: 4px;
  ${theme.breakpoints.down('xs')} {
    font-size: 17px;
    margin-bottom: 8px;
  }
`));

const ShareDescription = styled('div')`
  color: #808080;
  margin-bottom: ${isWebApp() ? '12px' : ''};
`;

export default withStyles(styles)(ShareModalTitleArea);
