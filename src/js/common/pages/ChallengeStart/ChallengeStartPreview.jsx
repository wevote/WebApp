import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ChallengeStartActions from '../../actions/ChallengeStartActions';
import { OuterWrapper, PageWrapper } from '../../components/Style/stepDisplayStyles';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import CompleteYourProfileModalController from '../../components/Settings/CompleteYourProfileModalController';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeStartStore from '../../stores/ChallengeStartStore';
import VoterStore from '../../../stores/VoterStore';
import initializejQuery from '../../utils/initializejQuery';


class ChallengeStartPreview extends Component {
  constructor (props) {
    super(props);
    this.state = {
      challengeDescription: '',
      challengePhotoLargeUrl: '',
      challengeTitle: '',
      readyToPublish: false,
      voterFirstName: '',
      voterSignedIn: false,
    };
  }

  componentDidMount () {
    // console.log('ChallengeStartPreview, componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onChallengeStartStoreChange();
    this.onVoterStoreChange();
    this.challengeStartStoreListener = ChallengeStartStore.addListener(this.onChallengeStartStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    initializejQuery(() => {
      ChallengeStartActions.challengeRetrieveAsOwner('');
      ChallengeStartActions.challengeEditAllReset();
    });
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.challengeStartStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  onChallengeStartStoreChange () {
    const challengeDescription = ChallengeStartStore.getChallengeDescription();
    const challengePhotoLargeUrl = ChallengeStartStore.getChallengePhotoLargeUrl();
    const challengeTitle = ChallengeStartStore.getChallengeTitle();
    const step1Completed = ChallengeStartStore.challengeTitleExists();
    const step2Completed = ChallengeStartStore.challengeDescriptionExists();
    // const step3Completed = ChallengeStartStore.challengePhotoExists();
    // const readyToPublish = step1Completed && step2Completed && step3Completed;
    const readyToPublish = step1Completed && step2Completed;
    this.setState({
      challengeDescription,
      challengePhotoLargeUrl,
      challengeTitle,
      readyToPublish,
    });
  }

  onVoterStoreChange () {
    const voterFirstName = VoterStore.getFirstName();
    const voterSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      voterFirstName,
      voterSignedIn,
    });
  }

  challengeEditAll = () => {
    historyPush('/start-a-challenge-edit-all');
  }

  submitPublishNowDesktop = () => {
    const { voterFirstName, voterSignedIn } = this.state;
    if (!voterFirstName || !voterSignedIn) {
      // Open complete your profile modal
      AppObservableStore.setShowCompleteYourProfileModal(true);
    } else {
      // Mark the challenge as published
      const challengeWeVoteId = '';
      ChallengeStartActions.inDraftModeSave(challengeWeVoteId, false);
      historyPush(`/+/${challengeWeVoteId}`);
    }
  }

  submitPublishNowMobile = () => {
    const { voterFirstName, voterSignedIn } = this.state;
    // console.log('ChallengeStartPreview submitPublishNowMobile');
    if (!voterFirstName || !voterSignedIn) {
      // Navigate to the mobile complete your profile page
      historyPush('/start-a-challenge-complete-your-profile');
    } else {
      this.functionToUseWhenProfileComplete();
    }
  }

  functionToUseWhenProfileComplete = () => {
    // Mark the challenge as published
    const challengeWeVoteId = '';
    ChallengeStartActions.inDraftModeSave(challengeWeVoteId, false);
    historyPush(`/+/${challengeWeVoteId}`);
  }

  render () {
    renderLog('ChallengeStartPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      challengeDescription, challengePhotoLargeUrl,
      challengeTitle, chosenWebsiteName, readyToPublish,
    } = this.state;
    return (
      <div>
        <Helmet title={`Preview Your Challenge - ${chosenWebsiteName}`} />
        <SaveCancelOuterWrapper>
          <SaveCancelInnerWrapper>
            <SaveCancelButtonsWrapper>
              <Link
                id="startChallengePublishLater"
                to="/challenges"
              >
                <Button
                  classes={{ root: classes.buttonSimpleLink }}
                  color="primary"
                >
                  <div className="u-show-mobile">
                    Later
                  </div>
                  <div className="u-show-desktop-tablet">
                    Publish&nbsp;later&nbsp;&nbsp;&nbsp;
                  </div>
                </Button>
              </Link>
              <Button
                classes={{ root: classes.buttonEdit }}
                color="primary"
                id="challengeEditAll"
                onClick={this.challengeEditAll}
                variant="outlined"
              >
                Edit
              </Button>
              <div className="u-show-mobile">
                <Button
                  classes={{ root: classes.buttonSave }}
                  color="primary"
                  disabled={!readyToPublish}
                  id="saveChallengePublishNowMobile"
                  onClick={this.submitPublishNowMobile}
                  variant="contained"
                >
                  Publish now
                </Button>
              </div>
              <div className="u-show-desktop-tablet">
                <Button
                  classes={{ root: classes.buttonSave }}
                  color="primary"
                  disabled={!readyToPublish}
                  id="saveChallengePublishNowDesktop"
                  onClick={this.submitPublishNowDesktop}
                  variant="contained"
                >
                  Publish now
                </Button>
              </div>
            </SaveCancelButtonsWrapper>
          </SaveCancelInnerWrapper>
        </SaveCancelOuterWrapper>
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ChallengeStartSectionWrapper>
                <ChallengeStartSection>
                  <DesktopDisplayWrapper className="u-show-desktop">
                    <ChallengeTitleDesktop>{challengeTitle || <ChallengeTitleMissing>Title Required</ChallengeTitleMissing>}</ChallengeTitleDesktop>
                  </DesktopDisplayWrapper>
                  <MobileDisplayWrapper className="u-show-mobile-tablet">
                    <ChallengeTitleMobile>{challengeTitle || <ChallengeTitleMissing>Title Required</ChallengeTitleMissing>}</ChallengeTitleMobile>
                  </MobileDisplayWrapper>
                  {challengePhotoLargeUrl ? (
                    <ChallengeImage src={challengePhotoLargeUrl} alt="Challenge" />
                  ) : (
                    <ChallengeImageMissingWrapper>
                      <ChallengeImageMissing>
                        <DelayedLoad showLoadingText waitBeforeShow={4000}>
                          <>
                            Photo Missing
                          </>
                        </DelayedLoad>
                      </ChallengeImageMissing>
                    </ChallengeImageMissingWrapper>
                  )}
                  {challengeDescription ? (
                    <ChallengeDescription>{challengeDescription}</ChallengeDescription>
                  ) : (
                    <ChallengeDescriptionMissing>Description Required</ChallengeDescriptionMissing>
                  )}
                </ChallengeStartSection>
              </ChallengeStartSectionWrapper>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
        <CompleteYourProfileModalController
          functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
          startChallenge
        />
      </div>
    );
  }
}
ChallengeStartPreview.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonEdit: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 30px',
    textTransform: 'none',
    width: 100,
  },
  buttonSave: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    marginLeft: 10,
    textTransform: 'none',
    width: 200,
    [theme.breakpoints.down('sm')]: {
      width: 150,
    },
  },
  buttonRoot: {
    width: 250,
  },
});

const ChallengeDescription = styled('div')`
  font-size: 15px;
  margin: 10px 0;
  white-space: pre-wrap;
`;

const ChallengeDescriptionMissing = styled('div')`
  color: red;
  font-size: 18px;
  margin: 10px 0;
`;

const ChallengeImage = styled('img')`
  width: 100%;
`;

const ChallengeImageMissing = styled('div')`
  color: red;
  font-size: 18px;
  font-weight: 600;
`;

const ChallengeImageMissingWrapper = styled('div')`
  display: flex;
  justify-content: flex-start;
`;

const ChallengeStartSection = styled('div')`
  margin-bottom: 60px !important;
  max-width: 620px;
  width: 100%;
`;

const ChallengeStartSectionWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const ChallengeTitleDesktop = styled('h1')(({ theme }) => (`
  font-size: 28px;
  text-align: center;
  margin: 30px 20px 40px 20px;
  ${theme.breakpoints.down('md')} {
    font-size: 24px;
  }
`));

const ChallengeTitleMissing = styled('div')`
  color: red;
`;

const ChallengeTitleMobile = styled('h1')`
  font-size: 18px;
  text-align: left;
  margin: 0;
`;

const DesktopDisplayWrapper = styled('div')`
`;

const InnerWrapper = styled('div')`
  width: 100%;
`;

const MobileDisplayWrapper = styled('div')`
`;

const SaveCancelButtonsWrapper = styled('div')`
  align-items: center;
  display: flex;
`;

const SaveCancelInnerWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  margin: 0 auto;
  max-width: 960px;
  padding: 8px 0;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const SaveCancelOuterWrapper = styled('div')`
  background-color: #f6f4f6;
  border-bottom: 1px solid #ddd;
  // margin: 10px 0;
  width: 100%;
`;

export default withStyles(styles)(ChallengeStartPreview);
