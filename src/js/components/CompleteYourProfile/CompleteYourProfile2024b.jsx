import { PlayCircleFilled, PushPin } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import VoterConstants from '../../constants/VoterConstants';
import AppObservableStore from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';

class CompleteYourProfile extends Component {
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

  // Steps: options, friends
  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setState({
      ballotLength: BallotStore.ballotLength,
      ballotRemainingChoicesLength: BallotStore.ballotRemainingChoicesLength,
      goToNextIncompleteStepForced: true,
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
    this.setState({
      goToNextIncompleteStepForced: true,
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
          title: 'Watch how it works (no sound)',
          buttonText: '',
          completed: false,
          description: '',
          icon: (<PlayCircleFilled />),
          onClick: this.openHowItWorksModal,
          titleCanBeClicked: true,
        },
        {
          id: stepIdPersonalizedScore,
          title: 'What\'s a personalized score?',
          buttonText: '',
          completed: false,
          description: '',
          icon: (<PersonalizedScorePlusOne>+1</PersonalizedScorePlusOne>),
          onClick: this.openPersonalizedScoreIntroModal,
          titleCanBeClicked: true,
        },
        {
          id: stepIdSignInToSave,
          title: voterIsSignedIn ? 'Your ballot choices and settings are saved' : 'Sign in or sign up to save your ballot choices and settings',
          buttonText: voterIsSignedIn ? '' : 'Sign up to save choices',
          completed: false,
          description: '',
          icon: (<PushPin />),
          onClick: this.toggleShowSignInModal,
          titleCanBeClicked: !voterIsSignedIn,
        },
      ],
    }, () => this.setCompletedStatus());
  }

  openHowItWorksModal = () => {
    // console.log('Opening modal');
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
    if (goToNextIncompleteStepForced) {
      this.goToNextIncompleteStep();
    }
    this.setState({
      goToNextIncompleteStepForced: false,
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
    const {
      ballotLength, ballotRemainingChoicesLength,
      howItWorksWatched, personalizedScoreIntroCompleted,
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
        <HowItWorksContainer>
          <Step />
        </HowItWorksContainer>
      </div>
    );
  }
}
CompleteYourProfile.propTypes = {
  // classes: PropTypes.object,
};
const styles = () => ({
  navigationButton: {
    opacity: '0.8',
    fontWeight: 400,
  },
});

const HowItWorksContainer = styled('div')`
  width: 458px;
  height: 168px;
  border-radius: 10px;
  border: 1px solid #B0B0B0;
  background: #E6F3FF;
`;

const Step = styled('div', {
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

export default withTheme(withStyles(styles)(CompleteYourProfile));
