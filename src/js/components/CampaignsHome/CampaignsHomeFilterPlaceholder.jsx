import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../common/utils/logging';
import CampaignsHomeFilter from './CampaignsHomeFilter';


function changeListModeShown () {
  // This is just a stub
  return true;
}

function clearSearchFunction () {
  // This is just a stub
  return true;
}

function handleChooseStateChange () {
  // This is just a stub
  return true;
}

function searchFunction () {
  // This is just a stub
  return true;
}

// React functional component example
export default function CampaignsHomeFilterPlaceholder (props) {
  renderLog('CampaignsHomeFilterPlaceholder functional component');
  // console.log('CampaignsHomeFilterPlaceholder props.stateCode:', props.stateCode);
  const { stateCode } = props;
  const isSearching = false;
  const listModeFiltersAvailable = [
    {
      displayAsChip: true,
      filterDisplayName: 'Upcoming',
      filterName: 'showUpcomingEndorsements',
      filterOrder: 1,
      filterSelected: true,
      filterType: 'showUpcomingEndorsements',
    },
  ];
  const searchText = '';
  return (
    <CampaignsHomeFilter
      changeListModeShown={changeListModeShown}
      clearSearchFunction={clearSearchFunction}
      handleChooseStateChange={handleChooseStateChange}
      isSearching={isSearching}
      listModeFiltersAvailable={listModeFiltersAvailable}
      searchFunction={searchFunction}
      searchText={searchText}
      stateCode={stateCode}
    />
  );
}
CampaignsHomeFilterPlaceholder.propTypes = {
  stateCode: PropTypes.string,
};
