import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
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
  constructor (props) {
    super(props);
    this.state = {
      step1Completed: false,
      step2Completed: false,
      isHovered1: false,
      isHovered2: false,
    };
  }

  componentDidMount () {
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

  render () {
    const { step1Completed, step2Completed, isHovered1, isHovered2 } =
      this.state;

    return (
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#F2F2F0',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          position: 'relative',
        }}
      >
        {/* Rocket, Invite more friends, and Learn More */}
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 'auto',
            }}
          >
            <div
              style={{
                backgroundColor: '#D2D2D2',
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
          </div>
        </div>

        {/* Steps (Step 1, Line, Step 2) */}
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Step 1 Icon and Text */}
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              width: '169px',
              textAlign: 'center',
              marginRight: '25px',
              cursor: 'pointer',
            }}
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
                  isHovered1 || step1Completed ?
                    hoverFontWeight :
                    defaultFontWeight,
                color: isHovered1 ? '#206DB3' : baseTextColor,
                textDecoration: 'none',
              }}
            >
              Customize the message to your friends
            </Link>
          </div>

          {/* Horizontal Line */}
          <div
            style={{
              borderTop: '1px solid #D2D2D2',
              left: 'calc(50% - 67px)',
              position: 'absolute',
              top: '20%',
              width: '164px',
            }}
          />

          {/* Step 2 Icon and Text */}
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              width: '109px',
              textAlign: 'center',
              marginLeft: '25px',
              cursor: 'pointer',
            }}
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
          </div>
        </div>
      </div>
    );
  }
}

ChallengeInviteSteps.propTypes = {
  classes: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
};

export default withStyles(commonMuiStyles)(ChallengeInviteSteps);
