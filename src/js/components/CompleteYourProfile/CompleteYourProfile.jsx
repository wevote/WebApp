import { CheckCircle, PlayCircleFilled, PushPin } from '@mui/icons-material';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { Component, Suspense } from 'react';
import Cookies from '../../common/utils/js-cookie/Cookies';
import { renderLog } from '../../common/utils/logging';
// import normalizedImagePath from '../../common/utils/normalizedImagePath';
import VoterConstants from '../../constants/VoterConstants';
import AppObservableStore from '../../stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
// import { Ballot } from '@mui/icons-material';
// import { ThumbUp } from '@mui/icons-material';

const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../SignIn/SignInModal'));

// const findAdvisorsId = 4;
class CompleteYourProfile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeStep: 1,
      addressIntroCompleted: false,
      ballotRemainingChoicesLength: 0, // If there aren't any remaining ballot choices, hide the onboarding.
      // firstPositionIntroCompleted: false,
      goToNextIncompleteStepForced: false,
      howItWorksWatched: false,
      personalizedScoreIntroCompleted: false,
      showSignInModal: false,
      stepIdHowItWorks: 1,
      // stepIdValuesIntro: 2,
      // stepIdEnterFullAddress: 3,
      stepIdPersonalizedScore: 2,
      stepIdSignInToSave: 3,
      steps: [],
      valuesIntroCompleted: false,
      textForMapSearch: '',
    };

    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  // Steps: options, friends
  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setState({
      ballotLength: BallotStore.ballotLength,
      ballotRemainingChoicesLength: BallotStore.ballotRemainingChoicesLength,
      goToNextIncompleteStepForced: true,
      textForMapSearch: VoterStore.getTextForMapSearch(),
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    }, () => this.updateStepsArray());
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onBallotStoreChange () {
    this.setState({
      ballotLength: BallotStore.ballotLength,
      ballotRemainingChoicesLength: BallotStore.ballotRemainingChoicesLength,
    });
  }

  onSupportStoreChange () {
    // ballotRemainingChoicesLength does a lookup from the SupportStore
    this.setState({
      ballotLength: BallotStore.ballotLength,
      ballotRemainingChoicesLength: BallotStore.ballotRemainingChoicesLength,
      goToNextIncompleteStepForced: true,
    }, () => this.updateStepsArray());
  }

  onVoterStoreChange () {
    // console.log('CompleteYourProfile onVoterStoreChange');
    this.setState({
      goToNextIncompleteStepForced: true,
      textForMapSearch: VoterStore.getTextForMapSearch(),
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    }, () => this.updateStepsArray());
  }

  setCompletedStatus = () => {
    const { stepIdEnterFullAddress, stepIdHowItWorks, stepIdPersonalizedScore, stepIdSignInToSave, stepIdValuesIntro } = this.state;
    const howItWorksWatched = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    if (howItWorksWatched) {
      this.setItemComplete(stepIdHowItWorks);
    } else {
      this.setItemNotComplete(stepIdHowItWorks);
    }
    const valuesIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.VALUES_INTRO_COMPLETED);
    if (valuesIntroCompleted) {
      this.setItemComplete(stepIdValuesIntro);
    } else {
      this.setItemNotComplete(stepIdValuesIntro);
    }
    // const adviserIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_ORGANIZATIONS_COMPLETED);
    // if (adviserIntroCompleted) {
    //   this.setItemComplete(findAdvisorsId);
    // } else {
    //   this.setItemNotComplete(findAdvisorsId);
    // }
    const addressIntroCompletedByCookie = Cookies.get('location_guess_closed');
    const { addressIntroCompleted } = this.state;
    if (addressIntroCompleted || addressIntroCompletedByCookie) {
      this.setItemComplete(stepIdEnterFullAddress);
    } else {
      this.setItemNotComplete(stepIdEnterFullAddress);
    }
    const personalizedScoreIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    if (personalizedScoreIntroCompleted) {
      this.setItemComplete(stepIdPersonalizedScore);
    } else {
      this.setItemNotComplete(stepIdPersonalizedScore);
    }
    // const firstPositionIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_POSITIONS_COMPLETED);
    // const firstPositionIntroCompletedId = 5;
    // if (firstPositionIntroCompleted) {
    //   this.setItemComplete(firstPositionIntroCompletedId);
    // } else {
    //   this.setItemNotComplete(firstPositionIntroCompletedId);
    // }
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    if (voterIsSignedIn) {
      this.setItemComplete(stepIdSignInToSave);
    } else {
      this.setItemNotComplete(stepIdSignInToSave);
    }
    this.setState({
      // adviserIntroCompleted,
      // firstPositionIntroCompleted,
      howItWorksWatched,
      personalizedScoreIntroCompleted,
      valuesIntroCompleted,
    }, () => this.sortSteps());
  }

  setItemComplete (stepItemIdToMarkComplete) {
    // console.log('Setting complete!');
    const { steps } = this.state;
    let oneStepModified;
    const newSteps = steps.map((oneStep) => {
      if (oneStep.id === stepItemIdToMarkComplete) {
        // console.log('Item to mark complete: ', oneStep);
        oneStepModified = oneStep;
        oneStepModified.completed = true;
        return oneStepModified;
      } else {
        return oneStep;
      }
    });
    this.setState({ steps: newSteps });
    this.goToNextIncompleteStep();
  }

  setItemNotComplete (stepItemIdToMarkNotComplete) {
    // console.log('Setting not complete!');
    const { steps } = this.state;
    let oneStepModified;
    const newSteps = steps.map((oneStep) => {
      if (oneStep.id === stepItemIdToMarkNotComplete) {
        // console.log('Item to mark not complete: ', oneStep);
        oneStepModified = oneStep;
        oneStepModified.completed = false;
        return oneStepModified;
      } else {
        return oneStep;
      }
    });
    this.setState({ steps: newSteps });
  }

  updateStepsArray = () => {
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    const voterOpposesListLength = SupportStore.getVoterOpposesListLength();
    const voterSupportsListLength = SupportStore.getVoterSupportsListLength();
    // console.log('voterIsSignedIn:, ', voterIsSignedIn, ', voterOpposesListLength:', voterOpposesListLength, ', voterSupportsListLength:', voterSupportsListLength);
    const ballotItemChoicesCount = voterOpposesListLength + voterSupportsListLength;
    let stepIdHowItWorks = 1;
    // let stepIdValuesIntro = 2;
    // let stepIdEnterFullAddress = 3;
    let stepIdPersonalizedScore = 2;
    let stepIdSignInToSave = 3;
    if (ballotItemChoicesCount >= 4 && !voterIsSignedIn) {
      stepIdSignInToSave = 1;
      stepIdHowItWorks = 2;
      // stepIdValuesIntro = 3;
      // stepIdEnterFullAddress = 4;
      stepIdPersonalizedScore = 3;
    }
    this.setState({
      stepIdHowItWorks,
      // stepIdValuesIntro,
      // stepIdEnterFullAddress,
      stepIdPersonalizedScore,
      stepIdSignInToSave,
      steps: [
        {
          id: stepIdHowItWorks,
          title: 'Watch how it works (no sound)',
          buttonText: 'How We Vote works',
          completed: false,
          description: '',
          icon: (<PlayCircleFilled />),
          onClick: this.openHowItWorksModal,
        },
        // {
        //   id: stepIdValuesIntro,
        //   title: 'Topics that match your values',
        //   buttonText: 'Choose topics',
        //   completed: false,
        //   description: '',
        //   icon: (<img alt="" src={normalizedImagePath('/img/global/svg-icons/issues/climate-change-24.svg')} />),
        //   onClick: this.openValuesIntroModal,
        // },
        // {
        //   id: findAdvisorsId,
        //   title: 'Find people and groups you trust',
        //   buttonText: 'Find Advisers',
        //   completed: false,
        //   description: '',
        //   icon: (<ThumbUp />),
        //   onClick: this.openAdviserIntroModal,
        // },
        // {
        //   id: stepIdEnterFullAddress,
        //   title: 'Enter your full address to see the correct ballot items.',
        //   buttonText: 'Confirm address',
        //   completed: false,
        //   description: '',
        //   icon: (<EditLocation />),
        //   onClick: this.openAddressIntroModal,
        // },
        {
          id: stepIdPersonalizedScore,
          title: 'What\'s a personalized score?',
          buttonText: 'Learn more',
          completed: false,
          description: '',
          icon: (<PersonalizedScorePlusOne>+1</PersonalizedScorePlusOne>),
          onClick: this.openPersonalizedScoreIntroModal,
        },
        // {
        //   id: 5,
        //   title: 'What do you mean by \'Choose\' and \'Oppose\'?',
        //   buttonText: 'Learn Now',
        //   completed: false,
        //   description: '',
        //   icon: (<BallotIcon />),
        //   onClick: this.openFirstPositionIntroModal,
        // },
        {
          id: stepIdSignInToSave,
          title: 'Sign in to save your ballot choices and settings',
          buttonText: 'Sign in to save',
          completed: false,
          description: '',
          icon: (<PushPin />),
          onClick: this.toggleShowSignInModal,
        },
      ],
    }, () => this.setCompletedStatus());
  }

  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowHowItWorksModal(true);
  }

  openValuesIntroModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowValuesIntroModal(true);
  }

  openAddressIntroModal = () => {
    const { stepIdEnterFullAddress } = this.state;
    Cookies.set('location_guess_closed', '1', { expires: 31, path: '/' });
    this.setState({
      addressIntroCompleted: true,
    });
    AppObservableStore.setShowSelectBallotModal(true, true);
    this.setItemComplete(stepIdEnterFullAddress);
  }

  // openAdviserIntroModal = () => {
  //   // console.log('Opening modal');
  //   AppObservableStore.setShowAdviserIntroModal(true);
  // }

  openPersonalizedScoreIntroModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowPersonalizedScoreIntroModal(true);
  }

  // openFirstPositionIntroModal = () => {
  //   // console.log('Opening modal');
  //   AppObservableStore.setShowFirstPositionIntroModal(true);
  // }

  goToNextIncompleteStep = () => {
    const { steps } = this.state;
    const notCompletedSteps = steps.filter((oneStep) => !oneStep.completed);
    if (notCompletedSteps && notCompletedSteps[0]) {
      this.setState({
        activeStep: notCompletedSteps[0].id,
      });
    }
  }

  goToNextIncompleteStepIfForced = () => {
    const { goToNextIncompleteStepForced } = this.state;
    // console.log('goToNextIncompleteStepForced:', goToNextIncompleteStepForced);
    if (goToNextIncompleteStepForced) {
      this.goToNextIncompleteStep();
    }
    this.setState({
      goToNextIncompleteStepForced: false,
    });
  }

  goToStep = (stepId) => {
    this.sortSteps();
    this.setState({
      activeStep: stepId,
    });
  }

  toggleShowSignInModal = () => {
    const { showSignInModal } = this.state;
    this.setState({
      showSignInModal: !showSignInModal,
    });
  }

  previousStep () {
    this.sortSteps();
    const { steps } = this.state;
    const currentIndex = steps.map((oneStep) => oneStep.id).indexOf(this.state.activeStep);
    // console.log('currentIndex: ', currentIndex);
    if (currentIndex >= 1) {
      this.setState({
        activeStep: steps[currentIndex - 1].id,
      });
    }
  }

  nextStep () {
    this.sortSteps();
    const { steps } = this.state;
    const currentIndex = steps.map((e) => e.id).indexOf(this.state.activeStep);
    // console.log('currentIndex: ', currentIndex);
    if (steps[currentIndex + 1]) {
      this.setState({
        activeStep: steps[currentIndex + 1].id,
      });
    }
  }

  sortSteps () {
    function compare (a, b) {
      // Use toUpperCase() to ignore character casing
      const itemA = a;
      const itemB = b;

      let comparison = 0;
      if (itemA.id > itemB.id) {
        comparison = 1;
      } else if (itemA.id < itemB.id) {
        comparison = -1;
      }
      return comparison;
    }

    const completed = this.state.steps.filter((oneStep) => oneStep.completed);
    const notCompleted = this.state.steps.filter((oneStep) => !oneStep.completed);

    if (completed) {
      completed.sort(compare);
    }
    if (notCompleted) {
      notCompleted.sort(compare);
    }
    const all = [...completed, ...notCompleted];
    this.setState({ steps: all }, () => this.goToNextIncompleteStepIfForced());
  }

  render () {
    renderLog('CompleteYourProfile');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('CompleteYourProfile render');
    const { classes } = this.props;
    const {
      activeStep, addressIntroCompleted, ballotLength, ballotRemainingChoicesLength,
      // firstPositionIntroCompleted,
      howItWorksWatched, personalizedScoreIntroCompleted,
      showSignInModal,
      stepIdEnterFullAddress, steps,
      textForMapSearch, valuesIntroCompleted, voterIsSignedIn,
    } = this.state;
    const addressIntroCompletedByCookie = Cookies.get('location_guess_closed');
    // console.log('activeStep: ', activeStep);
    // console.log('steps: ', steps);

    // If we have completed all the steps, don't render this component
    const showCompleteYourProfileForDebugging = false;
    if (showCompleteYourProfileForDebugging) {
      // Pass by this OFF switch so we render this component
    } else if ((addressIntroCompleted || addressIntroCompletedByCookie) && howItWorksWatched && personalizedScoreIntroCompleted && valuesIntroCompleted && voterIsSignedIn) {
      // If we have done all the steps, do not render CompleteYourProfile // OFF FOR NOW: adviserIntroCompleted && firstPositionIntroCompleted &&
      return null;
    } else if (ballotLength > 0 && ballotRemainingChoicesLength === 0) {
      return null;
    }

    return (
      <div>
        {(showSignInModal && !VoterStore.getVoterIsSignedIn()) && (
          <Suspense fallback={<></>}>
            <SignInModal
              signInTitle="Sign in to save your ballot choices and settings."
              signInSubTitle=""
              toggleOnClose={this.toggleShowSignInModal}
              uponSuccessfulSignIn={this.toggleShowSignInModal}
            />
          </Suspense>
        )}
        <Flex>
          <span>
            <strong>
              {steps.filter((oneStep) => oneStep.completed).length }
              {' '}
              of
              {' '}
              {steps.length}
            </strong>
            {' '}
            <Info>actions </Info>
            completed
          </span>
          <Indicators>
            {steps.map((step) => (
              <Indicator
                active={step.id === activeStep}
                complete={step.completed}
                key={`completeYourProfileIndicator-${step.id}`}
                id={`completeYourProfileIndicator-${step.id}`}
                onClick={() => this.goToStep(step.id)}
              />
            ))}
          </Indicators>
        </Flex>
        <Separator />
        {steps.map((step, index) => {
          if (step.id === activeStep) {
            return (
              <Description key={`completeYourProfileDescription-${step.id}`}>
                <Icon className="u-show-desktop-tablet" id="completeYourProfileDescriptionIcon" onClick={() => { step.onClick(); }}>
                  {step.icon}
                </Icon>
                <TitleArea id="completeYourProfileTitleArea" onClick={() => { step.onClick(); }}>
                  <Icon className="u-show-mobile">
                    {step.icon}
                  </Icon>
                  <TitleFlex>
                    <Title>
                      {step.title}
                    </Title>
                    {textForMapSearch && step.id === stepIdEnterFullAddress &&
                      (
                        <YourLocation>
                          {' '}
                          Our best guess for your location is
                          {' '}
                          <BestGuess>
                            &quot;
                            {textForMapSearch}
                            &quot;
                          </BestGuess>
                          .
                          {' '}
                        </YourLocation>
                      )}
                    {step.completed && (
                      <Completed>
                        <CheckCircle />
                        {' '}
                        Completed
                      </Completed>
                    )}
                  </TitleFlex>
                  {step.description}
                </TitleArea>
                {/*
                <TabletActionButton>
                  <Button
                    className="u-no-break"
                    id="completeYourProfileDesktopButton"
                    color="primary"
                    fullWidth
                    onClick={() => { step.onClick(); }}
                    variant="contained"
                  >
                    {step.buttonText}
                  </Button>
                </TabletActionButton>
                <MobileActionButton>
                  <Button
                    className="u-no-break"
                    id="completeYourProfileMobileButton"
                    color="primary"
                    fullWidth
                    onClick={() => { step.onClick(); }}
                    variant="contained"
                  >
                    {step.buttonText}
                  </Button>
                </MobileActionButton>
                */}
                <NavButtons>
                  <NavButton>
                    {index !== 0 && (
                      <Button
                        classes={{ root: classes.navigationButton }}
                        className="u-no-break"
                        id="completeYourProfilePreviousButton"
                        onClick={this.previousStep}
                        color="primary"
                      >
                        {'< Previous'}
                      </Button>
                    )}
                  </NavButton>
                  <NavButton>
                    {index < (steps.length - 1) ? (
                      <Button
                        classes={{ root: classes.navigationButton }}
                        className="u-no-break"
                        color="primary"
                        id="completeYourProfileNextButton"
                        onClick={this.nextStep}
                      >
                        {'Next >'}
                      </Button>
                    ) : (
                      <NextButtonPlaceholder />
                    )}
                  </NavButton>
                </NavButtons>
              </Description>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}
CompleteYourProfile.propTypes = {
  classes: PropTypes.object,
};
const styles = () => ({
  navigationButton: {
    opacity: '0.8',
    fontWeight: 400,
  },
});

const BestGuess = styled('span')`
  font-weight: bold;
`;

const Completed = styled('div')`
  color: green;
  margin-left: -2px;
  & * {
    width: 15px !important;
    height: 15px !important;
    position: relative;
    top: -2px;
  }
`;

const Description = styled('div')`
  @media (min-width: 769px) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    // margin: 14px 0 8px;
  }
`;

const Flex = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const Icon = styled('div')`
  cursor: pointer;
  display: inline-block;
  width: 35px;
  height: 35px;
  @media (min-width: 576px) and (max-width: 769px) {
    margin-bottom: 12px;
  }
  margin-right: 8px;
  * {
    height: 35px !important;
    width: 35px !important;
    fill: #2E3C5D;
  }
`;

const Indicators = styled('div')`
  align-items: center;
  display: flex;
  flex: 1 1 0;
  margin-left: 8px;
`;

const Indicator = styled('div', {
  shouldForwardProp: (prop) => !['complete', 'active'].includes(prop),
})(({ complete, active }) => (`
  cursor: pointer;
  flex: 1 1 0;
  height: 8px;
  margin: 0 4px;
  ${complete && active ? 'background: rgb(31,192,111); border-bottom: 2px solid #2E3C5D;' : ''}
  ${complete && !active ? 'background: rgb(31,192,111);' : ''}
  ${!complete && active ? 'background: #e1e1e1; border-bottom: 2px solid #2E3C5D;' : ''}
  ${!complete && !active ? 'background: #e1e1e1;' : ''}
`));

const Info = styled('span')`
  display: none;
  @media(min-width: 525px) {
    display: inline;
  }
`;

// const MobileActionButton = styled('div')`
//   border-bottom: 1px solid #e1e1e1;
//   margin-bottom: 0;
//   margin-top: 8px;
//   padding-bottom: 8px;
//   @media (min-width: 576px) {
//     display: none;
//   }
// `;

const NavButton = styled('div')`
  * {
    font-weight: bold;
  }
`;

const NavButtons = styled('div')`
  align-items: center;
  display: flex;
  // margin-top: 12px;
  justify-content: space-between;
  @media (min-width: 769px) {
    width: fit-content;
    margin-left: auto;
    // margin-right: auto;
    margin-top: 0;
  }
`;

const NextButtonPlaceholder = styled('div')`
  width: 64px;
`;

const PersonalizedScorePlusOne = styled('div')`
  align-items: center;
  background: #2E3C5D;
  border-radius: 5px;
  color: white;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  width: 40px;
  height: 40px;
  @media print{
    border: 2px solid grey;
  }
`;

const Separator = styled('div')`
  background: #e1e1e1;
  margin: 8px auto;
  width: 100%;
  height: 1px;
`;

// const TabletActionButton = styled('div')`
//   display: none;
//   @media(min-width: 576px) {
//     display: block;
//     margin-left: auto;
//   }
//   @media(min-width: 769px) {
//     margin-left: 12px;
//   }
// `;

const Title = styled('h2')`
  color: #4371CC;
  display: inline-block;
  margin: 0;
  text-decoration: underline;
  text-decoration-color: #ccc;
`;

const TitleArea = styled('div')`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  @media (min-width: 576px) {
    display: inline-block;
    margin: auto 0;
  }
`;

const TitleFlex = styled('div')`
  display: inline-block;
  // margin: 2px 0 0 0;
  margin-right: 8px;
`;

const YourLocation = styled('span')`
`;

export default withTheme(withStyles(styles)(CompleteYourProfile));
