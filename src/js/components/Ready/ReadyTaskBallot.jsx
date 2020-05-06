import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CheckCircle from '@material-ui/icons/CheckCircle';
import ViewListOutlined from '@material-ui/icons/ViewListOutlined';
import ViewListRounded from '@material-ui/icons/ViewListRounded';
import { historyPush } from '../../utils/cordovaUtils';
import { ButtonLeft, ButtonText, Card, Icon, PercentComplete, StyledButton, StyledCheckbox, StyledCheckboxCompleted, SubTitle, Title, TitleRowWrapper } from './ReadyTaskStyles';
// Hexagon,

class ReadyTaskBallot extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      completed: false,
    };
  }

  goToNextStep = () => {
    historyPush('/ballot');
  }

  render () {
    const { classes } = this.props;
    const { completed } = this.state;

    return (
      <Card completed={completed} className="card">
        <Icon className="u-cursor--pointer" completed={completed} onClick={this.goToNextStep}>
          {/* <Hexagon /> */}
          {completed ? <ViewListOutlined /> : <ViewListRounded />}
        </Icon>
        <div>
          <TitleRowWrapper>
            <Title
              className="u-cursor--pointer"
              onClick={this.goToNextStep}
            >
              {completed ? 'Your Ballot' : 'Voting?'}
            </Title>
            <PercentComplete completed={completed || undefined}>
              {completed ? '100%' : '0%'}
            </PercentComplete>
          </TitleRowWrapper>
          <SubTitle className="u-cursor--pointer" onClick={this.goToNextStep}>
            {completed ? 'Review your decisions.' : 'Start deciding how you\'ll vote.'}
          </SubTitle>
          {/* ************ */}
          {/* How It Works */}
          {/* ************ */}
          <StyledButton
            className="u-cursor--pointer"
            color="primary"
            completed={completed || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
          >
            <ButtonLeft>
              {completed ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {completed ? (
                  <>
                    <span className="u-show-mobile">
                      How It Works
                    </span>
                    <span className="u-show-desktop-tablet">
                      How It Works Completed
                    </span>
                  </>
                ) : 'How It Works'}
                {!completed && <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />}
              </ButtonText>
            </ButtonLeft>
            {!completed && (
              <NumberComplete>
                (0/4)
              </NumberComplete>
            )}
          </StyledButton>
          {/* ************* */}
          {/* Federal Races */}
          {/* ************* */}
          <StyledButton
            className="u-cursor--pointer"
            color="primary"
            completed={completed || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
          >
            <ButtonLeft>
              {completed ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {completed ? (
                  <>
                    <span className="u-show-mobile">
                      Federal Races
                    </span>
                    <span className="u-show-desktop-tablet">
                      Your Decisions on Federal Races
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile">
                      Federal Races
                    </span>
                    <span className="u-show-desktop-tablet">
                      Decide on Federal Races
                    </span>
                  </>
                )}
                {!completed && <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />}
              </ButtonText>
            </ButtonLeft>
            {!completed && (
              <NumberComplete>
                (0/4)
              </NumberComplete>
            )}
          </StyledButton>
          {/* ************* */}
          {/* State Races */}
          {/* ************* */}
          <StyledButton
            className="u-cursor--pointer"
            color="primary"
            completed={completed || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
          >
            <ButtonLeft>
              {completed ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {completed ? (
                  <>
                    <span className="u-show-mobile">
                      State Races
                    </span>
                    <span className="u-show-desktop-tablet">
                      Your Decisions on State Races
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile">
                      State Races
                    </span>
                    <span className="u-show-desktop-tablet">
                      Decide on State Races
                    </span>
                  </>
                )}
                {!completed && <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />}
              </ButtonText>
            </ButtonLeft>
            {!completed && (
              <NumberComplete>
                (0/4)
              </NumberComplete>
            )}
          </StyledButton>
          {/* ************* */}
          {/* Measures */}
          {/* ************* */}
          <StyledButton
            className="u-cursor--pointer"
            color="primary"
            completed={completed || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
          >
            <ButtonLeft>
              {completed ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {completed ? (
                  <>
                    <span className="u-show-mobile">
                      Measures
                    </span>
                    <span className="u-show-desktop-tablet">
                      Your Decisions on Measures
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile">
                      Measures
                    </span>
                    <span className="u-show-desktop-tablet">
                      Decide on Measures
                    </span>
                  </>
                )}
                {!completed && <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />}
              </ButtonText>
            </ButtonLeft>
            {!completed && (
              <NumberComplete>
                (0/4)
              </NumberComplete>
            )}
          </StyledButton>
          {/* *********** */}
          {/* Local Races */}
          {/* *********** */}
          <StyledButton
            className="u-cursor--pointer"
            color="primary"
            completed={completed || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
          >
            <ButtonLeft>
              {completed ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {completed ? (
                  <>
                    <span className="u-show-mobile">
                      Federal Races
                    </span>
                    <span className="u-show-desktop-tablet">
                      Your Decisions on Federal Races
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile">
                      Federal Races
                    </span>
                    <span className="u-show-desktop-tablet">
                      Decide on Federal Races
                    </span>
                  </>
                )}
                {!completed && <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />}
              </ButtonText>
            </ButtonLeft>
            {!completed && (
              <NumberComplete>
                (0/4)
              </NumberComplete>
            )}
          </StyledButton>
        </div>
      </Card>
    );
  }
}

const styles = theme => ({
  arrowRoot: {
    fontSize: 14,
    marginBottom: 3,
    marginLeft: 4,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
    },
  },
});

const NumberComplete = styled.div`
  font-size: 12px;
`;

export default withTheme(withStyles(styles)(ReadyTaskBallot));
