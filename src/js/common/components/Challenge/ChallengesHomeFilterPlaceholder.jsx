import React from 'react';
import { renderLog } from '../../utils/logging';
import ChallengesHomeFilter from './ChallengesHomeFilter';


function clearSearchFunction () {
  // This is just a stub
  return true;
}

function searchFunction () {
  // This is just a stub
  return true;
}

// React functional component example
export default function ChallengesHomeFilterPlaceholder () {
  renderLog('ChallengesHomeFilterPlaceholder functional component');
  return (
    <span id="ChallengesHomeFilterPlaceholder">
      <ChallengesHomeFilter
        clearSearchFunction={clearSearchFunction}
        searchFunction={searchFunction}
      />
    </span>
  );
}
ChallengesHomeFilterPlaceholder.propTypes = {
};
