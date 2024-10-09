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
import ChallengePhotoUpload from '../../components/ChallengeStart/ChallengePhotoUpload';
import ChallengeStartSteps from '../../components/Navigation/ChallengeStartSteps';
import { CampaignProcessStepIntroductionText, CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles';
import { CampaignStartDesktopButtonPanel, CampaignStartDesktopButtonWrapper, CampaignStartMobileButtonPanel, CampaignStartMobileButtonWrapper, CampaignStartSection, CampaignStartSectionWrapper } from '../../components/Style/CampaignStartStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeStartStore from '../../stores/ChallengeStartStore';
import initializejQuery from '../../utils/initializejQuery';


class ChallengeStartAddPhoto extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('ChallengeStartAddPhoto, componentDidMount');
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

  submitChallengePhoto = () => {
    const challengePhotoQueuedToSave = ChallengeStartStore.getChallengePhotoQueuedToSave();
    const challengePhotoQueuedToSaveSet = ChallengeStartStore.getChallengePhotoQueuedToSaveSet();
    if (challengePhotoQueuedToSaveSet) {
      // console.log('ChallengeStartAddPhoto, challengePhotoQueuedToSave:', challengePhotoQueuedToSave);
      const challengeWeVoteId = '';
      ChallengeStartActions.challengePhotoSave(challengeWeVoteId, challengePhotoQueuedToSave);
      ChallengeStartActions.challengePhotoQueuedToSave(undefined);
    }
    historyPush('/start-a-challenge-preview');
  }

  render () {
    renderLog('ChallengeStartAddPhoto');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenWebsiteName } = this.state;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title={`Add a Photo - ${chosenWebsiteName}`} />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ChallengeStartSteps atStepNumber3 />
              <CampaignProcessStepTitle>
                Add a photo
              </CampaignProcessStepTitle>
              <CampaignProcessStepIntroductionText>
                Challenges with a photo receive six times more participants than those without. Include one that captures the emotion of your story.
              </CampaignProcessStepIntroductionText>
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <ChallengePhotoUpload />
                  <CampaignStartDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignStartDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveChallengePhoto"
                        onClick={this.submitChallengePhoto}
                        variant="contained"
                      >
                        Review
                      </Button>
                    </CampaignStartDesktopButtonPanel>
                  </CampaignStartDesktopButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Choose a photo that captures the emotion of your challenge
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        A photo of people works well.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Try to upload a photo that is 1200 x 628 pixels or larger
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        A large photo will look good on all screen sizes. We can accept one photo up to 5 megabytes in size.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Keep it friendly for all audiences
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Make sure your photo doesn&apos;t include graphic violence or sexual content.
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
              id="saveChallengePhotoFooter"
              onClick={this.submitChallengePhoto}
              variant="contained"
            >
              Review
            </Button>
          </CampaignStartMobileButtonPanel>
        </CampaignStartMobileButtonWrapper>
      </div>
    );
  }
}
ChallengeStartAddPhoto.propTypes = {
  classes: PropTypes.object,
};


const InnerWrapper = styled('div')`
`;

export default withStyles(commonMuiStyles)(ChallengeStartAddPhoto);
