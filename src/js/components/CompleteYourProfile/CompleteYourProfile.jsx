import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import BallotIcon from '@material-ui/icons/Ballot';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import EditLocation from '@material-ui/icons/EditLocation';
import CheckCircle from '@material-ui/icons/CheckCircle';
import AppActions from '../../actions/AppActions';
import VoterStore from '../../stores/VoterStore';
import VoterConstants from '../../constants/VoterConstants';
import { cordovaDot } from '../../utils/cordovaUtils';
import cookies from '../../utils/cookies';
// import People from '@material-ui/icons/People';
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
      firstPositionIntroCompleted: false,
      howItWorksWatched: false,
      personalizedScoreIntroCompleted: false,
      valuesIntroCompleted: false,
      steps: [
        {
          id: 1,
          title: 'Watch how it works (no sound)',
          buttonText: 'How It Works',
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
        {
          id: 5,
          title: 'Choose your first candidate',
          buttonText: 'Choose Candidate',
          completed: false,
          description: '',
          icon: (<BallotIcon />),
          onClick: this.openFirstPositionIntroModal,
        },
        // {
        //   id: 7,
        //   title: 'Step Seven',
        //   buttonText: 'Step Seven',
        //   completed: false,
        //   description: '',
        //   icon: (<People />),
        // },
        // {
        //   id: 8,
        //   title: 'Step Eight',
        //   buttonText: 'Step Eight',
        //   completed: false,
        //   description: '',
        //   icon: (<ThumbUp />),
        // },
      ],
      textForMapSearch: '',
    };

    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  // Steps: options, friends
  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setCompletedStatus();
    this.sortSteps();
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setCompletedStatus();
    this.sortSteps();
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
  }

  setCompletedStatus = () => {
    const howItWorksWatched = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    if (howItWorksWatched) {
      const howItWorksWatchedId = 1;
      this.setItemComplete(howItWorksWatchedId);
    }
    const valuesIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.VALUES_INTRO_COMPLETED);
    if (valuesIntroCompleted) {
      const valuesIntroCompletedId = 2;
      this.setItemComplete(valuesIntroCompletedId);
    }
    // const adviserIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_ORGANIZATIONS_COMPLETED);
    // if (adviserIntroCompleted) {
    //   const adviserIntroCompletedId = 3;
    //   this.setItemComplete(adviserIntroCompletedId);
    // }
    const addressIntroCompletedByCookie = cookies.getItem('location_guess_closed');
    const { addressIntroCompleted } = this.state;
    if (addressIntroCompleted || addressIntroCompletedByCookie) {
      const addressIntroCompletedId = 3;
      this.setItemComplete(addressIntroCompletedId);
    }
    const personalizedScoreIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    if (personalizedScoreIntroCompleted) {
      const personalizedScoreIntroCompletedId = 4;
      this.setItemComplete(personalizedScoreIntroCompletedId);
    }
    const firstPositionIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.BALLOT_INTRO_POSITIONS_COMPLETED);
    if (firstPositionIntroCompleted) {
      const firstPositionIntroCompletedId = 5;
      this.setItemComplete(firstPositionIntroCompletedId);
    }
    this.setState({
      // adviserIntroCompleted,
      firstPositionIntroCompleted,
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

  openFirstPositionIntroModal = () => {
    // console.log('Opening modal');
    AppActions.setShowFirstPositionIntroModal(true);
  }

  goToNextIncompleteStep = () => {
    const { steps } = this.state;
    const notCompletedSteps = steps.filter(oneStep => !oneStep.completed);
    this.setState({
      activeStep: notCompletedSteps[0].id,
    });
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

    this.setState({
      activeStep: steps[currentIndex - 1].id,
    });
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
      // if (itemA.completed) {
      //   comparison = -1;
      // } else
      if (itemA.id > itemB.id) {
        comparison = 1;
      } else if (itemA.id < itemB.id) {
        comparison = -1;
      }
      return comparison;
    }

    const completed = this.state.steps.filter(oneStep => oneStep.completed);
    const notCompleted = this.state.steps.filter(oneStep => !oneStep.completed);

    completed.sort(compare);
    notCompleted.sort(compare);

    // console.log('Completed: ', completed);
    // console.log('Not Completed: ', notCompleted);

    const all = [...completed, ...notCompleted];
    // all.push(completed);
    // all.push(notCompleted);

    // console.log('All steps: ', all);

    this.setState({ steps: all });
  }

  render () {
    const {
      activeStep, addressIntroCompleted, firstPositionIntroCompleted,
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
    } else if (addressIntroCompleted && addressIntroCompletedByCookie && firstPositionIntroCompleted && howItWorksWatched && personalizedScoreIntroCompleted && valuesIntroCompleted) {
      // If we have done all of the steps, do not render CompleteYourProfile // OFF FOR NOW: adviserIntroCompleted &&
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
                    <Icon className="u-show-desktop-tablet">
                      {step.icon}
                    </Icon>
                    <TitleArea>
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
                          <Button onClick={this.previousStep} className="u-no-break" color="primary">
                            {'< Previous'}
                          </Button>
                        )}
                      </NavButton>
                      <NavButton>
                        {index < (steps.length - 1) ? (
                          <Button onClick={this.nextStep} className="u-no-break" color="primary">
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

const Info = styled.span`
  display: none;
  @media(min-width: 525px) {
    display: inline;
  }
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
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

const Separator = styled.div`
  width: 100%;
  background: #e1e1e1;
  height: 1px;
  margin: 8px auto;
`;

const Description = styled.div`
  @media (min-width: 769px) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const Icon = styled.div`
  display: inline-block;
  width: 35px;
  height: 35px;
  * {
    height: 35px !important;
    width: 35px !important;
    fill: #2E3C5D;
  }
`;

const Title = styled.h2`
  display: inline-block;
  font-weight: 600;
  margin: 0;
`;

const TitleFlex = styled.div`
  margin: 0 0 0 8px;
  margin-right: 8px;
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

const BestGuess = styled.span`
  font-weight: bold;
`;

const YourLocation = styled.span`
`;

const PersonalizedScorePlusOne = styled.div`
  background: #2E3C5D;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  @media print{
    border: 2px solid grey;
  }
`;

const TitleArea = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  @media(min-width: 576px) {
    margin-bottom: 12px;
  }
`;

const MobileActionButton = styled.div`
  margin-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e1e1e1;
  margin-bottom: 0px;
  @media (min-width: 576px) {
    display: none;
  }
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

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media(min-width: 576px) {
    width: fit-content;
    margin-right: auto;
  }
  @media(min-width: 769px) {
    margin-left: auto;
    margin-right: 0;
  }
`;

const NavButton = styled.div`
  * {
    font-weight: bold;
  }
`;

const NextButtonPlaceholder = styled.div`
  width: 64px;
`;

export default withTheme(withStyles(styles)(CompleteYourProfile));
