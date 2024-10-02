import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ChallengeStartActions from '../../actions/ChallengeStartActions';
import { OuterWrapper, PageWrapper } from '../../components/Style/stepDisplayStyles';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeStartStore from '../../stores/ChallengeStartStore';
import VoterStore from '../../../stores/VoterStore';
import initializejQuery from '../../utils/initializejQuery';
import ChallengeParticipantActions from '../../actions/ChallengeParticipantActions';

const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../../components/SignIn/SignInModal'));


class ChallengeStartPreview extends Component {
  constructor (props) {
    super(props);
    this.state = {
      challengeDescription: '',
      challengePhotoLargeUrl: '',
      challengeTitle: '',
      challengeWeVoteId: '',
      publishOnceSignedIn: false,
      publishWhenOutOfDraft: false,
      readyToPublish: false,
      showSignInModal: false,
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
    const challengeWeVoteId = ChallengeStartStore.getChallengeWeVoteId();
    const step1Completed = ChallengeStartStore.challengeTitleExists();
    const step2Completed = ChallengeStartStore.challengeDescriptionExists();
    // const step3Completed = ChallengeStartStore.challengePhotoExists();
    // const readyToPublish = step1Completed && step2Completed && step3Completed;
    const readyToPublish = step1Completed && step2Completed;
    const voterSignedIn = VoterStore.getVoterIsSignedIn();
    const { publishWhenOutOfDraft } = this.state;
    this.setState({
      challengeDescription,
      challengePhotoLargeUrl,
      challengeTitle,
      challengeWeVoteId,
      readyToPublish,
    }, () => {
      if (voterSignedIn && publishWhenOutOfDraft) {
        // console.log('ChallengeStartPreview, onChallengeStartStoreChange, voterSignedIn && publishWhenOutOfDraft, calling functionToUseWhenOutOfDraft');
        this.setState({
          publishWhenOutOfDraft: false,
        }, () => this.functionToUseWhenOutOfDraft());
      }
    });
  }

  onVoterStoreChange () {
    const { challengeWeVoteId, publishOnceSignedIn } = this.state;
    // const voterFirstName = VoterStore.getFirstName();
    const voterSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      // voterFirstName,
      voterSignedIn,
    });
    if (voterSignedIn && publishOnceSignedIn) {
      // console.log('ChallengeStartPreview, onVoterStoreChange, voterSignedIn && publishOnceSignedIn, Publishing the challenge now');
      this.setState({
        publishOnceSignedIn: false,
        publishWhenOutOfDraft: true,
      }, () => ChallengeStartActions.inDraftModeSave(challengeWeVoteId, false));
    }
  }

  challengeEditAll = () => {
    historyPush('/start-a-challenge-edit-all');
  }

  submitPublishNow = () => {
    const { challengeWeVoteId, voterSignedIn } = this.state;
    // console.log('ChallengeStartPreview submitPublishNow challengeWeVoteId:', challengeWeVoteId);
    if (!voterSignedIn) {
      // Open sign in modal
      this.toggleShowSignInModal(true);
      this.setState({
        publishOnceSignedIn: true,
      });
    } else {
      // Mark the challenge as published
      ChallengeStartActions.inDraftModeSave(challengeWeVoteId, false);
      this.setState({
        publishWhenOutOfDraft: true,
      });
    }
  }

  functionToUseWhenOutOfDraft = () => {
    const { challengeWeVoteId } = this.state;
    if (challengeWeVoteId) {
      const challengeBasePath = `/+/${challengeWeVoteId}`;
      // console.log('ChallengeStartPreview, functionToUseWhenOutOfDraft challengeBasePath: ', challengeBasePath, ', challengeWeVoteId: ', challengeWeVoteId);
      ChallengeParticipantActions.challengeParticipantSave(challengeWeVoteId);
      AppObservableStore.setShowCompleteYourProfileModal(false);
      AppObservableStore.setShowSignInModal(false);
      // ChallengeStartActions.inDraftModeSave(challengeWeVoteId, false);
      // console.log('goToNextPage challengeBasePath before setTimeout: ', challengeBasePath);
      setTimeout(() => {
        // console.log('historyPush challengeBasePath: ', challengeBasePath);
        historyPush(challengeBasePath);
      }, 500);
      return null;
    } else {
      console.log('ChallengeStartPreview functionToUseWhenOutOfDraft challengeWeVoteId not found');
      return null;
    }
  }

  functionToUseWhenSignedIn = () => {
    const { challengeWeVoteId } = this.state;
    if (challengeWeVoteId) {
      // Mark the challenge as published
      ChallengeStartActions.inDraftModeSave(challengeWeVoteId, false);
      return null;
    } else {
      console.log('ChallengeStartPreview functionToUseWhenSignedIn challengeWeVoteId not found');
      return null;
    }
  }

  toggleShowSignInModal = () => {
    const { showSignInModal } = this.state;
    this.setState({
      showSignInModal: !showSignInModal,
    });
  }

  render () {
    renderLog('ChallengeStartPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      challengeDescription, challengePhotoLargeUrl,
      challengeTitle, chosenWebsiteName, showSignInModal, readyToPublish,
    } = this.state;
    return (
      <div>
        <Helmet title={`Preview Your Challenge - ${chosenWebsiteName}`} />
        { showSignInModal && (
          <Suspense fallback={<></>}>
            <SignInModal
              signInTitle="Sign in to publish your Democracy Challenge"
              signInSubTitle="You can continue making changes after signing in."
              toggleOnClose={this.toggleShowSignInModal}
              uponSuccessfulSignIn={this.functionToUseWhenSignedIn}
            />
          </Suspense>
        )}
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
                    Finish&nbsp;later&nbsp;&nbsp;&nbsp;
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
              <Button
                classes={{ root: classes.buttonSave }}
                color="primary"
                disabled={!readyToPublish}
                id="saveChallengePublishNow"
                onClick={this.submitPublishNow}
                variant="contained"
              >
                Publish
              </Button>
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
