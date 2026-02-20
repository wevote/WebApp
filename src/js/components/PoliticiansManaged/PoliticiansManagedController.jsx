import React, { useCallback, useEffect } from 'react';
import PoliticianActions from '../../common/actions/PoliticianActions';
import PoliticianStore from '../../common/stores/PoliticianStore';
import VoterStore from '../../stores/VoterStore';
import apiCalming from '../../common/utils/apiCalming';
import initializejQuery from '../../common/utils/initializejQuery';
import { renderLog } from '../../common/utils/logging';

function PoliticiansManagedController () {
  renderLog('PoliticiansManagedController');  // Set LOG_RENDER_EVENTS to log all renders

  const politiciansManagedRetrieve = () => {
    initializejQuery(() => {
      // console.log(`politiciansQuery-${searchText}`);
      if (apiCalming('politiciansManagedRetrieve', 4000)) {
        PoliticianActions.politiciansManagedRetrieve();
      }
    });
  };

  const onPoliticianStoreChange = useCallback(() => {
    politiciansManagedRetrieve();
  }, []);

  const onVoterStoreChange = useCallback(() => {
    politiciansManagedRetrieve();
  }, []);

  useEffect(() => {
    politiciansManagedRetrieve();
  }, []);

  useEffect(() => {
    const politicianStoreListener = PoliticianStore.addListener(onPoliticianStoreChange);
    onPoliticianStoreChange();
    return () => {
      politicianStoreListener.remove();
    };
  }, []);

  useEffect(() => {
    const voterStoreListener = VoterStore.addListener(onVoterStoreChange);
    onVoterStoreChange();
    return () => {
      voterStoreListener.remove();
    };
  }, []);

  return (
    <span />
  );
}

export default PoliticiansManagedController;
