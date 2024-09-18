import loadable from '@loadable/component';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import VoterActions from '../../../actions/VoterActions';
import webAppConfig from '../../../config';
import VoterStore from '../../../stores/VoterStore';
import ChallengeSupporterActions from '../../actions/ChallengeSupporterActions';
import ChallengeHeaderSimple from '../../components/Navigation/ChallengeHeaderSimple';
import VoterPhotoUpload from '../../components/Settings/VoterPhotoUpload';
import VoterPlan from '../../../components/Ready/VoterPlan';
import {
  SupportButtonFooterWrapper, SupportButtonPanel,
} from '../../components/Style/CampaignDetailsStyles';
import DesignTokenColors from '../../components/Style/DesignTokenColors';
import { CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper, CampaignSupportSection, CampaignSupportSectionWrapper } from '../../components/Style/CampaignSupportStyles';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeStore from '../../stores/ChallengeStore';
import ChallengeSupporterStore from '../../stores/ChallengeSupporterStore';
import { getChallengeValuesFromIdentifiers, retrieveChallengeFromIdentifiersIfNeeded } from '../../utils/challengeUtils';
import historyPush from '../../utils/historyPush';
import initializejQuery from '../../utils/initializejQuery';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import BallotActions from '../../../actions/BallotActions';
import apiCalming from '../../utils/apiCalming';
import SettingsWidgetFirstLastName from '../../../components/Settings/SettingsWidgetFirstLastName';

const ChallengeRetrieveController = React.lazy(() => import(/* webpackChunkName: 'ChallengeRetrieveController' */ '../../components/Challenge/ChallengeRetrieveController'));
const VisibleToPublicCheckbox = React.lazy(() => import(/* webpackChunkName: 'VisibleToPublicCheckbox' */ '../../components/CampaignSupport/VisibleToPublicCheckbox'));
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));


class ChallengeInviteFriendsJoin extends Component {
  constructor (props) {
    super(props);
    this.state = {
      challengePhotoLargeUrl: '',
      challengeSEOFriendlyPath: '',
      challengeTitle: '',
      challengeWeVoteId: '',
      chosenWebsiteName: '',
      linkedPoliticianWeVoteId: '',
      payToPromoteStepTurnedOn: true,
      triggerVotingPlanSave: false,
      weVoteHostedProfileImageUrlLarge: '',
    };
  }

  componentDidMount () {
    // console.log('ChallengeInviteFriendsJoin componentDidMount');
    this.props.setShowHeaderFooter(false);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onChallengeStoreChange();
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams, challengeWeVoteId: challengeWeVoteIdFromParams } = params;
    // console.log('componentDidMount challengeSEOFriendlyPathFromParams: ', challengeSEOFriendlyPathFromParams, ', challengeWeVoteIdFromParams: ', challengeWeVoteIdFromParams);
    const {
      challengePhotoLargeUrl,
      challengeSEOFriendlyPath,
      challengePoliticianList,
      challengeWeVoteId,
      linkedPoliticianWeVoteId,
      weVoteHostedProfileImageUrlLarge,
    } = getChallengeValuesFromIdentifiers(challengeSEOFriendlyPathFromParams, challengeWeVoteIdFromParams);
    this.setState({
      challengePhotoLargeUrl,
      challengePoliticianList,
      linkedPoliticianWeVoteId,
      weVoteHostedProfileImageUrlLarge,
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
    window.scrollTo(0, 0);
    if (apiCalming('voterBallotItemsRetrieve', 600000)) {
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.challengeStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    const inPrivateLabelMode = AppObservableStore.inPrivateLabelMode();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    const payToPromoteStepTurnedOn = !inPrivateLabelMode && webAppConfig.ENABLE_PAY_TO_PROMOTE;
    this.setState({
      chosenWebsiteName,
      payToPromoteStepTurnedOn,
    });
  }

  onChallengeStoreChange () {
    const { match: { params } } = this.props;
    const { challengeSEOFriendlyPath: challengeSEOFriendlyPathFromParams, challengeWeVoteId: challengeWeVoteIdFromParams } = params;
    // console.log('onChallengeStoreChange challengeSEOFriendlyPathFromParams: ', challengeSEOFriendlyPathFromParams, ', challengeWeVoteIdFromParams: ', challengeWeVoteIdFromParams);
    const {
      challengePhotoLargeUrl,
      challengeSEOFriendlyPath,
      challengeTitle,
      challengePoliticianList,
      challengeWeVoteId,
      linkedPoliticianWeVoteId,
      weVoteHostedProfileImageUrlLarge,
    } = getChallengeValuesFromIdentifiers(challengeSEOFriendlyPathFromParams, challengeWeVoteIdFromParams);
    this.setState({
      challengePhotoLargeUrl,
      challengeTitle,
      challengePoliticianList,
      linkedPoliticianWeVoteId,
      weVoteHostedProfileImageUrlLarge,
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

  onVoterStoreChange () {
    const voterPhotoUrlLarge = VoterStore.getVoterPhotoUrlLarge();
    this.setState({
      voterPhotoUrlLarge,
    });
  }

  getChallengeBasePath = () => {
    const { challengeSEOFriendlyPath, challengeWeVoteId } = this.state;
    let challengeBasePath;
    if (challengeSEOFriendlyPath) {
      challengeBasePath = `/${challengeSEOFriendlyPath}/+/`;
    } else {
      challengeBasePath = `/+/${challengeWeVoteId}/`;
    }
    return challengeBasePath;
  }

  getPoliticianBasePath = () => {
    const { politicianSEOFriendlyPath, linkedPoliticianWeVoteId } = this.state;
    let politicianBasePath;
    if (politicianSEOFriendlyPath) {
      politicianBasePath = `/${politicianSEOFriendlyPath}/-/`;
    } else if (linkedPoliticianWeVoteId) {
      politicianBasePath = `/${linkedPoliticianWeVoteId}/p/`;
    } else {
      // console.log('ChallengeRecommendedChallenges getPoliticianBasePath, failed to get politicianBasePath');
      politicianBasePath = this.getChallengeBasePath();
    }
    return politicianBasePath;
  }

  goToChallengeHome = () => {
    historyPush(this.getChallengeBasePath());
  }

  joinChallengeNowSubmit = () => {
    // The function to save the voter plan is in the VoterPlan component because that's where the latest data is.
    // We pass this triggerVotingPlanSave into that component to make the save.
    // The VoterPlan component then triggers a function which calls joinChallengeNowSubmitPart2
    this.setState({
      triggerVotingPlanSave: true,
    });
  }

  joinChallengeNowSubmitPart2 = () => {
    const { challengeWeVoteId } = this.state;
    // console.log('ChallengeInviteFriendsJoin, joinChallengeNowSubmitPart2, challengeWeVoteId:', challengeWeVoteId);
    if (challengeWeVoteId) {
      const supporterEndorsementQueuedToSave = ChallengeSupporterStore.getSupporterEndorsementQueuedToSave();
      const supporterEndorsementQueuedToSaveSet = ChallengeSupporterStore.getSupporterEndorsementQueuedToSaveSet();
      let visibleToPublic = ChallengeSupporterStore.getVisibleToPublic();
      const visibleToPublicChanged = ChallengeSupporterStore.getVisibleToPublicQueuedToSaveSet();
      if (visibleToPublicChanged) {
        // If it has changed, use new value
        // TODO Convert to first name/last name visibility save
        // visibleToPublic = ChallengeSupporterStore.getVisibleToPublicQueuedToSave();
      }
      // TODO: Convert to saving "Why You Will Vote"
      // if (supporterEndorsementQueuedToSaveSet || visibleToPublicChanged) {
      //   // console.log('ChallengeInviteFriendsJoin, supporterEndorsementQueuedToSave:', supporterEndorsementQueuedToSave);
      //   const saveVisibleToPublic = true;
      //   initializejQuery(() => {
      //     ChallengeSupporterActions.supporterEndorsementSave(challengeWeVoteId, supporterEndorsementQueuedToSave, visibleToPublic, saveVisibleToPublic); // challengeSupporterSave
      //     ChallengeSupporterActions.supporterEndorsementQueuedToSave(undefined);
      //   });
      // }
      const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
      const voterPhotoQueuedToSaveSet = VoterStore.getVoterPhotoQueuedToSaveSet();
      if (voterPhotoQueuedToSaveSet) {
        initializejQuery(() => {
          VoterActions.voterPhotoSave(voterPhotoQueuedToSave, voterPhotoQueuedToSaveSet);
          VoterActions.voterPhotoQueuedToSave(undefined);
        });
      }
      // Has all the necessary data been saved?

      // TODO Save "Join Challenge" here

      // If all the necessary data has been saved, proceed to the next step
      console.log(`ChallengeInviteFriendsJoin, joinChallengeNowSubmitPart2, redirect to ${this.getChallengeBasePath()}customize-message`);
      historyPush(`${this.getChallengeBasePath()}customize-message`);
    }
  }

  render () {
    renderLog('ChallengeInviteFriendsJoin');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      challengeSEOFriendlyPath, challengeTitle,
      challengeWeVoteId, chosenWebsiteName,
      triggerVotingPlanSave, voterPhotoUrlLarge,
    } = this.state;
    const htmlTitle = `Why do you support ${challengeTitle}? - ${chosenWebsiteName}`;
    return (
      <div>
        <Helmet>
          <title>{htmlTitle}</title>
          <meta name="robots" content="noindex" data-react-helmet="true" />
        </Helmet>
        <ChallengeHeaderSimple
          challengeBasePath={this.getChallengeBasePath()}
          challengeTitle={challengeTitle}
          challengeWeVoteId={challengeWeVoteId}
          goToChallengeHome={this.goToChallengeHome}
          politicianBasePath={this.getPoliticianBasePath()}
        />
        <ChallengeH1Wrapper>
          <ChallengeH1>
            To join this challenge, share how you will vote &mdash; then ask your friends to join.
          </ChallengeH1>
        </ChallengeH1Wrapper>
        <PageWrapperDefault>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <ChallengeH2>
                    1. Your voting plan
                    {' '}
                    <HeaderAddendum>
                      (only visible to you)
                    </HeaderAddendum>
                  </ChallengeH2>
                  <VoterPlan
                    triggerVotingPlanSave={triggerVotingPlanSave}
                    votingPlanSaved={this.joinChallengeNowSubmitPart2}
                  />
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <ChallengeH2>
                    2. Your name and photo
                    {' '}
                    <HeaderAddendum>
                      (visible to all)
                    </HeaderAddendum>
                  </ChallengeH2>
                  <SettingsWidgetFirstLastName hideNameShownWithEndorsements />
                  <VoterPhotoUpload />
                  <VisibleToPublicCheckboxWrapper>
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <VisibleToPublicCheckbox challengeWeVoteId={challengeWeVoteId} />
                    </Suspense>
                  </VisibleToPublicCheckboxWrapper>
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <ChallengeH2>
                    3. Why you will vote
                    {' '}
                    <HeaderAddendum>
                      (optional, visible to all)
                    </HeaderAddendum>
                  </ChallengeH2>
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
            </ContentInnerWrapperDefault>
          </ContentOuterWrapperDefault>
        </PageWrapperDefault>
        <SupportButtonFooterWrapper>
          <SupportButtonPanel>
            <CenteredDiv>
              <Button
                classes={{ root: classes.buttonDesktop }}
                color="primary"
                id="joinChallengeNow"
                onClick={this.joinChallengeNowSubmit}
                variant="contained"
              >
                Join Challenge now
              </Button>
            </CenteredDiv>
          </SupportButtonPanel>
        </SupportButtonFooterWrapper>
        <Suspense fallback={<span>&nbsp;</span>}>
          <ChallengeRetrieveController challengeSEOFriendlyPath={challengeSEOFriendlyPath} challengeWeVoteId={challengeWeVoteId} />
        </Suspense>
        <Suspense fallback={<span>&nbsp;</span>}>
          <VoterFirstRetrieveController />
        </Suspense>
      </div>
    );
  }
}
ChallengeInviteFriendsJoin.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};


const CenteredDiv = styled('div')`
  display: flex;
  justify-content: center;
`;

const ChallengeH1Wrapper = styled('div')`
  background-color: ${DesignTokenColors.neutralUI50};
  display: flex;
  justify-content: center;
`;

const ChallengeH1 = styled('h1')`
  font-size: 24px;
  font-weight: 600;
  margin: 20px 0;
  max-width: 620px;
  ${isCordova() ? 'padding-top: 14px' : ''};
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin-left: 15px;
    margin-right: 15px;
  }
`;

const ChallengeH2 = styled('h2')`
  font-size: 18px;
  font-weight: 500;
`;

const HeaderAddendum = styled('span')`
  color: ${DesignTokenColors.neutral400};
  font-size: 14px;
  font-weight: 300;
`;

const VisibleToPublicCheckboxWrapper = styled('div')`
  min-height: 25px;
`;

export default withStyles(commonMuiStyles)(ChallengeInviteFriendsJoin);
