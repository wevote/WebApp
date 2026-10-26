import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PoliticianActions from '../../common/actions/PoliticianActions';
import apiCalming from '../../common/utils/apiCalming';
import initializejQuery from '../../common/utils/initializejQuery';
import { renderLog } from '../../common/utils/logging';


class FirstPoliticianListController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('FirstPoliticianListController componentDidMount');
    this.PoliticiansForStateRetrieve();
  }

  componentDidUpdate (prevProps) {
    const searchChanged = this.props.searchText !== prevProps.searchText;
    const stateChanged = this.props.stateCode !== prevProps.stateCode;
    if (this.props.combineSearchAndState) {
      if (searchChanged || stateChanged) {
        this.PoliticiansForStateRetrieve();
      }
      return;
    }
    if (searchChanged) {
      this.PoliticianSearchRetrieve();
    }
    if (stateChanged) {
      this.PoliticiansForStateRetrieve();
    }
  }

  componentWillUnmount () {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  PoliticianSearchRetrieve = () => {
    const { searchText } = this.props;
    initializejQuery(() => {
      // console.log(`politiciansQuery-${searchText}`);
      if (apiCalming(`politiciansQuery-${searchText}`, 180000)) {
        PoliticianActions.politiciansQuery([], '', searchText);
      }
    });
  };

  PoliticiansForStateRetrieve = () => {
    const { combineSearchAndState, stateCode } = this.props;
    const searchText = combineSearchAndState ? (this.props.searchText || '') : '';
    initializejQuery(() => {
      // Retrieve most liked politicians for this state
      // console.log(`politiciansQuery-${stateCode}-${thisYearInteger}`);
      let filteredStateCode = '';
      if (stateCode) {
        filteredStateCode = stateCode.toLowerCase().replace('all', '');
        filteredStateCode = filteredStateCode.toLowerCase().replace('na', '');
      }
      const queryKey = combineSearchAndState ? `politiciansQuery-${filteredStateCode}-${searchText}` : `politiciansQuery-${stateCode}`;
      if (apiCalming(queryKey, 180000)) {
        if (combineSearchAndState) {
          PoliticianActions.politiciansQuery([], filteredStateCode, searchText);
        } else {
          PoliticianActions.politiciansQuery([], filteredStateCode);
        }
      }
    });
  };

  render () {
    renderLog('FirstPoliticianListController');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <span />
    );
  }
}
FirstPoliticianListController.propTypes = {
  combineSearchAndState: PropTypes.bool,
  searchText: PropTypes.string,
  stateCode: PropTypes.string,
};

export default FirstPoliticianListController;
