import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import {
  CampaignImageMobile, CampaignImagePlaceholderText, CampaignImageMobilePlaceholder, CampaignImageDesktopPlaceholder, CampaignImageDesktop,
  CandidateCardForListWrapper,
  OneCampaignPhotoWrapperMobile, OneCampaignPhotoDesktopColumn, OneCampaignTitle, OneCampaignOuterWrapper, OneCampaignTextColumn, OneCampaignInnerWrapper, OneCampaignDescription,
  SupportersWrapper, SupportersCount, SupportersActionLink,
} from '../../common/components/Style/CampaignCardStyles';
import { getTodayAsInteger, getYearFromUltimateElectionDate } from '../../common/utils/dateFormat';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import CandidateStore from '../../stores/CandidateStore';
// import initializejQuery from '../../common/utils/initializejQuery';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
// import keepHelpingDestination from '../../common/utils/keepHelpingDestination';
import numberWithCommas from '../../common/utils/numberWithCommas';
// import { ElectionInPast, IndicatorButtonWrapper, IndicatorRow } from '../../common/components/Style/CampaignIndicatorStyles';

const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ '../Widgets/OfficeNameText'));
// const SupportButtonBeforeCompletionScreen = React.lazy(() => import(/* webpackChunkName: 'SupportButtonBeforeCompletionScreen' */ '../../common/components/CampaignSupport/SupportButtonBeforeCompletionScreen'));

class CandidateCardForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidate: {},
    };
    // this.functionToUseToKeepHelping = this.functionToUseToKeepHelping.bind(this);
    // this.functionToUseWhenProfileComplete = this.functionToUseWhenProfileComplete.bind(this);
    this.getCandidateBasePath = this.getCandidateBasePath.bind(this);
    this.goToNextPage = this.goToNextPage.bind(this);
    this.onCandidateClick = this.onCandidateClick.bind(this);
    this.onCandidateClickLink = this.onCandidateClickLink.bind(this);
    this.onCampaignEditClick = this.onCampaignEditClick.bind(this);
    this.onCampaignGetMinimumSupportersClick = this.onCampaignGetMinimumSupportersClick.bind(this);
    this.onCampaignShareClick = this.onCampaignShareClick.bind(this);
    // this.pullCampaignXSupporterVoterEntry = this.pullCampaignXSupporterVoterEntry.bind(this);
  }

  componentDidMount () {
    // console.log('CandidateCardForList componentDidMount');
    this.onCandidateStoreChange();
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    // this.onCampaignSupporterStoreChange();
    // this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
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
        // this.onCampaignSupporterStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    // this.campaignSupporterStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onCandidateStoreChange () {
    const { candidateWeVoteId } = this.props;
    const candidate = CandidateStore.getCandidateByWeVoteId(candidateWeVoteId);
    const {
      seo_friendly_path: campaignSEOFriendlyPath,
    } = candidate;
    let pathToUseWhenProfileComplete;
    if (campaignSEOFriendlyPath) {
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else if (candidateWeVoteId) {
      pathToUseWhenProfileComplete = `/id/${candidateWeVoteId}/why-do-you-support`;
    }
    this.setState({
      candidate,
      pathToUseWhenProfileComplete,
    });
  }

  onCandidateClickLink () {
    const { candidate } = this.state;
    // console.log('candidate:', candidate);
    if (!candidate) {
      return null;
    }
    const {
      seo_friendly_path: politicianSEOFriendlyPath,
      we_vote_id: candidateWeVoteId,
      politician_we_vote_id: politicianWeVoteId,
    } = candidate;
    if (politicianSEOFriendlyPath) {
      return `/${politicianSEOFriendlyPath}/-/`;
    } else if (politicianWeVoteId) {
      return `/${politicianWeVoteId}/p/`;
    } else {
      // return `/candidate/${candidateWeVoteId}`;
      return `/candidate/${candidateWeVoteId}`;
    }
  }

  onCandidateClick () {
    historyPush(this.onCandidateClickLink());
  }

  onCampaignEditClick () {
    const { candidate } = this.state;
    // console.log('candidate:', candidate);
    if (!candidate) {
      return null;
    }
    const {
      in_draft_mode: inDraftMode,
      seo_friendly_path: campaignSEOFriendlyPath,
      we_vote_id: candidateWeVoteId,
    } = candidate;
    if (inDraftMode) {
      historyPush('/start-a-campaign-preview');
    } else if (campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}/edit`);
    } else {
      historyPush(`/id/${candidateWeVoteId}/edit`);
    }
    return null;
  }

  onCampaignGetMinimumSupportersClick () {
    const { candidate } = this.state;
    // console.log('candidate:', candidate);
    if (!candidate) {
      return null;
    }
    const {
      seo_friendly_path: campaignSEOFriendlyPath,
      we_vote_id: candidateWeVoteId,
    } = candidate;
    if (campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}/share-campaign`);
    } else {
      historyPush(`/id/${candidateWeVoteId}/share-campaign`);
    }
    return null;
  }

  onCampaignShareClick () {
    const { candidate } = this.state;
    // console.log('candidate:', candidate);
    if (!candidate) {
      return null;
    }
    const {
      seo_friendly_path: campaignSEOFriendlyPath,
      we_vote_id: candidateWeVoteId,
    } = candidate;
    if (campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}/share-campaign`);
    } else {
      historyPush(`/id/${candidateWeVoteId}/share-campaign`);
    }
    return null;
  }

  getCandidateBasePath () {
    const { candidate } = this.state;
    // console.log('candidate:', candidate);
    if (!candidate) {
      return null;
    }
    const {
      seo_friendly_path: campaignSEOFriendlyPath,
      we_vote_id: candidateWeVoteId,
    } = candidate;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/candidate/${candidateWeVoteId}`;
    }

    return campaignBasePath;
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

  goToNextPage () {
    const { pathToUseWhenProfileComplete } = this.state;
    this.timer = setTimeout(() => {
      historyPush(pathToUseWhenProfileComplete);
    }, 500);
    return null;
  }

  // functionToUseToKeepHelping () {
  //   const { payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
  //   // console.log(payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed);
  //   const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted);
  //   console.log('functionToUseToKeepHelping keepHelpingDestinationString:', keepHelpingDestinationString);
  //   historyPush(`${this.getCandidateBasePath()}/${keepHelpingDestinationString}`);
  // }

  // functionToUseWhenProfileComplete () {
  //   const { candidateWeVoteId } = this.props;
  //   const campaignSupported = true;
  //   const campaignSupportedChanged = true;
  //   // From this page we always send value for 'visibleToPublic'
  //   let visibleToPublic = CampaignSupporterStore.getVisibleToPublic();
  //   const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
  //   if (visibleToPublicChanged) {
  //     // If it has changed, use new value
  //     visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
  //   }
  //   console.log('functionToUseWhenProfileComplete, visibleToPublic:', visibleToPublic, ', visibleToPublicChanged:', visibleToPublicChanged);
  //   const saveVisibleToPublic = true;
  //   initializejQuery(() => {
  //     CampaignSupporterActions.supportCampaignSave(candidateWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic);
  //   }, this.goToNextPage());
  // }

  render () {
    renderLog('CandidateCardForList');  // Set LOG_RENDER_EVENTS to log all renders
    const { limitCardWidth } = this.props;
    const { campaignSupported, candidate } = this.state;
    if (!candidate) {
      return null;
    }
    const {
      ballot_item_display_name: ballotItemDisplayName,
      candidate_photo_url_large: candidatePhotoLargeUrl,
      candidate_ultimate_election_date: candidateUltimateElectionDate,
      contest_office_name: contestOfficeName,
      // in_draft_mode: inDraftMode,
      // is_blocked_by_we_vote: isBlockedByWeVote,
      // is_in_team_review_mode: isInTeamReviewMode,
      // is_supporters_count_minimum_exceeded: isSupportersCountMinimumExceeded,
      party: politicalParty,
      // seo_friendly_path: campaignSEOFriendlyPath,
      state_code: stateCode,
      supporters_count: supportersCount,
      supporters_count_next_goal: supportersCountNextGoal,
      twitter_description: twitterDescription,
      // visible_on_this_site: visibleOnThisSite,
      we_vote_id: candidateWeVoteId,
    } = candidate;
    // console.log('candidate:', candidate);
    if (!candidateWeVoteId) {
      return null;
    }
    const stateName = convertStateCodeToStateText(stateCode);
    const year = getYearFromUltimateElectionDate(candidateUltimateElectionDate);
    const todayAsInteger = getTodayAsInteger();
    const finalElectionDateInPast = candidateUltimateElectionDate && (candidateUltimateElectionDate <= todayAsInteger);
    return (
      <CandidateCardForListWrapper limitCardWidth={limitCardWidth}>
        <OneCampaignOuterWrapper limitCardWidth={limitCardWidth}>
          <OneCampaignInnerWrapper limitCardWidth={limitCardWidth || isMobileScreenSize()}>
            <OneCampaignTextColumn>
              <div>
                <OneCampaignTitle>
                  <Link to={this.onCandidateClickLink()}>
                    {ballotItemDisplayName}
                  </Link>
                </OneCampaignTitle>
                {(contestOfficeName || politicalParty) && (
                  <div className="u-cursor--pointer" onClick={this.onCandidateClick}>
                    <Suspense fallback={<></>}>
                      <OfficeNameText
                        officeName={contestOfficeName}
                        politicalParty={politicalParty}
                        showOfficeName
                        stateName={stateName}
                        year={`${year}`}
                      />
                    </Suspense>
                  </div>
                )}
                {finalElectionDateInPast ? (
                  <SupportersWrapper>
                    {supportersCount > 0 && (
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
                      <SupportersActionLink className="u-link-color u-link-underline">
                        Let&apos;s get to
                        {' '}
                        {numberWithCommas(supportersCountNextGoal)}
                        !
                      </SupportersActionLink>
                    )}
                  </SupportersWrapper>
                )}
                {twitterDescription && (
                  <OneCampaignDescription className="u-cursor--pointer" onClick={this.onCandidateClick}>
                    <TruncateMarkup
                      ellipsis={(
                        <span>
                          <span className="u-text-fade-at-end">&nbsp;</span>
                          <span className="u-link-color u-link-underline">Read more</span>
                        </span>
                      )}
                      lines={4}
                      tokenize="words"
                    >
                      <div>
                        {twitterDescription}
                      </div>
                    </TruncateMarkup>
                  </OneCampaignDescription>
                )}
                {/*
                <CampaignOwnersWrapper>
                  <CampaignOwnersList campaignXWeVoteId={campaignXWeVoteId} compressedMode />
                </CampaignOwnersWrapper>
                */}
              </div>
              {/*
              <IndicatorRow>
                {finalElectionDateInPast && (
                  <IndicatorButtonWrapper>
                    <ElectionInPast>
                      Election in Past
                    </ElectionInPast>
                  </IndicatorButtonWrapper>
                )}
              </IndicatorRow>
              */}
              {!finalElectionDateInPast && (
                <ItemActionBarOutsideWrapper>
                  <Suspense fallback={<></>}>
                    <ItemActionBar
                      ballotItemWeVoteId={candidateWeVoteId}
                      ballotItemDisplayName={ballotItemDisplayName}
                      commentButtonHide
                      // externalUniqueId={`CandidateCardForList-ItemActionBar-${oneCandidate.we_vote_id}-${externalUniqueId}`}
                      hidePositionPublicToggle
                      positionPublicToggleWrapAllowed
                      shareButtonHide
                    />
                  </Suspense>
                </ItemActionBarOutsideWrapper>
              )}
            </OneCampaignTextColumn>
            <OneCampaignPhotoWrapperMobile className="u-cursor--pointer u-show-mobile" onClick={this.onCandidateClick}>
              {candidatePhotoLargeUrl ? (
                <CampaignImageMobilePlaceholder>
                  <CampaignImageMobile src={candidatePhotoLargeUrl} alt="" />
                </CampaignImageMobilePlaceholder>
              ) : (
                <CampaignImageMobilePlaceholder>
                  <CampaignImagePlaceholderText>
                    No image provided
                  </CampaignImagePlaceholderText>
                </CampaignImageMobilePlaceholder>
              )}
            </OneCampaignPhotoWrapperMobile>
            <OneCampaignPhotoDesktopColumn className="u-cursor--pointer u-show-desktop-tablet" limitCardWidth={limitCardWidth} onClick={this.onCandidateClick}>
              {candidatePhotoLargeUrl ? (
                <>
                  {limitCardWidth ? (
                    <CampaignImageDesktopPlaceholder limitCardWidth={limitCardWidth}>
                      <CampaignImageDesktop src={candidatePhotoLargeUrl} alt="" width="157px" height="157px" />
                    </CampaignImageDesktopPlaceholder>
                  ) : (
                    <CampaignImageDesktop src={candidatePhotoLargeUrl} alt="" width="117px" height="117px" />
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

const ItemActionBarOutsideWrapper = styled('div')`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 12px;
  width: 100%;
`;

export default withStyles(styles)(CandidateCardForList);
