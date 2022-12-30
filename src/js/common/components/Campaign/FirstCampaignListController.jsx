import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CampaignActions from '../../actions/CampaignActions';
import apiCalming from '../../utils/apiCalming';
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
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.campaignListFirstRetrieve();
    this.CampaignsForStateRetrieve();
  }

  componentDidUpdate (prevProps) {
    if (this.props.searchText !== prevProps.searchText) {
      if (this.searchTimer) clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.CampaignSearchRetrieve();
      }, 500);
    }
    if (this.props.stateCode !== prevProps.stateCode) {
      if (this.props.stateCode !== 'all') {
        this.CampaignsForStateRetrieve();
      }
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  onVoterStoreChange () {
    this.campaignListFirstRetrieve();
  }

  campaignListFirstRetrieve = () => {
    initializejQuery(() => {
      const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
      // console.log('FirstCampaignListController campaignListFirstRetrieveInitiated: ', campaignListFirstRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
      if (voterFirstRetrieveCompleted) {
        if (apiCalming('campaignListFirstRetrieve', 60000)) {
          CampaignActions.campaignListRetrieve();
        }
      }
    });
  }

  CampaignSearchRetrieve = () => {
    const { searchText } = this.props;
    initializejQuery(() => {
      // console.log(`campaignListRetrieve-${searchText}`);
      if (apiCalming(`campaignListRetrieve-${searchText}`, 180000)) {
        CampaignActions.campaignListRetrieve(searchText);
      }
    });
  }

  CampaignsForStateRetrieve = () => {
    const { stateCode } = this.props;
    initializejQuery(() => {
      // console.log(`campaignListRetrieve-${stateCode}`);
      if (apiCalming(`campaignListRetrieve-${stateCode}`, 180000)) {
        CampaignActions.campaignListRetrieve('', stateCode);
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
FirstCampaignListController.propTypes = {
  searchText: PropTypes.string,
  stateCode: PropTypes.string,
};

export default FirstCampaignListController;
