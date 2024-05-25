import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CampaignStore from '../../../stores/CampaignStore';
import VoterStore from '../../../../stores/VoterStore';
import AppObservableStore from '../../../stores/AppObservableStore';
import CampaignSupporterStore from '../../../stores/CampaignSupporterStore';
import initializejQuery from '../../../utils/initializejQuery';
import CampaignSupporterActions from '../../../actions/CampaignSupporterActions';

const HeartFavoriteToggleBase = React.lazy(() => import(/* webpackChunkName: 'HeartFavoriteToggleBase' */ './HeartFavoriteToggleBase'));

class HeartFavoriteToggleLive extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      supportersCount: 0,
      voterCanVoteForPoliticianInCampaign: false,
      voterFirstName: '',
      voterLastName: '',
      voterSignedInWithEmail: false,
    };
  }

  componentDidMount () {
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SupportButton componentDidUpdate');
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
    this.voterStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    if (campaignXWeVoteId) {
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      // console.log('CampaignSupportThermometer onCampaignStoreChange campaignX:', campaignX);
      const {
        campaignx_we_vote_id: campaignXWeVoteIdFromDict,
        final_election_date_in_past: finalElectionDateInPast,
        supporters_count: supportersCount,
        supporters_count_next_goal: supportersCountNextGoal,
      } = campaignX;
      const supportersCountNextGoalWithFloor = supportersCountNextGoal ||  CampaignStore.getCampaignXSupportersCountNextGoalDefault();
      const voterCanVoteForPoliticianInCampaign = CampaignStore.getVoterCanVoteForPoliticianInCampaign(campaignXWeVoteId);
      if (campaignXWeVoteIdFromDict) {
        this.setState({
          finalElectionDateInPast,
          supportersCount,
          supportersCountNextGoal: supportersCountNextGoalWithFloor,
          voterCanVoteForPoliticianInCampaign,
        });
      }
    }
  }

  onVoterStoreChange () {
    const voterFirstName = VoterStore.getFirstName();
    const voterLastName = VoterStore.getLastName();
    const voterSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    this.setState({
      voterFirstName,
      voterLastName,
      voterSignedInWithEmail,
    });
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
    initializejQuery(() => {
      CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
    });
  }

  submitSupportClick = () => {
    const { campaignXWeVoteId } = this.props;
    const { voterFirstName, voterLastName, voterSignedInWithEmail } = this.state;
    console.log('HeartFavoriteToggleLive submitSupportClick');
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
    const { supportersCount, voterSignedInWithEmail } = this.state;
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
            submitSupport={this.submitSupportClick}
            voterOpposes={false}
            voterSignedInWithEmail={voterSignedInWithEmail}
            voterSupports={false}
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
