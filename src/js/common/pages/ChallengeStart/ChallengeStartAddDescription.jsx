import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import ChallengeStartActions from '../../actions/ChallengeStartActions';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../components/Style/adviceBoxStyles';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import { OuterWrapper, PageWrapper } from '../../components/Style/stepDisplayStyles';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import ChallengeDescriptionInputField from '../../components/ChallengeStart/ChallengeDescriptionInputField';
import ChallengeStartSteps from '../../components/Navigation/ChallengeStartSteps';
import { CampaignProcessStepIntroductionText, CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles';
import { CampaignStartDesktopButtonPanel, CampaignStartDesktopButtonWrapper, CampaignStartMobileButtonPanel, CampaignStartMobileButtonWrapper, CampaignStartSection, CampaignStartSectionWrapper } from '../../components/Style/CampaignStartStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeStartStore from '../../stores/ChallengeStartStore';
import initializejQuery from '../../utils/initializejQuery';


class ChallengeStartAddDescription extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('ChallengeStartAddDescription, componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    initializejQuery(() => {
      ChallengeStartActions.challengeRetrieveAsOwner('');
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

  submitChallengeDescription = () => {
    const challengeDescriptionQueuedToSave = ChallengeStartStore.getChallengeDescriptionQueuedToSave();
    const challengeDescriptionQueuedToSaveSet = ChallengeStartStore.getChallengeDescriptionQueuedToSaveSet();
    if (challengeDescriptionQueuedToSaveSet) {
      // console.log('ChallengeStartAddDescription, challengeDescriptionQueuedToSave:', challengeDescriptionQueuedToSave);
      const challengeWeVoteId = '';
      ChallengeStartActions.challengeDescriptionSave(challengeWeVoteId, challengeDescriptionQueuedToSave);
      ChallengeStartActions.challengeDescriptionQueuedToSave(undefined);
    }
    historyPush('/start-a-challenge-add-photo');
  }

  render () {
    renderLog('ChallengeStartAddDescription');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenWebsiteName } = this.state;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title={`Add Description - ${chosenWebsiteName}`} />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ChallengeStartSteps atStepNumber2 />
              <CampaignProcessStepTitle>
                Describe your challenge
              </CampaignProcessStepTitle>
              {/* <CampaignProcessStepIntroductionText> */}
              {/*  Get Out the Vote Florida */}
              {/* </CampaignProcessStepIntroductionText> */}
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <ChallengeDescriptionInputField />
                  <CampaignStartDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignStartDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveChallengeDescription"
                        onClick={this.submitChallengeDescription}
                        variant="contained"
                      >
                        Continue
                      </Button>
                    </CampaignStartDesktopButtonPanel>
                  </CampaignStartDesktopButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Make it personal
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Your friends and followers are more likely to join your challenge if it’s clear why you care.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Respect others
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Don’t bully, use hate speech, threaten violence or make things up.
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
              id="saveChallengeDescriptionFooter"
              onClick={this.submitChallengeDescription}
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
ChallengeStartAddDescription.propTypes = {
  classes: PropTypes.object,
};

const InnerWrapper = styled('div')`
`;


export default withStyles(commonMuiStyles)(ChallengeStartAddDescription);
