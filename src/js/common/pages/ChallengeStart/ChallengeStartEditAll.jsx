import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import ChallengeStartActions from '../../actions/ChallengeStartActions';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import { OuterWrapper, PageWrapper } from '../../components/Style/stepDisplayStyles';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import ChallengeDescriptionInputField from '../../components/ChallengeStart/ChallengeDescriptionInputField';
import ChallengeInviteTextDefaultInputField from '../../components/ChallengeStart/ChallengeInviteTextDefaultInputField';
import ChallengePhotoUpload from '../../components/ChallengeStart/ChallengePhotoUpload';
import ChallengeTitleInputField from '../../components/ChallengeStart/ChallengeTitleInputField';
import { BlockedReason } from '../../components/Style/CampaignIndicatorStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeStartStore from '../../stores/ChallengeStartStore';
import ChallengeStore from '../../stores/ChallengeStore';
import { getChallengeValuesFromIdentifiers, retrieveChallengeFromIdentifiersIfNeeded } from '../../utils/challengeUtils';
import initializejQuery from '../../utils/initializejQuery';


const ChallengeRetrieveController = React.lazy(() => import(/* webpackChunkName: 'ChallengeRetrieveController' */ '../../components/Challenge/ChallengeRetrieveController'));


class ChallengeStartEditAll extends Component {
  constructor (props) {
    super(props);
    this.state = {
      challengeSEOFriendlyPath: '',
      challengeWeVoteId: '',
      chosenWebsiteName: '',
      isBlockedByWeVote: false,
      isBlockedByWeVoteReason: false,
      voterIsChallengeOwner: true, // Start by assuming true
    };
  }

  componentDidMount () {
    // console.log('ChallengeStartEditAll, componentDidMount');
    const { editExistingChallenge } = this.props;
    if (this.props.setShowHeaderFooter) {
      this.props.setShowHeaderFooter(false);
    }
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStoreChange.bind(this));
    if (editExistingChallenge) {
      const { match: { params } } = this.props;
      const {
        challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams,
        challengeWeVoteId: challengeWeVoteIdFromParams,
      } = params;
      // console.log('componentDidMount challengeSEOFriendlyPathFromParams: ', challengeSEOFriendlyPathFromParams, ', challengeWeVoteIdFromParams: ', challengeWeVoteIdFromParams);
      const {
        challengeSEOFriendlyPath,
        challengeWeVoteId,
        isBlockedByWeVote,
        isBlockedByWeVoteReason,
        voterIsChallengeOwner,
      } = getChallengeValuesFromIdentifiers(challengeSEOFriendlyPathFromParams, challengeWeVoteIdFromParams);
      this.setState({
        isBlockedByWeVote,
        isBlockedByWeVoteReason,
        voterIsChallengeOwner,
      });
      if (challengeSEOFriendlyPath) {
        this.setState({
          challengeSEOFriendlyPath,
        });
      } else if (challengeSEOFriendlyPathFromParams) {
        this.setState({
          challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams,
        });
      }
      if (challengeWeVoteId) {
        this.setState({
          challengeWeVoteId,
        });
      } else if (challengeWeVoteIdFromParams) {
        this.setState({
          challengeWeVoteId: challengeWeVoteIdFromParams,
        });
      }
      // Take the "calculated" identifiers and retrieve if missing
      retrieveChallengeFromIdentifiersIfNeeded(challengeSEOFriendlyPath, challengeWeVoteId);
    } else {
      initializejQuery(() => {
        ChallengeStartActions.challengeRetrieveAsOwner('');
        ChallengeStartActions.challengeEditAllReset();
      });
    }
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    if (this.props.setShowHeaderFooter) {
      this.props.setShowHeaderFooter(true);
    }
    this.appStateSubscription.unsubscribe();
    this.challengeStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  onChallengeStoreChange () {
    const { editExistingChallenge } = this.props;
    // console.log('onChallengeStoreChange challengeSEOFriendlyPathFromParams: ', challengeSEOFriendlyPathFromParams, ', challengeWeVoteIdFromParams: ', challengeWeVoteIdFromParams);
    if (editExistingChallenge) {
      const { match: { params } } = this.props;
      const {
        challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams,
        challengeWeVoteId: challengeWeVoteIdFromParams,
      } = params;
      // console.log('componentDidMount challengeSEOFriendlyPathFromParams: ', challengeSEOFriendlyPathFromParams, ', challengeWeVoteIdFromParams: ', challengeWeVoteIdFromParams);
      const {
        challengeSEOFriendlyPath,
        challengeWeVoteId,
        isBlockedByWeVote,
        isBlockedByWeVoteReason,
        voterIsChallengeOwner,
      } = getChallengeValuesFromIdentifiers(challengeSEOFriendlyPathFromParams, challengeWeVoteIdFromParams);
      this.setState({
        isBlockedByWeVote,
        isBlockedByWeVoteReason,
        voterIsChallengeOwner,
      });
      if (challengeSEOFriendlyPath) {
        this.setState({
          challengeSEOFriendlyPath,
        });
      } else if (challengeSEOFriendlyPathFromParams) {
        this.setState({
          challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams,
        });
      }
      if (challengeWeVoteId) {
        this.setState({
          challengeWeVoteId,
        });
      } else if (challengeWeVoteIdFromParams) {
        this.setState({
          challengeWeVoteId: challengeWeVoteIdFromParams,
        });
      }
    }
  }

  cancelEditAll = () => {
    const { editExistingChallenge } = this.props;
    if (editExistingChallenge) {
      ChallengeStartActions.challengeEditAllReset();
      const { challengeWeVoteId, challengeSEOFriendlyPath } = this.state;
      if (challengeSEOFriendlyPath) {
        historyPush(`/${challengeSEOFriendlyPath}/+/`);
      } else {
        historyPush(`/+/${challengeWeVoteId}`);
      }
    } else {
      historyPush('/start-a-challenge-preview');
    }
  }

  submitChallengeEditAll = () => {
    const { editExistingChallenge } = this.props;
    const { challengeWeVoteId, voterIsChallengeOwner } = this.state;
    const challengeDescriptionQueuedToSave = ChallengeStartStore.getChallengeDescriptionQueuedToSave();
    const challengeDescriptionQueuedToSaveSet = ChallengeStartStore.getChallengeDescriptionQueuedToSaveSet();
    const challengeInviteTextDefaultQueuedToSave = ChallengeStartStore.getChallengeInviteTextDefaultQueuedToSave();
    const challengeInviteTextDefaultQueuedToSaveSet = ChallengeStartStore.getChallengeInviteTextDefaultQueuedToSaveSet();
    const challengePhotoQueuedToDelete = ChallengeStartStore.getChallengePhotoQueuedToDelete();
    const challengePhotoQueuedToDeleteSet = ChallengeStartStore.getChallengePhotoQueuedToDeleteSet();
    const challengePhotoQueuedToSave = ChallengeStartStore.getChallengePhotoQueuedToSave();
    const challengePhotoQueuedToSaveSet = ChallengeStartStore.getChallengePhotoQueuedToSaveSet();
    const challengePoliticianDeleteList = ChallengeStartStore.getChallengePoliticianDeleteList();
    const challengePoliticianStarterListQueuedToSave = ChallengeStartStore.getChallengePoliticianStarterListQueuedToSave();
    const challengePoliticianStarterListQueuedToSaveSet = ChallengeStartStore.getChallengePoliticianStarterListQueuedToSaveSet();
    const challengeTitleQueuedToSave = ChallengeStartStore.getChallengeTitleQueuedToSave();
    const challengeTitleQueuedToSaveSet = ChallengeStartStore.getChallengeTitleQueuedToSaveSet();
    // console.log('ChallengeStartEditAll challengePoliticianStarterListQueuedToSaveSet:', challengePoliticianStarterListQueuedToSaveSet);
    if (voterIsChallengeOwner && (challengeDescriptionQueuedToSaveSet || challengeInviteTextDefaultQueuedToSaveSet || challengePhotoQueuedToDeleteSet || challengePhotoQueuedToSaveSet || challengePoliticianDeleteList || challengePoliticianStarterListQueuedToSaveSet || challengeTitleQueuedToSaveSet)) {
      const challengePoliticianDeleteListJson = JSON.stringify(challengePoliticianDeleteList);
      const challengePoliticianStarterListQueuedToSaveJson = JSON.stringify(challengePoliticianStarterListQueuedToSave);
      // console.log('ChallengeStartEditAll challengePoliticianStarterListQueuedToSaveJson:', challengePoliticianStarterListQueuedToSaveJson);
      ChallengeStartActions.challengeEditAllSave(
        challengeWeVoteId,
        challengeDescriptionQueuedToSave, challengeDescriptionQueuedToSaveSet,
        challengeInviteTextDefaultQueuedToSave, challengeInviteTextDefaultQueuedToSaveSet,
        challengePhotoQueuedToDelete, challengePhotoQueuedToDeleteSet,
        challengePhotoQueuedToSave, challengePhotoQueuedToSaveSet,
        challengePoliticianDeleteListJson,
        challengePoliticianStarterListQueuedToSaveJson, challengePoliticianStarterListQueuedToSaveSet,
        challengeTitleQueuedToSave, challengeTitleQueuedToSaveSet,
      );
      ChallengeStartActions.challengeEditAllReset();
    }
    // We want to wait 1 second before redirecting, so the save has a chance to execute
    this.timer = setTimeout(() => {
      if (editExistingChallenge) {
        const { challengeSEOFriendlyPath } = this.state;
        if (challengeSEOFriendlyPath) {
          historyPush(`/${challengeSEOFriendlyPath}/+/`);
        } else {
          historyPush(`/+/${challengeWeVoteId}`);
        }
      } else {
        historyPush('/start-a-challenge-preview');
      }
    }, 750);
  }

  render () {
    renderLog('ChallengeStartEditAll');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, editExistingChallenge } = this.props;
    const {
      challengeSEOFriendlyPath, challengeWeVoteId, chosenWebsiteName,
      isBlockedByWeVote, isBlockedByWeVoteReason, voterIsChallengeOwner,
    } = this.state;
    return (
      <div>
        <Suspense fallback={<span>&nbsp;</span>}>
          <ChallengeRetrieveController
            challengeSEOFriendlyPath={challengeSEOFriendlyPath}
            challengeWeVoteId={challengeWeVoteId}
            retrieveAsOwnerIfVoterSignedIn
          />
        </Suspense>
        <Helmet title={`Edit Your Challenge - ${chosenWebsiteName}`} />
        <SaveCancelOuterWrapper>
          <SaveCancelInnerWrapper>
            <SaveCancelButtonsWrapper>
              <Button
                classes={{ root: classes.buttonCancel }}
                color="primary"
                id="cancelEditAll"
                onClick={this.cancelEditAll}
                variant="outlined"
              >
                Cancel
              </Button>
              {voterIsChallengeOwner && (
                <Button
                  classes={{ root: classes.buttonSave }}
                  color="primary"
                  id="saveChallengeEditAll"
                  onClick={this.submitChallengeEditAll}
                  variant="contained"
                >
                  Save
                </Button>
              )}
            </SaveCancelButtonsWrapper>
          </SaveCancelInnerWrapper>
        </SaveCancelOuterWrapper>
        <PageWrapper>
          <OuterWrapper>
            {voterIsChallengeOwner ? (
              <InnerWrapper>
                {isBlockedByWeVote && (
                  <ChallengeStartSectionWrapper>
                    <ChallengeStartSection>
                      <BlockedReason>
                        Your challenge has been blocked by moderators from We Vote. Please make any requested modifications so you are in compliance with our terms of service and
                        {' '}
                        <OpenExternalWebSite
                          linkIdAttribute="weVoteSupport"
                          url="https://help.wevote.us/hc/en-us/requests/new"
                          target="_blank"
                          body={<span>contact We Vote support for help.</span>}
                        />
                        {isBlockedByWeVoteReason && (
                          <>
                            <br />
                            <hr />
                            &quot;
                            {isBlockedByWeVoteReason}
                            &quot;
                          </>
                        )}
                      </BlockedReason>
                    </ChallengeStartSection>
                  </ChallengeStartSectionWrapper>
                )}
                <ChallengeStartSectionWrapper>
                  <ChallengeStartSection>
                    <ChallengeTitleInputField
                      challengeWeVoteId={challengeWeVoteId}
                      editExistingChallenge={editExistingChallenge}
                    />
                    <PhotoUploadWrapper>
                      We recommend you use a photo that is 1200 x 628 pixels or larger. We can accept one photo up to 5 megabytes in size.
                      <ChallengePhotoUpload
                        challengeWeVoteId={challengeWeVoteId}
                        editExistingChallenge={editExistingChallenge}
                      />
                    </PhotoUploadWrapper>
                    <ChallengeDescriptionInputField
                      challengeWeVoteId={challengeWeVoteId}
                      editExistingChallenge={editExistingChallenge}
                    />
                    <ChallengeInviteTextDefaultInputField
                      challengeWeVoteId={challengeWeVoteId}
                      editExistingChallenge={editExistingChallenge}
                    />
                  </ChallengeStartSection>
                </ChallengeStartSectionWrapper>
              </InnerWrapper>
            ) : (
              <InnerWrapper>
                <ChallengeStartSectionWrapper>
                  <ChallengeStartSection>
                    <BlockedReason>
                      You do not have permission to edit this challenge.
                    </BlockedReason>
                  </ChallengeStartSection>
                </ChallengeStartSectionWrapper>
              </InnerWrapper>
            )}
          </OuterWrapper>
        </PageWrapper>
      </div>
    );
  }
}
ChallengeStartEditAll.propTypes = {
  classes: PropTypes.object,
  editExistingChallenge: PropTypes.bool,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};


const ChallengeStartSection = styled('div')`
  margin-bottom: 60px !important;
  max-width: 620px;
  width: 100%;
`;

const ChallengeStartSectionWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const SaveCancelButtonsWrapper = styled('div')`
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
  margin-top: 0;
  position: fixed;
  width: 100%;
  z-index: 2;
`;

const InnerWrapper = styled('div')`
  margin-top: 75px;
  width: 100%;
`;

const PhotoUploadWrapper = styled('div')`
  margin-top: 32px;
`;

export default withStyles(commonMuiStyles)(ChallengeStartEditAll);
