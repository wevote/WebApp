import { Done } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import commonMuiStyles from '../Style/commonMuiStyles';
import { InnerWrapper, OuterWrapperPageTitle, OuterWrapperSteps, OuterWrapperStepsOff, PageTitle, StepCircle, StepNumber, StepWrapper } from '../Style/stepDisplayStyles';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import VoterStore from '../../../stores/VoterStore';
import { onStep1ClickPath, onStep2ClickPath, onStep3ClickPath, onStep4ClickPath } from '../../utils/superSharingStepPaths';


class SuperSharingSteps extends Component {
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
    // console.log('SuperSharingSteps, componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SuperSharingSteps componentDidUpdate');
    const {
      campaignXNewsItemWeVoteId: campaignXNewsItemWeVoteIdPrevious,
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXNewsItemWeVoteId,
      campaignXWeVoteId,
    } = this.props;
    let updateFromStore = false;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        updateFromStore = true;
      }
    }
    if (campaignXNewsItemWeVoteId) {
      if (campaignXNewsItemWeVoteId !== campaignXNewsItemWeVoteIdPrevious) {
        updateFromStore = true;
      }
    }
    if (updateFromStore) {
      this.onCampaignStoreChange();
    }
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
  }

  onCampaignStoreChange () {
    const { campaignXNewsItemWeVoteId } = this.props;
    const { voterContactEmailListCount } = this.state;
    let inDraftMode = true;
    if (campaignXNewsItemWeVoteId) {
      const campaignXNewsItem = CampaignStore.getCampaignXNewsItemByWeVoteId(campaignXNewsItemWeVoteId);
      ({
        in_draft_mode: inDraftMode,
      } = campaignXNewsItem);
    }
    // atStepNumber1, atStepNumber2, atStepNumber3, atStepNumber4
    const step1Completed = Boolean(voterContactEmailListCount);
    const step2Completed = false;
    const step3Completed = campaignXNewsItemWeVoteId && !inDraftMode;
    const step4Completed = false;
    this.setState({
      step1Completed,
      step2Completed,
      step3Completed,
      step4Completed,
    });
  }

  onVoterStoreChange () {
    const voterContactEmailList = VoterStore.getVoterContactEmailList();
    const voterContactEmailListCount = voterContactEmailList.length;
    const step1Completed = Boolean(voterContactEmailListCount);
    this.setState({
      step1Completed,
      voterContactEmailListCount,
    });
  }

  onStep1Click = () => {
    const { campaignBasePath, campaignXNewsItemWeVoteId, sms } = this.props;
    const step1ClickPath = onStep1ClickPath(campaignBasePath, campaignXNewsItemWeVoteId, sms);
    if (step1ClickPath) {
      historyPush(step1ClickPath);
    }
  }

  onStep2Click = () => {
    const { campaignBasePath, campaignXNewsItemWeVoteId, sms } = this.props;
    const step2ClickPath = onStep2ClickPath(campaignBasePath, campaignXNewsItemWeVoteId, sms);
    if (step2ClickPath) {
      historyPush(step2ClickPath);
    }
  }

  onStep3Click = () => {
    const { campaignBasePath, campaignXNewsItemWeVoteId, sms } = this.props;
    const step3ClickPath = onStep3ClickPath(campaignBasePath, campaignXNewsItemWeVoteId, sms);
    if (step3ClickPath) {
      historyPush(step3ClickPath);
    }
  }

  onStep4Click = () => {
    const { campaignBasePath, campaignXNewsItemWeVoteId, sms } = this.props;
    const step4ClickPath = onStep4ClickPath(campaignBasePath, campaignXNewsItemWeVoteId, sms);
    if (step4ClickPath) {
      historyPush(step4ClickPath);
    }
  }

  render () {
    renderLog('SuperSharingSteps');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      atStepNumber1, atStepNumber2, atStepNumber3, atStepNumber4,
      campaignBasePath, classes, sms,
    } = this.props;
    // let { campaignXNewsItemWeVoteId } = this.props;
    // campaignXNewsItemWeVoteId = campaignXNewsItemWeVoteId || '';
    const {
      step1Completed, step2Completed, step3Completed, step4Completed,
    } = this.state;
    let pageTitle = 'Private Emails Supercharged';
    if (sms) {
      pageTitle = 'Private Text Messages Supercharged';
    }
    return (
      <div>
        <OuterWrapperPageTitle>
          <InnerWrapper>
            <PageTitle>
              {pageTitle}
            </PageTitle>
          </InnerWrapper>
        </OuterWrapperPageTitle>
        {atStepNumber4 ? (
          <OuterWrapperStepsOff />
        ) : (
          <OuterWrapperSteps>
            <InnerWrapper>
              <StepWrapper>
                {step1Completed ? (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber1}
                    onClick={this.onStep1Click}
                  >
                    <StepNumber inverseColor={atStepNumber1}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber1}
                    onClick={this.onStep1Click}
                  >
                    <StepNumber inverseColor={atStepNumber1}>1</StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
              <StepWrapper>
                {step2Completed ? (
                  <StepCircle
                    className={campaignBasePath ? 'u-cursor--pointer' : ''}
                    inverseColor={atStepNumber2}
                    onClick={this.onStep2Click}
                  >
                    <StepNumber inverseColor={atStepNumber2}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className={campaignBasePath ? 'u-cursor--pointer' : ''}
                    inverseColor={atStepNumber2}
                    onClick={this.onStep2Click}
                  >
                    <StepNumber inverseColor={atStepNumber2}>2</StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
              <StepWrapper>
                {step3Completed ? (
                  <StepCircle
                    className={campaignBasePath ? 'u-cursor--pointer' : ''}
                    inverseColor={atStepNumber3}
                    onClick={this.onStep3Click}
                  >
                    <StepNumber inverseColor={atStepNumber3}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className={campaignBasePath ? 'u-cursor--pointer' : ''}
                    inverseColor={atStepNumber3}
                    onClick={this.onStep3Click}
                  >
                    <StepNumber inverseColor={atStepNumber3}>3</StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
              <StepWrapper>
                {step4Completed ? (
                  <StepCircle
                    className={campaignBasePath ? 'u-cursor--pointer' : ''}
                    inverseColor={atStepNumber4}
                    onClick={this.onStep4Click}
                  >
                    <StepNumber inverseColor={atStepNumber4}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className={campaignBasePath ? 'u-cursor--pointer' : ''}
                    inverseColor={atStepNumber4}
                    onClick={this.onStep4Click}
                  >
                    <StepNumber inverseColor={atStepNumber4}>4</StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
            </InnerWrapper>
          </OuterWrapperSteps>
        )}
      </div>
    );
  }
}
SuperSharingSteps.propTypes = {
  classes: PropTypes.object,
  atStepNumber1: PropTypes.bool,
  atStepNumber2: PropTypes.bool,
  atStepNumber3: PropTypes.bool,
  atStepNumber4: PropTypes.bool,
  campaignBasePath: PropTypes.string,
  campaignXNewsItemWeVoteId: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
  sms: PropTypes.bool,
};

export default withStyles(commonMuiStyles)(SuperSharingSteps);
