import { Done } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import commonMuiStyles from '../Style/commonMuiStyles';
import { InnerWrapper, OuterWrapperPageTitle, OuterWrapperSteps, PageTitle, StepCircle, StepNumber, StepWrapper } from '../Style/stepDisplayStyles';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';


class CampaignNewsItemPublishSteps extends Component {
  constructor (props) {
    super(props);
    this.state = {
      step1Completed: false,
      step2Completed: false,
      step3Completed: false,
      step4Completed: false,
      siteConfigurationHasBeenRetrieved: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignNewsItemPublishSteps, componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignNewsItemPublishSteps componentDidUpdate');
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
  }

  onAppObservableStoreChange () {
    const siteConfigurationHasBeenRetrieved = AppObservableStore.siteConfigurationHasBeenRetrieved();
    this.setState({
      siteConfigurationHasBeenRetrieved,
    });
  }

  onCampaignStoreChange () {
    const { atStepNumber3, atStepNumber4, campaignXNewsItemWeVoteId } = this.props;
    let inDraftMode = true;
    if (campaignXNewsItemWeVoteId) {
      const campaignXNewsItem = CampaignStore.getCampaignXNewsItemByWeVoteId(campaignXNewsItemWeVoteId);
      ({
        in_draft_mode: inDraftMode,
      } = campaignXNewsItem);
    }
    // atStepNumber1, atStepNumber2, atStepNumber3, atStepNumber4
    const step1Completed = CampaignStore.campaignNewsItemTextExists(campaignXNewsItemWeVoteId);
    const step2Completed = !inDraftMode || atStepNumber3 || atStepNumber4;
    const step3Completed = campaignXNewsItemWeVoteId && !inDraftMode;
    const step4Completed = false;
    this.setState({
      step1Completed,
      step2Completed,
      step3Completed,
      step4Completed,
    });
  }

  onStep2Click = () => {
    const { campaignBasePath } = this.props;
    const { campaignXNewsItemWeVoteId } = this.props;
    if (campaignBasePath && campaignXNewsItemWeVoteId) {
      historyPush(`${campaignBasePath}/u-preview/${campaignXNewsItemWeVoteId}`);
    }
  }

  onStep3Click = () => {
    const { campaignBasePath } = this.props;
    const { campaignXNewsItemWeVoteId } = this.props;
    if (campaignBasePath && campaignXNewsItemWeVoteId) {
      historyPush(`${campaignBasePath}/send/${campaignXNewsItemWeVoteId}`);
    }
  }

  onStep4Click = () => {
    const { campaignBasePath } = this.props;
    const { campaignXNewsItemWeVoteId } = this.props;
    if (campaignBasePath && campaignXNewsItemWeVoteId) {
      historyPush(`${campaignBasePath}/share/${campaignXNewsItemWeVoteId}`);
    }
  }

  render () {
    renderLog('CampaignNewsItemPublishSteps');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      atStepNumber1, atStepNumber2, atStepNumber3, atStepNumber4,
      campaignBasePath, classes,
    } = this.props;
    let { campaignXNewsItemWeVoteId } = this.props;
    const {
      step1Completed, step2Completed, step3Completed, step4Completed,
      siteConfigurationHasBeenRetrieved,
    } = this.state;
    campaignXNewsItemWeVoteId = campaignXNewsItemWeVoteId || '';
    return (
      <div>
        <OuterWrapperPageTitle>
          <InnerWrapper>
            <PageTitle>
              Update Supporters
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
                    inverseColor={atStepNumber1}
                    onClick={() => historyPush(`${campaignBasePath}/add-update/${campaignXNewsItemWeVoteId}`)}
                  >
                    <StepNumber inverseColor={atStepNumber1}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className="u-cursor--pointer"
                    inverseColor={atStepNumber1}
                    onClick={() => historyPush(`${campaignBasePath}/add-update/${campaignXNewsItemWeVoteId}`)}
                  >
                    <StepNumber inverseColor={atStepNumber1}>1</StepNumber>
                  </StepCircle>
                )}
              </StepWrapper>
              <StepWrapper>
                {step2Completed ? (
                  <StepCircle
                    className={campaignBasePath && campaignXNewsItemWeVoteId ? 'u-cursor--pointer' : ''}
                    inverseColor={atStepNumber2}
                    onClick={this.onStep2Click}
                  >
                    <StepNumber inverseColor={atStepNumber2}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className={campaignBasePath && campaignXNewsItemWeVoteId ? 'u-cursor--pointer' : ''}
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
                    className={campaignBasePath && campaignXNewsItemWeVoteId ? 'u-cursor--pointer' : ''}
                    inverseColor={atStepNumber3}
                    onClick={this.onStep3Click}
                  >
                    <StepNumber inverseColor={atStepNumber3}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className={campaignBasePath && campaignXNewsItemWeVoteId ? 'u-cursor--pointer' : ''}
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
                    className={campaignBasePath && campaignXNewsItemWeVoteId ? 'u-cursor--pointer' : ''}
                    inverseColor={atStepNumber4}
                    onClick={this.onStep4Click}
                  >
                    <StepNumber inverseColor={atStepNumber4}>
                      <Done classes={{ root: classes.doneIcon }} />
                    </StepNumber>
                  </StepCircle>
                ) : (
                  <StepCircle
                    className={campaignBasePath && campaignXNewsItemWeVoteId ? 'u-cursor--pointer' : ''}
                    inverseColor={atStepNumber4}
                    onClick={this.onStep4Click}
                  >
                    <StepNumber inverseColor={atStepNumber4}>4</StepNumber>
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
CampaignNewsItemPublishSteps.propTypes = {
  classes: PropTypes.object,
  atStepNumber1: PropTypes.bool,
  atStepNumber2: PropTypes.bool,
  atStepNumber3: PropTypes.bool,
  atStepNumber4: PropTypes.bool,
  campaignBasePath: PropTypes.string,
  campaignXNewsItemWeVoteId: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
};

export default withStyles(commonMuiStyles)(CampaignNewsItemPublishSteps);
