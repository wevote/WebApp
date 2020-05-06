import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import EventAvailable from '@material-ui/icons/EventAvailable';
import EventBusy from '@material-ui/icons/EventBusy';
import { historyPush } from '../../utils/cordovaUtils';
import { ButtonLeft, ButtonText, Card, Icon, PercentComplete, StyledButton, StyledCheckbox, SubTitle, Title, TitleRowWrapper } from './ReadyTaskStyles';
// Hexagon,

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
      <Card completed={completed} className="card">
        <Icon className="u-cursor--pointer" completed={completed} onClick={this.goToNextStep}>
          {/* <Hexagon /> */}
          {completed ? <EventAvailable /> : <EventBusy />}
        </Icon>
        <div>
          <TitleRowWrapper>
            <Title
              className="u-cursor--pointer"
              onClick={this.goToNextStep}
            >
              {completed ? 'Your Voting Plan' : 'When Will You Vote?'}
            </Title>
            <PercentComplete completed={completed || undefined}>
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
                withoutSteps
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

export default withTheme(withStyles(styles)(ReadyTaskPlan));
