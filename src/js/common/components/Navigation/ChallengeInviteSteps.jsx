import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import commonMuiStyles from '../Style/commonMuiStyles';
import historyPush from '../../utils/historyPush';//We can use this to navigate to different steps later
import { OuterWrapper, StepCircle, StepNumber, StepWrapper } from '../Style/stepDisplayStyles';

// URLs for the steps
const STEP1_URL = '/:challengeSEOFriendlyPath/+/customize-message';
const STEP2_URL = '/:challengeSEOFriendlyPath/+/copy-message';

// Import the rocket ship SVG icon
import StepOneIcon from '../../../../img/global/svg-icons/issues/material-symbols-counter-1.svg';
import StepTwoIcon from '../../../../img/global/svg-icons/issues/material-symbols-counter-2.svg';
import RocketIcon from '../../../../img/global/svg-icons/issues/rocket-ship.svg';


// Styles Object
const styles = {
    outerWrapper: {
      alignItems: 'center',
      backgroundColor: '#F2F2F0',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      position: 'relative',
    },
    headerContainer: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative',
      textAlign: 'left',
      width: '100%',
    },
    rocketIcon: {
      height: '70px',
      position: 'relative',
      width: '40px',
    },
    headerText: {
      flex: '1',
      fontFamily: 'Poppins',
      fontSize: '28px',
      fontWeight: '600',
      lineHeight: '35px',
      margin: '0 10px',
      textAlign: 'left',
    },
    verticalLine: {
      backgroundColor: '#D2D2D2',
      height: '25px',
      marginRight: '10px',
      width: '1px',
    },
    learnMoreLink: {
      color: '#0858A1',
      fontSize: '16px',
      fontWeight: '500',
      textDecoration: 'none',
      width: '52px',
    },
    stepsContainer: {
      alignItems: 'flex-start',
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
      position: 'relative',
      width: '100%',
    },
    stepIconContainer: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      marginRight: '10px',
      zIndex: 1,
    },
    stepIcon: {
      height: '24px',
      marginBottom: '5px',
      width: '24px',
    },
    stepText: {
      fontSize: '16px',
      marginBottom: '15px',
      textAlign: 'center',
      width: '169px',
    },
    horizontalLine: {
      borderTop: '1px solid #D2D2D2',
      left: 'calc(50% - 90px)',
      position: 'absolute',
      top: '10%',
      width: '170px',
      zIndex: 0,
    },
  };

// ChallengeInviteSteps component
class ChallengeInviteSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step1Completed: false,
      step2Completed: false,
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
  }

  render() {
    const { step1Completed, step2Completed } = this.state;
    const { classes, currentStep } = this.props;

    return (
      <OuterWrapper style={styles.outerWrapper}>
        {/* Rocket, Invite more friends, and Learn More */}
        <div style={styles.headerContainer}>
          {/* Rocket Icon */}
          <img src={RocketIcon} alt="Rocket Icon" style={styles.rocketIcon} />

          {/* Title Text */}
          <h2 style={styles.headerText}>
            To boost your ranking, invite your friends to join.
          </h2>

          {/* Vertical Line and Learn More Link */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            {/* Vertical Line */}
            <div style={styles.verticalLine}></div>

            {/* Learn More Link */}
            <a href="#" style={styles.learnMoreLink}>
              Learn more
            </a>
          </div>
        </div>

        {/* Steps (Step 1, Line, Step 2) */}
        <div style={styles.stepsContainer}>
          {/* Step 1 Icon and Text */}
          <div style={{ ...styles.stepIconContainer, marginRight: '10px' }}>
            <img src={StepOneIcon} alt="Step 1 Icon" style={styles.stepIcon} />
            <Link to={`${this.getChallengeBasePath()}customize-message`} style={styles.stepText}>
              Customize the message to your friends
            </Link>
          </div>

          {/* Horizontal Line */}
          <div style={styles.horizontalLine}></div>

          {/* Step 2 Icon and Text */}
          <div style={{ ...styles.stepIconContainer, marginLeft: '10px' }}>
            <img src={StepTwoIcon} alt="Step 2 Icon" style={styles.stepIcon} />
            <Link to={`${this.getChallengeBasePath()}invite-friends`} style={styles.stepText}>
              Copy message & link
            </Link>
          </div>
        </div>
      </OuterWrapper>
    );
  }
}

ChallengeInviteSteps.propTypes = {
  classes: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
};

export default withStyles(commonMuiStyles)(ChallengeInviteSteps);
