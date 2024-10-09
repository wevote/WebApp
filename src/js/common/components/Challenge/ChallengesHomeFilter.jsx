import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import SearchBar2024 from '../../../components/Search/SearchBar2024';

function ChallengesHomeFilter (props) {
  renderLog('ChallengesHomeFilter functional component');
  // console.log('ChallengesHomeFilter props.listModeFiltersAvailable:', props.listModeFiltersAvailable);
  return (
    <ChallengesHomeFilterWrapper>
      <SearchBarWrapper>
        <SearchBar2024
          clearButton
          searchButton
          placeholder="Search challenges by name or state"
          searchFunction={props.searchFunction}
          clearFunction={props.clearSearchFunction}
          searchUpdateDelayTime={500}
        />
      </SearchBarWrapper>
    </ChallengesHomeFilterWrapper>
  );
}
ChallengesHomeFilter.propTypes = {
  clearSearchFunction: PropTypes.func.isRequired,
  searchFunction: PropTypes.func.isRequired,
};

const styles = () => ({
  formControl: {
    marginTop: 2,
    padding: '0px 4px',
    width: 200,
  },
  select: {
    padding: '5px 12px',
    margin: '0px 1px',
  },
  iconButton: {
    padding: 8,
  },
  notSelectedChip: {
    margin: 2,
  },
  selectedChip: {
    border: '1px solid #bdbdbd',
    margin: 2,
  },
});

const ChallengesHomeFilterWrapper = styled('div')`
  margin-top: 20px;
  margin-bottom: 24px;
`;

const SearchBarWrapper = styled('div')`
  margin-top: 14px;
  margin-bottom: 8px;
`;

export default withStyles(styles)(ChallengesHomeFilter);
