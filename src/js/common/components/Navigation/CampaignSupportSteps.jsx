import withStyles from '@mui/styles/withStyles';
import { Done } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import commonMuiStyles from '../Style/commonMuiStyles';
import { InnerWrapper, OuterWrapperPageTitle, OuterWrapperSteps, PageTitle, StepCircle, StepNumber, StepWrapper } from '../Style/stepDisplayStyles';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';

class CampaignSupportSteps extends Component {
  constructor (props) {
    super(props);
    this.state = {
      step1Completed: true,
      step2Completed: false,
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      sharingStepCompleted: false,
      siteConfigurationHasBeenRetrieved: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignSupportSteps, componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onCampaignSupporterStoreChange();
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    const step1Completed = true;
    this.setState({
      step1Completed,
    });
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignSupportSteps componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignSupporterStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.campaignSupporterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const inPrivateLabelMode = AppObservableStore.inPrivateLabelMode();
    const siteConfigurationHasBeenRetrieved = AppObservableStore.siteConfigurationHasBeenRetrieved();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    const payToPromoteStepTurnedOn = !inPrivateLabelMode;
    this.setState({
      payToPromoteStepTurnedOn,
      siteConfigurationHasBeenRetrieved,
    });
  }

  onCampaignSupporterStoreChange () {
    const { atPayToPromoteStep, atSharingStep, campaignXWeVoteId } = this.props;
    const step2Completed = atPayToPromoteStep || atSharingStep || CampaignSupporterStore.voterSupporterEndorsementExists(campaignXWeVoteId);
    const payToPromoteStepCompleted = atSharingStep;
    const sharingStepCompleted = false;
    // console.log('onCampaignSupporterStoreChange step1Completed: ', step1Completed, ', step2Completed: ', step2Completed, ', payToPromoteStepCompleted:', payToPromoteStepCompleted);
    this.setState({
      step2Completed,
      payToPromoteStepCompleted,
      sharingStepCompleted,
    });
  }

  render () {
    renderLog('CampaignSupportSteps');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      atStepNumber1, atStepNumber2, atPayToPromoteStep, atSharingStep,
      campaignBasePath, classes,
    } = this.props;
    const {
      step1Completed, step2Completed, payToPromoteStepCompleted,
      payToPromoteStepTurnedOn, sharingStepCompleted, siteConfigurationHasBeenRetrieved,
    } = this.state;
    return (
      <div>
        <OuterWrapperPageTitle>
          <InnerWrapper>
            <PageTitle>
              Complete Your Support
            </PageTitle>
          </InnerWrapper>
        </OuterWrapperPageTitle>
        <OuterWrapperSteps>
          {siteConfigurationHasBeenRetrieved && (
            <InnerWrapper>
              <StepWrapper>
                {step1Completed ? (
                  <StepCircle
                    className="u-cursor--pointer"
                    onClick={() => historyPush(`${campaignBasePath}`)}
                  >
                    <StepNumber>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber1}
                    onClick={() => historyPush(`${campaignBasePath}`)}
                  >
                    <StepNumber inverseColor={atStepNumber1}>1</StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
              <StepWrapper>
                {step2Completed ? (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber2}
                    onClick={() => historyPush(`${campaignBasePath}/why-do-you-support`)}
                  >
                    <StepNumber inverseColor={atStepNumber2}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber2}
                    onClick={() => historyPush(`${campaignBasePath}/why-do-you-support`)}
                  >
                    <StepNumber inverseColor={atStepNumber2}>2</StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
              {payToPromoteStepTurnedOn && (
                <StepWrapper>
                  {payToPromoteStepCompleted ? (
                    <StepCircle
                      className="u-cursor--pointer"
                      inverseColor={atPayToPromoteStep}
                      onClick={() => historyPush(`${campaignBasePath}/pay-to-promote`)}
                    >
                      <StepNumber inverseColor={atPayToPromoteStep}>
                        <Done classes={{ root: classes.doneIcon }} />
                      </StepNumber>
                    </StepCircle>
                  ) : (
                    <StepCircle
                      className="u-cursor--pointer"
                      inverseColor={atPayToPromoteStep}
                      onClick={() => historyPush(`${campaignBasePath}/pay-to-promote`)}
                    >
                      <StepNumber inverseColor={atPayToPromoteStep}>3</StepNumber>
                    </StepCircle>
                  )}
                </StepWrapper>
              )}
              <StepWrapper>
                {sharingStepCompleted ? (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atSharingStep}
                    onClick={() => historyPush(`${campaignBasePath}/share-campaign`)}
                  >
                    <StepNumber inverseColor={atSharingStep}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atSharingStep}
                    onClick={() => historyPush(`${campaignBasePath}/share-campaign`)}
                  >
                    <StepNumber inverseColor={atSharingStep}>
                      {payToPromoteStepTurnedOn ? '4' : '3'}
                    </StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
            </InnerWrapper>
          )}
        </OuterWrapperSteps>
      </div>
    );
  }
}
CampaignSupportSteps.propTypes = {
  classes: PropTypes.object,
  atStepNumber1: PropTypes.bool,
  atStepNumber2: PropTypes.bool,
  atPayToPromoteStep: PropTypes.bool,
  atSharingStep: PropTypes.bool,
  campaignBasePath: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
};

export default withStyles(commonMuiStyles)(CampaignSupportSteps);
