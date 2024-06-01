import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import CampaignActions from '../../../actions/CampaignActions';
import CampaignStore from '../../../stores/CampaignStore';
import VoterStore from '../../../../stores/VoterStore';
import AppObservableStore from '../../../stores/AppObservableStore';
import CampaignSupporterStore from '../../../stores/CampaignSupporterStore';
// import apiCalming from '../../../utils/apiCalming';
import initializejQuery from '../../../utils/initializejQuery';
import CampaignSupporterActions from '../../../actions/CampaignSupporterActions';
import { renderLog } from '../../../utils/logging';

const HeartFavoriteToggleBase = React.lazy(() => import(/* webpackChunkName: 'HeartFavoriteToggleBase' */ './HeartFavoriteToggleBase'));

class HeartFavoriteToggleLive extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      voterOpposesCampaignX: false,
      voterSupportsCampaignX: false,
      supportersCount: 0,
      voterCanVoteForPoliticianInCampaign: false,
      voterFirstName: '',
      voterLastName: '',
      voterSignedInWithEmail: false,
    };
    this.functionToUseWhenProfileComplete = this.functionToUseWhenProfileComplete.bind(this);
    this.submitSupportClick = this.submitSupportClick.bind(this);
  }

  componentDidMount () {
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
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
      }
    }
  }

  componentWillUnmount () {
    // console.log('SupportButton componentWillUnmount');
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    if (campaignXWeVoteId) {
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      // console.log('HeartFavoriteToggleLive onCampaignStoreChange campaignX:', campaignX);
      const {
        campaignx_we_vote_id: campaignXWeVoteIdFromDict,
        final_election_date_in_past: finalElectionDateInPast,
        supporters_count: supportersCount,
        supporters_count_next_goal: supportersCountNextGoal,
        voter_campaignx_supporter: voterCampaignXSupporter,
      } = campaignX;
      const supportersCountNextGoalWithFloor = supportersCountNextGoal ||  CampaignStore.getCampaignXSupportersCountNextGoalDefault();
      const voterCanVoteForPoliticianInCampaign = CampaignStore.getVoterCanVoteForPoliticianInCampaign(campaignXWeVoteId);
      if (campaignXWeVoteIdFromDict) {
        // console.log('HeartFavoriteToggleLive onCampaignStoreChange voterCampaignXSupporter:', voterCampaignXSupporter);
        if (voterCampaignXSupporter && 'campaign_supported' in voterCampaignXSupporter) {
          const {
            campaign_opposed: voterOpposesCampaignX,
            campaign_supported: voterSupportsCampaignX,
          } = voterCampaignXSupporter;
          this.setState({
            voterOpposesCampaignX,
            voterSupportsCampaignX,
          });
        }
        // console.log('HeartFavoriteToggleLive onCampaignStoreChange campaignXWeVoteIdFromDict:', campaignXWeVoteIdFromDict);
        this.setState({
          finalElectionDateInPast,
          supportersCount,
          supportersCountNextGoal: supportersCountNextGoalWithFloor,
          voterCanVoteForPoliticianInCampaign,
        });
      }
    }
  }

  onCampaignSupporterStoreChange () {
    // When campaignSupporterSave happens which is related to this campaingnX, refresh data
    const { campaignXWeVoteId } = this.props;
    const {  voterOpposesCampaignX: voterOpposesCampaignXPrevious, voterSupportsCampaignX: voterSupportsCampaignXPrevious } = this.state;
    if (campaignXWeVoteId) {
      const voterCampaignXSupporter = CampaignSupporterStore.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('HeartFavoriteToggleLive onCampaignSupporterStoreChange voterCampaignXSupporter:', voterCampaignXSupporter)
      if (voterCampaignXSupporter && 'campaign_supported' in voterCampaignXSupporter) {
        const {
          campaign_opposed: voterOpposesCampaignX,
          campaign_supported: voterSupportsCampaignX,
        } = voterCampaignXSupporter;
        if ((voterOpposesCampaignX !== voterOpposesCampaignXPrevious) || (voterSupportsCampaignX !== voterSupportsCampaignXPrevious)) {
          // If this voter's support/oppose status has changed, refresh data
          this.setState({
            voterOpposesCampaignX,
            voterSupportsCampaignX,
          }, () => {
            // TODO: Needs to be figured out in bulk -- not in this component
            // if (apiCalming(`campaignRetrieveAsOwner-${campaignXWeVoteId}`, 500)) {
            //   CampaignActions.campaignRetrieveAsOwner(campaignXWeVoteId);
            // }
          });
        }
      }
    }
  }

  onVoterStoreChange () {
    // const { campaignXWeVoteId } = this.props;
    const { voterSignedInWithEmail: voterSignedInWithEmailPrevious } = this.state;
    const voterFirstName = VoterStore.getFirstName();
    const voterLastName = VoterStore.getLastName();
    const voterSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    this.setState({
      voterFirstName,
      voterLastName,
      voterSignedInWithEmail,
    }, () => {
      if (voterSignedInWithEmail !== voterSignedInWithEmailPrevious) {
        // TODO: Needs to be figured out in bulk -- not in this component
        // if (apiCalming(`campaignRetrieveAsOwner-${campaignXWeVoteId}`, 500)) {
        //   CampaignActions.campaignRetrieveAsOwner(campaignXWeVoteId);
        // }
      }
    });
  }

  functionToUseWhenProfileComplete () {
    const { campaignXWeVoteId } = this.props;
    const campaignSupported = true;
    const campaignSupportedChanged = true;
    // From this page we always send value for 'visibleToPublic'
    let visibleToPublic = CampaignSupporterStore.getVisibleToPublic();
    const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
    if (visibleToPublicChanged) {
      // If it has changed, use new value
      visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
    }
    // console.log('HeartFavoriteToggleLive functionToUseWhenProfileComplete');
    const saveVisibleToPublic = true;
    initializejQuery(() => {
      CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
    });
  }

  submitSupportClick () {
    const { campaignXWeVoteId } = this.props;
    const { voterFirstName, voterLastName, voterSignedInWithEmail } = this.state;
    // console.log('HeartFavoriteToggleLive submitSupportClick');
    if (!campaignXWeVoteId) {
      console.log('HeartFavoriteToggleLive submitSupportClick: missing campaignXWeVoteId:', campaignXWeVoteId);
    } else if (!voterFirstName || !voterLastName || !voterSignedInWithEmail) {
      // Open complete your profile modal
      AppObservableStore.setShowCompleteYourProfileModal(true);
    } else {
      // Mark that voter supports this campaign
      AppObservableStore.setBlockCampaignXRedirectOnSignIn(false);
      this.functionToUseWhenProfileComplete();
    }
  }

  render () {
    renderLog('HeartFavoriteToggleLive');  // Set LOG_RENDER_EVENTS to log all renders

    const { campaignXWeVoteId } = this.props;
    const { supportersCount, voterSignedInWithEmail, voterOpposesCampaignX, voterSupportsCampaignX } = this.state;
    return (
      <HeartFavoriteToggleLiveContainer>
        <Suspense fallback={(
          <HeartFavoriteToggleBase
            campaignXOpposersCount={0}
            campaignXSupportersCount={supportersCount}
            submitSupport={this.submitSupportClick}
            voterOpposes={false}
            voterSignedInWithEmail={voterSignedInWithEmail}
            voterSupports={false}
          />
        )}
        >
          <HeartFavoriteToggleBase
            campaignXOpposersCount={0}
            campaignXSupportersCount={supportersCount}
            campaignXWeVoteId={campaignXWeVoteId}
            submitSupport={this.submitSupportClick}
            voterOpposes={voterOpposesCampaignX}
            voterSignedInWithEmail={voterSignedInWithEmail}
            voterSupports={voterSupportsCampaignX}
          />
        </Suspense>
      </HeartFavoriteToggleLiveContainer>
    );
  }
}

HeartFavoriteToggleLive.propTypes = {
  campaignXWeVoteId: PropTypes.string,
};

const HeartFavoriteToggleLiveContainer = styled.div`
`;

export default HeartFavoriteToggleLive;
