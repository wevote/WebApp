import { withStyles, withTheme } from '@material-ui/core/styles';
import { ArrowForward, CheckCircle } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';
import register0Percent from '../../../img/global/svg-icons/ready/register-0-percent.svg';
import register100Percent from '../../../img/global/svg-icons/ready/register-100-percent.svg';
import { cordovaDot, historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import { ButtonLeft, ButtonText, Icon, PercentComplete, ReadyCard, StyledButton, StyledCheckbox, StyledCheckboxCompleted, SubTitle, Title, TitleRowWrapper } from './ReadyTaskStyles';

class ReadyTaskRegister extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      completed: false,
    };
  }

  goToNextStep = () => {
    historyPush('/register');
  }

  render () {
    renderLog('ReadyTaskRegister');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { completed } = this.state;

    return (
      <ReadyCard showprogresscolor={completed} className="card">
        <Icon className="u-cursor--pointer" onClick={this.goToNextStep}>
          {completed ?  (
            <img
              src={cordovaDot(register100Percent)}
              width="50"
              height="50"
              alt="Registered to Vote"
            />
          ) : (
            <img
              src={cordovaDot(register0Percent)}
              width="50"
              height="50"
              alt="Register to Vote"
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
                    You are Registered
                  </span>
                  <span className="u-show-desktop-tablet">
                    You are Registered to Vote
                  </span>
                </>
              ) : (
                <>
                  <span className="u-show-mobile">
                    Registered to Vote?
                  </span>
                  <span className="u-show-desktop-tablet">
                    Registered to Vote?
                  </span>
                </>
              )}
            </Title>
            <PercentComplete showprogresscolor={completed || undefined}>
              {completed ? '100%' : '0%'}
              {!!(completed) && (
                <span className="u-show-desktop-tablet">
                  {' '}
                  Complete
                </span>
              )}
            </PercentComplete>
          </TitleRowWrapper>
          <SubTitle className="u-cursor--pointer" onClick={this.goToNextStep}>
            {completed ? 'You have verified with your state that you are registered to vote.' : 'If you\'re voter registration isn\'t current, you won\'t be able to cast your ballot.'}
          </SubTitle>
          <StyledButton
            id="verifyRegisteredInStateButton"
            className="u-cursor--pointer"
            color="primary"
            completed={completed || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
            withoutsteps="1"
          >
            <ButtonLeft>
              {completed ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {completed ? (
                  <>
                    <span className="u-show-mobile">
                      Registration Verified
                    </span>
                    <span className="u-show-desktop-tablet">
                      You Are Registered in your State
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile">
                      Verify Now
                    </span>
                    <span className="u-show-desktop-tablet">
                      Verify You Are Registered in your State
                    </span>
                    <ArrowForward classes={{ root: classes.arrowRoot }} />
                  </>
                )}
              </ButtonText>
            </ButtonLeft>
          </StyledButton>
        </div>
      </ReadyCard>
    );
  }
}
ReadyTaskRegister.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  arrowRoot: {
    fontSize: 14,
    marginBottom: 3,
    marginLeft: 4,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
    },
  },
});

export default withTheme(withStyles(styles)(ReadyTaskRegister));
