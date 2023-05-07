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
      this.CandidateSearchRetrieve();
    }
    if (this.props.stateCode !== prevProps.stateCode) {
      this.CandidatesForStateRetrieve();
    }
    if (this.props.year !== prevProps.year) {
      this.CandidatesForYearRetrieve();
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
    const { stateCode } = this.props; // year
    initializejQuery(() => {
      // Retrieve all candidates for this state for this and next year (previously: last two years)
      const today = new Date();
      const thisYearInteger = today.getFullYear();
      // console.log(`candidatesQuery-${stateCode}-${thisYearInteger}`);
      let filteredStateCode = '';
      if (stateCode) {
        filteredStateCode = stateCode.toLowerCase().replace('all', '');
        filteredStateCode = filteredStateCode.toLowerCase().replace('na', '');
      }
      if (apiCalming(`candidatesQuery-${stateCode}-${thisYearInteger}`, 180000)) {
        CandidateActions.candidatesQuery(thisYearInteger, [], filteredStateCode);
      }
      // Now retrieve national candidates (Presidential)
      if (apiCalming(`candidatesQuery-na-${thisYearInteger}`, 180000)) {
        CandidateActions.candidatesQuery(thisYearInteger, [], 'na');
      }
      // const yearsRetrieved = [];
      // yearsRetrieved.push(thisYearInteger);
      const nextYear = thisYearInteger + 1;
      // console.log(`candidatesQuery-${stateCode}-${nextYear}`);
      if (apiCalming(`candidatesQuery-${stateCode}-${nextYear}`, 180000)) {
        CandidateActions.candidatesQuery(nextYear, [], filteredStateCode);
      }
      // Now retrieve national candidates (Presidential)
      if (apiCalming(`candidatesQuery-na-${nextYear}`, 180000)) {
        CandidateActions.candidatesQuery(nextYear, [], 'na');
      }
      // yearsRetrieved.push(nextYear);
      // if (!(year in yearsRetrieved)) {
      //   if (apiCalming(`candidatesQuery-${stateCode}-${year}`, 180000)) {
      //     CandidateActions.candidatesQuery(year, [], filteredStateCode);
      //   }
      // }
    });
  }

  CandidatesForYearRetrieve = () => {
    const { stateCode, year: thisYearInteger } = this.props;
    initializejQuery(() => {
      let filteredStateCode = '';
      if (stateCode) {
        filteredStateCode = stateCode.toLowerCase().replace('all', '');
        filteredStateCode = filteredStateCode.toLowerCase().replace('na', '');
      }
      if (apiCalming(`candidatesQuery-${stateCode}-${thisYearInteger}`, 180000)) {
        CandidateActions.candidatesQuery(`${thisYearInteger}`, [], filteredStateCode);
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
  year: PropTypes.number,
};

export default FirstCandidateListController;
