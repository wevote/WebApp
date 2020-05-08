import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { cordovaDot, historyPush } from '../../utils/cordovaUtils';
import plan0Percent from '../../../img/global/svg-icons/ready/plan-0-percent.svg';
import plan100Percent from '../../../img/global/svg-icons/ready/plan-100-percent.svg';
import { ButtonLeft, ButtonText, Icon, PercentComplete, ReadyCard, StyledButton, StyledCheckbox, SubTitle, Title, TitleRowWrapper } from './ReadyTaskStyles';

class ReadyTaskPlan extends React.Component {
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
      <ReadyCard showprogresscolor={completed} className="card">
        <Icon className="u-cursor--pointer" onClick={this.goToNextStep}>
          {completed ?  (
            <img
              src={cordovaDot(plan100Percent)}
              width="50"
              height="50"
              alt="Made a Plan to Vote"
            />
          ) : (
            <img
              src={cordovaDot(plan0Percent)}
              width="50"
              height="50"
              alt="Make a Plan to Vote"
            />
          )}
        </Icon>
        <div>
          <TitleRowWrapper>
            <Title
              className="u-cursor--pointer"
              onClick={this.goToNextStep}
            >
              {completed ? (
                <>
                  <span className="u-show-mobile">
                    Your Voting Plan
                  </span>
                  <span className="u-show-desktop-tablet">
                    Your Voting Plan
                  </span>
                </>
              ) : (
                <>
                  <span className="u-show-mobile">
                    When Will You Vote?
                  </span>
                  <span className="u-show-desktop-tablet">
                    When and Where Will You Vote?
                  </span>
                </>
              )}
            </Title>
            <PercentComplete showprogresscolor={completed || undefined}>
              {completed ? '100%' : '0%'}
            </PercentComplete>
          </TitleRowWrapper>
          {completed ? (
            <div>
              I will drop my ballot at my polling place around 2pm.
            </div>
          ) : (
            <>
              <SubTitle className="u-cursor--pointer" onClick={this.goToNextStep}>
                Write your own adventure and cast your vote!
              </SubTitle>
              <StyledButton
                className="u-cursor--pointer"
                color="primary"
                completed={completed || undefined}
                onClick={this.goToNextStep}
                variant="outlined"
                withoutsteps="1"
              >
                <ButtonLeft>
                  <StyledCheckbox />
                  <ButtonText>
                    <span className="u-show-mobile">
                      Make A Plan
                    </span>
                    <span className="u-show-desktop-tablet">
                      Make A Plan Now
                    </span>
                    <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                  </ButtonText>
                </ButtonLeft>
              </StyledButton>
            </>
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

export default withTheme(withStyles(styles)(ReadyTaskPlan));
