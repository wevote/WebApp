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
import ChallengeTitleInputField from '../../components/ChallengeStart/ChallengeTitleInputField';
import ChallengeStartSteps from '../../components/Navigation/ChallengeStartSteps';
import { CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles'; // CampaignProcessStepIntroductionText
import { CampaignStartDesktopButtonPanel, CampaignStartDesktopButtonWrapper, CampaignStartMobileButtonPanel, CampaignStartMobileButtonWrapper, CampaignStartSection, CampaignStartSectionWrapper } from '../../components/Style/CampaignStartStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeStartStore from '../../stores/ChallengeStartStore';
import initializejQuery from '../../utils/initializejQuery';


class ChallengeStartAddTitle extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('ChallengeStartAddTitle, componentDidMount');
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

  submitChallengeTitle = () => {
    const challengeTitleQueuedToSave = ChallengeStartStore.getChallengeTitleQueuedToSave();
    const challengeTitleQueuedToSaveSet = ChallengeStartStore.getChallengeTitleQueuedToSaveSet();
    console.log('ChallengeStartAddTitle, challengeTitleQueuedToSaveSet:', challengeTitleQueuedToSaveSet);
    if (challengeTitleQueuedToSaveSet) {
      // console.log('ChallengeStartAddTitle, challengeTitleQueuedToSave:', challengeTitleQueuedToSave);
      const challengeWeVoteId = '';
      ChallengeStartActions.challengeTitleSave(challengeWeVoteId, challengeTitleQueuedToSave);
      ChallengeStartActions.challengeTitleQueuedToSave('');
    }
    historyPush('/start-a-challenge-why-winning-matters');
  }

  render () {
    renderLog('ChallengeStartAddTitle');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenWebsiteName } = this.state;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title={`Add Challenge Title - ${chosenWebsiteName}`} />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ChallengeStartSteps atStepNumber1 />
              <CampaignProcessStepTitle>
                Name your challenge
              </CampaignProcessStepTitle>
              {/* <CampaignProcessStepIntroductionText> */}
              {/*  This is the first thing people will see about your challenge. Get their attention with a short title that focuses on why we vote. */}
              {/* </CampaignProcessStepIntroductionText> */}
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <ChallengeTitleInputField />
                  <CampaignStartDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignStartDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveChallengeTitle"
                        onClick={this.submitChallengeTitle}
                        variant="contained"
                      >
                        Continue
                      </Button>
                    </CampaignStartDesktopButtonPanel>
                  </CampaignStartDesktopButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Keep it short and to the point:
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Make Your Voice Count Oakland
                        <br />
                        <br />
                      </AdviceBoxText>
                      <AdviceBoxText>
                        Stand up and Vote Florida
                        <br />
                        <br />
                      </AdviceBoxText>
                      <AdviceBoxText>
                        Oaklander&apos;s Unite: Let&apos;s Make November 5th BIG
                        <br />
                        <br />
                      </AdviceBoxText>
                      <AdviceBoxText>
                        Vote for a Better Tomorrow Georgia
                        <br />
                        <br />
                      </AdviceBoxText>
                      <AdviceBoxText>
                        Arizona For the Win
                        <br />
                        <br />
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
ChallengeStartAddTitle.propTypes = {
  classes: PropTypes.object,
};


const InnerWrapper = styled('div')`
`;

export default withStyles(commonMuiStyles)(ChallengeStartAddTitle);
