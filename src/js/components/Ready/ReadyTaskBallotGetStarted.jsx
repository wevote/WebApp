import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import {
  BallotToDoTitle, ButtonLeft, ButtonText, Icon,
  PercentComplete, ReadyCard, StyledButton, TitleRowWrapper,
} from './ReadyTaskStyles';


const ballot0Percent = '../../../img/global/svg-icons/ready/ballot-0-percent.svg';

class ReadyTaskBallotGetStarted extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
  }

  render () {
    renderLog('ReadyTaskBallotGetStarted');  // Set LOG_RENDER_EVENTS to log all renders
    const { toDoTitle } = this.props;

    const completedIcon = (
      <img
        src={normalizedImagePath(ballot0Percent)}
        width="50"
        height="50"
        alt="Personalize your ballot"
      />
    );
    return (
      <ReadyCard className="card">
        <Icon className="u-cursor--pointer" onClick={this.goToBallot}>
          {completedIcon}
        </Icon>
        <div>
          <TitleRowWrapper>
            <BallotToDoTitle
              className="u-cursor--pointer"
              onClick={this.goToBallot}
            >
              {toDoTitle}
            </BallotToDoTitle>
            <PercentComplete className="u-cursor--pointer u-show-desktop-tablet" onClick={() => this.showMoreButtonsLink()}>
              0%
            </PercentComplete>
          </TitleRowWrapper>
          <StyledButton
            id="decideOnCandidatesButton"
            className="u-cursor--pointer"
            color="primary"
            darkButton="1"
            // onClick={this.goToBallot} // onClick={this.goToCandidateTypeAfterCalculation}
            variant="contained"
          >
            <ButtonLeft>
              <ButtonText fontColor="#fff">
                Get started
              </ButtonText>
            </ButtonLeft>
          </StyledButton>
        </div>
      </ReadyCard>
    );
  }
}
ReadyTaskBallotGetStarted.propTypes = {
  toDoTitle: PropTypes.string,
};

const styles = (theme) => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
});

export default withTheme(withStyles(styles)(ReadyTaskBallotGetStarted));
