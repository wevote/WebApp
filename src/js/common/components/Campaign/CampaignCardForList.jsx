import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
// import { convertStateCodeToStateText } from '../../utils/addressFunctions';
// import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import {
  CampaignImageMobile,
  CampaignImagePlaceholderText,
  CampaignImageMobilePlaceholder,
  CampaignImageDesktopPlaceholder,
  CampaignImageDesktop,
  CampaignPoliticianImageMobile,
  CandidateCardForListWrapper,
  CampaignActionButtonsWrapper,
  OneCampaignPhotoWrapperMobile,
  OneCampaignPhotoDesktopColumn,
  OneCampaignTitle,
  OneCampaignOuterWrapper,
  OneCampaignTextColumn,
  OneCampaignInnerWrapper,
  OneCampaignDescription,
  SupportersWrapper,
  SupportersCount,
  SupportersActionLink,
  CampaignPoliticianImageDesktop,
} from '../Style/CampaignCardStyles';
// import { getTodayAsInteger, getYearFromUltimateElectionDate } from '../../utils/dateFormat';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import CampaignOwnersList from '../CampaignSupport/CampaignOwnersList';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import keepHelpingDestination from '../../utils/keepHelpingDestination';
import numberWithCommas from '../../utils/numberWithCommas';
import saveCampaignSupportAndGoToNextPage from '../../utils/saveCampaignSupportAndGoToNextPage';
// import { BlockedIndicator, DraftModeIndicator, EditIndicator, ElectionInPast, IndicatorButtonWrapper, IndicatorDefaultButtonWrapper, IndicatorRow } from '../Style/CampaignIndicatorStyles';

const SupportButtonBeforeCompletionScreen = React.lazy(() => import(/* webpackChunkName: 'SupportButtonBeforeCompletionScreen' */ '../CampaignSupport/SupportButtonBeforeCompletionScreen'));

class CampaignCardForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignSupported: false,
      campaignX: {},
      inPrivateLabelMode: false,
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      sharingStepCompleted: false,
      step2Completed: false,
    };
    this.functionToUseToKeepHelping = this.functionToUseToKeepHelping.bind(this);
    this.functionToUseWhenProfileComplete = this.functionToUseWhenProfileComplete.bind(this);
    this.getCampaignXBasePath = this.getCampaignXBasePath.bind(this);
    this.onCampaignClick = this.onCampaignClick.bind(this);
    this.onCampaignClickLink = this.onCampaignClickLink.bind(this);
    this.onCampaignEditClick = this.onCampaignEditClick.bind(this);
    this.onCampaignGetMinimumSupportersClick = this.onCampaignGetMinimumSupportersClick.bind(this);
    this.onCampaignShareClick = this.onCampaignShareClick.bind(this);
    this.pullCampaignXSupporterVoterEntry = this.pullCampaignXSupporterVoterEntry.bind(this);
  }

  componentDidMount () {
    // console.log('CampaignCardForList componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onCampaignSupporterStoreChange();
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
        this.onCampaignSupporterStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onAppObservableStoreChange () {
    const { inPrivateLabelMode: inPrivateLabelModePrevious, payToPromoteStepTurnedOn: payToPromoteStepTurnedOnPrevious } = this.state;
    const inPrivateLabelMode = AppObservableStore.inPrivateLabelMode();
    const payToPromoteStepTurnedOn = !inPrivateLabelMode;
    if (inPrivateLabelModePrevious !== inPrivateLabelMode) {
      this.setState({
        inPrivateLabelMode,
      });
    }
    if (payToPromoteStepTurnedOnPrevious !== payToPromoteStepTurnedOn) {
      this.setState({
        payToPromoteStepTurnedOn,
      });
    }
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    // const voterCanEditThisCampaign = CampaignStore.getVoterCanEditThisCampaign(campaignXWeVoteId);
    this.setState({
      campaignX,
      // voterCanEditThisCampaign,
    });
  }

  onCampaignSupporterStoreChange () {
    const {
      campaignXWeVoteId,
    } = this.props;
    // console.log('CampaignCardForList onCampaignSupporterStoreChange campaignXWeVoteId:', campaignXWeVoteId, ', campaignSEOFriendlyPath:', campaignSEOFriendlyPath);
    if (campaignXWeVoteId) {
      this.pullCampaignXSupporterVoterEntry(campaignXWeVoteId);
    }
  }

  onCampaignClickLink () {
    const { campaignX } = this.state;
    if (!campaignX) {
      return null;
    }
    const {
      in_draft_mode: inDraftMode,
    } = campaignX;
    if (inDraftMode) {
      return '/start-a-campaign-preview';
    } else {
      return `${this.getCampaignXBasePath()}`;
    }
  }

  onCampaignClick () {
    AppObservableStore.setBlockCampaignXRedirectOnSignIn(true);
    historyPush(this.onCampaignClickLink());
  }

  onCampaignEditClick () {
    const { campaignX } = this.state;
    // console.log('campaignX:', campaignX);
    if (!campaignX) {
      return null;
    }
    const {
      in_draft_mode: inDraftMode,
    } = campaignX;
    if (inDraftMode) {
      historyPush('/start-a-campaign-preview');
    } else {
      historyPush(`${this.getCampaignXBasePath()}/edit`);
    }
    return null;
  }

  onCampaignGetMinimumSupportersClick () {
    const { campaignX } = this.state;
    // console.log('campaignX:', campaignX);
    if (!campaignX) {
      return null;
    }
    historyPush(`${this.getCampaignXBasePath()}/share-campaign`);
    return null;
  }

  onCampaignShareClick () {
    const { campaignX } = this.state;
    // console.log('campaignX:', campaignX);
    if (!campaignX) {
      return null;
    }
    historyPush(`${this.getCampaignXBasePath()}/share-campaign`);
    return null;
  }

  getCampaignXBasePath () {
    const { campaignX } = this.state;
    // console.log('campaignX:', campaignX);
    if (!campaignX) {
      return null;
    }
    const {
      seo_friendly_path: campaignSEOFriendlyPath,
      campaignx_we_vote_id: campaignXWeVoteId,
    } = campaignX;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }
    return campaignBasePath;
  }

  pullCampaignXSupporterVoterEntry (campaignXWeVoteId) {
    if (campaignXWeVoteId) {
      const campaignXSupporterVoterEntry = CampaignSupporterStore.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('onCampaignSupporterStoreChange campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
      const {
        campaign_supported: campaignSupported,
        campaignx_we_vote_id: campaignXWeVoteIdFromCampaignXSupporter,
      } = campaignXSupporterVoterEntry;
      // console.log('onCampaignSupporterStoreChange campaignSupported: ', campaignSupported);
      if (campaignXWeVoteIdFromCampaignXSupporter) {
        const step2Completed = CampaignSupporterStore.voterSupporterEndorsementExists(campaignXWeVoteId);
        const payToPromoteStepCompleted = CampaignSupporterStore.voterChipInExists(campaignXWeVoteId);
        const sharingStepCompleted = false;
        this.setState({
          campaignSupported,
          sharingStepCompleted,
          step2Completed,
          payToPromoteStepCompleted,
        });
      } else {
        this.setState({
          campaignSupported: false,
        });
      }
    }
  }

  functionToUseToKeepHelping () {
    const { payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    // console.log(payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed);
    const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted);
    // console.log('functionToUseToKeepHelping keepHelpingDestinationString:', keepHelpingDestinationString);
    historyPush(`${this.getCampaignXBasePath()}/${keepHelpingDestinationString}`);
  }

  functionToUseWhenProfileComplete () {
    const { campaignXWeVoteId } = this.props;
    if (campaignXWeVoteId) {
      const campaignXBaseBath = this.getCampaignXBasePath();
      saveCampaignSupportAndGoToNextPage(campaignXWeVoteId, campaignXBaseBath);
    } else {
      console.log('CampaignCardForList functionToUseWhenProfileComplete campaignXWeVoteId not found');
    }
  }

  render () {
    renderLog('CampaignCardForList');  // Set LOG_RENDER_EVENTS to log all renders
    const { limitCardWidth } = this.props;
    const { campaignSupported, campaignX } = this.state; // , inPrivateLabelMode, voterCanEditThisCampaign
    if (!campaignX) {
      return null;
    }
    const {
      // ballot_guide_official_statement: ballotGuideOfficialStatement, // Consider using this
      campaign_description: campaignDescription,
      campaign_title: campaignTitle,
      campaignx_we_vote_id: campaignXWeVoteId,
      // final_election_date_as_integer: finalElectionDateAsInteger,
      // final_election_date_in_past: finalElectionDateInPast,
      in_draft_mode: inDraftMode,
      // is_blocked_by_we_vote: isBlockedByWeVote,
      // is_in_team_review_mode: isInTeamReviewMode,
      // is_supporters_count_minimum_exceeded: isSupportersCountMinimumExceeded,
      supporters_count: supportersCount,
      supporters_count_next_goal: supportersCountNextGoal,
      // visible_on_this_site: visibleOnThisSite,
      we_vote_hosted_campaign_photo_large_url: campaignPhotoLargeUrl,
      we_vote_hosted_campaign_photo_medium_url: campaignPhotoMediumUrl,
      we_vote_hosted_profile_image_url_large: weVoteHostedProfileImageUrlLarge,
    } = campaignX;
    // const stateName = convertStateCodeToStateText(stateCode);
    const supportersCountNextGoalWithFloor = supportersCountNextGoal || CampaignStore.getCampaignXSupportersCountNextGoalDefault();
    // const year = getYearFromUltimateElectionDate(finalElectionDateAsInteger);
    return (
      <CandidateCardForListWrapper limitCardWidth={limitCardWidth}>
        <OneCampaignOuterWrapper limitCardWidth={limitCardWidth}>
          <OneCampaignInnerWrapper limitCardWidth={limitCardWidth || isMobileScreenSize()}>
            <OneCampaignTextColumn>
              <TitleAndTextWrapper>
                <OneCampaignTitle>
                  <Link
                    id="campaignCardDisplayName"
                    to={this.onCampaignClickLink()}
                  >
                    {campaignTitle}
                  </Link>
                </OneCampaignTitle>
                <SupportersWrapper>
                  <SupportersCount>
                    {numberWithCommas(supportersCount)}
                    {' '}
                    {supportersCount === 1 ? 'supporter.' : 'supporters.'}
                  </SupportersCount>
                  {' '}
                  {campaignSupported ? (
                    <SupportersActionLink>
                      Thank you for supporting!
                    </SupportersActionLink>
                  ) : (
                    <SupportersActionLink
                      className="u-link-color u-link-underline u-cursor--pointer"
                      id="campaignCardLetsGetTo"
                      onClick={this.onCampaignClick}
                    >
                      Let&apos;s get to
                      {' '}
                      {numberWithCommas(supportersCountNextGoalWithFloor)}
                      !
                    </SupportersActionLink>
                  )}
                </SupportersWrapper>
                <OneCampaignDescription
                  className="u-cursor--pointer"
                  id="campaignCardDescription"
                  onClick={this.onCampaignClick}
                >
                  <TruncateMarkup
                    ellipsis="..."
                    lines={2}
                    tokenize="words"
                  >
                    <div>
                      {campaignDescription}
                    </div>
                  </TruncateMarkup>
                </OneCampaignDescription>
                <CampaignOwnersWrapper>
                  <CampaignOwnersList campaignXWeVoteId={campaignXWeVoteId} compressedMode />
                </CampaignOwnersWrapper>
              </TitleAndTextWrapper>
              {/*
              <IndicatorRow>
                {finalElectionDateInPast && (
                  <IndicatorButtonWrapper>
                    <ElectionInPast>
                      Election in Past
                    </ElectionInPast>
                  </IndicatorButtonWrapper>
                )}
                {isBlockedByWeVote && (
                  <IndicatorButtonWrapper>
                    <BlockedIndicator onClick={this.onCampaignEditClick}>
                      Blocked: Changes Needed
                    </BlockedIndicator>
                  </IndicatorButtonWrapper>
                )}
                {!!(!inDraftMode && !isSupportersCountMinimumExceeded && !inPrivateLabelMode) && (
                  <IndicatorButtonWrapper onClick={this.onCampaignGetMinimumSupportersClick}>
                    <DraftModeIndicator>
                      Needs Five Supporters
                    </DraftModeIndicator>
                  </IndicatorButtonWrapper>
                )}
              </IndicatorRow>
              <IndicatorRow>
                {inDraftMode && (
                  <IndicatorDefaultButtonWrapper onClick={this.onCampaignClick}>
                    <DraftModeIndicator>
                      Draft
                    </DraftModeIndicator>
                  </IndicatorDefaultButtonWrapper>
                )}
                {!visibleOnThisSite && (
                  <IndicatorButtonWrapper>
                    <DraftModeIndicator>
                      <span className="u-show-mobile">
                        Not Visible
                      </span>
                      <span className="u-show-desktop-tablet">
                        Not Visible On This Site
                      </span>
                    </DraftModeIndicator>
                  </IndicatorButtonWrapper>
                )}
                {isInTeamReviewMode && (
                  <IndicatorButtonWrapper>
                    <DraftModeIndicator onClick={this.onCampaignEditClick}>
                      <span className="u-show-mobile">
                        Team Reviewing
                      </span>
                      <span className="u-show-desktop-tablet">
                        Team Still Reviewing
                      </span>
                    </DraftModeIndicator>
                  </IndicatorButtonWrapper>
                )}
                {voterCanEditThisCampaign && (
                  <IndicatorButtonWrapper>
                    <EditIndicator onClick={this.onCampaignEditClick}>
                      <span className="u-show-mobile">
                        Edit
                      </span>
                      <span className="u-show-desktop-tablet">
                        Edit Campaign
                      </span>
                    </EditIndicator>
                  </IndicatorButtonWrapper>
                )}
                {(campaignSupported && !inDraftMode) && (
                  <IndicatorButtonWrapper>
                    <EditIndicator onClick={this.onCampaignShareClick}>
                      <span className="u-show-mobile">
                        Share
                      </span>
                      <span className="u-show-desktop-tablet">
                        Share Campaign
                      </span>
                    </EditIndicator>
                  </IndicatorButtonWrapper>
                )}
              </IndicatorRow>
              */}
              <CampaignActionButtonsWrapper>
                {!inDraftMode && (
                  <Suspense fallback={<span>&nbsp;</span>}>
                    <SupportButtonBeforeCompletionScreen
                      campaignXWeVoteId={campaignXWeVoteId}
                      functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                      functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                      inButtonFullWidthMode
                      // inCompressedMode
                    />
                  </Suspense>
                )}
              </CampaignActionButtonsWrapper>
            </OneCampaignTextColumn>
            <OneCampaignPhotoWrapperMobile className="u-cursor--pointer u-show-mobile" onClick={this.onCampaignClick}>
              {(campaignPhotoLargeUrl || weVoteHostedProfileImageUrlLarge) ? (
                <>
                  {campaignPhotoLargeUrl ? (
                    <CampaignImageMobile src={campaignPhotoLargeUrl} alt="Campaign" />
                  ) : (
                    <CampaignPoliticianImageMobile src={weVoteHostedProfileImageUrlLarge} alt="Campaign" />
                  )}
                </>
              ) : (
                <CampaignImageMobilePlaceholder>
                  <CampaignImagePlaceholderText>
                    No image provided
                  </CampaignImagePlaceholderText>
                </CampaignImageMobilePlaceholder>
              )}
            </OneCampaignPhotoWrapperMobile>
            <OneCampaignPhotoDesktopColumn className="u-cursor--pointer u-show-desktop-tablet" limitCardWidth={limitCardWidth} onClick={this.onCampaignClick}>
              {(campaignPhotoMediumUrl || weVoteHostedProfileImageUrlLarge) ? (
                <>
                  {campaignPhotoMediumUrl ? (
                    <>
                      {limitCardWidth ? (
                        <CampaignImageDesktop src={campaignPhotoMediumUrl} alt="" width="300px" height="157px" />
                      ) : (
                        <CampaignImageDesktop src={campaignPhotoMediumUrl} alt="" width="224px" height="117px" />
                      )}
                    </>
                  ) : (
                    <>
                      {limitCardWidth ? (
                        <CampaignPoliticianImageDesktop src={weVoteHostedProfileImageUrlLarge} alt="" width="157px" height="157px" />
                      ) : (
                        <CampaignPoliticianImageDesktop src={weVoteHostedProfileImageUrlLarge} alt="" width="117px" height="117px" />
                      )}
                    </>
                  )}
                </>
              ) : (
                <CampaignImageDesktopPlaceholder limitCardWidth={limitCardWidth}>
                  <CampaignImagePlaceholderText>
                    No image provided
                  </CampaignImagePlaceholderText>
                </CampaignImageDesktopPlaceholder>
              )}
            </OneCampaignPhotoDesktopColumn>
          </OneCampaignInnerWrapper>
        </OneCampaignOuterWrapper>
      </CandidateCardForListWrapper>
    );
  }
}
CampaignCardForList.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  limitCardWidth: PropTypes.bool,
};

const styles = (theme) => ({
  buttonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const CampaignOwnersWrapper = styled('div')`
`;

// const IndicatorSupportButtonWrapper = styled('div')`
//   margin-bottom: 4px;
//   margin-right: 8px;
//   margin-top: -1px;
// `;

const TitleAndTextWrapper = styled('div')`
  height: 60px;
`;

export default withStyles(styles)(CampaignCardForList);
