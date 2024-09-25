import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import styled from 'styled-components';
import commonMuiStyles from '../Style/commonMuiStyles';

// Import icons
import RocketIcon from '../../../../img/global/svg-icons/issues/rocket-ship.svg';
import StepOneIcon from '../../../../img/global/svg-icons/issues/material-symbols-counter-1.svg';
import StepOneActiveIcon from '../../../../img/global/svg-icons/issues/material-symbols-counter-1-active.svg';
import StepTwoIcon from '../../../../img/global/svg-icons/issues/material-symbols-counter-2.svg';
import StepTwoActiveIcon from '../../../../img/global/svg-icons/issues/material-symbols-counter-2-active.svg';

import historyPush from '../../utils/historyPush'; // We will use this to navigate to different steps later
import {
  OuterWrapper,
  StepCircle,
  StepNumber,
  StepWrapper,
} from '../Style/stepDisplayStyles';

// URLs for the steps (Use later for navigation)
const STEP1_URL = '/:challengeSEOFriendlyPath/+/customize-message';
const STEP2_URL = '/:challengeSEOFriendlyPath/+/copy-message';


// Color and font variables
const baseTextColor = '#2A2A2C';
const hoverFontWeight = '600';
const defaultFontWeight = '400';
const fontFamily = 'Poppins';
const commonTextStyle = {
  fontSize: '13px',
  lineHeight: '15px',
  textAlign: 'center',
  fontFamily,
};
// ChallengeInviteSteps component
class ChallengeInviteSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step1Completed: false,
      step2Completed: false,
      isHovered1: false,
      isHovered2: false,
    };
  }

  componentDidMount() {
    // Status for the steps
    const step1Completed = false;
    const step2Completed = false;
    this.setState({
      step1Completed,
      step2Completed,
    });
  }

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

  // Handle mouse enter and leave events for hover effects
  handleMouseEnter = (step) => {
    this.setState({ [`isHovered${step}`]: true });
  };

  handleMouseLeave = (step) => {
    this.setState({ [`isHovered${step}`]: false });
  };

  render() {
    const { step1Completed, step2Completed, isHovered1, isHovered2 } =
      this.state;

    return (
      <ChallengeInviteStepsContainer>
        {/* Rocket, Invite more friends, and Learn More */}
        <HeaderContainer>
          <img
            src={RocketIcon}
            alt="Rocket Icon"
            style={{ height: '70px', width: '40px' }}
          />
          <h2
            style={{
              ...commonTextStyle,
              fontWeight: '600',
              fontSize: '20px',
              lineHeight: '25px',
              color: baseTextColor,
              width: '272px',
              height: '63px',
              margin: '0 10px',
            }}
          >
            To boost your ranking, invite your friends to join.
          </h2>
          <Wrapper>
            <LearnMoreTextBlock
              style={{
                height: '50px',
                width: '1px',
                marginRight: '15px',
              }}
            />
            <a
              href="#"
              style={{
                color: '#0858A1',
                fontSize: '13px',
                fontWeight: '500',
                textDecoration: 'none',
              }}
            >
              Learn more
            </a>
          </Wrapper>
        </HeaderContainer>

        {/* Steps (Step 1, Line, Step 2) */}
        <StepsContainer>
          {/* Step 1 Icon and Text */}
          <StepOneIconAndText
            onMouseEnter={() => this.handleMouseEnter(1)}
            onMouseLeave={() => this.handleMouseLeave(1)}
          >
            <img
              src={
                isHovered1 || step1Completed ? StepOneActiveIcon : StepOneIcon
              }
              alt="Step 1 Icon"
            />
            <Link
              to={`${this.getChallengeBasePath()}customize-message`}
              style={{
                ...commonTextStyle,
                fontWeight:
                  isHovered1
                  || step1Completed ?
                    hoverFontWeight :
                    defaultFontWeight,
                color: isHovered1 ? '#206DB3' : baseTextColor,
                textDecoration: 'none',
              }}
            >
              Customize the message to your friends
            </Link>
          </StepOneIconAndText>

          {/* Horizontal Line Between Steps */}
          <HorizontalLine />
          {/* Step 2 Icon and Text */}
          <StepTwoIconAndText
            onMouseEnter={() => this.handleMouseEnter(2)}
            onMouseLeave={() => this.handleMouseLeave(2)}
          >
            <img
              src={
                isHovered2 || step2Completed ? StepTwoActiveIcon : StepTwoIcon
              }
              alt="Step 2 Icon"
            />
            <Link
              to={`${this.getChallengeBasePath()}invite-friends`}
              style={{
                ...commonTextStyle,
                fontWeight:
                  isHovered2 || step2Completed ?
                    hoverFontWeight :
                    defaultFontWeight,
                color: baseTextColor,
                textDecoration: 'none',
              }}
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
  classes: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
};


// Styled Components

const ChallengeInviteStepsContainer = styled('div')`
  align-items: center;
  background-color: #f2f2f0;
  display: flex;
  flex-direction: column;
  max-width: 620px;
  padding: 20px;
  position: relative;
  // width: 445px;
  width: 100%;
`;

const HeaderContainer = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const LearnMoreTextBlock = styled('div')`
  height: 50px;
  width: 1px;
  margin-right: 15px;
`;

const StepsContainer = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
`;

const StepOneIconAndText = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 169px;
  text-align: center;
  margin-right: 25px;
  cursor: pointer;
`;

const StepTwoIconAndText = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 109px;
  text-align: center;
  margin-left: 25px;
  cursor: pointer;
`;

const HorizontalLine = styled('div')`
  border-top: 1px solid #d2d2d2;
  left: calc(50% - 67px);
  position: absolute;
  top: 20%;
  width: 164px;
`;

export default withStyles(commonMuiStyles)(ChallengeInviteSteps);
