import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { PlayCircleFilled, EditLocation, CheckCircle } from '@material-ui/icons';
import AppActions from '../../actions/AppActions';
import BallotStore from '../../stores/BallotStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import VoterConstants from '../../constants/VoterConstants';
import { cordovaDot } from '../../utils/cordovaUtils';
import cookies from '../../utils/cookies';
import { renderLog } from '../../utils/logging';
// import BallotIcon from '@material-ui/icons/Ballot';
// import ThumbUp from '@material-ui/icons/ThumbUp';

class CompleteYourProfile extends Component {
  static propTypes = {
    // classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      activeStep: 1,
      addressIntroCompleted: false,
      ballotRemainingChoicesLength: 0, // If there aren't any remaining ballot choices, hide the onboarding.
      // firstPositionIntroCompleted: false,
      howItWorksWatched: false,
      personalizedScoreIntroCompleted: false,
      valuesIntroCompleted: false,
      steps: [
        {
          id: 1,
          title: 'Watch how it works (no sound)',
          buttonText: 'How We Vote Works',
          completed: false,
          description: '',
          icon: (<PlayCircleFilled />),
          onClick: this.openHowItWorksModal,
        },
        {
          id: 2,
          title: 'Interests that match your values',
          buttonText: 'Choose Interests',
          completed: false,
          description: '',
          icon: (<img alt="Choose Interests" src={cordovaDot('/img/global/svg-icons/issues/climate-change-24.svg')} />),
          onClick: this.openValuesIntroModal,
        },
        // {
        //   id: 3,
        //   title: 'Find people and groups you trust',
        //   buttonText: 'Find Advisers',
        //   completed: false,
        //   description: '',
        //   icon: (<ThumbUp />),
        //   onClick: this.openAdviserIntroModal,
        // },
        {
          id: 3,
          title: 'Enter your full address to see the correct ballot items.',
          buttonText: 'Confirm Address',
          completed: false,
          description: '',
          icon: (<EditLocation />),
          onClick: this.openAddressIntroModal,
        },
        {
          id: 4,
          title: 'What\'s a personalized score?',
          buttonText: 'Learn More',
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
      ],
      textForMapSearch: '',
    };

    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  // Steps: options, friends
  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onBallotStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setCompletedStatus();
    this.sortSteps();
    this.setState({
      ballotLength: BallotStore.ballotLength,
      ballotRemainingChoicesLength: BallotStore.ballotRemainingChoicesLength,
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
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
    });
  }

  onVoterStoreChange () {
    // console.log('CompleteYourProfile onVoterStoreChange');
    this.setCompletedStatus();
    this.sortSteps();
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
  }

  setCompletedStatus = () => {
    const howItWorksWatched = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    const howItWorksWatchedId = 1;
    if (howItWorksWatched) {
      this.setItemComplete(howItWorksWatchedId);
    } else {
      this.setItemNotComplete(howItWorksWatchedId);
    }
    const valuesIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.VALUES_INTRO_COMPLETED);
    const valuesIntroCompletedId = 2;
    if (valuesIntroCompleted) {
      this.setItemComplete(valuesIntroCompletedId);
    } else {
      this.setItemNotComplete(valuesIntroCompletedId);
    }
    // const adviserIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_ORGANIZATIONS_COMPLETED);
    // const adviserIntroCompletedId = 3;
    // if (adviserIntroCompleted) {
    //   this.setItemComplete(adviserIntroCompletedId);
    // } else {
    //   this.setItemNotComplete(adviserIntroCompletedId);
    // }
    const addressIntroCompletedByCookie = cookies.getItem('location_guess_closed');
    const { addressIntroCompleted } = this.state;
    const addressIntroCompletedId = 3;
    if (addressIntroCompleted || addressIntroCompletedByCookie) {
      this.setItemComplete(addressIntroCompletedId);
    } else {
      this.setItemNotComplete(addressIntroCompletedId);
    }
    const personalizedScoreIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    const personalizedScoreIntroCompletedId = 4;
    if (personalizedScoreIntroCompleted) {
      this.setItemComplete(personalizedScoreIntroCompletedId);
    } else {
      this.setItemNotComplete(personalizedScoreIntroCompletedId);
    }
    // const firstPositionIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_POSITIONS_COMPLETED);
    // const firstPositionIntroCompletedId = 5;
    // if (firstPositionIntroCompleted) {
    //   this.setItemComplete(firstPositionIntroCompletedId);
    // } else {
    //   this.setItemNotComplete(firstPositionIntroCompletedId);
    // }
    this.setState({
      // adviserIntroCompleted,
      // firstPositionIntroCompleted,
      howItWorksWatched,
      personalizedScoreIntroCompleted,
      valuesIntroCompleted,
    });
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

  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppActions.setShowHowItWorksModal(true);
  }

  openValuesIntroModal = () => {
    // console.log('Opening modal');
    AppActions.setShowValuesIntroModal(true);
  }

  openAddressIntroModal = () => {
    const oneMonthExpires = 86400 * 31;
    cookies.setItem('location_guess_closed', '1', oneMonthExpires, '/');
    this.setState({
      addressIntroCompleted: true,
    });
    AppActions.setShowSelectBallotModal(true);
    const addressIntroCompletedId = 3;
    this.setItemComplete(addressIntroCompletedId);
  }

  // openAdviserIntroModal = () => {
  //   // console.log('Opening modal');
  //   AppActions.setShowAdviserIntroModal(true);
  // }

  openPersonalizedScoreIntroModal = () => {
    // console.log('Opening modal');
    AppActions.setShowPersonalizedScoreIntroModal(true);
  }

  // openFirstPositionIntroModal = () => {
  //   // console.log('Opening modal');
  //   AppActions.setShowFirstPositionIntroModal(true);
  // }

  goToNextIncompleteStep = () => {
    const { steps } = this.state;
    const notCompletedSteps = steps.filter(oneStep => !oneStep.completed);
    if (notCompletedSteps && notCompletedSteps[0]) {
      this.setState({
        activeStep: notCompletedSteps[0].id,
      });
    }
  }

  goToStep = (stepId) => {
    this.sortSteps();
    this.setState({
      activeStep: stepId,
    });
  }

  previousStep () {
    this.sortSteps();
    const { steps } = this.state;
    const currentIndex = steps.map(oneStep => oneStep.id).indexOf(this.state.activeStep);
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
    const currentIndex = steps.map(e => e.id).indexOf(this.state.activeStep);
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

    const completed = this.state.steps.filter(oneStep => oneStep.completed);
    const notCompleted = this.state.steps.filter(oneStep => !oneStep.completed);

    if (completed) {
      completed.sort(compare);
    }
    if (notCompleted) {
      notCompleted.sort(compare);
    }
    const all = [...completed, ...notCompleted];
    this.setState({ steps: all });
  }

  render () {
    renderLog('CompleteYourProfile');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('CompleteYourProfile render');
    const {
      activeStep, addressIntroCompleted, ballotLength, ballotRemainingChoicesLength,
      // firstPositionIntroCompleted,
      howItWorksWatched, personalizedScoreIntroCompleted, steps,
      textForMapSearch, valuesIntroCompleted,
    } = this.state;
    const addressIntroCompletedByCookie = cookies.getItem('location_guess_closed');
    // console.log('activeStep: ', activeStep);
    // console.log('steps: ', steps);

    // If we have completed all of the steps, don't render this component
    const showCompleteYourProfileForDebugging = false;
    if (showCompleteYourProfileForDebugging) {
      // Pass by this OFF switch so we render this component
    } else if ((addressIntroCompleted || addressIntroCompletedByCookie) && howItWorksWatched && personalizedScoreIntroCompleted && valuesIntroCompleted) {
      // If we have done all of the steps, do not render CompleteYourProfile // OFF FOR NOW: adviserIntroCompleted && firstPositionIntroCompleted &&
      return null;
    } else if (ballotLength > 0 && ballotRemainingChoicesLength === 0) {
      return null;
    }

    return (
      <>
        <div className="card">
          <div className="card-main">
            <Flex>
              <span>
                <strong>
                  {steps.filter(oneStep => oneStep.completed).length }
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
                {steps.map(step => (
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
                        {textForMapSearch && step.id === 3 &&
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
                          )
                        }
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
                    <NavButtons>
                      <NavButton>
                        {index !== 0 && (
                          <Button id="completeYourProfilePreviousButton" onClick={this.previousStep} className="u-no-break" color="primary">
                            {'< Previous'}
                          </Button>
                        )}
                      </NavButton>
                      <NavButton>
                        {index < (steps.length - 1) ? (
                          <Button id="completeYourProfileNextButton" onClick={this.nextStep} className="u-no-break" color="primary">
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
        </div>
      </>
    );
  }
}
const styles = () => ({
});

const BestGuess = styled.span`
  font-weight: bold;
`;

const Completed = styled.div`
  color: green;
  margin-left: -2px;
  & * {
    width: 15px !important;
    height: 15px !important;
    position: relative;
    top: -2px;
  }
`;

const Description = styled.div`
  @media (min-width: 769px) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    // margin: 14px 0 8px;
  }
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Icon = styled.div`
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

const Indicators = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 0;
  margin-left: 8px;
`;

const Indicator = styled.div`
  cursor: pointer;
  flex: 1 1 0;
  height: 8px;
  margin: 0 4px;
  ${props => (props.complete && props.active ? 'background: rgb(31,192,111); border-bottom: 2px solid #2E3C5D;' : '')}
  ${props => (props.complete && !props.active ? 'background: rgb(31,192,111);' : '')}
  ${props => (!props.complete && props.active ? 'background: #e1e1e1; border-bottom: 2px solid #2E3C5D;' : '')}
  ${props => (!props.complete && !props.active ? 'background: #e1e1e1;' : '')}
`;

const Info = styled.span`
  display: none;
  @media(min-width: 525px) {
    display: inline;
  }
`;

const MobileActionButton = styled.div`
  border-bottom: 1px solid #e1e1e1;
  margin-bottom: 0px;
  margin-top: 8px;
  padding-bottom: 8px;
  @media (min-width: 576px) {
    display: none;
  }
`;

const NavButton = styled.div`
  * {
    font-weight: bold;
  }
`;

const NavButtons = styled.div`
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

const NextButtonPlaceholder = styled.div`
  width: 64px;
`;

const PersonalizedScorePlusOne = styled.div`
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

const Separator = styled.div`
  background: #e1e1e1;
  margin: 8px auto;
  width: 100%;
  height: 1px;
`;

const TabletActionButton = styled.div`
  display: none;
  @media(min-width: 576px) {
    display: block;
    margin-left: auto;
  }
  @media(min-width: 769px) {
    margin-left: 12px;
  }
`;

const Title = styled.h2`
  display: inline-block;
  font-weight: 600;
  margin: 0;
`;

const TitleArea = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  @media (min-width: 576px) {
    display: inline-block;
    margin: auto 0;
  }
`;

const TitleFlex = styled.div`
  display: inline-block;
  // margin: 2px 0 0 0;
  margin-right: 8px;
`;

const YourLocation = styled.span`
`;

export default withTheme(withStyles(styles)(CompleteYourProfile));
