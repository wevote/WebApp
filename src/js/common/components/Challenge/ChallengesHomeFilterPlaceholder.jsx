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
export default function ChallengesHomeFilterPlaceholder (props) {
  renderLog('ChallengesHomeFilterPlaceholder functional component');
  // console.log('ChallengesHomeFilterPlaceholder props.stateCode:', props.stateCode);
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
