import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BallotActions from '../../actions/BallotActions';
import CandidateActions from '../../actions/CandidateActions';
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
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.BallotItemsFirstRetrieve();
    this.CandidatesForStateRetrieve();
  }

  componentDidUpdate (prevProps) {
    if (this.props.searchText !== prevProps.searchText) {
      if (this.searchTimer) clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.CandidateSearchRetrieve();
      }, 500);
    }
    if (this.props.stateCode !== prevProps.stateCode) {
      if (this.props.stateCode !== 'all') {
        this.CandidatesForStateRetrieve();
      }
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  onVoterStoreChange () {
    this.BallotItemsFirstRetrieve();
  }

  BallotItemsFirstRetrieve = () => {
    initializejQuery(() => {
      const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
      // console.log('FirstCandidateListController voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
      if (voterFirstRetrieveCompleted) {
        // Retrieve ballot for this voter
        if (apiCalming('voterBallotItemsRetrieve', 60000)) {
          BallotActions.voterBallotItemsRetrieve(0, '', '');
        }
      }
    });
  }

  CandidateSearchRetrieve = () => {
    const { searchText } = this.props;
    initializejQuery(() => {
      // console.log(`candidatesQuery-${searchText}`);
      if (apiCalming(`candidatesQuery-${searchText}`, 180000)) {
        CandidateActions.candidatesQuery('', [], '', searchText);
      }
    });
  }

  CandidatesForStateRetrieve = () => {
    const { stateCode } = this.props;
    initializejQuery(() => {
      // Retrieve all candidates for this state for last two years
      const today = new Date();
      const thisYearInteger = today.getFullYear();
      let electionDay = thisYearInteger;
      // console.log(`candidatesQuery-${stateCode}-${electionDay}`);
      if (apiCalming(`candidatesQuery-${stateCode}-${electionDay}`, 180000)) {
        CandidateActions.candidatesQuery(electionDay, [], stateCode);
      }
      electionDay = thisYearInteger - 1;
      // console.log(`candidatesQuery-${stateCode}-${electionDay}`);
      if (apiCalming(`candidatesQuery-${stateCode}-${electionDay}`, 180000)) {
        CandidateActions.candidatesQuery(electionDay, [], stateCode);
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
FirstCandidateListController.propTypes = {
  searchText: PropTypes.string,
  stateCode: PropTypes.string,
};

export default FirstCandidateListController;
