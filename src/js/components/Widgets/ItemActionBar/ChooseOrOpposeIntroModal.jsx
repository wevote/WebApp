import { Close } from '@mui/icons-material';
import { Button, DialogContent, DialogTitle, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import AppObservableStore from '../../../common/stores/AppObservableStore';
import VoterStore from '../../../stores/VoterStore';
import PositionPublicToggle from '../../PositionItem/PositionPublicToggle';
import webAppConfig from '../../../config';
import { createGlobalStyle } from 'styled-components';
// import ConfirmCloseModal from '../../More/ConfirmCloseModal';
import ModalDisplayTemplateB from '../../Widgets/ModalDisplayTemplateB';

const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../../../common/components/SignIn/SignInOptionsPanel'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../../common/components/Widgets/OpenExternalWebSite'));

const termsOfServiceURL = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/more/terms`;
const privacyPolicyURL = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/privacy`;


class ChooseOrOpposeIntroModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentSlideKey: 'signIn',
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      currentSlideKey: voterIsSignedIn ? 'getReady' : 'signIn',
      voterIsSignedIn,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    const { currentSlideKey } = this.state;
    if (voterIsSignedIn && (currentSlideKey === 'signIn')) {
      this.setState({
        currentSlideKey: 'getReady',
      });
    }
    this.setState({
      voterIsSignedIn,
    });
  }

  getSlides = () => {
    const { ballotItemType, classes } = this.props;
    const { voterIsSignedIn } = this.state;
    const slides = {
      getReady:
        (
          <>
            <SubTitle>WeVote helps you get ready to vote, BUT does not officially cast your vote.</SubTitle>
            <PlainText>Make sure to return your official ballot to your local election registrar.</PlainText>
            <Options buttons="2">
              {!voterIsSignedIn && (
                <Button
                  classes={{ root: classes.optionsButton }}
                  variant="outlined"
                  color="primary"
                  onClick={() => this.changeCurrentSlideIndex('signIn')}
                >
                  Previous
                </Button>
              )}
              <Button
                classes={voterIsSignedIn ? { root: classes.button } : { root: classes.optionsButton }}
                variant="contained"
                color="primary"
                onClick={this.props.onClose}
              >
                Close
              </Button>
            </Options>
          </>
        ),
      toggle:
        (
          <>
            <SubTitle>Your position is only visible to your WeVote friends.</SubTitle>
            <PlainText>You can make your views public with the privacy toggle.</PlainText>
            <Row>
              <BoldText>Test the toggle here:</BoldText>
              <PositionPublicToggle
                ballotItemType={ballotItemType}
                ballotItemWeVoteId="null"
                className="null"
                externalUniqueId={`practiceToggle-${this.props.externalUniqueId}`}
                inModal={this.props.inModal}
                inTestMode
                politicianWeVoteId=""
              />
            </Row>
            <Options buttons="2">
              <Button
                classes={{ root: classes.optionsButton }}
                variant="outlined"
                color="primary"
                onClick={() => this.changeCurrentSlideIndex('getReady')}
              >
                Previous
              </Button>
              <Button
                classes={{ root: classes.optionsButton }}
                variant="contained"
                color="primary"
                onClick={this.props.onClose}
              >
                Close
              </Button>
            </Options>
          </>
        ),
    };
    if (!voterIsSignedIn) {
      slides.signIn = (
        <Suspense fallback={<></>}>
          <>
            {/* <SignInOptionsPanel
              pleaseSignInTitle="Save your choices for access on any device."
              pleaseSignInSubTitle=""
              toggleSignInModal={this.props.onClose}
              inModal
            /> */}
            <div
              className="u-f3"
              id="pleaseSignInTitle"
              style={{
                width: '100%',
                display: 'block',
                textAlign: 'center',
                margin: '0 auto',
                padding: '0 16px',
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: 1.4,
                color: '#4B4B4B',
              }}
            >
              Save your choices for access on any device.
            </div>
            <Options buttons="1">
              <Button
                classes={{ root: classes.signInButton }}
                variant="contained"
                color="primary"
                onClick={this.openSignInModal}
              >
                Save my choices
              </Button>
            </Options>
            <Options buttons="1">
              <Button
                classes={{ root: classes.signInButton }}
                variant="outlined"
                color="primary"
                onClick={() => this.changeCurrentSlideIndex('getReady')}
              >
                Continue without signing in
              </Button>
            </Options>
            <HelperText>
              Signing in is optional. Takes about 30 seconds. Free forever.
            </HelperText>
            <TermsWrapper id="terms_Wrapper">
              By continuing, you accept WeVote.US’s<br />
              {' '}
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  className="open-web-site"
                  body={(
                    <span>
                      Terms of Service
                    </span>
                  )}
                  linkIdAttribute="openTermsOfService"
                  target="_blank"
                  url={termsOfServiceURL}
                />
              </Suspense>
              {' '}
              and
              {' '}
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="openPrivacyPolicy"
                  url={privacyPolicyURL}
                  target="_blank"
                  className="open-web-site open-web-site__no-right-padding"
                  body={(
                    <span>
                      Privacy Policy
                    </span>
                  )}
                />
              </Suspense>
              .
            </TermsWrapper>
          </>
        </Suspense>
      );
    }
    return slides;
  };

  changeCurrentSlideIndex = (newSlideIndex) => {
    this.setState({
      currentSlideKey: newSlideIndex,
    });
    return null;
  };

  openSignInModal = () => {
    AppObservableStore.setShowChooseOrOpposeIntroModal(false);
    AppObservableStore.setShowChooseOrOpposeSignInModal(true);
    if (this.props.onClose) this.props.onClose();
  };

  render () {
    const { classes } = this.props;
    const { currentSlideKey } = this.state;
    // console.log('currentSlideKey:', currentSlideKey);
    const slides = this.getSlides();
    return (
      <>
        {/* <IconButtonRow>                                                                                                                                                                               
          <IconButton   
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={this.props.onClose}
            id="profileCloseItemActionBar"
            size="large"
          >
            <Close />
          </IconButton>
        </IconButtonRow>
        <DialogTitle classes={{ root: classes.dialogTitle }}>
          <TitleText>Nice work - you're making progress!</TitleText>
        </DialogTitle>
        <HorizontalLine />
        <DialogContent classes={{ root: classes.dialogContent }}>
          <SlidesWrapper>
            <SlidesContainer>
              {slides[currentSlideKey]}
            </SlidesContainer>
          </SlidesWrapper>
        </DialogContent> */}
        {/* <ConfirmCloseModal
          isOpen
          onConfirm={this.props.onClose}
          onCancel={this.props.onClose}
        /> */}
        <HideDivider />
        <SoftenCorners />
        <CenterModal />
        <RemovePadding />
        <ModalDisplayTemplateB
          show
          toggleModal={this.props.onClose}
          externalUniqueId="confirmCloseModal"
          textFieldJSX={(
            <>
              <DialogTitle classes={{ root: classes.dialogTitle }}>
                <TitleText>Nice work - you're making progress!</TitleText>
              </DialogTitle>
              <HorizontalLine />
              <DialogContent classes={{ root: classes.dialogContent }}>
                <SlidesWrapper>
                  <SlidesContainer>
                    {slides[currentSlideKey]}
                  </SlidesContainer>
                </SlidesWrapper>
              </DialogContent>
            </>
          )}
          tallMode={false}
        />
      </>
    );
  }
}
ChooseOrOpposeIntroModal.propTypes = {
  classes: PropTypes.object,
  ballotItemType: PropTypes.string.isRequired,
  externalUniqueId: PropTypes.string,
  onClose: PropTypes.func,
  inModal: PropTypes.bool,
};

const styles = (theme) => ({
  button: {
    width: '100%',
  },
  signInButton: {
    width: '70%',
    minHeight: '40px',
    padding: '8px 16px',
    [theme.breakpoints.down('sm')]: {
      width: '85%',
    },
  },
  closeButton: {
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  dialogTitle: {
    paddingTop: 22,
    paddingBottom: 5,
    display: 'flex',
  },
  nextButton: {
    width: '50%',
    margin: 8,
  },
  optionsButton: {
    minWidth: '40%',
    width: '50%',
    margin: 8,
    [theme.breakpoints.down('md')]: {
      width: '40%',
    },
  },
});

const CenterModal = createGlobalStyle`
  .MuiDialog-paper.MuiDialog-paperScrollPaper[role="dialog"]:has(#closeModalDisplayTemplateBconfirmCloseModal) {
    margin: 32px auto !important;
    top: 0 !important;
    transform: none !important;
  }
`;

const HideDivider = createGlobalStyle`
  .MuiDialogTitle-root:has(#closeModalDisplayTemplateBconfirmCloseModal) > hr {
    display: none !important;
  }
`;

const SoftenCorners = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateBconfirmCloseModal) {
    border-radius: 20px !important;
  }
`;

const RemovePadding = createGlobalStyle`
  .MuiDialog-paper:has(#closeModalDisplayTemplateBconfirmCloseModal) .MuiDialogContent-root {
    padding: 0 15px 15px 15px !important;
    overflow: visible !important;
  }
  .MuiDialog-paper:has(#closeModalDisplayTemplateBconfirmCloseModal) .MuiDialogContent-root > div {
    margin-top: 0 !important;
  }
  .MuiDialog-paper:has(#closeModalDisplayTemplateBconfirmCloseModal) .MuiDialogTitle-root {
    padding: 0 !important;
  }
`;

const TermsWrapper = styled('div')(({ theme }) => (`
  margin-top: 30px;
  font-weight: 600;
  text-align: center;
  // ${theme.breakpoints.down('sm')} {
  //   padding-top: 30px;
  // }
`));

const HorizontalLine = styled('div')(({ theme }) => (`
  background-color: #A9A9A9;
  height: 2px;
  margin: 0 72px;
  margin-bottom: 8px;
  margin-top: 0;
  ${theme.breakpoints.down('md')} {
    margin: 0 24px 8px 24px;
  }
`));

const IconButtonRow = styled('div')(() => (`
    display: flex;                                                                                                                                                                              
    justify-content: flex-end;
`));

const Options = styled('div')(({ buttons }) => (`
  display: flex;
  flex-flow: ${buttons > 1 ? 'row' : 'column'};
  ${buttons > 1 ? 'justify-content: space-between;' : 'align-items: center;'};
  margin-top: 1em;
`));

const TitleText = styled('div')`
  font-weight: 600;
  font-size: 26px;
  font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  color: #206DB3;
  margin: 0 auto 4px auto;
  padding: 0 16px;
  width: 100%;
  text-align: center;
  line-height: 1.3;
`;

const HelperText = styled('div')`
  font-size: 13px;
  font-weight: 600;
  color: #777;
  text-align: center;
  line-height: 1.4;
  padding: 14px;
`;

const SubTitle = styled('div')`
  font-size: 18px;
  color: #333;
  text-align: left;
  margin-bottom: 4px;
`;

const PlainText = styled('div')`
  color: #666;
  text-align: left;
`;

const BoldText = styled('div')`
  font-weight: bold;
`;

const Row = styled('div')`
  // display: flex;
  margin: 16px 0;
  margin-top: 20px;
`;

const SlidesContainer = styled('div')`
  display: block;
`;

const SlidesWrapper = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: column;
  min-width: 508px;
  min-height: 205px;
  justify-content: space-between;
  ${theme.breakpoints.down('md')} {
    width: 100%;
    min-width: 260px;
  }
`));

export default withStyles(styles)(ChooseOrOpposeIntroModal);
