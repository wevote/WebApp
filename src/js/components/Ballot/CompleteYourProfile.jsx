import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
// import EditLocation from '@material-ui/icons/EditLocation';
// import ThumbUp from '@material-ui/icons/ThumbUp';
// import People from '@material-ui/icons/People';
import CheckCircle from '@material-ui/icons/CheckCircle';
import AppActions from '../../actions/AppActions';
import VoterStore from '../../stores/VoterStore';
import VoterConstants from '../../constants/VoterConstants';

class CompleteYourProfile extends Component {
  static propTypes = {
    // classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      activeStep: 1,
      steps: [
        {
          id: 1,
          title: 'Watch how it works',
          buttonText: 'How It Works',
          completed: false,
          description: '',
          icon: (<PlayCircleFilled />),
          onClick: this.openHowItWorksModal,
        },
        // {
        //   id: 2,
        //   title: 'Step Two',
        //   buttonText: 'Step Two',
        //   completed: false,
        //   description: 'Do step two',
        //   icon: (<EditLocation />),
        //   onClick: this.openHowItWorksModal,
        // },
        // {
        //   id: 3,
        //   title: 'Step Three',
        //   buttonText: 'Step Three',
        //   completed: false,
        //   description: 'Do step three',
        //   icon: (<People />),
        //   onClick: this.openHowItWorksModal,
        // },
        // {
        //   id: 4,
        //   title: 'Step Four',
        //   buttonText: 'Step Four',
        //   completed: false,
        //   description: 'Do step four',
        //   icon: (<ThumbUp />),
        // },
        // {
        //   id: 5,
        //   title: 'Step Five',
        //   buttonText: 'Step Five',
        //   completed: true,
        //   description: 'Do step five',
        //   icon: (<EditLocation />),
        // },
        // {
        //   id: 6,
        //   title: 'Step Six',
        //   buttonText: 'Step Six',
        //   completed: false,
        //   description: 'Do step six',
        //   icon: (<PlayCircleFilled />),
        // },
        // {
        //   id: 7,
        //   title: 'Step Seven',
        //   buttonText: 'Step Seven',
        //   completed: false,
        //   description: 'Do step seven',
        //   icon: (<People />),
        // },
        // {
        //   id: 8,
        //   title: 'Step Eight',
        //   buttonText: 'Step Eight',
        //   completed: false,
        //   description: 'Do step eight',
        //   icon: (<ThumbUp />),
        // },
      ],
    };

    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    // this.setItemComplete = this.setItemComplete.bind(this);
    this.openHowItWorksModal = this.openHowItWorksModal.bind(this);
  }

  // Steps: options, friends
  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.sortSteps();
    const howItWorksWatched = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    if (howItWorksWatched) {
      const howItWorksWatchedId = 1;
      this.setItemComplete(howItWorksWatchedId);
    }
    this.setState({
      howItWorksWatched,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const howItWorksWatched = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    if (howItWorksWatched) {
      const howItWorksWatchedId = 1;
      this.setItemComplete(howItWorksWatchedId);
    }
    this.setState({
      howItWorksWatched,
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
    this.nextStep();
  }

  openHowItWorksModal () {
    // console.log('Opening modal');
    AppActions.setShowHowItWorksModal(true);
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
    const { activeStep, howItWorksWatched } = this.state;

    // If we have completed all of the steps, don't render this component
    const showCompleteYourProfileForDebugging = false;
    if (showCompleteYourProfileForDebugging) {
      // Pass by this OFF switch so we render this component
    } else if (howItWorksWatched) {
      // If we have done all of the steps, do not render CompleteYourProfile
      return null;
    }

    return (
      <>
        <div className="card">
          <div className="card-main">
            <Flex>
              <span>
                <strong>
                  {this.state.steps.filter(oneStep => oneStep.completed).length }
                  {' '}
                  of
                  {' '}
                  {this.state.steps.length}
                </strong>
                {' '}
                <Info>actions </Info>
                completed
              </span>
              <Indicators>
                {this.state.steps.map(step => (
                  <Indicator key={`completeYourProfileIndicator-${step.id}`} complete={step.completed} />
                ))}
              </Indicators>
            </Flex>
            <Separator />
            {this.state.steps.map((step, index) => {
              if (step.id === activeStep) {
                return (
                  <Description key={`completeYourProfileDescription-${step.id}`}>
                    <TitleArea>
                      <Icon>
                        {step.icon}
                      </Icon>
                      {step.completed ? (
                        <TitleFlex>
                          <Title>
                            {step.title}
                          </Title>
                          <Completed>
                            <CheckCircle />
                            {' '}
                            Completed
                          </Completed>
                        </TitleFlex>
                      ) : (
                        <TitleFlex>
                          <Title>
                            {step.title}
                          </Title>
                        </TitleFlex>
                      )}
                      {step.description}
                      <TabletActionButton>
                        <Button onClick={() => {
                          // this.setItemComplete(activeStep);
                          step.onClick();
                        }}
                        fullWidth
                        variant="contained"
                        color="primary"
                        >
                          {step.buttonText}
                        </Button>
                      </TabletActionButton>
                    </TitleArea>
                    <MobileActionButton>
                      <Button onClick={() => {
                        // this.setItemComplete(activeStep);
                        step.onClick();
                      }}
                      fullWidth
                      variant="contained"
                      color="primary"
                      >
                        {step.buttonText}
                      </Button>
                    </MobileActionButton>
                    <NavButtons>
                      <NavButton>
                        {index !== 0 && (
                          <Button onClick={this.previousStep} color="primary">
                            {'< Previous'}
                          </Button>
                        )}
                      </NavButton>
                      <NavButton>
                        {index < (this.state.steps.length - 1) && (
                          <Button onClick={this.nextStep} color="primary">
                            {'Next >'}
                          </Button>
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
  display: flex;
  flex: 1 1 0;
  align-items: center;
  margin-left: 8px;
`;

const Indicator = styled.div`
  flex: 1 1 0;
  margin: 0 4px;
  background: ${props => (props.complete ? '#2E3C5D' : '#e1e1e1')};
  height: 8px;
`;

const Separator = styled.div`
  width: 90%;
  background: #e1e1e1;
  height: 1px;
  margin: 12px auto;
`;

const Description = styled.div`
  @media (min-width: 769px) {
    display: flex;
    align-items: center;
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

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  @media(min-width: 576px) {
    margin-bottom: 12px;
  }
`;

const MobileActionButton = styled.div`
  margin-top: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e1e1e1;
  margin-bottom: 12px;
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


export default withTheme(withStyles(styles)(CompleteYourProfile));
