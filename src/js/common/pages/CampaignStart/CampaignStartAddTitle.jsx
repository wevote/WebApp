import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import CampaignStartActions from '../../actions/CampaignStartActions';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../components/Style/adviceBoxStyles';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import { OuterWrapper, PageWrapper } from '../../components/Style/stepDisplayStyles';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import CampaignTitleInputField from '../../components/CampaignStart/CampaignTitleInputField';
import CampaignStartSteps from '../../components/Navigation/CampaignStartSteps';
import { CampaignProcessStepIntroductionText, CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles';
import { CampaignStartDesktopButtonPanel, CampaignStartDesktopButtonWrapper, CampaignStartMobileButtonPanel, CampaignStartMobileButtonWrapper, CampaignStartSection, CampaignStartSectionWrapper } from '../../components/Style/CampaignStartStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStartStore from '../../stores/CampaignStartStore';
import initializejQuery from '../../utils/initializejQuery';


class CampaignStartAddTitle extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignStartAddTitle, componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    initializejQuery(() => {
      CampaignStartActions.campaignRetrieveAsOwner('');
    });
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  submitCampaignTitle = () => {
    const campaignTitleQueuedToSave = CampaignStartStore.getCampaignTitleQueuedToSave();
    const campaignTitleQueuedToSaveSet = CampaignStartStore.getCampaignTitleQueuedToSaveSet();
    if (campaignTitleQueuedToSaveSet) {
      // console.log('CampaignStartAddTitle, campaignTitleQueuedToSave:', campaignTitleQueuedToSave);
      const campaignWeVoteId = '';
      CampaignStartActions.campaignTitleSave(campaignWeVoteId, campaignTitleQueuedToSave);
      CampaignStartActions.campaignTitleQueuedToSave('');
    }
    historyPush('/who-do-you-want-to-see-elected');
  }

  render () {
    renderLog('CampaignStartAddTitle');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenWebsiteName } = this.state;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title={`Add Campaign Title - ${chosenWebsiteName}`} />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <CampaignStartSteps atStepNumber1 />
              <CampaignProcessStepTitle>
                Write your campaign title
              </CampaignProcessStepTitle>
              {/* <CampaignProcessStepIntroductionText> */}
              {/*  This is the first thing people will see about your campaign. Get their attention with a short title that focuses on what the candidate(s) you support will do to improve people&apos;s lives. */}
              {/* </CampaignProcessStepIntroductionText> */}
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <CampaignTitleInputField />
                  <CampaignStartDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignStartDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveCampaignTitle"
                        onClick={this.submitCampaignTitle}
                        variant="contained"
                      >
                        Continue
                      </Button>
                    </CampaignStartDesktopButtonPanel>
                  </CampaignStartDesktopButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Keep it short and to the point
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Example: &quot;Sam Davis for Oakland School Board&quot;
                      </AdviceBoxText>
                      <AdviceBoxText>
                        Not: &quot;If you want to have your kids be more engaged at school, vote for Sam Davis for Oakland School Board&quot;
                      </AdviceBoxText>
                    </AdviceBox>
                  </AdviceBoxWrapper>
                </CampaignStartSection>
              </CampaignStartSectionWrapper>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
        <CampaignStartMobileButtonWrapper className="u-show-mobile">
          <CampaignStartMobileButtonPanel>
            <Button
              classes={{ root: mobileButtonClasses }}
              color="primary"
              id="saveCampaignTitleFooter"
              onClick={this.submitCampaignTitle}
              variant="contained"
            >
              Continue
            </Button>
          </CampaignStartMobileButtonPanel>
        </CampaignStartMobileButtonWrapper>
      </div>
    );
  }
}
CampaignStartAddTitle.propTypes = {
  classes: PropTypes.object,
};


const InnerWrapper = styled('div')`
`;


export default withStyles(commonMuiStyles)(CampaignStartAddTitle);
