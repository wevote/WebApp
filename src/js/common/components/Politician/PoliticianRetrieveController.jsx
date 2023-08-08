import React, { Component } from 'react';
import PropTypes from 'prop-types';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import { retrievePoliticianFromIdentifiers } from '../../utils/politicianUtils';
import VoterStore from '../../../stores/VoterStore';


class PoliticianRetrieveController extends Component {
  constructor (props) {
    super(props);
    this.state = {
      politicianRetrieveInitiated: false,
    };
  }

  componentDidMount () {
    // console.log('PoliticianRetrieveController componentDidMount');
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
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.politicianFirstRetrieve();
  }

  politicianFirstRetrieve = (politicianRetrieveOverride = false) => {
    const { politicianSEOFriendlyPath, politicianWeVoteId } = this.props;
    // console.log('PoliticianRetrieveController politicianSEOFriendlyPath: ', politicianSEOFriendlyPath, ', politicianWeVoteId: ', politicianWeVoteId);
    if (politicianSEOFriendlyPath || politicianWeVoteId) {
      const { politicianRetrieveInitiated } = this.state;
      initializejQuery(() => {
        // console.log('PoliticianRetrieveController politicianRetrieveInitiated: ', politicianRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
        const triggerRetrieve = politicianRetrieveOverride || !politicianRetrieveInitiated;
        if (triggerRetrieve) {
          // console.log('politicianRetrieveInitiated:', politicianRetrieveInitiated, 'updatedPoliticianRetrieveInitiated:', updatedPoliticianRetrieveInitiated);
          this.setState({
            politicianRetrieveInitiated: true,
          }, () => retrievePoliticianFromIdentifiers(politicianSEOFriendlyPath, politicianWeVoteId));
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
