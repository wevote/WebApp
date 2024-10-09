import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import styled from 'styled-components';
import commonMuiStyles from '../Style/commonMuiStyles';
import DesignTokenColors from '../Style/DesignTokenColors';

// Import icons
import RocketIcon from '../../../../img/global/svg-icons/issues/rocket-ship.svg';
import StepOneIcon from '../../../../img/global/svg-icons/issues/material-symbols-counter-1.svg';
import StepOneActiveIcon from '../../../../img/global/svg-icons/issues/material-symbols-counter-1-active.svg';
import StepTwoIcon from '../../../../img/global/svg-icons/issues/material-symbols-counter-2.svg';
import StepTwoActiveIcon from '../../../../img/global/svg-icons/issues/material-symbols-counter-2-active.svg';

// Color and font variables
const commonTextStyle = {
  fontSize: '13px',
  fontFamily: 'Poppins',
  lineHeight: '15px',
  textAlign: 'center',
  colors: DesignTokenColors.neutral900,
  textDecoration: 'none',
  // width: '272px',
};
// ChallengeInviteSteps component to display the steps
class ChallengeInviteSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: this.getActiveStepFromPath(),
    };
  }
  // Get the current step based on the URL to determine which step is active by default when the page loads
  getActiveStepFromPath = () => {
    const { location } = this.props;
    if (location.pathname.includes('customize-message')) {
      return 1;
    } else if (location.pathname.includes('invite-friends')) {
      return 2;
    }
    return 1;
  };

  // Check if a step is active based on the current step number
  isStepActive = (stepNumber) => this.props.currentStep === stepNumber;

  // Get the path for the challenge
  getChallengeBasePath = () => {
    const { challengeSEOFriendlyPath, challengeWeVoteId } = this.props;
    let challengeBasePath;
    if (challengeSEOFriendlyPath) {
      challengeBasePath = `/${challengeSEOFriendlyPath}/+/`;
    } else {
      challengeBasePath = `/+/${challengeWeVoteId}/`;
    }
    return challengeBasePath;
  };

  // Set a step as active when clicked
  isStepActive = (stepNumber) => this.state.activeStep === stepNumber;

  // Update the active step when the link is clicked
  handleStepClick = (stepNumber) => {
    this.setState({ activeStep: stepNumber });
  };

  render() {
    return (
      <ChallengeInviteStepsContainer>
        {/* Rocket, Invite more friends, and Learn More */}
        <HeaderContainer>
          <img
            src={RocketIcon}
            alt="Rocket Icon"
            style={{ height: '70px', width: '40px' }}
          />
          <h2>
            To boost your ranking, invite your friends to join.
          </h2>
          <Wrapper>
            <LearnMoreTextBlock />
            <button type="button">
              Learn more
            </button>
          </Wrapper>
        </HeaderContainer>

        {/* Steps (Step 1, Line, Step 2) */}
        <StepsContainer>
          {/* Step 1 Icon and Text */}
          <StepOneIconAndText
            isActive={this.isStepActive(1)}
            onClick={() => this.handleStepClick(1)}
          >
            <img
              src={this.isStepActive(1) ? StepOneActiveIcon : StepOneIcon}
              alt="Step 1 Icon"
            />
            <Link
              to={`${this.getChallengeBasePath()}customize-message`}
              style={commonTextStyle}
              // Handle click to update state
              onClick={() => this.handleStepClick(1)}
            >
              Customize the message to your friends
            </Link>
          </StepOneIconAndText>

          {/* Horizontal Line Between Steps */}
          <HorizontalLine />
          {/* Step 2 Icon and Text */}
          <StepTwoIconAndText
            isActive={this.isStepActive(2)}
            onClick={() => this.handleStepClick(2)}
          >
            <img
              src={this.isStepActive(2) ? StepTwoActiveIcon : StepTwoIcon}
              alt="Step 2 Icon"
            />
            <Link
              to={`${this.getChallengeBasePath()}invite-friends`}
              style={commonTextStyle}
              // Handle click to update state
              onClick={() => this.handleStepClick(2)}
            >
              Copy message & link
            </Link>
          </StepTwoIconAndText>
        </StepsContainer>
      </ChallengeInviteStepsContainer>
    );
  }
}

ChallengeInviteSteps.propTypes = {
  currentStep: PropTypes.number.isRequired,
  challengeSEOFriendlyPath: PropTypes.string,
  challengeWeVoteId: PropTypes.string,
  location: PropTypes.object.isRequired,
};


// Styled Components
const ChallengeInviteStepsContainer = styled('div')`
  align-items: center;
  background-color: ${DesignTokenColors.neutralUI50};
  display: flex;
  flex-direction: column;
  max-width: 620px;
  padding: 20px 20px 0;
  width: 100%;
`;

const HeaderContainer = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 100%;

  h2 {
    color: ${DesignTokenColors.neutral900};
    font-size: 20px;
    font-weight: 600;
    line-height: 25px;
    margin: 0 10px;

  }
    button {
    background: none;
    border: none;
    color: ${DesignTokenColors.primary500};
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
  }
`;

const Wrapper = styled('div')`
  align-items: center;
  display: flex;
  margin-left: auto;
`;

const LearnMoreTextBlock = styled('div')`
  background-color: ${DesignTokenColors.neutral100};
  height: 50px;
  margin-right: 15px;
  width: 1px;
`;

const StepsContainer = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
`;

const StepOneIconAndText = styled('div')`
  align-items: center;
  border-bottom: 2px solid ${({ isActive }) => (isActive ? DesignTokenColors.primary500 : 'transparent')};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-right: 25px;
  text-align: center;
  width: 169px;

  img {
    content: url(${({ isActive }) => (isActive ? StepOneActiveIcon : StepOneIcon)});
  }

  a {
    font-weight: ${({ isActive }) => (isActive ? '600' : 'normal')};
    color: ${({ isActive }) => (isActive ? DesignTokenColors.primary500 : 'inherit')};

    &:hover {
      color: ${DesignTokenColors.primary500};
      font-weight: 600;
      text-decoration: underline;
    }
  }

  &:hover {
    border-bottom: 2px solid ${DesignTokenColors.primary500};
  }
`;

const StepTwoIconAndText = styled('div')`
  align-items: center;
  border-bottom: 2px solid ${({ isActive }) => (isActive ? DesignTokenColors.primary500 : 'transparent')};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-left: 25px;
  text-align: center;
  width: 109px;

  img {
    content: url(${({ isActive }) => (isActive ? StepTwoActiveIcon : StepTwoIcon)});
  }

  a {
    font-weight: ${({ isActive }) => (isActive ? '600' : 'normal')};
    color: ${({ isActive }) => (isActive ? DesignTokenColors.primary500 : 'inherit')};

    &:hover {
      color: ${DesignTokenColors.primary500};
      font-weight: 600;
    }
  }

  &:hover {
   // border-bottom: 2px solid ${DesignTokenColors.primary500};
  }
`;

const HorizontalLine = styled('div')`
  border-top: 1px solid ${DesignTokenColors.neutral100};
  left: calc(50% - 67px);
  position: absolute;
  top: 20%;
  width: 164px;
`;

export default withRouter(withStyles(commonMuiStyles)(ChallengeInviteSteps));
