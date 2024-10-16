import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import CardForListBodyPlaceholder from '../../common/components/CardForListBodyPlaceholder';
import { getTodayAsInteger } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';
import CampaignSupporterStore from '../../common/stores/CampaignSupporterStore';
import CandidateStore from '../../stores/CandidateStore';
import PoliticianStore from '../../common/stores/PoliticianStore';
import keepHelpingDestination from '../../common/utils/keepHelpingDestination';
import { mostLikelyCandidateDictFromList } from '../../utils/candidateFunctions';

const CardForListBody = React.lazy(() => import('../../common/components/CardForListBody'));

// const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class PoliticianCardForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidate: {},
      linkedCampaignXWeVoteId: '',
      politician: {},
    };
    this.getCampaignXBasePath = this.getCampaignXBasePath.bind(this);
    this.getPathToUseToKeepHelping = this.getPathToUseToKeepHelping.bind(this);
    this.getPoliticianBasePath = this.getPoliticianBasePath.bind(this);
    // this.pullCampaignXSupporterVoterEntry = this.pullCampaignXSupporterVoterEntry.bind(this);
  }

  componentDidMount () {
    // console.log('PoliticianCardForList componentDidMount');
    this.onCandidateStoreChange();
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.onCampaignSupporterStoreChange();
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.onPoliticianStoreChange();
    this.politicianStoreListener = PoliticianStore.addListener(this.onPoliticianStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    const {
      politicianWeVoteId: politicianWeVoteIdPrevious,
    } = prevProps;
    const {
      politicianWeVoteId,
    } = this.props;
    if (politicianWeVoteId) {
      if (politicianWeVoteId !== politicianWeVoteIdPrevious) {
        this.onCandidateStoreChange();
        this.onCampaignSupporterStoreChange();
        this.onPoliticianStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignSupporterStoreListener.remove();
    this.candidateStoreListener.remove();
    this.politicianStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onCampaignSupporterStoreChange () {
    const { politicianWeVoteId } = this.props;
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
    const { candidateWeVoteId } = this.state;
    const candidate = CandidateStore.getCandidateByWeVoteId(candidateWeVoteId);
    this.setState({
      candidate,
    });
  }

  onPoliticianStoreChange () {
    const { politicianWeVoteId } = this.props;
    const politician = PoliticianStore.getPoliticianByWeVoteId(politicianWeVoteId);
    const {
      linked_campaignx_we_vote_id: linkedCampaignXWeVoteId,
    } = politician;
    const mostLikelyCandidate = mostLikelyCandidateDictFromList(politician.candidate_list);
    // console.log('mostLikelyCandidate: ', mostLikelyCandidate);
    if (mostLikelyCandidate && (mostLikelyCandidate.we_vote_id !== '' || mostLikelyCandidate.we_vote_id !== null)) {
      this.setState({
        candidate: mostLikelyCandidate,
        candidateWeVoteId: mostLikelyCandidate.we_vote_id,
      });
    }
    this.setState({
      politician,
      linkedCampaignXWeVoteId,
    });
  }

  getCampaignXBasePath () {
    const { politician } = this.state;
    // console.log('politician:', politician);
    if (!politician) {
      return null;
    }
    const {
      seo_friendly_path: politicianSEOFriendlyPath,
      linked_campaignx_we_vote_id: campaignXWeVoteId,
    } = politician;
    let campaignXBasePath;
    if (politicianSEOFriendlyPath) {
      campaignXBasePath = `/c/${politicianSEOFriendlyPath}/`;
    } else {
      campaignXBasePath = `/id/${campaignXWeVoteId}/`;
    }
    return campaignXBasePath;
  }

  getPoliticianBasePath () {
    const { politicianWeVoteId } = this.props;
    const { politician } = this.state;
    // console.log('politician:', politician);
    const {
      seo_friendly_path: politicianSEOFriendlyPath,
    } = politician;
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

  getPathToUseToKeepHelping () {
    const { payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    // console.log(payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed);
    const keepHelpingDestinationString = keepHelpingDestination(step2Completed, payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted);
    // console.log('getPathToUseToKeepHelping keepHelpingDestinationString:', keepHelpingDestinationString);
    return `${this.getCampaignXBasePath()}${keepHelpingDestinationString}`;
  }

  render () {
    renderLog('PoliticianCardForList');  // Set LOG_RENDER_EVENTS to log all renders
    const { limitCardWidth, politicianWeVoteId, showPoliticianOpenInNewWindow, useCampaignSupportThermometer, useVerticalCard } = this.props;
    const { campaignSupported, candidate, candidateWeVoteId, linkedCampaignXWeVoteId, politician } = this.state;
    if (!politicianWeVoteId) {
      return (
        <CardForListBodyPlaceholder
          useVerticalCard={useVerticalCard}
          hideCardMargins
          profileImageBackgroundColor
          limitCardWidth={limitCardWidth}
        />
      );
    }
    if (!politician) {
      return null;
    }
    // const {
    //   ballot_guide_official_statement: ballotGuideOfficialStatement,
    //   ballot_item_display_name: ballotItemDisplayName,
    //   candidate_photo_url_large: candidatePhotoLargeUrl,
    //   candidate_ultimate_election_date: candidateUltimateElectionDate,
    //   contest_office_name: contestOfficeName,
    //   contest_office_list: contestOfficeList,
    //   // in_draft_mode: inDraftMode,
    //   // is_blocked_by_we_vote: isBlockedByWeVote,
    //   // is_in_team_review_mode: isInTeamReviewMode,
    //   // is_supporters_count_minimum_exceeded: isSupportersCountMinimumExceeded,
    //   party: politicalParty,
    //   profile_image_background_color: profileImageBackgroundColor,
    //   state_code: stateCode,
    //   supporters_count: supportersCount,
    //   supporters_count_next_goal: supportersCountNextGoalRaw,
    //   twitter_description: twitterDescription,
    //   // visible_on_this_site: visibleOnThisSite,
    // } = candidate;
    const {
      ballot_guide_official_statement: ballotGuideOfficialStatement,
      // ballot_item_display_name: ballotItemDisplayName,
      // candidate_photo_url_large: candidatePhotoLargeUrl,
      candidate_ultimate_election_date: candidateUltimateElectionDate,
      contest_office_name: contestOfficeName,
      contest_office_list: contestOfficeList,
      // supporters_count: supportersCount,
      // supporters_count_next_goal: supportersCountNextGoalRaw,
      // twitter_description: twitterDescription,
    } = candidate;
    const {
      politician_description: politicianDescription,
      politician_name: ballotItemDisplayName,
      we_vote_hosted_profile_image_url_large: politicianPhotoLargeUrl,
      political_party: politicalParty,
      profile_image_background_color: profileImageBackgroundColor,
      state_code: stateCode,
      supporters_count: supportersCount,
      supporters_count_next_goal: supportersCountNextGoalRaw, // Not provided in every return
      twitter_description: twitterDescription,
      // visible_on_this_site: visibleOnThisSite,
    } = politician;
    // console.log('candidate:', candidate);
    // console.log('politician:', politician);
    if (!politicianWeVoteId) {
      return null;
    }
    // let politicianDescriptionToDisplay;
    if (ballotGuideOfficialStatement) {
      // politicianDescriptionToDisplay = ballotGuideOfficialStatement;
    } else if (politicianDescription) {
      // politicianDescriptionToDisplay = politicianDescription;
    } else if (twitterDescription) {
      // politicianDescriptionToDisplay = twitterDescription;
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
    return (
      <Suspense fallback={fallbackJsx}>
        <CardForListBody
          ballotItemDisplayName={ballotItemDisplayName || ''}
          campaignSupported={campaignSupported}
          candidateWeVoteId={candidateWeVoteId}
          districtName={districtName}
          finalElectionDateInPast={finalElectionDateInPast}
          hideCardMargins
          hideItemActionBar
          limitCardWidth={limitCardWidth}
          linkedCampaignXWeVoteId={linkedCampaignXWeVoteId}
          officeName={contestOfficeName}
          pathToUseToKeepHelping={pathToUseToKeepHelping}
          photoLargeUrl={politicianPhotoLargeUrl}
          politicalParty={politicalParty}
          politicianBaseBath={this.getPoliticianBasePath()}
          // politicianDescription={politicianDescriptionToDisplay}
          politicianWeVoteId={politicianWeVoteId}
          profileImageBackgroundColor={profileImageBackgroundColor}
          showPoliticianOpenInNewWindow={showPoliticianOpenInNewWindow}
          stateCode={stateCode}
          supportersCount={supportersCount}
          supportersCountNextGoalRaw={supportersCountNextGoalRaw}
          tagIdBaseName="politicianCard"
          ultimateElectionDate={candidateUltimateElectionDate}
          useCampaignSupportThermometer={useCampaignSupportThermometer}
          usePoliticianWeVoteIdForBallotItem
          useVerticalCard={useVerticalCard}
        />
      </Suspense>
    );
  }
}
PoliticianCardForList.propTypes = {
  politicianWeVoteId: PropTypes.string,
  limitCardWidth: PropTypes.bool,
  showPoliticianOpenInNewWindow: PropTypes.bool,
  useCampaignSupportThermometer: PropTypes.bool,
  useVerticalCard: PropTypes.bool,
};

export default PoliticianCardForList;
