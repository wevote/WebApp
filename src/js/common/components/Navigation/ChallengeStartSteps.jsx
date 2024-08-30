import withStyles from '@mui/styles/withStyles';
import { Done } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import commonMuiStyles from '../Style/commonMuiStyles';
import { InnerWrapper, OuterWrapper, StepCircle, StepNumber, StepWrapper } from '../Style/stepDisplayStyles';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import ChallengeStartStore from '../../stores/ChallengeStartStore';

const STEP1_URL = '/start-a-challenge-add-title';
const STEP2_URL = '/start-a-challenge-why-winning-matters';
const STEP3_URL = '/start-a-challenge-add-photo';
// const STEP4_URL = '/who-do-you-want-to-see-elected';

class ChallengeStartSteps extends Component {
  constructor (props) {
    super(props);
    this.state = {
      step1Completed: false,
      step2Completed: false,
      step3Completed: false,
    };
  }

  componentDidMount () {
    // console.log('ChallengeStartSteps, componentDidMount');
    this.challengeStartStoreListener = ChallengeStartStore.addListener(this.onChallengeStartStoreChange.bind(this));
    const step1Completed = ChallengeStartStore.challengeTitleExists();
    const step2Completed = ChallengeStartStore.challengeDescriptionExists();
    const step3Completed = ChallengeStartStore.challengePhotoExists();
    this.setState({
      step1Completed,
      step2Completed,
      step3Completed,
    });
  }

  componentWillUnmount () {
    this.challengeStartStoreListener.remove();
  }

  onChallengeStartStoreChange () {
    const step1Completed = ChallengeStartStore.challengeTitleExists();
    const step2Completed = ChallengeStartStore.challengeDescriptionExists();
    const step3Completed = ChallengeStartStore.challengePhotoExists();
    // console.log('onChallengeStartStoreChange step1Completed: ', step1Completed, ', step2Completed: ', step2Completed, ', step3Completed:', step3Completed);
    this.setState({
      step1Completed,
      step2Completed,
      step3Completed,
    });
  }

  render () {
    renderLog('ChallengeStartSteps');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      atStepNumber1, atStepNumber2, atStepNumber3,
      classes,
    } = this.props;
    const {
      step1Completed, step2Completed, step3Completed,
    } = this.state;
    return (
      <div>
        <OuterWrapper>
          <InnerWrapper>
            <StepWrapper>
              {step1Completed ? (
                <StepCircle inverseColor={atStepNumber1} onClick={() => historyPush(STEP1_URL)}>
                  <StepNumber inverseColor={atStepNumber1}>
                    <Done classes={{ root: classes.doneIcon }} />
                  </StepNumber>
                </StepCircle>
              ) : (
                <StepCircle inverseColor={atStepNumber1} onClick={() => historyPush(STEP1_URL)}>
                  <StepNumber inverseColor={atStepNumber1}>1</StepNumber>
                </StepCircle>
              )}
            </StepWrapper>
            <StepWrapper>
              {step2Completed ? (
                <StepCircle inverseColor={atStepNumber2} onClick={() => historyPush(STEP2_URL)}>
                  <StepNumber inverseColor={atStepNumber2}>
                    <Done classes={{ root: classes.doneIcon }} />
                  </StepNumber>
                </StepCircle>
              ) : (
                <StepCircle inverseColor={atStepNumber2} onClick={() => historyPush(STEP2_URL)}>
                  <StepNumber inverseColor={atStepNumber2}>2</StepNumber>
                </StepCircle>
              )}
            </StepWrapper>
            <StepWrapper>
              {step3Completed ? (
                <StepCircle inverseColor={atStepNumber3} onClick={() => historyPush(STEP3_URL)}>
                  <StepNumber inverseColor={atStepNumber3}>
                    <Done classes={{ root: classes.doneIcon }} />
                  </StepNumber>
                </StepCircle>
              ) : (
                <StepCircle inverseColor={atStepNumber3} onClick={() => historyPush(STEP3_URL)}>
                  <StepNumber inverseColor={atStepNumber3}>3</StepNumber>
                </StepCircle>
              )}
            </StepWrapper>
            {/* <StepWrapper> */}
            {/*  {step4Completed ? ( */}
            {/*    <StepCircle inverseColor={atStepNumber4} onClick={() => historyPush(STEP4_URL)}> */}
            {/*      <StepNumber inverseColor={atStepNumber4}> */}
            {/*        <Done classes={{ root: classes.doneIcon }} /> */}
            {/*      </StepNumber> */}
            {/*    </StepCircle> */}
            {/*  ) : ( */}
            {/*    <StepCircle inverseColor={atStepNumber4} onClick={() => historyPush(STEP4_URL)}> */}
            {/*      <StepNumber inverseColor={atStepNumber4}>4</StepNumber> */}
            {/*    </StepCircle> */}
            {/*  )} */}
            {/* </StepWrapper> */}
          </InnerWrapper>
        </OuterWrapper>
      </div>
    );
  }
}
ChallengeStartSteps.propTypes = {
  classes: PropTypes.object,
  atStepNumber1: PropTypes.bool,
  atStepNumber2: PropTypes.bool,
  atStepNumber3: PropTypes.bool,
  // atStepNumber4: PropTypes.bool,
};

export default withStyles(commonMuiStyles)(ChallengeStartSteps);
