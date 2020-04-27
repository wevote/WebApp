import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Tabs, Tab, Box } from '@material-ui/core';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import { hasIPhoneNotch, isIPhone4in, isCordova, isWebApp } from '../../utils/cordovaUtils';
import FollowToggle from '../Widgets/FollowToggle';
import ImageHandler from '../ImageHandler';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import ShareActions from '../../actions/ShareActions';
import SharedItemIntroduction from './SharedItemIntroduction';
import ShareStore from '../../stores/ShareStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';

class SharedItemModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    show: PropTypes.bool,
    closeSharedItemModal: PropTypes.func,
    sharedItemCode: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
      condensed: false,
      errorToDisplay: false,
      errorMessageToDisplay: '',
      organizationName: '',
      organizationPhotoUrlLarge: '',
      sharedByOrganizationWeVoteId: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    // console.log('SharedItemModal componentDidMount');
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { sharedItemCode } = this.props;
    // const newVoterPhoneNumber = voterPhoneNumber.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    // console.log('sharedItemCode:', sharedItemCode);
    this.setState({
      sharedItemCode,
    });
    ShareActions.sharedItemRetrieveByCode(sharedItemCode);
  }

  componentWillUnmount () {
    // console.log('SharedItemModal componentWillUnmount');
    this.organizationStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { sharedByOrganizationWeVoteId } = this.state;
    const organization = OrganizationStore.getOrganizationByWeVoteId(sharedByOrganizationWeVoteId);
    if (organization && organization.organization_name) {
      // While typing 'Tom Smith' in the org field, without the following line, when you get to 'Tom ', autosaving trims and overwrites it to 'Tom' before you can type the 'S'
      // console.log('onOrganizationStoreChange: \'' + organization.organization_name + "' '" + this.state.organizationName + "'");
      if (organization.organization_name.trim() !== this.state.organizationName.trim()) {
        this.setState({
          organizationName: organization.organization_name,
          organizationPhotoUrlLarge: organization.organization_photo_url_large,
        });
      }
    }
  }

  onShareStoreChange () {
    // console.log('SharedItemLanding onShareStoreChange');
    const { sharedItemCode } = this.state;
    if (sharedItemCode) {
      const sharedItem = ShareStore.getSharedItemByCode(sharedItemCode);
      const { shared_by_organization_we_vote_id: sharedByOrganizationWeVoteId } = sharedItem;
      const organization = OrganizationStore.getOrganizationByWeVoteId(sharedByOrganizationWeVoteId);
      if (organization && organization.organization_name) {
        // console.log('onOrganizationStoreChange: \'' + organization.organization_name + "' '" + this.state.organizationName + "'");
        if (organization.organization_name.trim() !== this.state.organizationName.trim()) {
          this.setState({
            organizationName: organization.organization_name,
            organizationPhotoUrlLarge: organization.organization_photo_url_large,
          });
        }
      } else {
        OrganizationActions.organizationRetrieve(sharedByOrganizationWeVoteId);
      }
      this.setState({
        sharedByOrganizationWeVoteId,
      });
    }
  }

  onVoterStoreChange () {
    // const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    // const { incorrectSecretCodeEntered, numberOfTriesRemaining, secretCodeVerified, voterMustRequestNewCode, voterSecretCodeRequestsLocked } = secretCodeVerificationStatus;
    // // console.log('onVoterStoreChange secretCodeVerified: ' + secretCodeVerified);
    // if (secretCodeVerified) {
    //   // console.log('onVoterStoreChange secretCodeVerified: yes');
    //   this.closeSharedItemModalLocal();
    // } else {
    //   let errorMessageToDisplay = '';
    //   let errorToDisplay = false;
    //   if (voterSecretCodeRequestsLocked) {
    //     errorToDisplay = true;
    //     const { sharedItemCode, voterPhoneNumber } = this.state;
    //     if (sharedItemCode) {
    //       errorMessageToDisplay = `Please contact We Vote support regarding ${sharedItemCode}.`;
    //     } else if (voterPhoneNumber) {
    //       errorMessageToDisplay = `Please contact We Vote support regarding ${voterPhoneNumber}.`;
    //     } else {
    //       errorMessageToDisplay = 'Please contact We Vote support. Your account is locked.';
    //     }
    //   } else if (voterMustRequestNewCode) {
    //     errorToDisplay = true;
    //     errorMessageToDisplay = 'You\'ve reached the maximum number of tries.';
    //   } else if (incorrectSecretCodeEntered || numberOfTriesRemaining <= 4) {
    //     errorToDisplay = true;
    //     errorMessageToDisplay = 'Incorrect code entered.';
    //   }
    //   this.setState({
    //     errorMessageToDisplay,
    //     errorToDisplay,
    //     incorrectSecretCodeEntered,
    //     numberOfTriesRemaining,
    //     secretCodeVerified,
    //     voterMustRequestNewCode,
    //     voterSecretCodeRequestsLocked,
    //     voterVerifySecretCodeSubmitted: false,
    //   });
    // }
  }

  closeSharedItemModalLocal = () => {
    // console.log('voterVerifySecretCode this.props.closeSharedItemModal:', this.props.closeSharedItemModal);
    if (this.props.closeSharedItemModal) {
      this.props.closeSharedItemModal();
    }
  };

  clickNextStepButton = () => {
    const {
      nextStep,
    } = this.state;
    console.log('clickNextStepButton, nextStep:', nextStep);
    // if (nextStep) {
    //   this.setState(personalizedScoreSteps[nextStep]);
    // }
  };

  clickPreviousStepButton = () => {
    const {
      previousStep,
    } = this.state;
    console.log('clickPreviousStepButton, previousStep:', previousStep);
    // if (previousStep) {
    //   this.setState(personalizedScoreSteps[previousStep]);
    // }
  };

  handleChange (event, newActiveTabIndex) {
    this.setState({
      activeTabIndex: newActiveTabIndex,
    });
  }

  render () {
    renderLog('SharedItemModal');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('SharedItemModal render');
    const { classes } = this.props;
    const {
      activeTabIndex, condensed, errorMessageToDisplay, errorToDisplay,
      organizationName, organizationPhotoUrlLarge,
      sharedByOrganizationWeVoteId,
      sharedItemCode,
    } = this.state;
    const showIntroduction = true;

    if (!sharedItemCode) {
      return null;
    }

    let modalContentToDisplay;
    if (showIntroduction) {
      // Introduction
      modalContentToDisplay = (
        <span>
          <ModalTitleArea condensed={condensed}>
            <div>
              &nbsp;
            </div>
            <IconButton
              aria-label="Close"
              className={classes.closeButtonAbsolute}
              onClick={this.closeSharedItemModalLocal}
              id="closeSharedItemModal"
            >
              <CloseIcon />
            </IconButton>
          </ModalTitleArea>
          <ModalContent condensed={condensed} style={{ padding: `${isWebApp() ? 'undefined' : '37px 0 2px 0'}` }}>
            <SharedItemIntroduction />
            <ContinueButtonWrapper>
              <TwoButtonsWrapper>
                <div
                  style={{
                    width: '100%',
                  }}
                >
                  <Button
                    classes={{ root: classes.backButtonRoot }}
                    color="primary"
                    // disabled={!(previousStep)}
                    fullWidth
                    id="personalizedScoreIntroModalBackButton"
                    onClick={this.clickPreviousStepButton}
                    variant="outlined"
                  >
                    Back
                  </Button>
                </div>
                <div
                  style={{
                    width: '100%',
                  }}
                >
                  <Button
                    classes={{ root: classes.nextButtonRoot }}
                    color="primary"
                    fullWidth
                    id="personalizedScoreIntroModalNextButton"
                    // disabled={!(nextStep || showPersonalizedScoreIntroCompletedButton)}
                    variant="contained"
                    onClick={this.clickNextStepButton}
                  >
                    Next
                  </Button>
                </div>
              </TwoButtonsWrapper>
            </ContinueButtonWrapper>
          </ModalContent>
        </span>
      );
    } else {
      modalContentToDisplay = (
        <span>
          <ModalTitleArea condensed={condensed}>
            <SharedByOrganizationWrapper>
              {organizationPhotoUrlLarge && (
                <OrganizationImageWrapper>
                  <ImageHandler
                    imageUrl={organizationPhotoUrlLarge}
                    hidePlaceholder
                    sizeClassName="icon-lg "
                  />
                </OrganizationImageWrapper>
              )}
              <OrganizationNameWrapper>
                {organizationName}
              </OrganizationNameWrapper>
            </SharedByOrganizationWrapper>
            <FollowToggleWrapper className="u-show-desktop-tablet">
              <FollowToggle
                platformType="mobile"
                organizationWeVoteId={sharedByOrganizationWeVoteId}
                showFollowingText
              />
            </FollowToggleWrapper>
            <IconButton
              aria-label="Close"
              className={classes.closeButtonAbsolute}
              onClick={this.closeSharedItemModalLocal}
              id="closeSharedItemModal"
            >
              <CloseIcon />
            </IconButton>
          </ModalTitleArea>
          <ModalContent condensed={condensed} style={{ padding: `${isWebApp() ? 'undefined' : '37px 0 2px 0'}` }}>
            <Tabs variant="fullWidth" classes={{ indicator: classes.indicator }} value={activeTabIndex} onChange={this.handleChange}>
              <Tab
                classes={{ root: classes.tabStyle }}
                variant="fullWidth"
                color="primary"
                label={(
                  <span>
                    <span className="u-show-desktop-tablet">Positions From Your Ballot</span>
                    <span className="u-show-mobile">Your Ballot</span>
                  </span>
                )}
              />
              <Tab classes={{ root: classes.tabStyle }} variant="fullWidth" color="primary" label="All Positions" />
            </Tabs>
            <div
              role="tabpanel"
              hidden={activeTabIndex !== 0}
              id={`simple-tabpanel-${0}`}
              aria-labelledby={`simple-tab-${0}`}
              value={0}
            >
              {activeTabIndex === 0 && (
                <Box classes={{ root: classes.Box }} p={3}>
                  <TextContainer condensed={condensed}>
                    <Subtitle>The shared item code is:</Subtitle>
                    <PhoneSubtitle>{sharedItemCode}</PhoneSubtitle>
                    {errorToDisplay && (
                      <ErrorMessage>{errorMessageToDisplay}</ErrorMessage>
                    )}
                  </TextContainer>
                </Box>
              )}
            </div>
            <div
              role="tabpanel"
              hidden={activeTabIndex !== 1}
              id={`simple-tabpanel-${1}`}
              aria-labelledby={`simple-tab-${1}`}
              value={1}
            >
              {activeTabIndex === 1 && (
                <Box classes={{ root: classes.Box }} p={3}>
                  <Title condensed={condensed}>All Positions</Title>
                </Box>
              )}
            </div>
          </ModalContent>
        </span>
      );
    }

    return (
      <Dialog
        id="sharedItemModal"
        open={this.props.show}
        onClose={this.closeSharedItemModalLocal}
        classes={{
          paper: clsx(classes.dialogPaper, {
            [classes.codeVerifyCordova]: isCordova(),
          }),
          root: classes.dialogRoot,
        }}
      >
        {modalContentToDisplay}
      </Dialog>
    );
  }
}

const styles = theme => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    [theme.breakpoints.up('sm')]: {
      maxWidth: '720px',
      width: '85%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
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
  dialogRoot: {
    [theme.breakpoints.down('sm')]: {
      zIndex: '9010 !important',
    },
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  codeVerifyCordova: {
    top: '9%',
    bottom: 'unset',
    height: 'unset',
    minHeight: 'unset',
    margin: '5px',
  },
  indicator: {
    backgroundColor: theme.palette.primary.main,
    height: 2.5,
  },
  tabStyle: {
    fontWeight: 600,
  },
  Box: {
    padding: 2,
  },
  backButtonRoot: {
    width: '95%',
  },
  nextButtonRoot: {
    width: '100%',
  },
});

const ContinueButtonWrapper = styled.div`
  align-items: center;
  bottom: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: absolute;
`;

const ErrorMessage = styled.div`
  color: red;
  margin: 12px 0;
  text-align: center;
  font-size: 14px;
`;

const FollowToggleWrapper = styled.div`
`;

const OrganizationImageWrapper = styled.div`
`;

const OrganizationNameWrapper = styled.div`
`;

const ModalTitleArea = styled.div`
  width: 100%;
  padding: ${props => (props.condensed ? '8px' : '12px')};
  box-shadow: 0 20px 40px -25px #999;
  z-index: 999;
  display: flex;
  justify-content: flex-start;
  position: absolute;
  top: 0;
`;

const ModalContent = styled.div`
  height: isWebApp() ? 100% : 'unset';
  width: 100%;
  margin: 0 auto;
  padding: 55px 0 12px 0;
`;

const PhoneSubtitle = styled.h4`
  color: black;
  font-weight: bold;
  text-align: center;
`;

const SharedByOrganizationWrapper = styled.div`
  margin-right: 12px;
`;

const Subtitle = styled.h4`
  color: #ccc;
  font-weight: bold;
  text-align: center;
`;

const TextContainer = styled.div`
`;

const Title = styled.h3`
  font-weight: bold;
  font-size: ${() => (isIPhone4in() ? '26px' : '30px')};
  padding: 0 10px;
  margin-bottom: ${props => (props.condensed ? '16px' : '36px')};
  color: black;
  text-align: center;
  media(min-width: 569px) {
    font-size: 36px;
  }
`;

const TwoButtonsWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0;
  width: 100%;
`;

export default withTheme(withStyles(styles)(SharedItemModal));

