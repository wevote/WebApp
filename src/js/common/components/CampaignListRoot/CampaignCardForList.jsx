import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import styled from 'styled-components';
import webAppConfig from '../../../config';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import historyPush from '../../utils/historyPush';
import keepHelpingDestination from '../../utils/keepHelpingDestination';
import { renderLog } from '../../utils/logging';
import saveCampaignSupportAndGoToNextPage from '../../utils/saveCampaignSupportAndGoToNextPage';
import CampaignCardForListBody from './CampaignCardForListBody';

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
  }

  onAppObservableStoreChange () {
    const { inPrivateLabelMode: inPrivateLabelModePrevious, payToPromoteStepTurnedOn: payToPromoteStepTurnedOnPrevious } = this.state;
    const inPrivateLabelMode = AppObservableStore.inPrivateLabelMode();
    const payToPromoteStepTurnedOn = !inPrivateLabelMode && webAppConfig.ENABLE_PAY_TO_PROMOTE;
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
      historyPush(`${this.getCampaignXBasePath()}edit`);
    }
    return null;
  }

  onCampaignGetMinimumSupportersClick () {
    const { campaignX } = this.state;
    // console.log('campaignX:', campaignX);
    if (!campaignX) {
      return null;
    }
    historyPush(`${this.getCampaignXBasePath()}share-campaign`);
    return null;
  }

  onCampaignShareClick () {
    const { campaignX } = this.state;
    // console.log('campaignX:', campaignX);
    if (!campaignX) {
      return null;
    }
    historyPush(`${this.getCampaignXBasePath()}share-campaign`);
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
      campaignBasePath = `/c/${campaignSEOFriendlyPath}/`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}/`;
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
    historyPush(`${this.getCampaignXBasePath()}${keepHelpingDestinationString}`);
  }

  functionToUseWhenProfileComplete () {
    const { campaignXWeVoteId } = this.props;
    if (campaignXWeVoteId) {
      const campaignXBasePath = this.getCampaignXBasePath();
      saveCampaignSupportAndGoToNextPage(campaignXWeVoteId, campaignXBasePath);
    } else {
      console.log('CampaignCardForList functionToUseWhenProfileComplete campaignXWeVoteId not found');
    }
  }

  render () {
    renderLog('CampaignCardForList');  // Set LOG_RENDER_EVENTS to log all renders
    const { limitCardWidth, useVerticalCard } = this.props;
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
      profile_image_background_color: profileImageBackgroundColor,
      supporters_count: supportersCount,
      supporters_count_next_goal: supportersCountNextGoal,
      // visible_on_this_site: visibleOnThisSite,
      we_vote_hosted_campaign_photo_large_url: campaignPhotoLargeUrl,
      // we_vote_hosted_campaign_photo_medium_url: campaignPhotoMediumUrl,
      // we_vote_hosted_profile_image_url_large: weVoteHostedProfileImageUrlLarge,
    } = campaignX;
    // const stateName = convertStateCodeToStateText(stateCode);
    const supportersCountNextGoalWithFloor = supportersCountNextGoal || CampaignStore.getCampaignXSupportersCountNextGoalDefault();
    // const year = getYearFromUltimateElectionDate(finalElectionDateAsInteger);
    return (
      <CampaignCardForListBody
        campaignDescription={campaignDescription}
        campaignSupported={campaignSupported}
        campaignTitle={campaignTitle}
        campaignXWeVoteId={campaignXWeVoteId}
        hideCardMargins
        inDraftMode={inDraftMode}
        functionToUseToKeepHelping={this.functionToUseToKeepHelping}
        functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
        limitCardWidth={limitCardWidth}
        onCampaignClick={this.onCampaignClick}
        onCampaignClickLink={this.onCampaignClickLink}
        photoLargeUrl={campaignPhotoLargeUrl}
        profileImageBackgroundColor={profileImageBackgroundColor}
        supportersCount={supportersCount}
        supportersCountNextGoalWithFloor={supportersCountNextGoalWithFloor}
        tagIdBaseName=""
        useVerticalCard={useVerticalCard}
      />
    );
  }
}
CampaignCardForList.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  limitCardWidth: PropTypes.bool,
  useVerticalCard: PropTypes.bool,
};

const styles = (theme) => ({
  buttonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

// const CampaignOwnersWrapper = styled('div')`
// `;

export default withStyles(styles)(CampaignCardForList);
