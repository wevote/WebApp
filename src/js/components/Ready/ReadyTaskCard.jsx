import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import EventAvailable from '@material-ui/icons/EventAvailable';
import EventBusy from '@material-ui/icons/EventBusy';
import { Checkbox, Button } from '@material-ui/core';
import { historyPush } from '../../utils/cordovaUtils';

class ReadyTaskCard extends React.Component {
  static propTypes = {
    ballotMode: PropTypes.bool,
    buttonText: PropTypes.string,
    completedTitle: PropTypes.string,
    completedSubtitle: PropTypes.string,
    completedButtonText: PropTypes.string,
    makeAPlanMode: PropTypes.bool,
    title: PropTypes.string,
    subtitle: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      completed: false,
    };
  }

  goToNextStep = () => {
    const { ballotMode, makeAPlanMode } = this.props;
    if (ballotMode) {
      historyPush('/ballot');
    }
  }

  render () {
    const { completedTitle, title, subtitle, buttonText } = this.props;
    const { completed } = this.state;
    return (
      <Card completed={completed} className="card">
        <Icon className="u-cursor--pointer" completed={completed} onClick={this.goToNextStep}>
          {/* <Hexagon /> */}
          {completed ? <EventAvailable /> : <EventBusy />}
        </Icon>
        <div>
          <Title className="u-cursor--pointer" onClick={this.goToNextStep}>{completed ? completedTitle : title}</Title>
          <SubTitle className="u-cursor--pointer" onClick={this.goToNextStep}>{subtitle}</SubTitle>
          <StyledButton className="u-cursor--pointer" onClick={this.goToNextStep} completed={completed || undefined} variant="outlined" color="primary">
            <StyledCheckbox completed={completed} />
            {completed ? 'Completed' : buttonText}
          </StyledButton>
        </div>
      </Card>
    );
  }
}

const Card = styled.div`
  padding: 16px;
  padding-left: 82px;
  position: relative;
  ::after {
    content: "";
    display: block;
    position: absolute;
    background: ${props => (props.completed ? 'rgb(31,192,111)' : '#bed1fb')};
    width: 4px;
    z-index: 0;
    height: calc(100% - 32px);
    left: 39px;
    top: 16px;
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 16px;
  top: 16px;
  z-index: 999;
  height 100%;
  width: fit-content;
  width: 50px;
  height: 50px;
    background: ${props => (props.completed ? 'rgb(31,192,111)' : '#bed1fb')};
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg, path, * {
    color: white;
    width: 35px !important;
    display: block !important;
    height: 35px !important;
    font-size: 35px !important;
  }
`;

const Hexagon = styled.div`
position: relative;
width: 50px;
height: 28.87px;
background-color: #bed1fb;
margin: 14.43px 0;

::before,
::after {
  content: "";
  position: absolute;
  width: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
}

::before {
  bottom: 100%;
  border-bottom: 14.43px solid #bed1fb;
}

::after {
  top: 100%;
  width: 0;
  border-top: 14.43px solid #bed1fb;
}
`;
const Title = styled.h3`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 12px;
`;

const SubTitle = styled.small`
  margin: 0;
  font-size: 16px;
  color: #555;
`;

const StyledButton = styled(Button)`
  border: 1.5px solid ${props => (props.completed ? 'rgb(31,192,111)' : '#e8e8e8')} !important;
  padding: 8px 16px !important;
  margin-top: 12px !important;
  border-radius: 5px !important;
  font-weight: bold !important;
  font-size: 16px !important;
  width: 100% !important;
  color: ${props => (props.completed ? 'rgb(31,192,111)' : 'inherit')} !important;
  .MuiButton-label {
    width: 100% !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
  }
  :hover {
    background: #f7f7f7 !important;
  }
`;

const StyledCheckbox = styled.div`
  width: 25px;
  height: 25px;
  background: ${props => (props.completed ? 'rgb(31,192,111)' : 'transparent')};
  border-radius: 50px;
  margin: 0;
  margin-right: 12px;
  border: 1.5px solid #e8e8e8;

`;

export default ReadyTaskCard;
