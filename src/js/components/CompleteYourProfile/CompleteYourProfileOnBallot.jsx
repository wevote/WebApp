import React, { Component, Suspense } from 'react';
import TagManager from 'react-gtm-module';
import { renderLog } from '../../common/utils/logging';
import VoterConstants from '../../constants/VoterConstants';
import AppObservableStore from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import CompleteYourProfileWizard from './CompleteYourProfileWizard';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';

const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../../common/components/SignIn/SignInModal'));

class CompleteYourProfileOnBallot extends Component {
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
    // Track component load/impression for analytics
    const dataLayerObject = {
      actionDetails: {
        actionType: 'landing',
        componentName: 'CompleteYourProfile2024',
      },
      event: 'landing',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    // console.log('CompleteYourProfile2024 component loaded:', dataLayerObject);
    TagManager.dataLayer({ dataLayer: dataLayerObject });
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
    this.setState({
      stepIdHowItWorks: 1,
      stepIdPersonalizedScore: 2,
      stepIdSignInToSave: 3,
      steps: [
        {
          id: 1,
          title: 'How WeVote works',
          buttonText: '',
          completed: false,
          description: '',
          onClick: this.openHowItWorksModal,
          titleCanBeClicked: true,
          width: '33.33%',
        },
        {
          id: 2,
          title: 'Your personalized score',
          buttonText: '',
          completed: false,
          description: '',
          onClick: this.openPersonalizedScoreIntroModal,
          titleCanBeClicked: true,
          width: '33.33%',
        },
        {
          id: 3,
          title: voterIsSignedIn ? 'Your ballot choices and settings are saved' : 'Sign in or join to save your ballot choices/settings',
          buttonText: voterIsSignedIn ? '' : 'Sign up to save choices',
          completed: false,
          description: '',
          onClick: this.toggleShowSignInModal,
          titleCanBeClicked: !voterIsSignedIn,
          width: '33.33%',
        },
      ],
    }, () => {
      this.setCompletedStatus();
    });
  }

  openHowItWorksModal = () => {
    // console.log('openHowItWorksModal called');

    AppObservableStore.setShowHowItWorksModal(true);

    // Add dataLayer tracking
    const { location: { pathname: currentPathname } } = window;
    const currentPage = lookupPageNameAndPageTypeDict(currentPathname);

    const dataLayerObject = {
      actionDetails: {
        actionType: 'openModal',
        buttonId: 'howWeVoteWorksStep',
      },
      event: 'action',
      destinationDetails: {
        destinationPageName: 'HowItWorksModal',
        destinationPageType: currentPage.pageType, // Use same pageType as current page
        destinationPathname: currentPathname,
      },
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    // console.log('openHowItWorksModal dataLayer:', dataLayerObject);
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  openPersonalizedScoreIntroModal = () => {
    // console.log('openPersonalizedScoreIntroModal called');
    AppObservableStore.setShowPersonalizedScoreIntroModal(true);
    // Add dataLayer tracking
    const { location: { pathname: currentPathname } } = window;
    const currentPage = lookupPageNameAndPageTypeDict(currentPathname);

    const dataLayerObject = {
      actionDetails: {
        actionType: 'openModal',
        buttonId: 'yourPersonalizedScoreStep',
      },
      event: 'action',
      destinationDetails: {
        destinationPageName: 'PersonalizedScoreIntroModal',
        destinationPageType: currentPage.pageType,
        destinationPathname: currentPathname,
      },
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    // console.log('openPersonalizedScoreIntroModal dataLayer:', dataLayerObject);
    TagManager.dataLayer({ dataLayer: dataLayerObject });
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
  }

  goToStep = (stepId) => {
    this.setState({
      activeStep: stepId,
    });
  }

  toggleShowSignInModal = () => {
    // Refactor to use:
    // AppObservableStore.setShowSignInModal(
    const { showSignInModal } = this.state;

    // console.log('toggleShowSignInModal called, current state:', showSignInModal);

    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();

    // Only track dataLayer when opening the modal (not closing)
    if (!showSignInModal && !voterIsSignedIn) {
      // Add dataLayer tracking
      const { location: { pathname: currentPathname } } = window;
      const currentPage = lookupPageNameAndPageTypeDict(currentPathname);

      const dataLayerObject = {
        actionDetails: {
          actionType: !showSignInModal ? 'openModal' : 'closeModal',
          buttonId: 'SignInToSaveStep',
        },
        event: 'action',
        destinationDetails: {
          destinationPageName: 'SignInModal',
          destinationPageType: currentPage.pageType,
          destinationPathname: currentPathname,
        },
        pageDetails: {
          pageName: 'CompleteYourProfileWizard',
          pageType: currentPage.pageType,
          pathname: currentPathname,
        },
        userDetails: VoterStore.getAnalyticsUserDetails(),
      };
      // console.log('toggleShowSignInModal dataLayer:', dataLayerObject);
      TagManager.dataLayer({ dataLayer: dataLayerObject });
    }

    this.setState({
      showSignInModal: !showSignInModal,
    });
  }

  previousStep () {
    const { steps } = this.state;
    const currentIndex = steps.map((oneStep) => oneStep.id).indexOf(this.state.activeStep);
    if (currentIndex >= 1) {
      this.setState({
        activeStep: steps[currentIndex - 1].id,
      });
    }
  }

  nextStep () {
    const { steps } = this.state;
    const currentIndex = steps.map((e) => e.id).indexOf(this.state.activeStep);
    if (steps[currentIndex + 1]) {
      this.setState({
        activeStep: steps[currentIndex + 1].id,
      });
    }
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

        <CompleteYourProfileWizard steps={steps} activeStep={activeStep} />
      </div>
    );
  }
}

export default CompleteYourProfileOnBallot;
