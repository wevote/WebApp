import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';
import {
  BottomActionButtonEmptyWrapper,
  BottomActionButtonWrapper,
  CampaignActionButtonsWrapper,
  CampaignImageMobile,
  CampaignImagePlaceholderText,
  CampaignImageMobilePlaceholder,
  CampaignImageDesktopPlaceholder,
  CampaignImageDesktop,
  CandidateCardForListWrapper,
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
} from '../../common/components/Style/CampaignCardStyles';
import { getTodayAsInteger } from '../../common/utils/dateFormat';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import saveCampaignSupportAndGoToNextPage from '../../common/utils/saveCampaignSupportAndGoToNextPage';
import CampaignStore from '../../common/stores/CampaignStore';
import RepresentativeStore from '../../stores/RepresentativeStore';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import keepHelpingDestination from '../../common/utils/keepHelpingDestination';
import numberWithCommas from '../../common/utils/numberWithCommas';
// import webAppConfig from '../../config';
// import { ElectionInPast, IndicatorButtonWrapper, IndicatorRow } from '../../common/components/Style/CampaignIndicatorStyles';

const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));
const OfficeHeldNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeHeldNameText' */ '../../common/components/Widgets/OfficeHeldNameText'));
const SupportButtonBeforeCompletionScreen = React.lazy(() => import(/* webpackChunkName: 'SupportButtonBeforeCompletionScreen' */ '../../common/components/CampaignSupport/SupportButtonBeforeCompletionScreen'));

// const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class RepresentativeCardForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      linkedCampaignXWeVoteId: '',
      representative: {},
    };
    this.functionToUseToKeepHelping = this.functionToUseToKeepHelping.bind(this);
    this.functionToUseWhenProfileComplete = this.functionToUseWhenProfileComplete.bind(this);
    this.getCampaignXBasePath = this.getCampaignXBasePath.bind(this);
    this.getPoliticianBasePath = this.getPoliticianBasePath.bind(this);
    this.onRepresentativeClick = this.onRepresentativeClick.bind(this);
    this.onCampaignEditClick = this.onCampaignEditClick.bind(this);
    this.onCampaignGetMinimumSupportersClick = this.onCampaignGetMinimumSupportersClick.bind(this);
    this.onCampaignShareClick = this.onCampaignShareClick.bind(this);
    // this.pullCampaignXSupporterVoterEntry = this.pullCampaignXSupporterVoterEntry.bind(this);
  }

  componentDidMount () {
    // console.log('RepresentativeCardForList componentDidMount');
    this.onRepresentativeStoreChange();
    this.representativeStoreListener = RepresentativeStore.addListener(this.onRepresentativeStoreChange.bind(this));
    // this.onCampaignSupporterStoreChange();
    // this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    const {
      representativeWeVoteId: representativeWeVoteIdPrevious,
    } = prevProps;
    const {
      representativeWeVoteId,
    } = this.props;
    if (representativeWeVoteId) {
      if (representativeWeVoteId !== representativeWeVoteIdPrevious) {
        this.onRepresentativeStoreChange();
        // this.onCampaignSupporterStoreChange();
      }
    }
  }

  componentWillUnmount () {
    // this.campaignSupporterStoreListener.remove();
    this.representativeStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onRepresentativeStoreChange () {
    const { representativeWeVoteId } = this.props;
    const representative = RepresentativeStore.getRepresentativeByWeVoteId(representativeWeVoteId);
    const {
      linked_campaignx_we_vote_id: linkedCampaignXWeVoteId,
    } = representative;
    this.setState({
      linkedCampaignXWeVoteId,
      representative,
    });
  }

  onRepresentativeClick () {
    historyPush(this.getPoliticianBasePath());
  }

  onCampaignEditClick () {
    const { representative } = this.state;
    // console.log('representative:', representative);
    if (!representative) {
      return null;
    }
    const {
      in_draft_mode: inDraftMode,
    } = representative;
    if (inDraftMode) {
      historyPush('/start-a-campaign-preview');
    } else {
      historyPush(`${this.getCampaignXBasePath()}/edit`);
    }
    return null;
  }

  onCampaignGetMinimumSupportersClick () {
    const { representative } = this.state;
    // console.log('representative:', representative);
    if (!representative) {
      return null;
    }
    historyPush(`${this.getCampaignXBasePath()}/share-campaign`);
    return null;
  }

  onCampaignShareClick () {
    const { representative } = this.state;
    // console.log('representative:', representative);
    if (!representative) {
      return null;
    }
    historyPush(`${this.getCampaignXBasePath()}/share-campaign`);
    return null;
  }

  getCampaignXBasePath () {
    const { representative } = this.state;
    // console.log('representative:', representative);
    if (!representative) {
      return null;
    }
    const {
      // seo_friendly_path: politicianSEOFriendlyPath,  // Problem -- this is the politician seo friendly path, not the campaignx seo friendly path
      linked_campaignx_we_vote_id: campaignXWeVoteId,
    } = representative;
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
    const { representative } = this.state;
    // console.log('representative:', representative);
    if (!representative) {
      return null;
    }
    const {
      seo_friendly_path: politicianSEOFriendlyPath,
      politician_we_vote_id: politicianWeVoteId,
    } = representative;
    let politicianBasePath;
    if (politicianSEOFriendlyPath) {
      politicianBasePath = `/${politicianSEOFriendlyPath}/-`;
    } else {
      politicianBasePath = `/${politicianWeVoteId}/p`;
    }
    return politicianBasePath;
  }

  // pullCampaignXSupporterVoterEntry (representativeWeVoteId) {
  //   // console.log('pullCampaignXSupporterVoterEntry representativeWeVoteId:', representativeWeVoteId);
  //   if (representativeWeVoteId) {
  //     const campaignXSupporterVoterEntry = CampaignSupporterStore.getCampaignXSupporterVoterEntry(representativeWeVoteId);
  //     // console.log('onCampaignSupporterStoreChange campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
  //     const {
  //       campaign_supported: campaignSupported,
  //       campaignx_we_vote_id: representativeWeVoteIdFromCampaignXSupporter,
  //     } = campaignXSupporterVoterEntry;
  //     // console.log('onCampaignSupporterStoreChange campaignSupported: ', campaignSupported);
  //     if (representativeWeVoteIdFromCampaignXSupporter) {
  //       const step2Completed = CampaignSupporterStore.voterSupporterEndorsementExists(representativeWeVoteId);
  //       const payToPromoteStepCompleted = CampaignSupporterStore.voterChipInExists(representativeWeVoteId);
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
      console.log('RepresentativeCardForList functionToUseWhenProfileComplete linkedCampaignXWeVoteId not found');
    }
  }

  render () {
    renderLog('RepresentativeCardForList');  // Set LOG_RENDER_EVENTS to log all renders
    const { limitCardWidth } = this.props;
    const { campaignSupported, representative } = this.state;
    if (!representative) {
      return null;
    }
    const {
      ballot_item_display_name: ballotItemDisplayName,
      linked_campaignx_we_vote_id: linkedCampaignXWeVoteId,
      office_held_name: officeHeldName,
      office_held_district_name: districtName,
      // in_draft_mode: inDraftMode,
      // is_blocked_by_we_vote: isBlockedByWeVote,
      // is_in_team_review_mode: isInTeamReviewMode,
      // is_supporters_count_minimum_exceeded: isSupportersCountMinimumExceeded,
      political_party: politicalParty,
      politician_we_vote_id: politicianWeVoteId,
      representative_photo_url_large: representativePhotoLargeUrl,
      representative_ultimate_election_date: representativeUltimateElectionDate,
      // seo_friendly_path: politicianSEOFriendlyPath,
      state_code: stateCode,
      supporters_count: supportersCount,
      supporters_count_next_goal: supportersCountNextGoal,
      twitter_description: twitterDescription,
      // visible_on_this_site: visibleOnThisSite,
      we_vote_id: representativeWeVoteId,
    } = representative;
    // console.log('representative:', representative);
    if (!representativeWeVoteId) {
      return null;
    }
    const stateName = convertStateCodeToStateText(stateCode);
    const supportersCountNextGoalWithFloor = supportersCountNextGoal || CampaignStore.getCampaignXSupportersCountNextGoalDefault();
    // const year = getYearFromUltimateElectionDate(representativeUltimateElectionDate);
    const todayAsInteger = getTodayAsInteger();
    const finalElectionDateInPast = representativeUltimateElectionDate && (representativeUltimateElectionDate <= todayAsInteger);
    return (
      <CandidateCardForListWrapper limitCardWidth={limitCardWidth}>
        <OneCampaignOuterWrapper limitCardWidth={limitCardWidth}>
          <OneCampaignInnerWrapper limitCardWidth={limitCardWidth || isMobileScreenSize()}>
            <OneCampaignTextColumn>
              <TitleAndTextWrapper>
                <OneCampaignTitle>
                  <Link
                    className="u-link-color u-link-underline"
                    id="representativeCardDisplayName"
                    to={this.getPoliticianBasePath()}
                  >
                    {ballotItemDisplayName}
                  </Link>
                </OneCampaignTitle>
                {(officeHeldName || politicalParty) && (
                  <div
                    className="u-cursor--pointer"
                    id="representativeCardOfficeName"
                    onClick={this.onRepresentativeClick}
                  >
                    <Suspense fallback={<></>}>
                      <OfficeHeldNameText
                        inCard
                        districtName={districtName}
                        officeName={officeHeldName}
                        politicalParty={politicalParty}
                        stateName={stateName}
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
                          id="representativeCardLetsGetTo"
                          onClick={this.onRepresentativeClick}
                        >
                          Let&apos;s get to
                          {' '}
                          {numberWithCommas(supportersCountNextGoalWithFloor)}
                          {' '}
                          supporters!
                        </SupportersActionLink>
                      )}
                    </SupportersWrapper>
                  )}
                </>
                {twitterDescription && (
                  <OneCampaignDescription
                    className="u-cursor--pointer"
                    id="representativeCardTwitterDescription"
                    onClick={this.onRepresentativeClick}
                  >
                    <TruncateMarkup
                      ellipsis="..."
                      lines={2}
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
              </TitleAndTextWrapper>
              <CampaignActionButtonsWrapper>
                <Suspense fallback={<></>}>
                  <ItemActionBar
                    ballotItemWeVoteId={politicianWeVoteId}
                    ballotItemDisplayName={ballotItemDisplayName}
                    commentButtonHide
                    externalUniqueId={`FromRepresentativeCardForList-${politicianWeVoteId}`} // -${externalUniqueId}
                    hidePositionPublicToggle
                    inCard
                    positionPublicToggleWrapAllowed
                    shareButtonHide
                    // useSupportWording
                  />
                </Suspense>
                <>
                  {linkedCampaignXWeVoteId ? (
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
                  ) : (
                    <BottomActionButtonEmptyWrapper>
                      {/* MISSING_LINKED_CAMPAIGN_WE_VOTE_ID */}
                    </BottomActionButtonEmptyWrapper>
                  )}
                </>
              </CampaignActionButtonsWrapper>
            </OneCampaignTextColumn>
            <OneCampaignPhotoWrapperMobile className="u-cursor--pointer u-show-mobile" onClick={this.onRepresentativeClick}>
              {representativePhotoLargeUrl ? (
                <CampaignImageMobilePlaceholder>
                  <CampaignImageMobile src={representativePhotoLargeUrl} alt="" />
                </CampaignImageMobilePlaceholder>
              ) : (
                <CampaignImageMobilePlaceholder>
                  <CampaignImagePlaceholderText>
                    No image provided
                  </CampaignImagePlaceholderText>
                </CampaignImageMobilePlaceholder>
              )}
            </OneCampaignPhotoWrapperMobile>
            <OneCampaignPhotoDesktopColumn className="u-cursor--pointer u-show-desktop-tablet" limitCardWidth={limitCardWidth} onClick={this.onRepresentativeClick}>
              {representativePhotoLargeUrl ? (
                <>
                  {limitCardWidth ? (
                    <CampaignImageDesktopPlaceholder limitCardWidth={limitCardWidth}>
                      <CampaignImageDesktop src={representativePhotoLargeUrl} alt="" width="157px" height="157px" />
                    </CampaignImageDesktopPlaceholder>
                  ) : (
                    <CampaignImageDesktop src={representativePhotoLargeUrl} alt="" width="117px" height="117px" />
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
RepresentativeCardForList.propTypes = {
  limitCardWidth: PropTypes.bool,
  representativeWeVoteId: PropTypes.string,
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

export default withStyles(styles)(RepresentativeCardForList);
