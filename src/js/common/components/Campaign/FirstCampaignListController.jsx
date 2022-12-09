import React, { Component } from 'react';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignActions from '../../actions/CampaignActions';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../../stores/VoterStore';


class FirstCampaignListController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('FirstCampaignListController componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.campaignListFirstRetrieve();
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    this.campaignListFirstRetrieve();
  }

  onVoterStoreChange () {
    this.campaignListFirstRetrieve();
  }

  campaignListFirstRetrieve = () => {
    initializejQuery(() => {
      const campaignListFirstRetrieveInitiated = AppObservableStore.campaignListFirstRetrieveInitiated();
      const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
      // console.log('FirstCampaignListController campaignListFirstRetrieveInitiated: ', campaignListFirstRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
      if (voterFirstRetrieveCompleted && !campaignListFirstRetrieveInitiated) {
        AppObservableStore.setCampaignListFirstRetrieveInitiated(true);
        CampaignActions.campaignListRetrieve();
      }
    });
  }

  render () {
    renderLog('FirstCampaignListController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('FirstCampaignListController render');
    return (
      <span />
    );
  }
}

export default FirstCampaignListController;
