import React, { Component } from 'react';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import BallotActions from '../../actions/BallotActions';
// import CampaignActions from '../../common/actions/CampaignActions';
import apiCalming from '../../common/utils/apiCalming';
import initializejQuery from '../../common/utils/initializejQuery';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';


class FirstCandidateListController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('FirstCandidateListController componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.CandidateListFirstRetrieve();
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    this.CandidateListFirstRetrieve();
  }

  onVoterStoreChange () {
    this.CandidateListFirstRetrieve();
  }

  CandidateListFirstRetrieve = () => {
    initializejQuery(() => {
      const CandidateListFirstRetrieveInitiated = AppObservableStore.candidateListFirstRetrieveInitiated();
      const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
      // console.log('FirstCandidateListController CandidateListFirstRetrieveInitiated: ', CandidateListFirstRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
      if (voterFirstRetrieveCompleted && !CandidateListFirstRetrieveInitiated) {
        AppObservableStore.setCandidateListFirstRetrieveInitiated(true);
        // CampaignActions.CandidateListRetrieve();
        if (apiCalming('voterBallotItemsRetrieve', 60000)) {
          BallotActions.voterBallotItemsRetrieve(0, '', '');
        }
      }
    });
  }

  render () {
    renderLog('FirstCandidateListController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('FirstCandidateListController render');
    return (
      <span />
    );
  }
}

export default FirstCandidateListController;
