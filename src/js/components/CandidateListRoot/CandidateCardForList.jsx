import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import {
  BottomActionButtonWrapper,
  CampaignActionButtonsWrapper, CampaignImageMobile, CampaignImagePlaceholderText, CampaignImageMobilePlaceholder, CampaignImageDesktopPlaceholder, CampaignImageDesktop,
  CandidateCardForListWrapper,
  OneCampaignPhotoWrapperMobile, OneCampaignPhotoDesktopColumn, OneCampaignTitle, OneCampaignOuterWrapper, OneCampaignTextColumn, OneCampaignInnerWrapper, OneCampaignDescription,
  SupportersWrapper, SupportersCount, SupportersActionLink,
} from '../../common/components/Style/CampaignCardStyles';
import { getTodayAsInteger, getYearFromUltimateElectionDate } from '../../common/utils/dateFormat';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import CampaignStore from '../../common/stores/CampaignStore';
import CampaignSupporterStore from '../../common/stores/CampaignSupporterStore';
import CandidateStore from '../../stores/CandidateStore';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import keepHelpingDestination from '../../common/utils/keepHelpingDestination';
import numberWithCommas from '../../common/utils/numberWithCommas';
import saveCampaignSupportAndGoToNextPage from '../../common/utils/saveCampaignSupportAndGoToNextPage';

const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ '../../common/components/Widgets/OfficeNameText'));
const SupportButtonBeforeCompletionScreen = React.lazy(() => import(/* webpackChunkName: 'SupportButtonBeforeCompletionScreen' */ '../../common/components/CampaignSupport/SupportButtonBeforeCompletionScreen'));

// const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class CandidateCardForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidate: {},
      linkedCampaignXWeVoteId: '',
    };
    this.functionToUseToKeepHelping = this.functionToUseToKeepHelping.bind(this);
    this.functionToUseWhenProfileComplete = this.functionToUseWhenProfileComplete.bind(this);
    this.getCampaignXBasePath = this.getCampaignXBasePath.bind(this);
    this.getPoliticianBasePath = this.getPoliticianBasePath.bind(this);
    this.onCandidateClick = this.onCandidateClick.bind(this);
    this.onCampaignEditClick = this.onCampaignEditClick.bind(this);
    this.onCampaignGetMinimumSupportersClick = this.onCampaignGetMinimumSupportersClick.bind(this);
    this.onCampaignShareClick = this.onCampaignShareClick.bind(this);
    // this.pullCampaignXSupporterVoterEntry = this.pullCampaignXSupporterVoterEntry.bind(this);
  }

  componentDidMount () {
    // console.log('CandidateCardForList componentDidMount');
    this.onCandidateStoreChange();
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.onCampaignSupporterStoreChange();
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    const {
      candidateWeVoteId: candidateWeVoteIdPrevious,
    } = prevProps;
    const {
      candidateWeVoteId,
    } = this.props;
    if (candidateWeVoteId) {
      if (candidateWeVoteId !== candidateWeVoteIdPrevious) {
        this.onCandidateStoreChange();
        this.onCampaignSupporterStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignSupporterStoreListener.remove();
    this.candidateStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onCampaignSupporterStoreChange () {
    const { politicianWeVoteId } = this.state;
    const step2Completed = CampaignSupporterStore.voterSupporterEndorsementExists(politicianWeVoteId);
    const payToPromoteStepCompleted = CampaignSupporterStore.voterChipInExists(politicianWeVoteId);
    const sharingStepCompleted = false;
    // console.log('onCampaignSupporterStoreChange step2Completed: ', step2Completed, ', sharingStepCompleted: ', sharingStepCompleted, ', payToPromoteStepCompleted:', payToPromoteStepCompleted);
    this.setState({
      sharingStepCompleted,
      step2Completed,
      payToPromoteStepCompleted,
    });
  }

  onCandidateStoreChange () {
    const { candidateWeVoteId } = this.props;
    const candidate = CandidateStore.getCandidateByWeVoteId(candidateWeVoteId);
    const {
      linked_campaignx_we_vote_id: linkedCampaignXWeVoteId,
    } = candidate;
    this.setState({
      candidate,
      linkedCampaignXWeVoteId,
    });
  }

  onCandidateClick () {
    historyPush(this.getPoliticianBasePath());
  }

  onCampaignEditClick () {
    const { candidate } = this.state;
    // console.log('candidate:', candidate);
    if (!candidate) {
      return null;
    }
    const {
      in_draft_mode: inDraftMode,
    } = candidate;
    if (inDraftMode) {
      historyPush('/start-a-campaign-preview');
    } else {
      historyPush(`${this.getCampaignXBasePath()}/edit`);
    }
    return null;
  }

  onCampaignGetMinimumSupportersClick () {
    const { candidate } = this.state;
    // console.log('candidate:', candidate);
    if (!candidate) {
      return null;
    }
    historyPush(`${this.getCampaignXBasePath()}/share-campaign`);
    return null;
  }

  onCampaignShareClick () {
    const { candidate } = this.state;
    // console.log('candidate:', candidate);
    if (!candidate) {
      return null;
    }
    historyPush(`${this.getCampaignXBasePath()}/share-campaign`);
    return null;
  }

  getCampaignXBasePath () {
    const { candidate } = this.state;
    // console.log('candidate:', candidate);
    if (!candidate) {
      return null;
    }
    const {
      // seo_friendly_path: politicianSEOFriendlyPath,  // Problem -- this is the politician seo friendly path, not the campaignx seo friendly path
      linked_campaignx_we_vote_id: campaignXWeVoteId,
    } = candidate;
    // let campaignXBasePath;
    // if (politicianSEOFriendlyPath) {
    //   campaignXBasePath = `/c/${politicianSEOFriendlyPath}`;
    // } else {
    //   campaignXBasePath = `/id/${campaignXWeVoteId}`;
    // }
    // return campaignXBasePath;
    return `/id/${campaignXWeVoteId}`;
  }

  getPoliticianBasePath () {
    const { candidate } = this.state;
    // console.log('candidate:', candidate);
    if (!candidate) {
      return null;
    }
    const {
      seo_friendly_path: politicianSEOFriendlyPath,
      politician_we_vote_id: politicianWeVoteId,
    } = candidate;
    let politicianBasePath;
    if (politicianSEOFriendlyPath) {
      politicianBasePath = `/${politicianSEOFriendlyPath}/-`;
    } else if (politicianWeVoteId) {
      politicianBasePath = `/${politicianWeVoteId}/p`;
    } else {
      politicianBasePath = '';      // Still loading, or other problems
    }
    return politicianBasePath;
  }

  // pullCampaignXSupporterVoterEntry (candidateWeVoteId) {
  //   // console.log('pullCampaignXSupporterVoterEntry candidateWeVoteId:', candidateWeVoteId);
  //   if (candidateWeVoteId) {
  //     const campaignXSupporterVoterEntry = CampaignSupporterStore.getCampaignXSupporterVoterEntry(candidateWeVoteId);
  //     // console.log('onCampaignSupporterStoreChange campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
  //     const {
  //       campaign_supported: campaignSupported,
  //       campaignx_we_vote_id: candidateWeVoteIdFromCampaignXSupporter,
  //     } = campaignXSupporterVoterEntry;
  //     // console.log('onCampaignSupporterStoreChange campaignSupported: ', campaignSupported);
  //     if (candidateWeVoteIdFromCampaignXSupporter) {
  //       const step2Completed = CampaignSupporterStore.voterSupporterEndorsementExists(candidateWeVoteId);
  //       const payToPromoteStepCompleted = CampaignSupporterStore.voterChipInExists(candidateWeVoteId);
  //       const sharingStepCompleted = false;
  //       this.setState({
  //         campaignSupported,
  //         sharingStepCompleted,
  //         step2Completed,
  //         payToPromoteStepCompleted,
  //       });
  //     } else {
  //       this.setState({
  //         campaignSupported: false,
  //       });
  //     }
  //   } else {
  //     this.setState({
  //       campaignSupported: false,
  //     });
  //   }
  // }

  functionToUseToKeepHelping () {
    const { payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    // console.log(payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed);
    const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted);
    // console.log('functionToUseToKeepHelping keepHelpingDestinationString:', keepHelpingDestinationString);
    historyPush(`${this.getCampaignXBasePath()}/${keepHelpingDestinationString}`);
  }

  functionToUseWhenProfileComplete () {
    const { linkedCampaignXWeVoteId } = this.state;
    if (linkedCampaignXWeVoteId) {
      const campaignXBaseBath = this.getCampaignXBasePath();
      saveCampaignSupportAndGoToNextPage(linkedCampaignXWeVoteId, campaignXBaseBath);
    } else {
      console.log('CandidateCardForList functionToUseWhenProfileComplete linkedCampaignXWeVoteId not found');
    }
  }

  render () {
    renderLog('CandidateCardForList');  // Set LOG_RENDER_EVENTS to log all renders
    const { limitCardWidth } = this.props;
    const { campaignSupported, candidate, linkedCampaignXWeVoteId } = this.state;
    if (!candidate) {
      return null;
    }
    const {
      ballot_guide_official_statement: ballotGuideOfficialStatement,
      ballot_item_display_name: ballotItemDisplayName,
      candidate_photo_url_large: candidatePhotoLargeUrl,
      candidate_ultimate_election_date: candidateUltimateElectionDate,
      contest_office_name: contestOfficeName,
      contest_office_list: contestOfficeList,
      // in_draft_mode: inDraftMode,
      // is_blocked_by_we_vote: isBlockedByWeVote,
      // is_in_team_review_mode: isInTeamReviewMode,
      // is_supporters_count_minimum_exceeded: isSupportersCountMinimumExceeded,
      party: politicalParty,
      politician_we_vote_id: politicianWeVoteId,
      profile_image_background_color: profileImageBackgroundColor,
      state_code: stateCode,
      supporters_count: supportersCount,
      supporters_count_next_goal: supportersCountNextGoalRaw,
      twitter_description: twitterDescription,
      // visible_on_this_site: visibleOnThisSite,
      we_vote_id: candidateWeVoteId,
    } = candidate;
    // console.log('candidate:', candidate);
    if (!candidateWeVoteId) {
      return null;
    }
    let candidateDescription;
    if (ballotGuideOfficialStatement) {
      candidateDescription = ballotGuideOfficialStatement;
    } else if (twitterDescription) {
      candidateDescription = twitterDescription;
    }
    let districtName;
    if (contestOfficeList) {
      if (contestOfficeList.length > 0) {
        districtName = contestOfficeList[0].district_name;
      }
    }
    const stateName = convertStateCodeToStateText(stateCode);
    const supportersCountNextGoal = supportersCountNextGoalRaw || 0;
    let supportersCountNextGoalWithFloor = supportersCountNextGoal || CampaignStore.getCampaignXSupportersCountNextGoalDefault();
    // console.log('supportersCount:', supportersCount, 'supportersCountNextGoal:', supportersCountNextGoal, 'supportersCountNextGoalWithFloor:', supportersCountNextGoalWithFloor);
    if (supportersCount && supportersCountNextGoalWithFloor < supportersCount) {
      const nextGoal = supportersCount + 50;
      supportersCountNextGoalWithFloor = Math.floor(nextGoal / 50) * 50;
    }
    const year = getYearFromUltimateElectionDate(candidateUltimateElectionDate);
    const todayAsInteger = getTodayAsInteger();
    const finalElectionDateInPast = candidateUltimateElectionDate && (candidateUltimateElectionDate <= todayAsInteger);
    return (
      <CandidateCardForListWrapper limitCardWidth={limitCardWidth}>
        <OneCampaignOuterWrapper limitCardWidth={limitCardWidth}>
          <OneCampaignInnerWrapper limitCardWidth={limitCardWidth || isMobileScreenSize()}>
            <OneCampaignTextColumn>
              <TitleAndTextWrapper>
                <OneCampaignTitle>
                  <Link
                    className="u-link-color u-link-underline"
                    id="candidateCardDisplayName"
                    to={this.getPoliticianBasePath()}
                  >
                    {ballotItemDisplayName}
                  </Link>
                </OneCampaignTitle>
                {(contestOfficeName || politicalParty) && (
                  <div
                    className="u-cursor--pointer"
                    id="candidateCardOfficeName"
                    onClick={this.onCandidateClick}
                  >
                    <Suspense fallback={<></>}>
                      <OfficeNameText
                        districtName={districtName}
                        inCard
                        officeName={contestOfficeName}
                        politicalParty={politicalParty}
                        showOfficeName
                        stateName={stateName}
                        year={`${year}`}
                      />
                    </Suspense>
                  </div>
                )}
                <>
                  {finalElectionDateInPast ? (
                    <SupportersWrapper>
                      {(!supportersCount || supportersCount === 0) ? (
                        <SupportersCount>
                          0 supporters.
                          {' '}
                        </SupportersCount>
                      ) : (
                        <SupportersCount>
                          {numberWithCommas(supportersCount)}
                          {' '}
                          {supportersCount === 1 ? 'supporter.' : 'supporters.'}
                          {' '}
                        </SupportersCount>
                      )}
                      {campaignSupported && (
                        <SupportersActionLink>
                          Thank you for supporting!
                        </SupportersActionLink>
                      )}
                    </SupportersWrapper>
                  ) : (
                    <SupportersWrapper>
                      {(!supportersCount || supportersCount === 0) ? (
                        <SupportersCount>
                          Be the first.
                          {' '}
                        </SupportersCount>
                      ) : (
                        <SupportersCount>
                          {numberWithCommas(supportersCount)}
                          {' '}
                          {supportersCount === 1 ? 'supporter.' : 'supporters.'}
                        </SupportersCount>
                      )}
                      {' '}
                      {campaignSupported ? (
                        <SupportersActionLink>
                          Thank you for supporting!
                        </SupportersActionLink>
                      ) : (
                        <SupportersActionLink
                          className="u-link-color u-link-underline u-cursor--pointer"
                          id="candidateCardLetsGetTo"
                          onClick={this.onCandidateClick}
                        >
                          Let&apos;s get to
                          {' '}
                          {numberWithCommas(supportersCountNextGoalWithFloor)}
                          !
                        </SupportersActionLink>
                      )}
                    </SupportersWrapper>
                  )}
                </>
                {candidateDescription && (
                  <OneCampaignDescription
                    className="u-cursor--pointer"
                    id="candidateCardDescription"
                    onClick={this.onCandidateClick}
                  >
                    <TruncateMarkup
                      ellipsis="..."
                      lines={2}
                      tokenize="words"
                    >
                      <div>
                        {candidateDescription}
                      </div>
                    </TruncateMarkup>
                  </OneCampaignDescription>
                )}
                {/*
                <CampaignOwnersWrapper>
                  <CampaignOwnersList campaignXWeVoteId={campaignXWeVoteId} compressedMode />
                </CampaignOwnersWrapper>
                */}
              </TitleAndTextWrapper>
              <CampaignActionButtonsWrapper>
                <Suspense fallback={<></>}>
                  {finalElectionDateInPast ? (
                    <ItemActionBar
                      ballotItemWeVoteId={politicianWeVoteId}
                      ballotItemDisplayName={ballotItemDisplayName}
                      commentButtonHide
                      // externalUniqueId={`CandidateCardForList-ItemActionBar-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                      hidePositionPublicToggle
                      inCard
                      positionPublicToggleWrapAllowed
                      shareButtonHide
                      useSupportWording
                    />
                  ) : (
                    <ItemActionBar
                      ballotItemWeVoteId={candidateWeVoteId}
                      ballotItemDisplayName={ballotItemDisplayName}
                      commentButtonHide
                      // externalUniqueId={`CandidateCardForList-ItemActionBar-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                      hidePositionPublicToggle
                      inCard
                      positionPublicToggleWrapAllowed
                      shareButtonHide
                      useSupportWording
                    />
                  )}
                </Suspense>
                <BottomActionButtonWrapper>
                  <Suspense fallback={<span>&nbsp;</span>}>
                    <SupportButtonBeforeCompletionScreen
                      campaignXWeVoteId={linkedCampaignXWeVoteId}
                      functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                      functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                      inButtonFullWidthMode
                      // inCompressedMode
                    />
                  </Suspense>
                </BottomActionButtonWrapper>
              </CampaignActionButtonsWrapper>
            </OneCampaignTextColumn>
            <OneCampaignPhotoWrapperMobile id="candidatePhotoMobile" className="u-cursor--pointer u-show-mobile" onClick={this.onCandidateClick}>
              {candidatePhotoLargeUrl ? (
                <CampaignImageMobilePlaceholder id="cimp4" profileImageBackgroundColor={profileImageBackgroundColor}>
                  <CampaignImageMobile src={candidatePhotoLargeUrl} alt="" />
                </CampaignImageMobilePlaceholder>
              ) : (
                <CampaignImageMobilePlaceholder id="cimp2">
                  <CampaignImagePlaceholderText>
                    No image provided
                  </CampaignImagePlaceholderText>
                </CampaignImageMobilePlaceholder>
              )}
            </OneCampaignPhotoWrapperMobile>
            <OneCampaignPhotoDesktopColumn id="candidatePhotoDesktop" className="u-cursor--pointer u-show-desktop-tablet" limitCardWidth={limitCardWidth} onClick={this.onCandidateClick}>
              {candidatePhotoLargeUrl ? (
                <>
                  {limitCardWidth ? (
                    <CampaignImageDesktopPlaceholder
                      id="cidp4"
                      limitCardWidth={limitCardWidth}
                      profileImageBackgroundColor={profileImageBackgroundColor}
                    >
                      <CampaignImageDesktop src={candidatePhotoLargeUrl} alt="" width="157px" height="157px" />
                    </CampaignImageDesktopPlaceholder>
                  ) : (
                    <CampaignImageDesktop src={candidatePhotoLargeUrl} alt="" width="117px" height="117px" />
                  )}
                </>
              ) : (
                <CampaignImageDesktopPlaceholder
                  id="cidp5"
                  limitCardWidth={limitCardWidth}
                  profileImageBackgroundColor={profileImageBackgroundColor}
                >
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
CandidateCardForList.propTypes = {
  candidateWeVoteId: PropTypes.string,
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

const TitleAndTextWrapper = styled('div')`
  height: 60px;
`;

export default withStyles(styles)(CandidateCardForList);
