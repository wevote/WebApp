import { AccountCircle, ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import anonymous from '../../../../img/global/icons/avatar-generic.png';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import LazyImage from '../../components/LazyImage';
import {
  CampaignDescription, CampaignDescriptionDesktop, CampaignDescriptionWrapper,
  CampaignDescriptionDesktopWrapper, CampaignImagePlaceholder, CampaignImagePlaceholderText,
  CampaignImage, CampaignImageDesktop, CampaignImageDesktopWrapper, CampaignImageMobileWrapper,
  CampaignSubSectionTitle,
  CampaignTitleAndScoreBar, CampaignTitleDesktop, CampaignTitleMobile,
  CommentsListWrapper, DetailsSectionDesktopTablet, DetailsSectionMobile,
  SpeakerAndPhotoOuterWrapper, SpeakerName, SpeakerVoterPhotoWrapper,
  SupportButtonFooterWrapper, SupportButtonPanel,
} from '../../components/Style/CampaignDetailsStyles';
import { PageWrapper } from '../../components/Style/stepDisplayStyles';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import { formatDateToMonthDayYear } from '../../utils/dateFormat';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import returnFirstXWords from '../../utils/returnFirstXWords';
import stringContains from '../../utils/stringContains';
import CampaignNewsItemPublishSteps from '../../components/Navigation/CampaignNewsItemPublishSteps';
import CompleteYourProfileModalController from '../../components/Settings/CompleteYourProfileModalController';
import { BlockedIndicator, BlockedReason, DraftModeIndicator, EditIndicator, ElectionInPast, IndicatorButtonWrapper, IndicatorRow } from '../../components/Style/CampaignIndicatorStyles';
import { PageContentContainer } from '../../../components/Style/pageLayoutStyles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import initializejQuery from '../../utils/initializejQuery';
import keepHelpingDestination from '../../utils/keepHelpingDestination';

const CampaignCommentsList = React.lazy(() => import(/* webpackChunkName: 'CampaignCommentsList' */ '../../components/Campaign/CampaignCommentsList'));
const CampaignDetailsActionSideBox = React.lazy(() => import(/* webpackChunkName: 'CampaignDetailsActionSideBox' */ '../../components/CampaignSupport/CampaignDetailsActionSideBox'));
const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const CampaignSupportThermometer = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportThermometer' */ '../../components/CampaignSupport/CampaignSupportThermometer'));
const SupportButtonBeforeCompletionScreen = React.lazy(() => import(/* webpackChunkName: 'SupportButtonBeforeCompletionScreen' */ '../../components/CampaignSupport/SupportButtonBeforeCompletionScreen'));


class CampaignNewsItemDetailsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      datePosted: '',
      finalElectionDateInPast: false,
      inDraftMode: false,
      inPrivateLabelMode: false,
      pathToUseWhenProfileComplete: '',
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      sharingStepCompleted: false,
      step2Completed: false,
      voterCanEditThisCampaign: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignNewsItemDetailsPage componentDidMount');
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    // console.log('componentDidMount campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onCampaignSupporterStoreChange();
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    let pathToUseWhenProfileComplete;
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else {
      this.setState({
        campaignXWeVoteId,
      });
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    this.setState({
      pathToUseWhenProfileComplete,
    });
    // Take the "calculated" identifiers and retrieve if missing
    retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      campaignXWeVoteId,
    } = this.state;
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevState;
    // console.log('CampaignNewsItemDetailsPage componentDidUpdate, campaignXWeVoteId:', campaignXWeVoteId, ', campaignXWeVoteIdPrevious:', campaignXWeVoteIdPrevious);
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        // console.log('CampaignNewsItemDetailsPage componentDidUpdate campaignXWeVoteId change');
        this.onCampaignStoreChange();
      }
    }
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = null;
    if (this.props.setShowHeaderFooter) {
      this.props.setShowHeaderFooter(true);
    }
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    const inPrivateLabelMode = AppObservableStore.inPrivateLabelMode();
    // For now, we assume that paid sites with chosenSiteLogoUrl will turn off "Chip in"
    const payToPromoteStepTurnedOn = !inPrivateLabelMode;
    this.setState({
      chosenWebsiteName,
      inPrivateLabelMode,
      payToPromoteStepTurnedOn,
    });
  }

  onCampaignStoreChange () {
    const { inPreviewMode, match: { params } } = this.props;
    const {
      campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      campaignXNewsItemWeVoteId,
      campaignXWeVoteId: campaignXWeVoteIdFromParams,
    } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams, ', campaignXNewsItemWeVoteId:', campaignXNewsItemWeVoteId);
    const {
      campaignDescription,
      campaignPhotoLargeUrl,
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
      finalElectionDateInPast,
      isBlockedByWeVote,
      isBlockedByWeVoteReason,
      isSupportersCountMinimumExceeded,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    let pathToUseWhenProfileComplete;
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else if (campaignXWeVoteId) {
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    if (campaignXWeVoteId) {
      const voterCanEditThisCampaign = CampaignStore.getVoterCanEditThisCampaign(campaignXWeVoteId);
      this.setState({
        campaignXWeVoteId,
        voterCanEditThisCampaign,
      });
    }
    const campaignDescriptionLimited = returnFirstXWords(campaignDescription, 200);
    this.setState({
      campaignDescriptionLimited,
      campaignPhotoLargeUrl,
      campaignTitle,
      finalElectionDateInPast,
      isBlockedByWeVote,
      isBlockedByWeVoteReason,
      isSupportersCountMinimumExceeded,
      pathToUseWhenProfileComplete,
    });
    if (campaignXNewsItemWeVoteId) {
      const campaignXNewsItem = CampaignStore.getCampaignXNewsItemByWeVoteId(campaignXNewsItemWeVoteId);
      const {
        campaign_news_subject: campaignNewsSubject,
        campaign_news_text: campaignNewsText,
        date_posted: datePosted,
        in_draft_mode: inDraftMode,
        speaker_name: speakerName,
        we_vote_hosted_profile_image_url_tiny: speakerProfileImageUrlTiny,
      } = campaignXNewsItem;

      if (this.props.setShowHeaderFooter) {
        if (inDraftMode || inPreviewMode) {
          this.props.setShowHeaderFooter(false);
        } else {
          this.props.setShowHeaderFooter(true);
        }
      }
      this.setState({
        campaignNewsSubject,
        campaignNewsText,
        campaignXNewsItemWeVoteId,
        datePosted,
        inDraftMode,
        speakerName,
        speakerProfileImageUrlTiny,
      });
    }
  }

  onCampaignSupporterStoreChange () {
    const { campaignXWeVoteId } = this.state;
    const step2Completed = CampaignSupporterStore.voterSupporterEndorsementExists(campaignXWeVoteId);
    const payToPromoteStepCompleted = CampaignSupporterStore.voterChipInExists(campaignXWeVoteId);
    const sharingStepCompleted = false;
    // console.log('onCampaignSupporterStoreChange sharingStepCompleted: ', sharingStepCompleted, ', step2Completed: ', step2Completed, ', payToPromoteStepCompleted:', payToPromoteStepCompleted);
    this.setState({
      sharingStepCompleted,
      step2Completed,
      payToPromoteStepCompleted,
    });
  }

  getCampaignBasePath = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }
    return campaignBasePath;
  }

  goToCampaignBasePath = () => {
    historyPush(`${this.getCampaignBasePath()}`);
  }

  goToNextPage = () => {
    const { pathToUseWhenProfileComplete } = this.state;
    this.timer = setTimeout(() => {
      historyPush(pathToUseWhenProfileComplete);
    }, 500);
  }

  functionToUseToKeepHelping = () => {
    // console.log('functionToUseToKeepHelping');
    const { payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted);
    historyPush(`${this.getCampaignBasePath()}/${keepHelpingDestinationString}`);
  }

  functionToUseWhenProfileComplete = () => {
    const { campaignXWeVoteId } = this.state;
    const campaignSupported = true;
    const campaignSupportedChanged = true;
    // From this page we always send value for 'visibleToPublic'
    let visibleToPublic = CampaignSupporterStore.getVisibleToPublic();
    const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
    if (visibleToPublicChanged) {
      // If it has changed, use new value
      visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
    }
    // console.log('functionToUseWhenProfileComplete, visibleToPublic:', visibleToPublic, ', visibleToPublicChanged:', visibleToPublicChanged, ', blockCampaignXRedirectOnSignIn:', AppObservableStore.blockCampaignXRedirectOnSignIn());
    const saveVisibleToPublic = true;
    if (!AppObservableStore.blockCampaignXRedirectOnSignIn()) {
      initializejQuery(() => {
        CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic);
      }, this.goToNextPage());
    }
  }

  continueToNextStep = () => {
    const { match: { params } } = this.props;
    const { campaignXNewsItemWeVoteId } = params;
    historyPush(`${this.getCampaignBasePath()}/send/${campaignXNewsItemWeVoteId}`);
    return null;
  }

  onCampaignEditClick = () => {
    historyPush(`${this.getCampaignBasePath()}/edit`);
    return null;
  }

  onCampaignNewsItemEditClick = () => {
    const { match: { params } } = this.props;
    const { campaignXNewsItemWeVoteId } = params;
    historyPush(`${this.getCampaignBasePath()}/add-update/${campaignXNewsItemWeVoteId}`);
    return null;
  }

  onCampaignNewsItemShareClick = () => {
    const { match: { params } } = this.props;
    const { campaignXNewsItemWeVoteId } = params;
    historyPush(`${this.getCampaignBasePath()}/share-it/${campaignXNewsItemWeVoteId}`);
    return null;
  }

  onCampaignGetMinimumSupportersClick = () => {
    historyPush(`${this.getCampaignBasePath()}/share-campaign`);
    return null;
  }

  render () {
    renderLog('CampaignNewsItemDetailsPage');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, inPreviewMode } = this.props;
    const {
      campaignDescriptionLimited, campaignNewsSubject,
      campaignNewsText, campaignPhotoLargeUrl,
      campaignSEOFriendlyPath, campaignTitle, campaignXNewsItemWeVoteId, campaignXWeVoteId,
      chosenWebsiteName, datePosted, inDraftMode, isBlockedByWeVote, isBlockedByWeVoteReason,
      inPrivateLabelMode, finalElectionDateInPast, isSupportersCountMinimumExceeded,
      speakerName, speakerProfileImageUrlTiny,
      voterCanEditThisCampaign,
    } = this.state;
    const htmlTitle = `${campaignTitle} - ${chosenWebsiteName}`;
    if (isBlockedByWeVote && !voterCanEditThisCampaign) {
      return (
        <PageContentContainer>
          <PageWrapper>
            <Helmet>
              <title>{htmlTitle}</title>
              <meta
                name="description"
                content={campaignDescriptionLimited}
              />
            </Helmet>
            <CampaignTitleAndScoreBar className="u-show-mobile">
              <CampaignTitleMobile>{campaignTitle}</CampaignTitleMobile>
            </CampaignTitleAndScoreBar>
            <DetailsSectionDesktopTablet className="u-show-desktop-tablet">
              <CampaignTitleDesktop>{campaignTitle}</CampaignTitleDesktop>
            </DetailsSectionDesktopTablet>
            <BlockedReason>
              This campaign has been blocked by moderators from We Vote because it is currently violating our terms of service. If you have any questions,
              {' '}
              <OpenExternalWebSite
                linkIdAttribute="weVoteSupport"
                url="https://help.wevote.us/hc/en-us/requests/new"
                target="_blank"
                body={<span>please contact We Vote support.</span>}
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
          </PageWrapper>
        </PageContentContainer>
      );
    }

    const speakerHTML = (
      <>
        {!stringContains('Voter-', speakerName) && (
          <SpeakerAndPhotoOuterWrapper>
            <SpeakerVoterPhotoWrapper>
              {speakerProfileImageUrlTiny ? (
                <LazyImage
                  src={speakerProfileImageUrlTiny}
                  placeholder={anonymous}
                  className="profile-photo"
                  height={32}
                  width={32}
                  alt={speakerName}
                />
              ) : (
                <AccountCircle classes={{ root: classes.accountCircleRoot }} />
              )}
            </SpeakerVoterPhotoWrapper>
            <SpeakerName>
              {speakerName}
            </SpeakerName>
          </SpeakerAndPhotoOuterWrapper>
        )}
      </>
    );

    if (!campaignTitle && !campaignNewsText) {
      return (
        <div>
          <Suspense fallback={<span>&nbsp;</span>}>
            <CampaignRetrieveController campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
          </Suspense>
          <Helmet>
            <title>{htmlTitle}</title>
            <meta
              name="description"
              content={campaignDescriptionLimited}
            />
          </Helmet>
        </div>
      );
    }

    return (
      <PageContentContainer>
        <Suspense fallback={<span>&nbsp;</span>}>
          <CampaignRetrieveController campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Helmet>
          <title>{htmlTitle}</title>
          <meta
            name="description"
            content={campaignDescriptionLimited}
          />
        </Helmet>
        {(inDraftMode || inPreviewMode) && (
          <UpdateSupportersHeader>
            <CampaignNewsItemPublishSteps
              atStepNumber2
              campaignBasePath={this.getCampaignBasePath()}
              campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId}
              campaignXWeVoteId={campaignXWeVoteId}
            />
            <EditContinueOuterWrapper>
              <EditContinueInnerWrapper>
                <PreviewHeader>
                  Preview
                </PreviewHeader>
                <EditContinueButtonsWrapper>
                  <Button
                    classes={{ root: classes.buttonEdit }}
                    color="primary"
                    id="campaignGoBackToEditNewsItemText"
                    onClick={this.onCampaignNewsItemEditClick}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                  <Button
                    classes={{ root: classes.buttonSave }}
                    color="primary"
                    id="continueToNextStep"
                    onClick={this.continueToNextStep}
                    variant="contained"
                  >
                    Continue
                  </Button>
                </EditContinueButtonsWrapper>
              </EditContinueInnerWrapper>
            </EditContinueOuterWrapper>
          </UpdateSupportersHeader>
        )}
        <PageWrapper>
          {!inDraftMode && (
            <BackToNavigationBar className="u-cursor--pointer u-link-color-on-hover u-link-underline-on-hover" onClick={this.goToCampaignBasePath}>
              <ArrowBack className="button-icon" />
              <BackToCampaignTitle>
                {campaignTitle}
              </BackToCampaignTitle>
            </BackToNavigationBar>
          )}
          {isBlockedByWeVote && (
            <BlockedReason>
              Your campaign has been blocked by moderators from We Vote. It is only visible campaign owners. Please make any requested modifications so you are in compliance with our terms of service and
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
          )}
          <CampaignUpdateBar>
            <CampaignUpdate>
              For Immediate Release
            </CampaignUpdate>
          </CampaignUpdateBar>
          <DetailsSectionMobile className="u-show-mobile">
            <NewsItemSubjectMobile>
              {campaignNewsSubject}
            </NewsItemSubjectMobile>
            {speakerHTML}
            <CampaignImageMobileWrapper>
              {campaignPhotoLargeUrl ? (
                <CampaignImage src={campaignPhotoLargeUrl} alt="Campaign" />
              ) : (
                <DelayedLoad waitBeforeShow={1000}>
                  <CampaignImagePlaceholder>
                    <CampaignImagePlaceholderText>
                      No image provided
                    </CampaignImagePlaceholderText>
                  </CampaignImagePlaceholder>
                </DelayedLoad>
              )}
            </CampaignImageMobileWrapper>
            <CampaignTitleAndScoreBar>
              <Suspense fallback={<span>&nbsp;</span>}>
                <CampaignSupportThermometer campaignXWeVoteId={campaignXWeVoteId} />
              </Suspense>
            </CampaignTitleAndScoreBar>
            <CampaignDescriptionWrapper>
              <CampaignDescription>
                {datePosted && (
                  <DatePostedWrapper>
                    {formatDateToMonthDayYear(datePosted)}
                    {' '}
                    &mdash;
                    {' '}
                  </DatePostedWrapper>
                )}
                {campaignNewsText}
              </CampaignDescription>
              <IndicatorRow>
                {(finalElectionDateInPast && !inDraftMode) && (
                  <IndicatorButtonWrapper>
                    <ElectionInPast>
                      Election in Past
                    </ElectionInPast>
                  </IndicatorButtonWrapper>
                )}
                {voterCanEditThisCampaign && (
                  <>
                    {isBlockedByWeVote && (
                      <IndicatorButtonWrapper>
                        <BlockedIndicator onClick={this.onCampaignEditClick}>
                          Blocked
                        </BlockedIndicator>
                      </IndicatorButtonWrapper>
                    )}
                    {(!isSupportersCountMinimumExceeded && !inDraftMode && !inPrivateLabelMode) && (
                      <IndicatorButtonWrapper>
                        <DraftModeIndicator onClick={this.onCampaignGetMinimumSupportersClick}>
                          Needs Five Supporters
                        </DraftModeIndicator>
                      </IndicatorButtonWrapper>
                    )}
                  </>
                )}
              </IndicatorRow>
              <IndicatorRow>
                {voterCanEditThisCampaign && (
                  <IndicatorButtonWrapper>
                    <EditIndicator onClick={this.onCampaignNewsItemEditClick}>
                      Edit This Update
                    </EditIndicator>
                  </IndicatorButtonWrapper>
                )}
                <IndicatorButtonWrapper>
                  <EditIndicator onClick={this.onCampaignNewsItemShareClick}>
                    <span className="u-show-mobile">
                      Share
                    </span>
                    <span className="u-show-desktop-tablet">
                      Share This
                    </span>
                  </EditIndicator>
                </IndicatorButtonWrapper>
              </IndicatorRow>
              <PressReleaseEnd>
                <>
                  ###
                </>
              </PressReleaseEnd>
            </CampaignDescriptionWrapper>
            {!inDraftMode && (
              <CommentsListWrapper>
                <DelayedLoad waitBeforeShow={1000}>
                  <Suspense fallback={<span>&nbsp;</span>}>
                    <CampaignSubSectionTitle>
                      Reasons for supporting
                    </CampaignSubSectionTitle>
                    <CampaignCommentsList campaignXWeVoteId={campaignXWeVoteId} startingNumberOfCommentsToDisplay={2} />
                  </Suspense>
                </DelayedLoad>
              </CommentsListWrapper>
            )}
          </DetailsSectionMobile>
          <DetailsSectionDesktopTablet className="u-show-desktop-tablet">
            <ColumnsWrapper>
              <ColumnTwoThirds>
                <NewsItemSubjectDesktop>
                  {campaignNewsSubject}
                </NewsItemSubjectDesktop>
                {speakerHTML}
                <CampaignImageDesktopWrapper>
                  {campaignPhotoLargeUrl ? (
                    <CampaignImageDesktop src={campaignPhotoLargeUrl} alt="Campaign" />
                  ) : (
                    <DelayedLoad waitBeforeShow={1000}>
                      <CampaignImagePlaceholder>
                        <CampaignImagePlaceholderText>
                          No image provided
                        </CampaignImagePlaceholderText>
                      </CampaignImagePlaceholder>
                    </DelayedLoad>
                  )}
                </CampaignImageDesktopWrapper>
                <CampaignDescriptionDesktopWrapper>
                  <CampaignDescriptionDesktop>
                    {datePosted && (
                      <DatePostedWrapper>
                        {formatDateToMonthDayYear(datePosted)}
                        {' '}
                        &mdash;
                        {' '}
                      </DatePostedWrapper>
                    )}
                    {campaignNewsText}
                  </CampaignDescriptionDesktop>
                  <IndicatorRow>
                    {(finalElectionDateInPast && !inDraftMode) && (
                      <IndicatorButtonWrapper>
                        <ElectionInPast>
                          Election in Past
                        </ElectionInPast>
                      </IndicatorButtonWrapper>
                    )}
                    {voterCanEditThisCampaign && (
                      <>
                        {isBlockedByWeVote && (
                          <IndicatorButtonWrapper>
                            <BlockedIndicator onClick={this.onCampaignEditClick}>
                              Blocked: Changes Needed
                            </BlockedIndicator>
                          </IndicatorButtonWrapper>
                        )}
                        {(!isSupportersCountMinimumExceeded && !inDraftMode && !inPrivateLabelMode) && (
                          <IndicatorButtonWrapper>
                            <DraftModeIndicator onClick={this.onCampaignGetMinimumSupportersClick}>
                              Needs Five Supporters
                            </DraftModeIndicator>
                          </IndicatorButtonWrapper>
                        )}
                      </>
                    )}
                  </IndicatorRow>
                  <IndicatorRow>
                    {voterCanEditThisCampaign && (
                      <IndicatorButtonWrapper>
                        <EditIndicator onClick={this.onCampaignNewsItemEditClick}>
                          Edit This Update
                        </EditIndicator>
                      </IndicatorButtonWrapper>
                    )}
                    <IndicatorButtonWrapper>
                      <EditIndicator onClick={this.onCampaignNewsItemShareClick}>
                        <span className="u-show-mobile">
                          Share
                        </span>
                        <span className="u-show-desktop-tablet">
                          Share This
                        </span>
                      </EditIndicator>
                    </IndicatorButtonWrapper>
                  </IndicatorRow>
                  <PressReleaseEnd>
                    <>
                      ###
                    </>
                  </PressReleaseEnd>
                </CampaignDescriptionDesktopWrapper>
                {!inDraftMode && (
                  <CommentsListWrapper>
                    <DelayedLoad waitBeforeShow={500}>
                      <Suspense fallback={<span>&nbsp;</span>}>
                        <CampaignSubSectionTitle>
                          Reasons for supporting
                        </CampaignSubSectionTitle>
                        <CampaignCommentsList campaignXWeVoteId={campaignXWeVoteId} startingNumberOfCommentsToDisplay={2} />
                      </Suspense>
                    </DelayedLoad>
                  </CommentsListWrapper>
                )}
              </ColumnTwoThirds>
              <ColumnOneThird>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSupportThermometer campaignXWeVoteId={campaignXWeVoteId} finalElectionDateInPast={finalElectionDateInPast} />
                </Suspense>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignDetailsActionSideBox
                    campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                    campaignXWeVoteId={campaignXWeVoteId}
                    finalElectionDateInPast={finalElectionDateInPast}
                    functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                    functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                    inDraftMode={inDraftMode}
                  />
                </Suspense>
              </ColumnOneThird>
            </ColumnsWrapper>
          </DetailsSectionDesktopTablet>
        </PageWrapper>
        {!inDraftMode && (
          <SupportButtonFooterWrapper className="u-show-mobile">
            {!finalElectionDateInPast && (
              <SupportButtonPanel>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <SupportButtonBeforeCompletionScreen
                    campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                    campaignXWeVoteId={campaignXWeVoteId}
                    functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                    functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                  />
                </Suspense>
              </SupportButtonPanel>
            )}
          </SupportButtonFooterWrapper>
        )}
        <CompleteYourProfileModalController
          campaignXWeVoteId={campaignXWeVoteId}
          functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
          supportCampaign
        />
      </PageContentContainer>
    );
  }
}
CampaignNewsItemDetailsPage.propTypes = {
  classes: PropTypes.object,
  inPreviewMode: PropTypes.bool,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};

const styles = (theme) => ({
  accountCircleRoot: {
    color: '#999',
    height: 32,
    marginRight: 8,
    width: 32,
  },
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
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const BackToCampaignTitle = styled('div')`
  font-size: 18px;
  font-weight: 600;
  margin-left: 10px;
  padding: 18px 0;
`;

const BackToNavigationBar = styled('div')`
  align-items: center;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 24px;
  min-height: 59px;
`;

const CampaignUpdate = styled('div')(({ theme }) => (`
  color: #808080;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
  ${theme.breakpoints.down('sm')} {
    margin: 0 6px;
  }
`));

const CampaignUpdateBar = styled('div')`
  // align-items: bottom;  // bottom is nonsense css
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
`;

const ColumnOneThird = styled('div')`
  flex: 1;
  flex-direction: column;
  flex-basis: 40%;
  margin: 0 0 0 25px;
`;

const ColumnsWrapper = styled('div')`
  display: flex;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const ColumnTwoThirds = styled('div')`
  flex: 2;
  flex-direction: column;
  flex-basis: 60%;
`;

const DatePostedWrapper = styled('span')`
  color: #808080;
  font-weight: 700;
  text-transform: uppercase;
`;

const EditContinueButtonsWrapper = styled('div')`
  display: flex;
`;

const EditContinueInnerWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 960px;
  padding: 8px 0;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const EditContinueOuterWrapper = styled('div')`
  background-color: #f6f4f6;
  border-bottom: 1px solid #ddd;
  // margin: 10px 0;
  width: 100%;
`;

const NewsItemSubjectDesktop = styled('h1')(({ theme }) => (`
  font-size: 32px;
  margin: 0 0 24px 0;
  min-height: 34px;
  ${theme.breakpoints.down('md')} {
    font-size: 24px;
    min-height: 29px;
  }
`));

const NewsItemSubjectMobile = styled('h1')(({ theme }) => (`
  font-size: 28px;
  margin: 0 6px 12px 6px;
  min-height: 34px;
  ${theme.breakpoints.down('md')} {
    font-size: 24px;
    min-height: 29px;
  }
`));

const PressReleaseEnd = styled('div')`
  align-items: center;
  color: #808080;
  display: flex;
  font-weight: 700;
  justify-content: center;
  margin-top: 20px;
`;

const PreviewHeader = styled('div')`
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
`;

const UpdateSupportersHeader = styled('div')`
  margin-bottom: 24px;
  margin-top: 30px;
`;

export default withStyles(styles)(CampaignNewsItemDetailsPage);
