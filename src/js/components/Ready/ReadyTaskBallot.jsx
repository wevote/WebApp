import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CheckCircle from '@material-ui/icons/CheckCircle';
import ballot0Percent from '../../../img/global/svg-icons/ready/ballot-0-percent.svg';
import ballot50Percent from '../../../img/global/svg-icons/ready/ballot-50-percent.svg';
import ballot100Percent from '../../../img/global/svg-icons/ready/ballot-100-percent.svg';
import { cordovaDot, historyPush } from '../../utils/cordovaUtils';
import { ButtonLeft, ButtonText, Icon, PercentComplete, ReadyCard, StyledButton, StyledCheckbox, StyledCheckboxCompleted, SubTitle, Title, TitleRowWrapper } from './ReadyTaskStyles';

class ReadyTaskBallot extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotCompleted: false,
      federalCompleted: false,
      federalNumberCompleted: 0,
      federalShowButton: true,
      federalTotalNumber: 0,
      howItWorksShowButton: true,
      howItWorksCompleted: false,
      howItWorksNumberCompleted: 0,
      localShowButton: true,
      localCompleted: false,
      localNumberCompleted: 0,
      localTotalNumber: 0,
      measureShowButton: true,
      measureCompleted: false,
      measureNumberCompleted: 0,
      measureTotalNumber: 0,
      percentCompleted: 10,
      stateShowButton: true,
      stateCompleted: false,
      stateNumberCompleted: 0,
      stateTotalNumber: 0,
    };
  }

  goToNextStep = () => {
    historyPush('/ballot');
  }

  render () {
    const { classes } = this.props;
    const {
      ballotCompleted,
      federalCompleted, federalNumberCompleted, federalShowButton, federalTotalNumber,
      howItWorksCompleted, howItWorksNumberCompleted, howItWorksShowButton, howItWorksTotalNumber,
      localCompleted, localNumberCompleted, localShowButton, localTotalNumber,
      measureCompleted, measureNumberCompleted, measureShowButton, measureTotalNumber,
      percentCompleted,
      stateCompleted, stateNumberCompleted, stateShowButton, stateTotalNumber,
    } = this.state;

    let ballotImage;
    let altValue;
    if (percentCompleted < 50) {
      ballotImage = ballot0Percent;
      altValue = 'Start deciding';
    } else if (percentCompleted < 100) {
      ballotImage = ballot50Percent;
      altValue = 'Ballot decisions underway';
    } else {
      ballotImage = ballot100Percent;
      altValue = 'Ballot Completed';
    }
    const completedIcon = (
      <img
        src={cordovaDot(ballotImage)}
        width="50"
        height="50"
        alt={altValue}
      />
    );
    return (
      <ReadyCard showprogresscolor={ballotCompleted} className="card">
        <Icon className="u-cursor--pointer" onClick={this.goToNextStep}>
          {completedIcon}
        </Icon>
        <div>
          <TitleRowWrapper>
            <Title
              className="u-cursor--pointer"
              onClick={this.goToNextStep}
            >
              {ballotCompleted ? 'Your Ballot' : 'Voting?'}
            </Title>
            <PercentComplete showprogresscolor={percentCompleted > 0}>
              {percentCompleted}
              %
            </PercentComplete>
          </TitleRowWrapper>
          <SubTitle className="u-cursor--pointer" onClick={this.goToNextStep}>
            {ballotCompleted ? 'Review your decisions.' : 'Start deciding how you\'ll vote.'}
          </SubTitle>
          {/* ************ */}
          {/* How It Works */}
          {/* ************ */}
          {howItWorksShowButton && (
            <StyledButton
              className="u-cursor--pointer"
              color="primary"
              completed={howItWorksCompleted || undefined}
              onClick={this.goToNextStep}
              variant="outlined"
            >
              <ButtonLeft>
                {howItWorksCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {howItWorksCompleted ? (
                    <>
                      <span className="u-show-mobile">
                        How It Works
                      </span>
                      <span className="u-show-desktop-tablet">
                        How It Works Completed
                      </span>
                    </>
                  ) : (
                    <span>
                      How It Works
                      <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                    </span>
                  )}
                </ButtonText>
              </ButtonLeft>
              {!ballotCompleted && (
                <NumberComplete>
                  (
                  {howItWorksNumberCompleted}
                  /
                  {howItWorksTotalNumber}
                  )
                </NumberComplete>
              )}
            </StyledButton>
          )}
          {/* ************* */}
          {/* Federal Races */}
          {/* ************* */}
          {federalShowButton && (
            <StyledButton
              className="u-cursor--pointer"
              color="primary"
              completed={federalCompleted || undefined}
              onClick={this.goToNextStep}
              variant="outlined"
            >
              <ButtonLeft>
                {federalCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {federalCompleted ? (
                    <>
                      <span className="u-show-mobile">
                        Federal, State, Local
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
                      <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              {!federalCompleted && (
                <NumberComplete>
                  (
                  {federalNumberCompleted}
                  /
                  {federalTotalNumber}
                  )
                </NumberComplete>
              )}
            </StyledButton>
          )}
          {/* ************* */}
          {/* State Races */}
          {/* ************* */}
          {stateShowButton && (
            <StyledButton
              className="u-cursor--pointer"
              color="primary"
              completed={stateCompleted || undefined}
              onClick={this.goToNextStep}
              variant="outlined"
            >
              <ButtonLeft>
                {stateCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {stateCompleted ? (
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
                      <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              {!stateCompleted && (
                <NumberComplete>
                  (
                  {stateNumberCompleted}
                  /
                  {stateTotalNumber}
                  )
                </NumberComplete>
              )}
            </StyledButton>
          )}
          {/* ************* */}
          {/* Measures */}
          {/* ************* */}
          {measureShowButton && (
            <StyledButton
              className="u-cursor--pointer"
              color="primary"
              completed={measureCompleted || undefined}
              onClick={this.goToNextStep}
              variant="outlined"
            >
              <ButtonLeft>
                {measureCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {measureCompleted ? (
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
                      <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              {!measureCompleted && (
                <NumberComplete>
                  (
                  {measureNumberCompleted}
                  /
                  {measureTotalNumber}
                  )
                </NumberComplete>
              )}
            </StyledButton>
          )}
          {/* *********** */}
          {/* Local Races */}
          {/* *********** */}
          {localShowButton && (
            <StyledButton
              className="u-cursor--pointer"
              color="primary"
              completed={localCompleted || undefined}
              onClick={this.goToNextStep}
              variant="outlined"
            >
              <ButtonLeft>
                {localCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {localCompleted ? (
                    <>
                      <span className="u-show-mobile">
                        Local Races
                      </span>
                      <span className="u-show-desktop-tablet">
                        Your Decisions on Local Races
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="u-show-mobile">
                        Local Races
                      </span>
                      <span className="u-show-desktop-tablet">
                        Decide on Local Races
                      </span>
                      <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              {!localCompleted && (
                <NumberComplete>
                  (
                  {localNumberCompleted}
                  /
                  {localTotalNumber}
                  )
                </NumberComplete>
              )}
            </StyledButton>
          )}
        </div>
      </ReadyCard>
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
