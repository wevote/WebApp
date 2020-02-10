import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';

class CompleteYourProfile extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      activeStep: 1,
      steps: [
        {
          id: 1,
          title: 'Step One',
          buttonText: 'Step One',
          completed: false,
        },
        {
          id: 2,
          title: 'Step Two',
          buttonText: 'Step Two',
          completed: true,
        },
        {
          id: 3,
          title: 'Step Three',
          buttonText: 'Step Three',
          completed: false,
        },
        {
          id: 4,
          title: 'Step Four',
          buttonText: 'Step Four',
          completed: false,
        },
        {
          id: 5,
          title: 'Step Five',
          buttonText: 'Step Five',
          completed: true,
        },
        {
          id: 6,
          title: 'Step Six',
          buttonText: 'Step Six',
          completed: false,
        },
        {
          id: 7,
          title: 'Step Seven',
          buttonText: 'Step Seven',
          completed: false,
        },
        {
          id: 8,
          title: 'Step Eight',
          buttonText: 'Step Eight',
          completed: false,
        },
      ],
    };

    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  // Steps: options, friends
  componentDidMount () {
    this.sortSteps();
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

    const completed = this.state.steps.filter(item => item.completed);
    const notCompleted = this.state.steps.filter(item => !item.completed);

    completed.sort(compare);
    notCompleted.sort(compare);

    console.log('Completed: ', completed);
    console.log('Not Completed: ', notCompleted);

    const all = [...completed, ...notCompleted];
    // all.push(completed);
    // all.push(notCompleted);

    console.log('All: ', all);

    this.setState({ steps: all });
  }

  previousStep () {
    this.sortSteps();

    const currentIndex = this.state.steps.map(e => e.id).indexOf(this.state.activeStep);

    console.log(currentIndex);

    this.setState({ activeStep: this.state.steps[currentIndex - 1].id });
  }

  nextStep () {
    this.sortSteps();

    const currentIndex = this.state.steps.map(e => e.id).indexOf(this.state.activeStep);

    console.log(currentIndex);

    this.setState({ activeStep: this.state.steps[currentIndex + 1].id });
  }

  render () {
    const { classes } = this.props;
    const { activeStep } = this.state;

    return (
      <>
        <div className="card">
          <div className="card-main">
            <Flex>
              <span>
                <strong>3 of 8</strong>
                {' '}
                actions completed
              </span>
              <Indicators>
                {this.state.steps.map(step => (
                  <Indicator complete={step.completed}>
                    {step.id}
                  </Indicator>
                ))}
              </Indicators>
            </Flex>
            <Seperator />
            {this.state.steps.map((step, index) => {
              if (step.id === this.state.activeStep) {
                return (
                  <Description>
                    <TitleArea>
                      <Icon>
                        <PlayCircleFilled />
                      </Icon>
                      <Title>{step.title}</Title>
                      <TabletActionButton>
                        <Button fullWidth variant="contained" color="primary">
                          {step.buttonText}
                        </Button>
                      </TabletActionButton>
                    </TitleArea>
                    <MobileActionButton>
                      <Button fullWidth variant="contained" color="primary">
                        {step.buttonText}
                      </Button>
                    </MobileActionButton>
                    <NavButtons>
                      {index !== 0 ? (
                        <NavButton>
                          <Button onClick={this.previousStep} color="primary">
                            {'< Previous'}
                          </Button>
                        </NavButton>
                      ) : null}
                      {index !== 7 ? (
                        <NavButton>
                          <Button onClick={this.nextStep} color="primary">
                            {'Next >'}
                          </Button>
                        </NavButton>
                      ) : null}
                    </NavButtons>
                  </Description>
                );
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
  @media (max-width: 768px) {
    &:nth-child(even) {
      margin-left: -4px;
    }    
  }
`;

const Seperator = styled.div`
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
  font-weight: normal;
  margin: 0 0 0 8px;
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
