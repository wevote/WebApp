import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import CandidateItem from '../Ballot/CandidateItem';
import { hideZenDeskHelpVisibility, setZenDeskHelpVisibility } from '../../utils/applicationUtils';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';

class PersonalizedScoreIntroModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      previousStep: false,
      currentStep: 1,
      nextStep: 2,
      actionButtonText: '',
      controlAdviserMaterialUIPopoverFromProp: false,
      explanationTextTopPlain: null,
      explanationTextTopBlue: null,
      explanationTextBottomPlain: null,
      explanationTextBottomBlue: null,
      openAdviserMaterialUIPopover: false,
      openSupportOpposeCountDisplayModal: false,
      pathname: '',
      supportOpposeCountDisplayModalTutorialOn: true,
      supportOpposeCountDisplayModalTutorialText: null,
      showPersonalizedScoreDownArrow: false,
      showPersonalizedScoreUpArrow: false,
      showPersonalizedScoreIntroCompletedButton: false,
      personalizedScoreSteps: {
        1: {
          previousStep: false,
          currentStep: 1,
          nextStep: 2,
          actionButtonText: 'Say What?!?',
          closeSupportOpposeCountDisplayModal: true,
          controlAdviserMaterialUIPopoverFromProp: false,
          explanationTextTopPlain: null,
          explanationTextTopBlue: <>A Personalized Score is the number of people who support a candidate.</>,
          explanationTextBottomPlain: <>(We&apos;ll explain! Click the button below to continue.)</>,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: false,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        2: {
          previousStep: 1,
          currentStep: 2,
          nextStep: 3,
          actionButtonText: 'Next >',
          closeSupportOpposeCountDisplayModal: true,
          controlAdviserMaterialUIPopoverFromProp: false,
          explanationTextTopPlain: null,
          explanationTextTopBlue: <>In this example, you have a Personalized Score of &quot;+3&quot; for the historical candidate &quot;Alexander Hamilton&quot;.</>,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: true,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        3: {
          previousStep: 2,
          currentStep: 3,
          nextStep: 4,
          actionButtonText: 'Tell Me!',
          closeSupportOpposeCountDisplayModal: true,
          explanationTextTopPlain: <>But how is the +3 calculated?</>,
          explanationTextTopBlue: null,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: true,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        4: {
          previousStep: 3,
          currentStep: 4,
          nextStep: 5,
          actionButtonText: 'I\'ll Pretend',
          closeSupportOpposeCountDisplayModal: true,
          controlAdviserMaterialUIPopoverFromProp: false,
          explanationTextTopPlain: <>But how is the +3 calculated?</>,
          explanationTextTopBlue: null,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: <>In this example, we pretend you are following 3 advisers.</>,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: true,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        5: {
          previousStep: 4,
          currentStep: 5,
          nextStep: 6,
          actionButtonText: 'Next >',
          closeSupportOpposeCountDisplayModal: true,
          controlAdviserMaterialUIPopoverFromProp: false,
          explanationTextTopPlain: <>But how is the +3 calculated?</>,
          explanationTextTopBlue: null,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: <>Out of those people, we count the number who support Alexander Hamilton. We pretend all 3 support him.</>,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: true,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        6: {
          previousStep: 5,
          currentStep: 6,
          nextStep: 7,
          actionButtonText: 'Show',
          closeSupportOpposeCountDisplayModal: true,
          controlAdviserMaterialUIPopoverFromProp: false,
          explanationTextTopPlain: null,
          explanationTextTopBlue: <>So, your Personalized Score is the number of people who support Alexander Hamilton, from among the people you follow.</>,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: true,
          showPersonalizedScoreUpArrow: false,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        7: {
          previousStep: 6,
          currentStep: 7,
          nextStep: 8,
          actionButtonText: 'Next >',
          closeSupportOpposeCountDisplayModal: false,
          controlAdviserMaterialUIPopoverFromProp: true,
          explanationTextTopPlain: null,
          explanationTextTopBlue: null,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: true,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: <>These are the people and groups who support Alexander Hamilton.</>,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: false,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        8: {
          previousStep: 7,
          currentStep: 8,
          nextStep: 9,
          actionButtonText: 'Next >',
          closeSupportOpposeCountDisplayModal: false,
          controlAdviserMaterialUIPopoverFromProp: true,
          explanationTextTopPlain: null,
          explanationTextTopBlue: null,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: true,
          openSupportOpposeCountDisplayModal: true,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: <>You can click on any adviser to see why they are part of your Personalized Score.</>,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: false,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        9: {
          previousStep: 8,
          currentStep: 9,
          nextStep: 10,
          actionButtonText: 'Got It!',
          closeSupportOpposeCountDisplayModal: false,
          controlAdviserMaterialUIPopoverFromProp: true,
          explanationTextTopPlain: null,
          explanationTextTopBlue: null,
          explanationTextBottomPlain: null,
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: true,
          supportOpposeCountDisplayModalTutorialOn: true,
          supportOpposeCountDisplayModalTutorialText: <>Click the +3 any time to see your Personalized Score explained.</>,
          showPersonalizedScoreDownArrow: true,
          showPersonalizedScoreUpArrow: false,
          showPersonalizedScoreIntroCompletedButton: false,
        },
        10: {
          previousStep: 9,
          currentStep: 10,
          nextStep: false,
          actionButtonText: 'All Done!',
          closeSupportOpposeCountDisplayModal: true,
          controlAdviserMaterialUIPopoverFromProp: false,
          explanationTextTopPlain: null,
          explanationTextTopBlue: <>Success! Now you know what a personalized score is:</>,
          explanationTextBottomPlain: (
            <>
              A
              {' '}
              <strong>
                Personalized Score
              </strong>
              {' '}
              is the number of friends, public figures or groups who support one candidate, from among the people you follow.
            </>
          ),
          explanationTextBottomBlue: null,
          openAdviserMaterialUIPopover: false,
          openSupportOpposeCountDisplayModal: false,
          supportOpposeCountDisplayModalTutorialOn: false,
          supportOpposeCountDisplayModalTutorialText: null,
          showPersonalizedScoreDownArrow: false,
          showPersonalizedScoreUpArrow: false,
          showPersonalizedScoreIntroCompletedButton: true,
        },
      },
    };
  }

  componentDidMount () {
    // Step 1 settings
    const { personalizedScoreSteps } = this.state;
    this.setState(personalizedScoreSteps[1]);
    this.setState({
      pathname: this.props.pathname,
    });
    if (this.props.show) {
      hideZenDeskHelpVisibility();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.show) {
      hideZenDeskHelpVisibility();
    } else {
      setZenDeskHelpVisibility(this.props.pathname);
    }
  }

  componentWillUnmount () {
    setZenDeskHelpVisibility(this.props.pathname);
  }

  closeThisModal = () => {
    setZenDeskHelpVisibility(this.props.pathname);
    const { currentStep } = this.state;
    const currentStepCompletedThreshold = 8;
    if (currentStep >= currentStepCompletedThreshold) {
      // console.log('currentStepCompletedThreshold passed');
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    }
    this.props.toggleFunction(this.state.pathname);
  };

  personalizedScoreIntroCompleted = () => {
    // Mark this so we know to show 'How it Works' as completed
    VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    this.props.toggleFunction(this.state.pathname);
  };

  clickNextStepButton = () => {
    const {
      nextStep, personalizedScoreSteps,
    } = this.state;
    // console.log('clickNextStepButton, nextStep:', nextStep);
    if (nextStep) {
      this.setState(personalizedScoreSteps[nextStep]);
    }
  };

  clickPreviousStepButton = () => {
    const {
      previousStep, personalizedScoreSteps,
    } = this.state;
    // console.log('clickPreviousStepButton, previousStep:', previousStep);
    if (previousStep) {
      this.setState(personalizedScoreSteps[previousStep]);
    }
  };

  render () {
    renderLog('PersonalizedScoreIntroModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      actionButtonText, closeSupportOpposeCountDisplayModal, controlAdviserMaterialUIPopoverFromProp,
      explanationTextBottomBlue, explanationTextBottomPlain,
      explanationTextTopBlue, explanationTextTopPlain, showPersonalizedScoreIntroCompletedButton,
      nextStep, openAdviserMaterialUIPopover, openSupportOpposeCountDisplayModal,
      supportOpposeCountDisplayModalTutorialOn, supportOpposeCountDisplayModalTutorialText,
      previousStep,
      showPersonalizedScoreDownArrow, showPersonalizedScoreUpArrow,
    } = this.state;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={this.closeThisModal}
      >
        <ModalTitleArea>
          <Title>
            What&apos;s a Personalized Score?
          </Title>
          <IconButtonWrapper>
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              onClick={this.closeThisModal}
              id="closePersonalizedScoreIntroModal"
            >
              <CloseIcon />
            </IconButton>
          </IconButtonWrapper>
        </ModalTitleArea>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <div className="full-width">
            <CandidateItemOuterWrapper>
              <CandidateItem
                candidateWeVoteId="candidateAlexanderHamilton"
                closeSupportOpposeCountDisplayModal={closeSupportOpposeCountDisplayModal}
                controlAdviserMaterialUIPopoverFromProp={controlAdviserMaterialUIPopoverFromProp}
                hideBallotItemSupportOpposeComment
                hideCandidateText
                hideCandidateUrl
                hideIssuesRelatedToCandidate
                hideShowMoreFooter
                openAdviserMaterialUIPopover={openAdviserMaterialUIPopover}
                openSupportOpposeCountDisplayModal={openSupportOpposeCountDisplayModal}
                supportOpposeCountDisplayModalTutorialOn={supportOpposeCountDisplayModalTutorialOn}
                supportOpposeCountDisplayModalTutorialText={supportOpposeCountDisplayModalTutorialText}
                showDownArrow={showPersonalizedScoreDownArrow}
                showUpArrow={showPersonalizedScoreUpArrow}
                showLargeImage
                showOfficeName
              />
            </CandidateItemOuterWrapper>
            <ExplanationTextTop>
              {explanationTextTopBlue && (
                <div
                  style={{
                    color: '#2e3c5d',
                    fontSize: '18px',
                    fontWeight: 600,
                    margin: '6px 0 0 0',
                  }}
                >
                  {explanationTextTopBlue}
                </div>
              )}
              {explanationTextTopPlain && (
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 200,
                    margin: '6px 0 0 0',
                  }}
                >
                  {explanationTextTopPlain}
                </div>
              )}
            </ExplanationTextTop>
            <ExplanationTextBottom>
              {explanationTextBottomBlue && (
                <div
                  style={{
                    color: '#2e3c5d',
                    fontSize: '18px',
                    fontWeight: 600,
                    margin: '6px 0 0 0',
                  }}
                >
                  {explanationTextBottomBlue}
                </div>
              )}
              {explanationTextBottomPlain && (
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 200,
                    margin: '6px 0 0 0',
                  }}
                >
                  {explanationTextBottomPlain}
                </div>
              )}
            </ExplanationTextBottom>
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
                    disabled={!(previousStep)}
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
                    id="personalizedScoreIntroModalNextButton"
                    disabled={!(nextStep || showPersonalizedScoreIntroCompletedButton)}
                    variant="contained"
                    onClick={showPersonalizedScoreIntroCompletedButton ? this.personalizedScoreIntroCompleted : this.clickNextStepButton}
                  >
                    {actionButtonText}
                  </Button>
                </div>
              </TwoButtonsWrapper>
            </ContinueButtonWrapper>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
const styles = () => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 576px)': {
      maxWidth: '600px',
      width: '90%',
      height: '600px',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      transitionDuration: '.25s',
    },
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: '90%',
    maxHeight: '90%',
    height: '90%',
    margin: '0 auto',
    padding: '0 !important',
  },
  dialogContent: {
    background: 'white',
    margin: '0 20px 20px 20px',
    padding: '0 !important',
    position: 'relative',
  },
  explanationTextMain: {
    color: '#2e3c5d',
    fontSize: '22px',
    fontWeight: 600,
    margin: '6px 0 0 0',
  },
  closeButton: {
  },
  actionButtonRoot: {
    margin: 'auto',
  },
  backButtonRoot: {
    width: '95%',
  },
  nextButtonRoot: {
    width: '100%',
  },
});

const CandidateItemOuterWrapper = styled.div`
`;

const ContinueButtonWrapper = styled.div`
  align-items: center;
  bottom: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: absolute;
`;

const ExplanationTextBottom = styled.div`
`;

const ExplanationTextTop = styled.div`
`;

const IconButtonWrapper = styled.div`
  margin: 4px 0 12px 0;
`;

const ModalTitleArea = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
`;

const Title = styled.div`
  color: black;
  font-size: 24px;
  font-weight: bold;
  margin: 0 12px;
  width: 100%;
  @media (max-width: 769px) {
    font-size: 16px;
  }
`;

const TwoButtonsWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0;
  width: 100%;
`;

export default withTheme(withStyles(styles)(PersonalizedScoreIntroModal));
