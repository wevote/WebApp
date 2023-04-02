import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import adjustDistrictNameAndOfficeName from '../../utils/adjustDistrictNameAndOfficeName';
import { renderLog } from '../../utils/logging';
import toTitleCase from '../../utils/toTitleCase';

function isAllUpperCase (str) {
  if (str) {
    return str === str.toUpperCase();
  } else {
    return false;
  }
}

// React functional component example
export default function OfficeHeldNameText (props) {
  renderLog('OfficeHeldNameText');  // Set LOG_RENDER_EVENTS to log all renders
  let districtNameFiltered;
  let nameHtml;
  let officeNameFiltered;
  const { districtName: incomingDistrictName, officeName: incomingOfficeHeldName, politicalParty } = props; // Mar 2023: Turning off officeLink until we can do design review
  if (isAllUpperCase(incomingDistrictName)) {
    districtNameFiltered = toTitleCase(incomingDistrictName);
  } else {
    districtNameFiltered = incomingDistrictName;
  }
  if (isAllUpperCase(incomingOfficeHeldName)) {
    officeNameFiltered = toTitleCase(incomingOfficeHeldName);
  } else {
    officeNameFiltered = incomingOfficeHeldName;
  }
  const { districtName, officeName } = adjustDistrictNameAndOfficeName(districtNameFiltered, officeNameFiltered);
  // console.log('districtName: ', districtName, 'officeName: ', officeName);
  const officeLink = null;
  const politicalPartyHtml = (politicalParty) ? (
    <PoliticalPartySpan>
      {' '}
      (
      {politicalParty}
      )
    </PoliticalPartySpan>
  ) : null;

  if (districtName) {
    if (officeName === undefined) {
      nameHtml = (
        <NoPoliticalPartySpan>
          <span>Representative for </span>
          {officeLink ? (
            <Link to={officeLink}>
              <DistrictNameSpan>{districtName}</DistrictNameSpan>
            </Link>
          ) : <DistrictNameSpan>{districtName}</DistrictNameSpan>}
          {politicalPartyHtml}
        </NoPoliticalPartySpan>
      );
    } else {
      nameHtml = (
        <PartyAndOfficeWrapper>
          <span className="u-gray-darker">
            {officeName}
            {' '}
          </span>
          <span>for </span>
          {officeLink ? (
            <Link id="officeHeldNameTextContestOfficeName" to={officeLink}>
              <DistrictNameSpan>{districtName}</DistrictNameSpan>
            </Link>
          ) : <DistrictNameSpan>{districtName}</DistrictNameSpan>}
          {politicalPartyHtml}
        </PartyAndOfficeWrapper>
      );
    }
  } else {
    nameHtml = (
      <PartyAndYearWrapper>
        <span className="u-gray-darker">
          {officeName}
        </span>
        {politicalPartyHtml}
      </PartyAndYearWrapper>
    );
  }

  return nameHtml;
}
OfficeHeldNameText.propTypes = {
  districtName: PropTypes.string,
  officeName: PropTypes.string,
  // officeLink: PropTypes.string,
  politicalParty: PropTypes.string,
};

const DistrictNameSpan = styled('span')`
  color: #333;
`;

const NoPoliticalPartySpan = styled('span')`
`;

const PartyAndYearWrapper = styled('div')`
`;

const PartyAndOfficeWrapper = styled('div')`
  line-height: 17px;
`;

const PoliticalPartySpan = styled('span')`
  color: #999;
  font-weight: 200;
  white-space: nowrap;
`;
