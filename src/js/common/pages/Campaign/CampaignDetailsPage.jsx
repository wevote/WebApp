import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import {
  CampaignDescription, CampaignDescriptionDesktop, CampaignDescriptionWrapper,
  CampaignDescriptionDesktopWrapper, CampaignImagePlaceholder, CampaignImagePlaceholderText,
  CampaignImage, CampaignImageDesktop, CampaignImageDesktopWrapper, CampaignImageMobileWrapper,
  CampaignOwnersDesktopWrapper, CampaignOwnersWrapper, CampaignSubSectionTitle,
  CampaignTitleAndScoreBar, CampaignTitleDesktop, CampaignTitleMobile,
  CommentsListWrapper, DetailsSectionDesktopTablet, DetailsSectionMobile,
  SupportButtonFooterWrapper, SupportButtonPanel,
} from '../../components/Style/CampaignDetailsStyles';
import { PageWrapper } from '../../components/Style/stepDisplayStyles';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import returnFirstXWords from '../../utils/returnFirstXWords';
import CampaignOwnersList from '../../components/CampaignSupport/CampaignOwnersList';
import CampaignTopNavigation from '../../components/Navigation/CampaignTopNavigation';
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
const CampaignNewsItemList = React.lazy(() => import(/* webpackChunkName: 'CampaignNewsItemList' */ '../../components/Campaign/CampaignNewsItemList'));
const CampaignRetrieveController = React.lazy(() => import(/* webpackChunkName: 'CampaignRetrieveController' */ '../../components/Campaign/CampaignRetrieveController'));
const CampaignSupportThermometer = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportThermometer' */ '../../components/CampaignSupport/CampaignSupportThermometer'));
const SupportButtonBeforeCompletionScreen = React.lazy(() => import(/* webpackChunkName: 'SupportButtonBeforeCompletionScreen' */ '../../components/CampaignSupport/SupportButtonBeforeCompletionScreen'));


class CampaignDetailsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhotoLargeUrl: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      finalElectionDateInPast: false,
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
    // console.log('CampaignDetailsPage componentDidMount');
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

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
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
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
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
      const voterSupportsThisCampaign = CampaignStore.getVoterSupportsThisCampaign(campaignXWeVoteId);
      this.setState({
        campaignXWeVoteId,
        voterCanEditThisCampaign,
        voterSupportsThisCampaign,
      });
    }
    const campaignDescriptionLimited = returnFirstXWords(campaignDescription, 200);
    this.setState({
      campaignDescription,
      campaignDescriptionLimited,
      campaignPhotoLargeUrl,
      campaignTitle,
      finalElectionDateInPast,
      isBlockedByWeVote,
      isBlockedByWeVoteReason,
      isSupportersCountMinimumExceeded,
      pathToUseWhenProfileComplete,
    });
  }

  onCampaignSupporterStoreChange () {
    const { campaignXWeVoteId } = this.state;
    const step2Completed = CampaignSupporterStore.voterSupporterEndorsementExists(campaignXWeVoteId);
    const payToPromoteStepCompleted = CampaignSupporterStore.voterChipInExists(campaignXWeVoteId);
    const sharingStepCompleted = false;
    // console.log('onCampaignSupporterStoreChange step2Completed: ', step2Completed, ', sharingStepCompleted: ', sharingStepCompleted, ', payToPromoteStepCompleted:', payToPromoteStepCompleted);
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

  goToNextPage = () => {
    const { pathToUseWhenProfileComplete } = this.state;
    this.timer = setTimeout(() => {
      historyPush(pathToUseWhenProfileComplete);
    }, 500);
  }

  functionToUseToKeepHelping = () => {
    const { finalElectionDateInPast, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    // console.log('functionToUseToKeepHelping sharingStepCompleted:', sharingStepCompleted, ', payToPromoteStepCompleted:', payToPromoteStepCompleted, ', step2Completed:', step2Completed);
    const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, finalElectionDateInPast);
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
    // console.log('functionToUseWhenProfileComplete, blockCampaignXRedirectOnSignIn:', AppObservableStore.blockCampaignXRedirectOnSignIn());
    const saveVisibleToPublic = true;
    if (!AppObservableStore.blockCampaignXRedirectOnSignIn()) {
      initializejQuery(() => {
        CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic);
      }, this.goToNextPage());
    }
  }

  onCampaignEditClick = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    // console.log('campaignX:', campaignX);
    if (campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}/edit`);
    } else {
      historyPush(`/id/${campaignXWeVoteId}/edit`);
    }
    return null;
  }

  onCampaignShareClick = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    if (campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}/share-campaign`);
    } else {
      historyPush(`/id/${campaignXWeVoteId}/share-campaign`);
    }
    return null;
  }

  render () {
    renderLog('CampaignDetailsPage');  // Set LOG_RENDER_EVENTS to log all renders
    // const { classes } = this.props;
    const {
      campaignDescription, campaignDescriptionLimited, campaignPhotoLargeUrl,
      campaignSEOFriendlyPath, campaignTitle, campaignXWeVoteId,
      chosenWebsiteName, inPrivateLabelMode, isBlockedByWeVote, isBlockedByWeVoteReason,
      finalElectionDateInPast, isSupportersCountMinimumExceeded,
      voterCanEditThisCampaign, voterSupportsThisCampaign,
    } = this.state;
    // console.log('render isSupportersCountMinimumExceeded: ', isSupportersCountMinimumExceeded);
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
        <PageWrapper>
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
          <CampaignTopNavigation campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
          <DetailsSectionMobile className="u-show-mobile">
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
              <CampaignTitleMobile>{campaignTitle}</CampaignTitleMobile>
              <Suspense fallback={<span>&nbsp;</span>}>
                <CampaignSupportThermometer campaignXWeVoteId={campaignXWeVoteId} />
              </Suspense>
              <CampaignOwnersWrapper>
                <CampaignOwnersList campaignXWeVoteId={campaignXWeVoteId} />
              </CampaignOwnersWrapper>
            </CampaignTitleAndScoreBar>
            <CampaignDescriptionWrapper>
              <CampaignDescription>
                {campaignDescription}
              </CampaignDescription>
              <IndicatorRow>
                {finalElectionDateInPast && (
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
                    {(!isSupportersCountMinimumExceeded && !inPrivateLabelMode) && (
                      <IndicatorButtonWrapper>
                        <DraftModeIndicator onClick={this.onCampaignShareClick}>
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
                    <EditIndicator onClick={this.onCampaignEditClick}>
                      Edit Campaign
                    </EditIndicator>
                  </IndicatorButtonWrapper>
                )}
                {voterSupportsThisCampaign && (
                  <IndicatorButtonWrapper>
                    <EditIndicator onClick={this.onCampaignShareClick}>
                      Share Campaign
                    </EditIndicator>
                  </IndicatorButtonWrapper>
                )}
              </IndicatorRow>
            </CampaignDescriptionWrapper>
            <CommentsListWrapper>
              <DelayedLoad waitBeforeShow={1000}>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSubSectionTitle>
                    Updates
                  </CampaignSubSectionTitle>
                  <CampaignNewsItemList
                    campaignXWeVoteId={campaignXWeVoteId}
                    campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                    showAddNewsItemIfNeeded
                    startingNumberOfCommentsToDisplay={1}
                  />
                </Suspense>
              </DelayedLoad>
            </CommentsListWrapper>
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
          </DetailsSectionMobile>
          <DetailsSectionDesktopTablet className="u-show-desktop-tablet">
            <CampaignTitleDesktop>{campaignTitle}</CampaignTitleDesktop>
            <ColumnsWrapper>
              <ColumnTwoThirds>
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
                <CampaignOwnersDesktopWrapper>
                  <CampaignOwnersList campaignXWeVoteId={campaignXWeVoteId} />
                </CampaignOwnersDesktopWrapper>
                <CampaignDescriptionDesktopWrapper>
                  <CampaignDescriptionDesktop>
                    {campaignDescription}
                  </CampaignDescriptionDesktop>
                  <IndicatorRow>
                    {finalElectionDateInPast && (
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
                        {(!isSupportersCountMinimumExceeded && !inPrivateLabelMode) && (
                          <IndicatorButtonWrapper>
                            <DraftModeIndicator onClick={this.onCampaignShareClick}>
                              Needs Five Supporters
                            </DraftModeIndicator>
                          </IndicatorButtonWrapper>
                        )}
                      </>
                    )}
                  </IndicatorRow>
                  {voterCanEditThisCampaign && (
                    <IndicatorRow>
                      <IndicatorButtonWrapper>
                        <EditIndicator onClick={this.onCampaignEditClick}>
                          Edit This Campaign
                        </EditIndicator>
                      </IndicatorButtonWrapper>
                    </IndicatorRow>
                  )}
                </CampaignDescriptionDesktopWrapper>
                <CommentsListWrapper>
                  <DelayedLoad waitBeforeShow={500}>
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <CampaignSubSectionTitle>
                        Updates
                      </CampaignSubSectionTitle>
                      <CampaignNewsItemList
                        campaignXWeVoteId={campaignXWeVoteId}
                        campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                        showAddNewsItemIfNeeded
                        startingNumberOfCommentsToDisplay={1}
                      />
                    </Suspense>
                  </DelayedLoad>
                </CommentsListWrapper>
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
                  />
                </Suspense>
              </ColumnOneThird>
            </ColumnsWrapper>
          </DetailsSectionDesktopTablet>
        </PageWrapper>
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
        <CompleteYourProfileModalController
          campaignXWeVoteId={campaignXWeVoteId}
          functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
          supportCampaign
        />
      </PageContentContainer>
    );
  }
}
CampaignDetailsPage.propTypes = {
  // classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});

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

export default withStyles(styles)(CampaignDetailsPage);
