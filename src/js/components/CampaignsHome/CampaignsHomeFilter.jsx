import { Chip } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { SearchTitleTop } from '../../common/components/Style/FilterStyles';
import StateDropDownCore from '../Filter/StateDropDownCore';
import SearchBar2024 from '../Search/SearchBar2024';

// React functional component example
function CampaignsHomeFilter (props) {
  renderLog('CampaignsHomeFilter functional component');
  const { classes, isSearching, listModeFiltersAvailable, searchText, stateCode } = props;
  // console.log('CampaignsHomeFilter props.listModeFiltersAvailable:', props.listModeFiltersAvailable);
  return (
    <CampaignsHomeFilterWrapper>
      {/* {(isSearching && searchText) && (
        <SearchTitleTop>
          Searching for &quot;
          {searchText}
          &quot;
        </SearchTitleTop>
      )} */}
      {!!(listModeFiltersAvailable) && (
        <CampaignsHomeFilterChoices>
          {listModeFiltersAvailable.map((oneFilter) => (
            <span key={oneFilter.filterName}>
              {oneFilter.displayAsChip && (
                <Chip
                  label={<span style={oneFilter.filterSelected ? { fontWeight: 600 } : {}}>{oneFilter.filterDisplayName}</span>}
                  className={oneFilter.filterSelected ? classes.selectedChip : classes.notSelectedChip}
                  component="div"
                  onClick={() => props.changeListModeShown(oneFilter.filterName, oneFilter.filterYear)}
                  variant={oneFilter.filterSelected ? undefined : 'outlined'}
                />
              )}
            </span>
          ))}
          <StateDropDownCore
            stateCodesToDisplay={[]}
            onStateDropDownChange={props.handleChooseStateChange}
            stateCodesHtml=""
            selectedState={stateCode}
            dialogLabel="State"
          />
        </CampaignsHomeFilterChoices>
      )}
      <SearchBarWrapper>
        <SearchBar2024
          clearButton
          searchButton
          placeholder="Search by name, office or state"
          searchFunction={props.searchFunction}
          clearFunction={props.clearSearchFunction}
          searchUpdateDelayTime={500}
        />
      </SearchBarWrapper>
    </CampaignsHomeFilterWrapper>
  );
}
CampaignsHomeFilter.propTypes = {
  classes: PropTypes.object,
  changeListModeShown: PropTypes.func.isRequired,
  clearSearchFunction: PropTypes.func.isRequired,
  handleChooseStateChange: PropTypes.func.isRequired,
  isSearching: PropTypes.bool,
  listModeFiltersAvailable: PropTypes.array.isRequired,
  searchFunction: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  stateCode: PropTypes.string,
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


const CampaignsHomeFilterChoices = styled('div')`
  margin-top: 14px;
`;

const CampaignsHomeFilterWrapper = styled('div')`
  margin-top: 20px;
  margin-bottom: 24px;
`;

const SearchBarWrapper = styled('div')`
  margin-top: 14px;
  margin-bottom: 8px;
`;

export default withStyles(styles)(CampaignsHomeFilter);
