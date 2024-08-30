import withStyles from '@mui/styles/withStyles';
import { Done } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import commonMuiStyles from '../Style/commonMuiStyles';
import { InnerWrapper, OuterWrapper, StepCircle, StepNumber, StepWrapper } from '../Style/stepDisplayStyles';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import CampaignStartStore from '../../stores/CampaignStartStore';


class CampaignStartSteps extends Component {
  constructor (props) {
    super(props);
    this.state = {
      step1Completed: false,
      step2Completed: false,
      step3Completed: false,
      step4Completed: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignStartSteps, componentDidMount');
    this.campaignStartStoreListener = CampaignStartStore.addListener(this.onCampaignStartStoreChange.bind(this));
    const step1Completed = CampaignStartStore.campaignTitleExists();
    const step2Completed = CampaignStartStore.campaignPoliticianListExists();
    const step3Completed = CampaignStartStore.campaignDescriptionExists();
    const step4Completed = CampaignStartStore.campaignPhotoExists();
    this.setState({
      step1Completed,
      step2Completed,
      step3Completed,
      step4Completed,
    });
  }

  componentWillUnmount () {
    this.campaignStartStoreListener.remove();
  }

  onCampaignStartStoreChange () {
    const step1Completed = CampaignStartStore.campaignTitleExists();
    const step2Completed = CampaignStartStore.campaignPoliticianListExists();
    const step3Completed = CampaignStartStore.campaignDescriptionExists();
    const step4Completed = CampaignStartStore.campaignPhotoExists();
    // console.log('onCampaignStartStoreChange step1Completed: ', step1Completed, ', step2Completed: ', step2Completed, ', step3Completed:', step3Completed);
    this.setState({
      step1Completed,
      step2Completed,
      step3Completed,
      step4Completed,
    });
  }

  render () {
    renderLog('CampaignStartSteps');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      atStepNumber1, atStepNumber2, atStepNumber3, atStepNumber4,
      classes,
    } = this.props;
    const {
      step1Completed, step2Completed, step3Completed, step4Completed,
    } = this.state;
    return (
      <div>
        <OuterWrapper>
          <InnerWrapper>
            <StepWrapper>
              {step1Completed ? (
                <StepCircle inverseColor={atStepNumber1} onClick={() => historyPush('/start-a-campaign-add-title')}>
                  <StepNumber inverseColor={atStepNumber1}>
                    <Done classes={{ root: classes.doneIcon }} />
                  </StepNumber>
                </StepCircle>
              ) : (
                <StepCircle inverseColor={atStepNumber1} onClick={() => historyPush('/start-a-campaign-add-title')}>
                  <StepNumber inverseColor={atStepNumber1}>1</StepNumber>
                </StepCircle>
              )}
            </StepWrapper>
            <StepWrapper>
              {step2Completed ? (
                <StepCircle inverseColor={atStepNumber2} onClick={() => historyPush('/who-do-you-want-to-see-elected')}>
                  <StepNumber inverseColor={atStepNumber2}>
                    <Done classes={{ root: classes.doneIcon }} />
                  </StepNumber>
                </StepCircle>
              ) : (
                <StepCircle inverseColor={atStepNumber2} onClick={() => historyPush('/who-do-you-want-to-see-elected')}>
                  <StepNumber inverseColor={atStepNumber2}>2</StepNumber>
                </StepCircle>
              )}
            </StepWrapper>
            <StepWrapper>
              {step3Completed ? (
                <StepCircle inverseColor={atStepNumber3} onClick={() => historyPush('/start-a-campaign-why-winning-matters')}>
                  <StepNumber inverseColor={atStepNumber3}>
                    <Done classes={{ root: classes.doneIcon }} />
                  </StepNumber>
                </StepCircle>
              ) : (
                <StepCircle inverseColor={atStepNumber3} onClick={() => historyPush('/start-a-campaign-why-winning-matters')}>
                  <StepNumber inverseColor={atStepNumber3}>3</StepNumber>
                </StepCircle>
              )}
            </StepWrapper>
            <StepWrapper>
              {step4Completed ? (
                <StepCircle inverseColor={atStepNumber4} onClick={() => historyPush('/start-a-campaign-add-photo')}>
                  <StepNumber inverseColor={atStepNumber4}>
                    <Done classes={{ root: classes.doneIcon }} />
                  </StepNumber>
                </StepCircle>
              ) : (
                <StepCircle inverseColor={atStepNumber4} onClick={() => historyPush('/start-a-campaign-add-photo')}>
                  <StepNumber inverseColor={atStepNumber4}>4</StepNumber>
                </StepCircle>
              )}
            </StepWrapper>
          </InnerWrapper>
        </OuterWrapper>
      </div>
    );
  }
}
CampaignStartSteps.propTypes = {
  classes: PropTypes.object,
  atStepNumber1: PropTypes.bool,
  atStepNumber2: PropTypes.bool,
  atStepNumber3: PropTypes.bool,
  atStepNumber4: PropTypes.bool,
};

export default withStyles(commonMuiStyles)(CampaignStartSteps);
