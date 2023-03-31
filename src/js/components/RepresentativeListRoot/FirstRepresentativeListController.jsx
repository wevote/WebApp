import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RepresentativeActions from '../../actions/RepresentativeActions';
import apiCalming from '../../common/utils/apiCalming';
import initializejQuery from '../../common/utils/initializejQuery';
import { renderLog } from '../../common/utils/logging';


class FirstRepresentativeListController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('FirstRepresentativeListController componentDidMount');
    this.RepresentativesForStateRetrieve();
  }

  componentDidUpdate (prevProps) {
    if (this.props.searchText !== prevProps.searchText) {
      this.RepresentativeSearchRetrieve();
    }
    if (this.props.stateCode !== prevProps.stateCode) {
      this.RepresentativesForStateRetrieve();
    }
    if (this.props.year !== prevProps.year) {
      this.RepresentativesForYearRetrieve();
    }
  }

  componentWillUnmount () {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  RepresentativeSearchRetrieve = () => {
    const { searchText } = this.props;
    initializejQuery(() => {
      // console.log(`representativesQuery-${searchText}`);
      if (apiCalming(`representativesQuery-${searchText}`, 180000)) {
        RepresentativeActions.representativesQuery('', [], '', searchText);
      }
    });
  }

  RepresentativesForStateRetrieve = () => {
    const { stateCode, year } = this.props;
    initializejQuery(() => {
      const yearsRetrieved = [];
      // Retrieve all representatives for this state for last two years
      const today = new Date();
      const thisYearInteger = today.getFullYear();
      // console.log(`representativesQuery-${stateCode}-${thisYearInteger}`);
      let filteredStateCode = '';
      if (stateCode) {
        filteredStateCode = stateCode.toLowerCase().replace('all', '');
        filteredStateCode = filteredStateCode.toLowerCase().replace('na', '');
      }
      if (apiCalming(`representativesQuery-${stateCode}-${thisYearInteger}`, 180000)) {
        RepresentativeActions.representativesQuery(thisYearInteger, [], filteredStateCode);
      }
      yearsRetrieved.push(thisYearInteger);
      const lastYearInteger = thisYearInteger - 1;
      // console.log(`representativesQuery-${stateCode}-${lastYearInteger}`);
      if (apiCalming(`representativesQuery-${stateCode}-${lastYearInteger}`, 180000)) {
        RepresentativeActions.representativesQuery(lastYearInteger, [], filteredStateCode);
      }
      yearsRetrieved.push(lastYearInteger);
      if (!(year in yearsRetrieved)) {
        if (apiCalming(`representativesQuery-${stateCode}-${year}`, 180000)) {
          RepresentativeActions.representativesQuery(year, [], filteredStateCode);
        }
      }
    });
  }

  RepresentativesForYearRetrieve = () => {
    const { stateCode, year: thisYearInteger } = this.props;
    initializejQuery(() => {
      let filteredStateCode = '';
      if (stateCode) {
        filteredStateCode = stateCode.toLowerCase().replace('all', '');
        filteredStateCode = filteredStateCode.toLowerCase().replace('na', '');
      }
      if (apiCalming(`representativesQuery-${stateCode}-${thisYearInteger}`, 180000)) {
        RepresentativeActions.representativesQuery(`${thisYearInteger}`, [], filteredStateCode);
      }
    });
  }

  render () {
    renderLog('FirstRepresentativeListController');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <span />
    );
  }
}
FirstRepresentativeListController.propTypes = {
  searchText: PropTypes.string,
  stateCode: PropTypes.string,
  year: PropTypes.number,
};

export default FirstRepresentativeListController;
