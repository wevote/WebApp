import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ChallengeActions from '../../actions/ChallengeActions';
import apiCalming from '../../utils/apiCalming';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../../stores/VoterStore';

const UPDATE_NO_MORE_OFTEN_THAN = 30000;  // 30 seconds

class FirstChallengeListController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('FirstChallengeListController componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.challengeListFirstRetrieve();
    this.ChallengesForStateRetrieve();
  }

  componentDidUpdate (prevProps) {
    if (this.props.searchText !== prevProps.searchText) {
      if (this.searchTimer) clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.ChallengeSearchRetrieve();
      }, 500);
    }
    if (this.props.stateCode !== prevProps.stateCode) {
      let stateCodeLowerCase = '';
      if (this.props.stateCode) {
        stateCodeLowerCase = this.props.stateCode.toLowerCase();
      }
      if (stateCodeLowerCase !== 'all' && stateCodeLowerCase !== 'na') {
        this.ChallengesForStateRetrieve();
      }
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  onVoterStoreChange () {
    this.challengeListFirstRetrieve();
  }

  challengeListFirstRetrieve = () => {
    initializejQuery(() => {
      const voterFirstRetrieveCompleted = VoterStore.voterFirstRetrieveCompleted();
      // console.log('FirstChallengeListController challengeListFirstRetrieveInitiated: ', challengeListFirstRetrieveInitiated, ', voterFirstRetrieveCompleted: ', voterFirstRetrieveCompleted);
      if (voterFirstRetrieveCompleted) {
        if (apiCalming('challengeListFirstRetrieve', UPDATE_NO_MORE_OFTEN_THAN)) {
          ChallengeActions.challengeListRetrieve();
        }
      }
    });
  }

  ChallengeSearchRetrieve = () => {
    const { searchText } = this.props;
    initializejQuery(() => {
      // console.log(`challengeListRetrieve-${searchText}`);
      if (apiCalming(`challengeListRetrieve-${searchText}`, 180000)) {
        ChallengeActions.challengeListRetrieve(searchText);
      }
    });
  }

  ChallengesForStateRetrieve = () => {
    const { stateCode } = this.props;
    let filteredStateCode = '';
    if (stateCode) {
      filteredStateCode = stateCode.toLowerCase().replace('all', '');
      filteredStateCode = filteredStateCode.toLowerCase().replace('na', '');
    }
    initializejQuery(() => {
      // console.log(`challengeListRetrieve-${stateCode}`);
      if (apiCalming(`challengeListRetrieve-${stateCode}`, 180000)) {
        ChallengeActions.challengeListRetrieve('', filteredStateCode);
      }
    });
  }

  render () {
    renderLog('FirstChallengeListController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('FirstChallengeListController render');
    return (
      <span />
    );
  }
}
FirstChallengeListController.propTypes = {
  searchText: PropTypes.string,
  stateCode: PropTypes.string,
};

export default FirstChallengeListController;
