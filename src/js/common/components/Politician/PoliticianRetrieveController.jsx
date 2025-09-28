import React, { Component } from 'react';
import PropTypes from 'prop-types';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import { politicianRetrieveFromIdentifiers } from '../../utils/politicianUtils';
// import PoliticianActions from '../../actions/PoliticianActions';
import PoliticianStore from '../../stores/PoliticianStore';
import VoterStore from '../../../stores/VoterStore';


class PoliticianRetrieveController extends Component {
  constructor (props) {
    super(props);
    this.state = {
      politicianRetrieveInitiated: false,
      politicianRetrieveAsOwnerInitiated: false, // If the voter is the owner of the politician, use different API call that doesn't run through the CDN
    };
  }

  componentDidMount () {
    // console.log('PoliticianRetrieveController componentDidMount');
    this.politicianStoreListener = PoliticianStore.addListener(this.onPoliticianStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.politicianFirstRetrieve();
  }

  componentDidUpdate (prevProps) {
    const {
      politicianWeVoteId: previousPoliticianWeVoteId,
    } = prevProps;
    const {
      politicianWeVoteId,
    } = this.props;
    if (politicianWeVoteId !== previousPoliticianWeVoteId) {
      // console.log('PoliticianRetrieveController componentDidUpdate politicianWeVoteId has changed');
      const politicianRetrieveOverride = true;
      this.politicianFirstRetrieve(politicianRetrieveOverride);
    } else {
      // console.log('PoliticianRetrieveController componentDidUpdate, politicianWeVoteId:', politicianWeVoteId);
      this.politicianFirstRetrieve();
    }
  }

  componentWillUnmount () {
    this.politicianStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onPoliticianStoreChange () {
    this.politicianFirstRetrieve();
  }

  onVoterStoreChange () {
    this.politicianFirstRetrieve();
  }

  politicianFirstRetrieve = (politicianRetrieveOverride = false) => {
    const { politicianSEOFriendlyPath, politicianWeVoteId } = this.props;
    // console.log('PoliticianRetrieveController politicianFirstRetrieve politicianSEOFriendlyPath: ', politicianSEOFriendlyPath, ', politicianWeVoteId: ', politicianWeVoteId);
    if (politicianSEOFriendlyPath || politicianWeVoteId) {
      const { politicianRetrieveAsOwnerInitiated, politicianRetrieveInitiated } = this.state;
      initializejQuery(() => {
        const voterIsOwner = PoliticianStore.getVoterCanEditThisPolitician(politicianWeVoteId);
        // console.log('PoliticianRetrieveController politicianRetrieveInitiated: ', politicianRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
        const triggerRetrieve = politicianRetrieveOverride || !politicianRetrieveInitiated || (voterIsOwner && !politicianRetrieveAsOwnerInitiated);
        if (triggerRetrieve) {
          // console.log('PoliticianRetrieveController politicianFirstRetrieve triggerRetrieve politicianSEOFriendlyPath: ', politicianSEOFriendlyPath, ', politicianWeVoteId: ', politicianWeVoteId, ', voterIsOwner: ', voterIsOwner);
          // console.log('politicianRetrieveInitiated:', politicianRetrieveInitiated, 'updatedPoliticianRetrieveInitiated:', updatedPoliticianRetrieveInitiated);
          this.setState({
            politicianRetrieveInitiated: true,
            politicianRetrieveAsOwnerInitiated: voterIsOwner,
          }, () => politicianRetrieveFromIdentifiers(politicianSEOFriendlyPath, politicianWeVoteId));
        }
      });
    }
  }

  render () {
    renderLog('PoliticianRetrieveController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('PoliticianRetrieveController render');
    return (
      <span />
    );
  }
}
PoliticianRetrieveController.propTypes = {
  politicianSEOFriendlyPath: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
};

export default PoliticianRetrieveController;
