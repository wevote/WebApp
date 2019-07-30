import React from 'react';
import { isCordova, isIOsSmallerThanPlus } from '../../utils/cordovaUtils';

const BallotTitleHeader = ({ electionName, electionDayTextFormatted }) => {
  if (isCordova && isIOsSmallerThanPlus() && electionName) {
    return (
      <h1 className="ballot__header__title__cordova">
        <div className="ballot__header__title__cordova-text">
          <span>
            {electionName}
          </span>
          <br />
          <span className="u-gray-mid u-no-break">{electionDayTextFormatted}</span>
        </div>
      </h1>
    );
  } else if (isCordova && electionName) {
    return (
      <h1 className="ballot__header__title__cordova">
        <span className="ballot__header__title__cordova-text">
          <span>
            {electionName}
          </span>
          {' '}
          <span className="d-none d-sm-inline">&mdash;</span>
          <span className="u-gray-mid u-no-break">{electionDayTextFormatted}</span>
        </span>
      </h1>
    );
  } else if (electionName) {
    return (
      <h1 className="ballot__header__title">
        <span className="u-push--sm">
          <span>
            {electionName}
          </span>
          {' '}
          <span className="d-none d-sm-inline">&mdash;</span>
          <span className="u-gray-mid u-no-break">{electionDayTextFormatted}</span>
        </span>
      </h1>
    );
  } else {
    return (
      <span className="u-push--sm">
        Loading Election...
      </span>
    );
  }
};

export default BallotTitleHeader;
