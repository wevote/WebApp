import React from 'react';
import PropTypes from 'prop-types';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import EventAvailable from '@material-ui/icons/EventAvailable';
import EventBusy from '@material-ui/icons/EventBusy';
import { historyPush } from '../../utils/cordovaUtils';
import { Card, Icon, PercentComplete, StyledButton, StyledCheckbox, SubTitle, Title, TitleRowWrapper } from './ReadyTaskStyles';
// Hexagon,

class ReadyTaskPlan extends React.Component {
  static propTypes = {
    arrowsOn: PropTypes.bool,
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
    const { arrowsOn } = this.props;
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
              <StyledButton className="u-cursor--pointer" onClick={this.goToNextStep} completed={completed || undefined} variant="outlined" color="primary">
                <StyledCheckbox completed={completed} />
                <span>
                  <span className="u-show-mobile">
                    Make A Plan
                  </span>
                  <span className="u-show-desktop-tablet">
                    Make A Plan Now
                  </span>
                  {arrowsOn && (
                    <>
                      &nbsp;
                      <ArrowForwardIcon />
                    </>
                  )}
                </span>
              </StyledButton>
            </>
          )}
        </div>
      </Card>
    );
  }
}

export default ReadyTaskPlan;
