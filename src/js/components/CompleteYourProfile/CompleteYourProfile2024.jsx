import React, { Component, Suspense } from 'react';
import { renderLog } from '../../common/utils/logging';
import VoterConstants from '../../constants/VoterConstants';
import AppObservableStore from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import HowItWorksWizard from './HowItWorksWizard';

const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../../common/components/SignIn/SignInModal'));

class CompleteYourProfile2024 extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeStep: 1,
      ballotRemainingChoicesLength: 0, // If there aren't any remaining ballot choices, hide the onboarding.
      goToNextIncompleteStepForced: false,
      howItWorksWatched: false,
      personalizedScoreIntroCompleted: false,
      showSignInModal: false,
      stepIdHowItWorks: 1,
      stepIdPersonalizedScore: 2,
      stepIdSignInToSave: 3,
      steps: [],
    };

    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setState({
      ballotLength: BallotStore.ballotLength,
      ballotRemainingChoicesLength: BallotStore.ballotRemainingChoicesLength,
      goToNextIncompleteStepForced: true,
      // textForMapSearch: VoterStore.getTextForMapSearch(),
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
      // textForMapSearch: VoterStore.getTextForMapSearch(),
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    }, () => this.updateStepsArray());
  }

  setCompletedStatus = () => {
    const { stepIdHowItWorks, stepIdPersonalizedScore, stepIdSignInToSave } = this.state; // stepIdEnterFullAddress, stepIdValuesIntro
    const howItWorksWatched = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    if (howItWorksWatched) {
      this.setItemComplete(stepIdHowItWorks);
    } else {
      this.setItemNotComplete(stepIdHowItWorks);
    }
    const personalizedScoreIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    if (personalizedScoreIntroCompleted) {
      this.setItemComplete(stepIdPersonalizedScore);
    } else {
      this.setItemNotComplete(stepIdPersonalizedScore);
    }
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    if (voterIsSignedIn) {
      this.setItemComplete(stepIdSignInToSave);
    } else {
      this.setItemNotComplete(stepIdSignInToSave);
    }
    this.setState({
      howItWorksWatched,
      personalizedScoreIntroCompleted,
    }, () => this.sortSteps());
  }

  setItemComplete (stepItemIdToMarkComplete) {
    const { steps } = this.state;
    let oneStepModified;
    const newSteps = steps.map((oneStep) => {
      if (oneStep.id === stepItemIdToMarkComplete) {
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
    const { steps } = this.state;
    let oneStepModified;
    const newSteps = steps.map((oneStep) => {
      if (oneStep.id === stepItemIdToMarkNotComplete) {
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
    const ballotItemChoicesCount = voterOpposesListLength + voterSupportsListLength;
    let stepIdHowItWorks = 1;
    let stepIdPersonalizedScore = 2;
    let stepIdSignInToSave = 3;
    if (ballotItemChoicesCount >= 4 && !voterIsSignedIn) {
      stepIdSignInToSave = 1;
      stepIdHowItWorks = 2;
      stepIdPersonalizedScore = 3;
    }
    this.setState({
      stepIdHowItWorks,
      stepIdPersonalizedScore,
      stepIdSignInToSave,
      steps: [
        {
          id: stepIdHowItWorks,
          title: 'How WeVote works',
          buttonText: '',
          completed: false,
          description: '',
          onClick: this.openHowItWorksModal,
          titleCanBeClicked: true,
          width: '33.33%',
        },
        {
          id: stepIdPersonalizedScore,
          title: 'Your personalized score',
          buttonText: '',
          completed: false,
          description: '',
          onClick: this.openPersonalizedScoreIntroModal,
          titleCanBeClicked: true,
          width: '33.33%',
        },
        {
          id: stepIdSignInToSave,
          title: voterIsSignedIn ? 'Your ballot choices and settings are saved' : 'Sign in or join to save your ballot choices/settings',
          buttonText: voterIsSignedIn ? '' : 'Sign up to save choices',
          completed: false,
          description: '',
          onClick: this.toggleShowSignInModal,
          titleCanBeClicked: !voterIsSignedIn,
          width: '33.33%',
        },
      ],
    }, () => this.setCompletedStatus());
  }

  openHowItWorksModal = () => {
    AppObservableStore.setShowHowItWorksModal(true);
  }

  openPersonalizedScoreIntroModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowPersonalizedScoreIntroModal(true);
  }

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
    if (steps[currentIndex + 1]) {
      this.setState({
        activeStep: steps[currentIndex + 1].id,
      });
    }
  }

  sortSteps () {
    function compare (a, b) {
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
    renderLog('CompleteYourProfile2024');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      activeStep, ballotLength, ballotRemainingChoicesLength,
      howItWorksWatched, personalizedScoreIntroCompleted,
      showSignInModal,
      steps,
      voterIsSignedIn,
    } = this.state;

    // If we have completed all the steps, don't render this component
    const allStepsHaveBeenCompleted = howItWorksWatched && personalizedScoreIntroCompleted && voterIsSignedIn;
    // Prior: (addressIntroCompleted || addressIntroCompletedByCookie) && howItWorksWatched && personalizedScoreIntroCompleted && valuesIntroCompleted && voterIsSignedIn
    const showCompleteYourProfileForDebugging = false;
    if (showCompleteYourProfileForDebugging) {
      // Pass by this OFF switch so we render this component
    } else if (allStepsHaveBeenCompleted) {
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
              signInTitle="Sign in or join to save your ballot choices/settings"
              signInSubTitle=""
              toggleOnClose={this.toggleShowSignInModal}
              uponSuccessfulSignIn={this.toggleShowSignInModal}
            />
          </Suspense>
        )}

        <HowItWorksWizard steps={steps} activeStep={activeStep} />
      </div>
    );
  }
}

export default CompleteYourProfile2024;
