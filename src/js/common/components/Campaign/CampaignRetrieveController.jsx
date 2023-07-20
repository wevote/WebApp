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

  componentDidUpdate (prevProps) {
    const {
      campaignXWeVoteId: prevCampaignXWeVoteId,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId !== prevCampaignXWeVoteId) {
      // console.log('CampaignRetrieveController componentDidUpdate campaignXWeVoteId has changed');
      const campaignRetrieveOverride = true;
      this.campaignFirstRetrieve(campaignRetrieveOverride);
    } else {
      // console.log('CampaignRetrieveController componentDidUpdate, campaignXWeVoteId:', campaignXWeVoteId);
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

  campaignFirstRetrieve = (campaignRetrieveOverride = false) => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.props;
    // console.log('CampaignRetrieveController campaignFirstRetrieve campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    if (campaignSEOFriendlyPath || campaignXWeVoteId) {
      const { campaignRetrieveInitiated } = this.state;
      initializejQuery(() => {
        const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
        // console.log('CampaignRetrieveController campaignRetrieveInitiated: ', campaignRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
        const triggerRetrieve = campaignRetrieveOverride || !campaignRetrieveInitiated;
        if (voterFirstRetrieveCompleted && triggerRetrieve) {
          // We use retrieveCampaignXFromIdentifiers instead of
          // retrieveCampaignXFromIdentifiersIfNotAlreadyRetrieved because there are some details
          // (ex/ campaignx_news_item_list, latest_campaignx_supporter_endorsement_list, latest_campaignx_supporter_list)
          // that come in with campaignRetrieve which don't come in campaignListRetrieve,
          // details which are only useful when you look at the full campaign
          this.setState({
            campaignRetrieveInitiated: true,
          }, () => retrieveCampaignXFromIdentifiers(campaignSEOFriendlyPath, campaignXWeVoteId));
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
