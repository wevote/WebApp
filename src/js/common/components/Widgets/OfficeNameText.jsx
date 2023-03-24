import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import YearState from './YearState';
import { renderLog } from '../../utils/logging';
import toTitleCase from '../../utils/toTitleCase';

function isAllUpperCase (str) {
  return str === str.toUpperCase();
}

// React functional component example
export default function OfficeNameText (props) {
  renderLog('OfficeNameText');  // Set LOG_RENDER_EVENTS to log all renders
  let nameText;
  const { politicalParty, showOfficeName, stateName, year } = props; // officeLink, // Dec 2022: Turning off officeLink until we can do design review
  let { officeName } = props;
  const officeLink = null;
  if (isAllUpperCase(officeName)) {
    officeName = toTitleCase(officeName);
  }
  if (showOfficeName) {
    if (politicalParty === undefined || politicalParty === '') {
      nameText = (
        <NoPoliticalPartyWrapper>
          <span>Candidate for </span>
          {officeLink ? (
            <Link to={officeLink}>
              <OfficeNameSpan>{officeName}</OfficeNameSpan>
            </Link>
          ) : <OfficeNameSpan>{officeName}</OfficeNameSpan>}
          <YearState year={year} stateName={stateName} />
        </NoPoliticalPartyWrapper>
      );
    } else {
      nameText = (
        <PartyAndOfficeWrapper>
          <span className="u-bold u-gray-darker">
            {politicalParty}
            {' '}
          </span>
          <span>candidate for </span>
          {officeLink ? (
            <Link id="officeNameTextContestOfficeName" to={officeLink}>
              <OfficeNameSpan>{officeName}</OfficeNameSpan>
            </Link>
          ) : <OfficeNameSpan>{officeName}</OfficeNameSpan>}
          <YearState year={year} stateName={stateName} />
        </PartyAndOfficeWrapper>
      );
    }
  } else {
    nameText = (
      <PartyAndYearWrapper>
        <span className="u-gray-darker">
          {politicalParty}
        </span>
        <YearState year={year} stateName={stateName} />
      </PartyAndYearWrapper>
    );
  }

  return nameText;
}
OfficeNameText.propTypes = {
  officeName: PropTypes.string,
  // officeLink: PropTypes.string,
  politicalParty: PropTypes.string,
  showOfficeName: PropTypes.bool,
  stateName: PropTypes.string,
  year: PropTypes.string,
};

const NoPoliticalPartyWrapper = styled('div')`
  line-height: 1.2;
`;

const OfficeNameSpan = styled('span')`
  color: #333;
  font-weight: 600;
`;

const PartyAndYearWrapper = styled('div')`
  line-height: 1.2;
`;

const PartyAndOfficeWrapper = styled('div')`
  line-height: 1.2;
`;
