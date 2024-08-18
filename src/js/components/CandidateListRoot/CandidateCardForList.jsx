import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CardForListBody from '../../common/components/CardForListBody';
import { getTodayAsInteger } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';
import CampaignSupporterStore from '../../common/stores/CampaignSupporterStore';
import CandidateStore from '../../stores/CandidateStore';
import keepHelpingDestination from '../../common/utils/keepHelpingDestination';

// const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class CandidateCardForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidate: {},
      linkedCampaignXWeVoteId: '',
    };
    this.getCampaignXBasePath = this.getCampaignXBasePath.bind(this);
    this.getPathToUseToKeepHelping = this.getPathToUseToKeepHelping.bind(this);
    this.getPoliticianBasePath = this.getPoliticianBasePath.bind(this);
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
    return `/id/${campaignXWeVoteId}/`;
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
      politicianBasePath = `/${politicianSEOFriendlyPath}/-/`;
    } else if (politicianWeVoteId) {
      politicianBasePath = `/${politicianWeVoteId}/p/`;
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

  getPathToUseToKeepHelping () {
    const { payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    // console.log(payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed);
    const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted);
    // console.log('getPathToUseToKeepHelping keepHelpingDestinationString:', keepHelpingDestinationString);
    return `${this.getCampaignXBasePath()}${keepHelpingDestinationString}`;
  }

  render () {
    renderLog('CandidateCardForList');  // Set LOG_RENDER_EVENTS to log all renders
    const { limitCardWidth, showPoliticianOpenInNewWindow, useVerticalCard } = this.props;
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
    const todayAsInteger = getTodayAsInteger();
    const finalElectionDateInPast = candidateUltimateElectionDate && (candidateUltimateElectionDate <= todayAsInteger);
    const pathToUseToKeepHelping = this.getPathToUseToKeepHelping();
    return (
      <CardForListBody
        ballotItemDisplayName={ballotItemDisplayName}
        campaignSupported={campaignSupported}
        candidateWeVoteId={candidateWeVoteId}
        districtName={districtName}
        finalElectionDateInPast={finalElectionDateInPast}
        limitCardWidth={limitCardWidth}
        linkedCampaignXWeVoteId={linkedCampaignXWeVoteId}
        officeName={contestOfficeName}
        pathToUseToKeepHelping={pathToUseToKeepHelping}
        photoLargeUrl={candidatePhotoLargeUrl}
        politicalParty={politicalParty}
        politicianBaseBath={this.getPoliticianBasePath()}
        // politicianDescription={candidateDescription}
        politicianWeVoteId={politicianWeVoteId}
        profileImageBackgroundColor={profileImageBackgroundColor}
        showPoliticianOpenInNewWindow={showPoliticianOpenInNewWindow}
        stateCode={stateCode}
        supportersCount={supportersCount}
        supportersCountNextGoalRaw={supportersCountNextGoalRaw}
        tagIdBaseName="candidateCard"
        ultimateElectionDate={candidateUltimateElectionDate}
        useVerticalCard={useVerticalCard}
      />
    );
  }
}
CandidateCardForList.propTypes = {
  candidateWeVoteId: PropTypes.string,
  limitCardWidth: PropTypes.bool,
  showPoliticianOpenInNewWindow: PropTypes.bool,
  useVerticalCard: PropTypes.bool,
};

export default CandidateCardForList;
