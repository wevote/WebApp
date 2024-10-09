import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import CardForListBodyPlaceholder from '../../common/components/CardForListBodyPlaceholder';
import { getTodayAsInteger } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';
import RepresentativeStore from '../../stores/RepresentativeStore';
import keepHelpingDestination from '../../common/utils/keepHelpingDestination';

const CardForListBody = React.lazy(() => import('../../common/components/CardForListBody'));
// const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class RepresentativeCardForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // linkedCampaignXWeVoteId: '',
      representative: {},
    };
    this.getCampaignXBasePath = this.getCampaignXBasePath.bind(this);
    this.getPathToUseToKeepHelping = this.getPathToUseToKeepHelping.bind(this);
    this.getPoliticianBasePath = this.getPoliticianBasePath.bind(this);
    // this.onCampaignEditClick = this.onCampaignEditClick.bind(this);
    // this.onCampaignGetMinimumSupportersClick = this.onCampaignGetMinimumSupportersClick.bind(this);
    // this.onCampaignShareClick = this.onCampaignShareClick.bind(this);
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
    this.setState({
      representative,
    });
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
    return `/id/${campaignXWeVoteId}/`;
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
      politicianBasePath = `/${politicianSEOFriendlyPath}/-/`;
    } else {
      politicianBasePath = `/${politicianWeVoteId}/p/`;
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

  getPathToUseToKeepHelping () {
    const { payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    // console.log(payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed);
    const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted);
    // console.log('getPathToUseToKeepHelping keepHelpingDestinationString:', keepHelpingDestinationString);
    return `${this.getCampaignXBasePath()}${keepHelpingDestinationString}`;
  }

  render () {
    renderLog('RepresentativeCardForList');  // Set LOG_RENDER_EVENTS to log all renders
    const { limitCardWidth, showPoliticianOpenInNewWindow, useVerticalCard } = this.props;
    const { campaignSupported, representative } = this.state;
    if (!representative) {
      return null;
    }
    const {
      // ballot_guide_official_statement: ballotGuideOfficialStatement, // Consider using this
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
      profile_image_background_color: profileImageBackgroundColor,
      representative_photo_url_large: representativePhotoLargeUrl,
      representative_ultimate_election_date: representativeUltimateElectionDate,
      // seo_friendly_path: politicianSEOFriendlyPath,
      state_code: stateCode,
      supporters_count: supportersCount,
      supporters_count_next_goal: supportersCountNextGoalRaw,
      // twitter_description: twitterDescription,
      // visible_on_this_site: visibleOnThisSite,
      we_vote_id: representativeWeVoteId,
    } = representative;
    // console.log('representative:', representative);
    if (!representativeWeVoteId) {
      return null;
    }
    const todayAsInteger = getTodayAsInteger();
    const finalElectionDateInPast = representativeUltimateElectionDate && (representativeUltimateElectionDate <= todayAsInteger);
    const pathToUseToKeepHelping = this.getPathToUseToKeepHelping();
    const fallbackJsx = (
      <span>
        <CardForListBodyPlaceholder
          useVerticalCard
          hideCardMargins
          limitCardWidth
          profileImageBackgroundColor
        />
      </span>
    );
    // /////////////////////// START OF DISPLAY
    return (
      <Suspense fallback={fallbackJsx}>
        <CardForListBody
          ballotItemDisplayName={ballotItemDisplayName}
          campaignSupported={campaignSupported}
          // candidateWeVoteId={candidateWeVoteId}
          districtName={districtName}
          finalElectionDateInPast={finalElectionDateInPast}
          limitCardWidth={limitCardWidth}
          linkedCampaignXWeVoteId={linkedCampaignXWeVoteId}
          officeName={officeHeldName}
          pathToUseToKeepHelping={pathToUseToKeepHelping}
          photoLargeUrl={representativePhotoLargeUrl}
          politicalParty={politicalParty}
          politicianBaseBath={this.getPoliticianBasePath()}
          // politicianDescription={twitterDescription}
          politicianWeVoteId={politicianWeVoteId}
          profileImageBackgroundColor={profileImageBackgroundColor}
          showPoliticianOpenInNewWindow={showPoliticianOpenInNewWindow}
          stateCode={stateCode}
          supportersCount={supportersCount}
          supportersCountNextGoalRaw={supportersCountNextGoalRaw}
          tagIdBaseName="representativeCard"
          ultimateElectionDate={representativeUltimateElectionDate}
          usePoliticianWeVoteIdForBallotItem
          useVerticalCard={useVerticalCard}
        />
      </Suspense>
    );
  }
}
RepresentativeCardForList.propTypes = {
  limitCardWidth: PropTypes.bool,
  representativeWeVoteId: PropTypes.string,
  showPoliticianOpenInNewWindow: PropTypes.bool,
  useVerticalCard: PropTypes.bool,
};

export default RepresentativeCardForList;
