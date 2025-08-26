import { useState, useEffect, useCallback, useRef } from 'react';
import VoterActions from '../actions/VoterActions';
import AppObservableStore, { messageService } from '../common/stores/AppObservableStore';
import CampaignStore from '../common/stores/CampaignStore';
import VoterStore from '../stores/VoterStore';
import voterCanEditPolitician from '../common/utils/voterCanEditPolitician';
import apiCalming from '../common/utils/apiCalming';

export default function useVoterCanEditPolitician () {
  const [voterCanEditPoliticianProfile, setVoterCanEditPoliticianProfile] = useState(false);
  const campaignXWeVoteIdRef = useRef('');
  const politicianWeVoteIdRef = useRef('');

  const updateVoterCanEditPoliticianProfile = useCallback(() => {
    const currentCampaignXWeVoteId = campaignXWeVoteIdRef.current;
    const politicianWeVoteId = politicianWeVoteIdRef.current;
    if (voterCanEditPolitician(politicianWeVoteId, currentCampaignXWeVoteId)) {
      setVoterCanEditPoliticianProfile(true);
    } else {
      setVoterCanEditPoliticianProfile(false);
    }
  }, []);

  const onAppObservableStoreChange = useCallback(() => {
    campaignXWeVoteIdRef.current = AppObservableStore.getCampaignXWeVoteIdBeingViewed();
    politicianWeVoteIdRef.current = AppObservableStore.getPoliticianWeVoteIdBeingViewed();
    updateVoterCanEditPoliticianProfile();
  }, [updateVoterCanEditPoliticianProfile]);

  const onCampaignStoreChange = useCallback(() => {
    updateVoterCanEditPoliticianProfile();
  }, [updateVoterCanEditPoliticianProfile]);

  const onVoterStoreChange = useCallback(() => {
    updateVoterCanEditPoliticianProfile();
  }, [updateVoterCanEditPoliticianProfile]);

  useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(onAppObservableStoreChange);
    onAppObservableStoreChange();
    return () => {
      appStateSubscription.unsubscribe();
    };
  }, [onAppObservableStoreChange]);

  useEffect(() => {
    const campaignStoreListener = CampaignStore.addListener(onCampaignStoreChange);
    onCampaignStoreChange();
    return () => {
      campaignStoreListener.remove();
    };
  }, [onCampaignStoreChange]);

  useEffect(() => {
    const voterStoreListener = VoterStore.addListener(onVoterStoreChange);
    onVoterStoreChange();
    return () => {
      voterStoreListener.remove();
    };
  }, [onVoterStoreChange]);

  useEffect(() => {
    if (apiCalming('voterEmailAddressRetrieve', 30000)) {
      VoterActions.voterEmailAddressRetrieve();
    }
  }, []);
  return voterCanEditPoliticianProfile;
}
