import { useState, useEffect, useCallback, useRef } from 'react';
import PoliticianActions from '../common/actions/PoliticianActions';
import VoterActions from '../actions/VoterActions';
import AppObservableStore, { messageService } from '../common/stores/AppObservableStore';
import CampaignStore from '../common/stores/CampaignStore';
import PoliticianStore from '../common/stores/PoliticianStore';
import VoterStore from '../stores/VoterStore';
import voterCanEditPolitician from '../common/utils/voterCanEditPolitician';
import apiCalming from '../common/utils/apiCalming';

export default function useVoterCanEditPolitician () {
  const [voterCanEditPoliticianProfile, setVoterCanEditPoliticianProfile] = useState(false);
  const campaignXWeVoteIdRef = useRef('');
  const politicianWeVoteIdRef = useRef('');
  const voterCanEditPoliticianHasDispatchedRef = useRef(false);

  const updateVoterCanEditPoliticianProfile = useCallback(() => {
    const currentCampaignXWeVoteId = campaignXWeVoteIdRef.current;
    const politicianWeVoteId = politicianWeVoteIdRef.current;
    // console.log('useVoterCanEditPolitician, politicianWeVoteId: ', politicianWeVoteId, ', currentCampaignXWeVoteId: ', currentCampaignXWeVoteId);
    if (voterCanEditPolitician(politicianWeVoteId, currentCampaignXWeVoteId)) {
      setVoterCanEditPoliticianProfile(true);
      // console.log('useVoterCanEditPolitician, voterCanEditPoliticianProfile set to true, voterCanEditPoliticianHasDispatchedRef.current:', voterCanEditPoliticianHasDispatchedRef.current);
      if (!voterCanEditPoliticianHasDispatchedRef.current && !PoliticianStore.getVoterCanEditThisPolitician(politicianWeVoteId)) {
        setTimeout(() => {
          PoliticianActions.voterCanEditPolitician(politicianWeVoteId);
          voterCanEditPoliticianHasDispatchedRef.current = true;
        }, 0);
      }
    } else {
      setVoterCanEditPoliticianProfile(false);
    }
  }, []);

  const onAppObservableStoreChange = useCallback(() => {
    campaignXWeVoteIdRef.current = AppObservableStore.getCampaignXWeVoteIdBeingViewed();
    if (politicianWeVoteIdRef.current !== AppObservableStore.getPoliticianWeVoteIdBeingViewed()) {
      voterCanEditPoliticianHasDispatchedRef.current = false;
    }
    politicianWeVoteIdRef.current = AppObservableStore.getPoliticianWeVoteIdBeingViewed();
    updateVoterCanEditPoliticianProfile();
  }, [updateVoterCanEditPoliticianProfile]);

  const onCampaignStoreChange = useCallback(() => {
    updateVoterCanEditPoliticianProfile();
  }, [updateVoterCanEditPoliticianProfile]);

  const onVoterStoreChange = useCallback(() => {
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    if (secretCodeVerified) {
      VoterActions.voterEmailAddressRetrieve();
    }
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
