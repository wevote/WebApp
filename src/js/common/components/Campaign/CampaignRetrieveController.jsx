import React, { Component } from 'react';
import PropTypes from 'prop-types';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import { retrieveCampaignXFromIdentifiers } from '../../utils/campaignUtils';
import PoliticianStore from '../../stores/PoliticianStore';
import VoterStore from '../../../stores/VoterStore';


class CampaignRetrieveController extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignRetrieveInitiated: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignRetrieveController componentDidMount');
    this.politicianStoreListener = PoliticianStore.addListener(this.onPoliticianStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.campaignFirstRetrieve();
  }

  componentDidUpdate () {
    const {
      campaignXWeVoteId,
    } = this.props;
    const {
      campaignRetrieveInitiated,
    } = this.state;
    // console.log('CampaignRetrieveController componentDidUpdate, campaignXWeVoteId:', campaignXWeVoteId, ', campaignRetrieveInitiated:', campaignRetrieveInitiated);
    if (campaignXWeVoteId && !campaignRetrieveInitiated) {
      this.campaignFirstRetrieve();
    }
  }

  componentWillUnmount () {
    this.politicianStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onPoliticianStoreChange () {
    this.campaignFirstRetrieve();
  }

  onVoterStoreChange () {
    this.campaignFirstRetrieve();
  }

  campaignFirstRetrieve = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.props;
    // console.log('CampaignRetrieveController campaignFirstRetrieve campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    if (campaignSEOFriendlyPath || campaignXWeVoteId) {
      const { campaignRetrieveInitiated } = this.state;
      initializejQuery(() => {
        const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
        // console.log('CampaignRetrieveController campaignRetrieveInitiated: ', campaignRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
        if (voterFirstRetrieveCompleted && !campaignRetrieveInitiated) {
          // We use retrieveCampaignXFromIdentifiers instead of
          // retrieveCampaignXFromIdentifiersIfNotAlreadyRetrieved because there are some details
          // (ex/ campaignx_news_item_list, latest_campaignx_supporter_endorsement_list, latest_campaignx_supporter_list)
          // that come in with campaignRetrieve which don't come in campaignListRetrieve,
          // details which are only useful when you look at the full campaign
          this.setState({
            campaignRetrieveInitiated: true,
          }, () => retrieveCampaignXFromIdentifiers(campaignSEOFriendlyPath, campaignXWeVoteId));
          // const updatedCampaignRetrieveInitiated = retrieveCampaignXFromIdentifiers(campaignSEOFriendlyPath, campaignXWeVoteId);
          // console.log('campaignRetrieveInitiated:', campaignRetrieveInitiated, 'updatedCampaignRetrieveInitiated:', updatedCampaignRetrieveInitiated);
          // if (updatedCampaignRetrieveInitiated) {
          //   this.setState({
          //     campaignRetrieveInitiated: updatedCampaignRetrieveInitiated,
          //   });
          // }
        }
      });
    }
  }

  render () {
    renderLog('CampaignRetrieveController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('CampaignRetrieveController render');
    return (
      <span />
    );
  }
}
CampaignRetrieveController.propTypes = {
  campaignSEOFriendlyPath: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
};

export default CampaignRetrieveController;
