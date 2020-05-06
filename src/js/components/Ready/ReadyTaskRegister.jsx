import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import AccountBoxOutlined from '@material-ui/icons/AccountBoxOutlined';
import AccountBoxFilled from '@material-ui/icons/AccountBox';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { historyPush } from '../../utils/cordovaUtils';
import { ButtonLeft, ButtonText, Card, Icon, PercentComplete, StyledButton, StyledCheckbox, SubTitle, Title, TitleRowWrapper } from './ReadyTaskStyles';
// Hexagon,

class ReadyTaskRegister extends React.Component {
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
          {completed ? <AccountBoxOutlined /> : <AccountBoxFilled />}
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
            <PercentComplete completed={completed || undefined}>
              {completed ? '100%' : '0%'}
            </PercentComplete>
          </TitleRowWrapper>
          <SubTitle className="u-cursor--pointer" onClick={this.goToNextStep}>
            {completed ? 'You have verified with your state that you are registered to vote.' : 'If you\'re voter registration isn\'t current, you won\'t be able to cast your ballot.'}
          </SubTitle>
          {!completed && (
            <StyledButton
              className="u-cursor--pointer"
              color="primary"
              completed={completed || undefined}
              onClick={this.goToNextStep}
              variant="outlined"
              withoutSteps
            >
              <ButtonLeft>
                <StyledCheckbox />
                <ButtonText>
                  <>
                    <span className="u-show-mobile">
                      Verify Now
                    </span>
                    <span className="u-show-desktop-tablet">
                      Verify You Are Registered in your State
                    </span>
                  </>
                  <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                </ButtonText>
              </ButtonLeft>
            </StyledButton>
          )}
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

export default withTheme(withStyles(styles)(ReadyTaskRegister));
