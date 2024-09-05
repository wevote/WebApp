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
import VoterPhotoUpload from '../../components/Settings/VoterPhotoUpload';
import VoterPlan from '../../../components/Ready/VoterPlan';
import { AdviceBox, AdviceBoxText, AdviceBoxTitle, AdviceBoxWrapper } from '../../components/Style/adviceBoxStyles';
import { CampaignProcessStepIntroductionText, CampaignProcessStepTitle } from '../../components/Style/CampaignProcessStyles';
import { CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper, CampaignSupportMobileButtonPanel, CampaignSupportMobileButtonWrapper, CampaignSupportSection, CampaignSupportSectionWrapper, SkipForNowButtonPanel, SkipForNowButtonWrapper } from '../../components/Style/CampaignSupportStyles';
import commonMuiStyles from '../../components/Style/commonMuiStyles';
import { ContentInnerWrapperDefault, ContentOuterWrapperDefault, PageWrapperDefault } from '../../components/Style/PageWrapperStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeStore from '../../stores/ChallengeStore';
import ChallengeSupporterStore from '../../stores/ChallengeSupporterStore';
import { getChallengeValuesFromIdentifiers, retrieveChallengeFromIdentifiersIfNeeded } from '../../utils/challengeUtils';
import historyPush from '../../utils/historyPush';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';

const ChallengeRetrieveController = React.lazy(() => import(/* webpackChunkName: 'ChallengeRetrieveController' */ '../../components/Challenge/ChallengeRetrieveController'));
const VisibleToPublicCheckbox = React.lazy(() => import(/* webpackChunkName: 'VisibleToPublicCheckbox' */ '../../components/CampaignSupport/VisibleToPublicCheckbox'));
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));


class ChallengeSupportJoin extends Component {
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
      weVoteHostedProfileImageUrlLarge: '',
    };
  }

  componentDidMount () {
    // console.log('ChallengeSupportJoin componentDidMount');
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
      challengeBasePath = `/c/${challengeSEOFriendlyPath}/`;
    } else {
      challengeBasePath = `/id/${challengeWeVoteId}/`;
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

  goToNextStep = () => {
    const { payToPromoteStepTurnedOn } = this.state;
    if (payToPromoteStepTurnedOn) {
      historyPush(`${this.getChallengeBasePath()}pay-to-promote`);
    } else {
      historyPush(`${this.getChallengeBasePath()}share-challenge`);
    }
  }

  submitSkipForNow = () => {
    initializejQuery(() => {
      ChallengeSupporterActions.supporterEndorsementQueuedToSave(undefined);
    });
    this.goToNextStep();
  }

  submitSupporterEndorsement = () => {
    const { challengeWeVoteId } = this.state;
    if (challengeWeVoteId) {
      const supporterEndorsementQueuedToSave = ChallengeSupporterStore.getSupporterEndorsementQueuedToSave();
      const supporterEndorsementQueuedToSaveSet = ChallengeSupporterStore.getSupporterEndorsementQueuedToSaveSet();
      let visibleToPublic = ChallengeSupporterStore.getVisibleToPublic();
      const visibleToPublicChanged = ChallengeSupporterStore.getVisibleToPublicQueuedToSaveSet();
      if (visibleToPublicChanged) {
        // If it has changed, use new value
        visibleToPublic = ChallengeSupporterStore.getVisibleToPublicQueuedToSave();
      }
      if (supporterEndorsementQueuedToSaveSet || visibleToPublicChanged) {
        // console.log('ChallengeSupportJoin, supporterEndorsementQueuedToSave:', supporterEndorsementQueuedToSave);
        const saveVisibleToPublic = true;
        initializejQuery(() => {
          ChallengeSupporterActions.supporterEndorsementSave(challengeWeVoteId, supporterEndorsementQueuedToSave, visibleToPublic, saveVisibleToPublic); // challengeSupporterSave
          ChallengeSupporterActions.supporterEndorsementQueuedToSave(undefined);
        });
      }
      const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
      const voterPhotoQueuedToSaveSet = VoterStore.getVoterPhotoQueuedToSaveSet();
      if (voterPhotoQueuedToSaveSet) {
        initializejQuery(() => {
          VoterActions.voterPhotoSave(voterPhotoQueuedToSave, voterPhotoQueuedToSaveSet);
          VoterActions.voterPhotoQueuedToSave(undefined);
        });
      }
      this.goToNextStep();
    }
  }

  render () {
    renderLog('ChallengeSupportJoin');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      challengeSEOFriendlyPath, challengeTitle,
      challengeWeVoteId, chosenWebsiteName,
      voterPhotoUrlLarge,
    } = this.state;
    const htmlTitle = `Why do you support ${challengeTitle}? - ${chosenWebsiteName}`;
    return (
      <div>
        <Helmet>
          <title>{htmlTitle}</title>
          <meta name="robots" content="noindex" data-react-helmet="true" />
        </Helmet>
        <PageWrapperDefault>
          <ContentOuterWrapperDefault>
            <ContentInnerWrapperDefault>
              {/*
              <ChallengeSupportSteps
                atStepNumber2
                challengeBasePath={this.getChallengeBasePath()}
                challengeWeVoteId={challengeWeVoteId}
                politicianBasePath={this.getPoliticianBasePath()}
              />
              */}
              <CampaignProcessStepTitle>
                To join this challenge, share how you will vote &mdash; then ask your friends to join.
              </CampaignProcessStepTitle>
              {/*
              <CampaignProcessStepIntroductionText>
                People are more likely to support this challenge if it’s clear why you care. Explain how
                {' '}
                {politicianListSentenceString}
                {' '}
                winning will impact you, your family, or your community.
              </CampaignProcessStepIntroductionText>
              */}
              <CampaignSupportSectionWrapper>
                <CampaignSupportSection>
                  <VoterPlan />
                  { !voterPhotoUrlLarge && <VoterPhotoUpload /> }
                  <VisibleToPublicCheckboxWrapper>
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <VisibleToPublicCheckbox challengeWeVoteId={challengeWeVoteId} />
                    </Suspense>
                  </VisibleToPublicCheckboxWrapper>
                  <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
                    <CampaignSupportDesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveSupporterEndorsement"
                        onClick={this.submitSupporterEndorsement}
                        variant="contained"
                      >
                        Join Challenge now
                      </Button>
                    </CampaignSupportDesktopButtonPanel>
                  </CampaignSupportDesktopButtonWrapper>
                  <CampaignSupportMobileButtonWrapper className="u-show-mobile">
                    <CampaignSupportMobileButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDefault }}
                        color="primary"
                        id="saveSupporterEndorsementMobile"
                        onClick={this.submitSupporterEndorsement}
                        variant="contained"
                      >
                        Join Challenge now
                      </Button>
                    </CampaignSupportMobileButtonPanel>
                  </CampaignSupportMobileButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Describe the people who will be affected if this candidate loses
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        People are most likely to vote when they understand the consequences of this candidate not being elected, described in terms of the people impacted.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Describe the benefits of this candidate winning
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Explain why this candidate or candidates winning will bring positive change.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Make it personal
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Voters are more likely to sign and support this challenge if it’s clear why you care.
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
                  {/*
                  <SkipForNowButtonWrapper>
                    <SkipForNowButtonPanel show>
                      <Button
                        classes={{ root: classes.buttonSimpleLink }}
                        color="primary"
                        id="skipSupporterEndorsementMobile"
                        onClick={this.submitSkipForNow}
                      >
                        Skip for now
                      </Button>
                    </SkipForNowButtonPanel>
                  </SkipForNowButtonWrapper>
                  */}
                </CampaignSupportSection>
              </CampaignSupportSectionWrapper>
            </ContentInnerWrapperDefault>
          </ContentOuterWrapperDefault>
        </PageWrapperDefault>
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
ChallengeSupportJoin.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};


const VisibleToPublicCheckboxWrapper = styled('div')`
  min-height: 25px;
`;

export default withStyles(commonMuiStyles)(ChallengeSupportJoin);
