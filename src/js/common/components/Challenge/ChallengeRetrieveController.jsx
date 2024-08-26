import React, { Component } from 'react';
import PropTypes from 'prop-types';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import { retrieveChallengeFromIdentifiers } from '../../utils/challengeUtils';
import ChallengeStore from '../../stores/ChallengeStore';
import VoterStore from '../../../stores/VoterStore';


class ChallengeRetrieveController extends Component {
  constructor (props) {
    super(props);
    this.state = {
      challengeRetrieveInitiated: false,
    };
  }

  componentDidMount () {
    // console.log('ChallengeRetrieveController componentDidMount');
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // this.challengeFirstRetrieve();
    this.setState({});  // Trigger componentDidUpdate
  }

  componentDidUpdate (prevProps) {
    const {
      challengeWeVoteId: prevChallengeWeVoteId,
      retrieveAsOwnerIfVoterSignedIn: retrieveAsOwnerIfVoterSignedInPrevious,
    } = prevProps;
    const {
      challengeWeVoteId,
      retrieveAsOwnerIfVoterSignedIn,
    } = this.props;
    let challengeRetrieveOverride = false;
    if (retrieveAsOwnerIfVoterSignedIn !== retrieveAsOwnerIfVoterSignedInPrevious) {
      // console.log('ChallengeRetrieveController componentDidUpdate retrieveAsOwnerIfVoterSignedIn has changed');
      challengeRetrieveOverride = true;
    } else if (challengeWeVoteId !== prevChallengeWeVoteId) {
      // console.log('ChallengeRetrieveController componentDidUpdate challengeWeVoteId has changed');
      challengeRetrieveOverride = true;
    }
    let retrieveAsOwner = false;
    if (retrieveAsOwnerIfVoterSignedIn) {
      retrieveAsOwner = VoterStore.getVoterIsSignedIn();
    }
    // console.log('ChallengeRetrieveController componentDidUpdate, challengeWeVoteId:', challengeWeVoteId, ', challengeRetrieveOverride', challengeRetrieveOverride, ', retrieveAsOwner:', retrieveAsOwner);
    this.challengeFirstRetrieve(challengeRetrieveOverride, retrieveAsOwner);
  }

  componentWillUnmount () {
    this.challengeStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onChallengeStoreChange () {
    // this.challengeFirstRetrieve();
    this.setState({});  // Trigger componentDidUpdate
  }

  onVoterStoreChange () {
    // this.challengeFirstRetrieve();
    this.setState({});  // Trigger componentDidUpdate
  }

  challengeFirstRetrieve = (challengeRetrieveOverride = false, retrieveAsOwner = false) => {
    const { challengeSEOFriendlyPath, challengeWeVoteId } = this.props;
    // console.log('ChallengeRetrieveController challengeFirstRetrieve challengeSEOFriendlyPath: ', challengeSEOFriendlyPath, ', challengeWeVoteId: ', challengeWeVoteId);
    if (challengeSEOFriendlyPath || challengeWeVoteId) {
      const { challengeRetrieveInitiated } = this.state;
      initializejQuery(() => {
        const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
        // console.log('ChallengeRetrieveController challengeRetrieveInitiated: ', challengeRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
        const triggerRetrieve = challengeRetrieveOverride || !challengeRetrieveInitiated;
        if (voterFirstRetrieveCompleted && triggerRetrieve) {
          this.setState({
            challengeRetrieveInitiated: true,
          }, () => retrieveChallengeFromIdentifiers(challengeSEOFriendlyPath, challengeWeVoteId, retrieveAsOwner));
        }
      });
    }
  }

  render () {
    renderLog('ChallengeRetrieveController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('ChallengeRetrieveController render');
    return (
      <span />
    );
  }
}
ChallengeRetrieveController.propTypes = {
  retrieveAsOwnerIfVoterSignedIn: PropTypes.bool,
  challengeSEOFriendlyPath: PropTypes.string,
  challengeWeVoteId: PropTypes.string,
};

export default ChallengeRetrieveController;
