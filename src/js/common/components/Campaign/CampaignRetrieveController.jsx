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
    // this.campaignFirstRetrieve();
    this.setState({});  // Trigger componentDidUpdate
  }

  componentDidUpdate (prevProps) {
    const {
      campaignXWeVoteId: prevCampaignXWeVoteId,
      retrieveAsOwnerIfVoterSignedIn: retrieveAsOwnerIfVoterSignedInPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
      retrieveAsOwnerIfVoterSignedIn,
    } = this.props;
    let campaignRetrieveOverride = false;
    if (retrieveAsOwnerIfVoterSignedIn !== retrieveAsOwnerIfVoterSignedInPrevious) {
      // console.log('CampaignRetrieveController componentDidUpdate retrieveAsOwnerIfVoterSignedIn has changed');
      campaignRetrieveOverride = true;
    } else if (campaignXWeVoteId !== prevCampaignXWeVoteId) {
      // console.log('CampaignRetrieveController componentDidUpdate campaignXWeVoteId has changed');
      campaignRetrieveOverride = true;
    }
    let retrieveAsOwner = false;
    if (retrieveAsOwnerIfVoterSignedIn) {
      retrieveAsOwner = VoterStore.getVoterIsSignedIn();
    }
    // console.log('CampaignRetrieveController componentDidUpdate, campaignXWeVoteId:', campaignXWeVoteId, ', campaignRetrieveOverride', campaignRetrieveOverride, ', retrieveAsOwner:', retrieveAsOwner);
    this.campaignFirstRetrieve(campaignRetrieveOverride, retrieveAsOwner);
  }

  componentWillUnmount () {
    this.politicianStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onPoliticianStoreChange () {
    // this.campaignFirstRetrieve();
    this.setState({});  // Trigger componentDidUpdate
  }

  onVoterStoreChange () {
    // this.campaignFirstRetrieve();
    this.setState({});  // Trigger componentDidUpdate
  }

  campaignFirstRetrieve = (campaignRetrieveOverride = false, retrieveAsOwner = false) => {
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
          // console.log('CampaignRetrieveController campaignFirstRetrieve, campaignRetrieveOverride', campaignRetrieveOverride, ', retrieveAsOwner:', retrieveAsOwner);
          this.setState({
            campaignRetrieveInitiated: true,
          }, () => retrieveCampaignXFromIdentifiers(campaignSEOFriendlyPath, campaignXWeVoteId, retrieveAsOwner));
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
  retrieveAsOwnerIfVoterSignedIn: PropTypes.bool,
  campaignSEOFriendlyPath: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
};

export default CampaignRetrieveController;
