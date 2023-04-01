import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import YearState from './YearState';
import adjustDistrictNameAndOfficeName from '../../utils/adjustDistrictNameAndOfficeName';
import { renderLog } from '../../utils/logging';
import toTitleCase from '../../utils/toTitleCase';

function isAllUpperCase (str) {
  return str === str.toUpperCase();
}

// React functional component example
export default function OfficeNameText (props) {
  renderLog('OfficeNameText');  // Set LOG_RENDER_EVENTS to log all renders
  let districtNameFiltered;
  let nameHtml;
  let officeAndDistrictHtml;
  let officeNameFiltered;
  const { politicalParty, showOfficeName, stateName, year } = props; // officeLink, // Dec 2022: Turning off officeLink until we can do design review
  const { districtName: incomingDistrictName, officeName: incomingOfficeName } = props; // Mar 2023: Turning off officeLink until we can do design review
  if (isAllUpperCase(incomingDistrictName)) {
    districtNameFiltered = toTitleCase(incomingDistrictName);
  } else {
    districtNameFiltered = incomingDistrictName;
  }
  if (isAllUpperCase(incomingOfficeName)) {
    officeNameFiltered = toTitleCase(incomingOfficeName);
  } else {
    officeNameFiltered = incomingOfficeName;
  }
  const { districtName, officeName } = adjustDistrictNameAndOfficeName(districtNameFiltered, officeNameFiltered);
  // console.log('districtName: ', districtName, 'officeName: ', officeName);
  const officeLink = null;
  if (districtName) {
    if (officeName === undefined) {
      officeAndDistrictHtml = (
        <NoPoliticalPartySpan>
          <span>Representative for </span>
          {officeLink ? (
            <Link to={officeLink}>
              <DistrictNameSpan>{districtName}</DistrictNameSpan>
            </Link>
          ) : <DistrictNameSpan>{districtName}</DistrictNameSpan>}
        </NoPoliticalPartySpan>
      );
    } else {
      officeAndDistrictHtml = (
        <OfficeAndDistrictSpan>
          <span className="u-gray-darker">
            {officeName}
            ,
            {' '}
          </span>
          {officeLink ? (
            <Link id="officeNameTextContestOfficeName" to={officeLink}>
              <DistrictNameSpan>{districtName}</DistrictNameSpan>
            </Link>
          ) : <DistrictNameSpan>{districtName}</DistrictNameSpan>}
        </OfficeAndDistrictSpan>
      );
    }
  } else {
    officeAndDistrictHtml = (
      <PartyAndYearWrapper>
        <span className="u-gray-darker">
          {officeName}
        </span>
      </PartyAndYearWrapper>
    );
  }

  if (showOfficeName) {
    if (politicalParty === undefined || politicalParty === '') {
      nameHtml = (
        <NoPoliticalPartyWrapper>
          <span>Candidate for </span>
          {officeLink ? (
            <Link to={officeLink}>
              <OfficeNameSpan>{officeAndDistrictHtml}</OfficeNameSpan>
            </Link>
          ) : <OfficeNameSpan>{officeAndDistrictHtml}</OfficeNameSpan>}
          <YearState year={year} stateName={stateName} />
        </NoPoliticalPartyWrapper>
      );
    } else {
      nameHtml = (
        <PartyAndOfficeWrapper>
          <span className="u-bold u-gray-darker">
            {politicalParty}
            {' '}
          </span>
          <span>candidate for </span>
          {officeLink ? (
            <Link id="officeNameTextContestOfficeName" to={officeLink}>
              <OfficeNameSpan>{officeAndDistrictHtml}</OfficeNameSpan>
            </Link>
          ) : <OfficeNameSpan>{officeAndDistrictHtml}</OfficeNameSpan>}
          <YearState year={year} stateName={stateName} />
        </PartyAndOfficeWrapper>
      );
    }
  } else {
    nameHtml = (
      <PartyAndYearWrapper>
        <span className="u-gray-darker">
          {politicalParty}
        </span>
        <YearState year={year} stateName={stateName} />
      </PartyAndYearWrapper>
    );
  }

  return nameHtml;
}
OfficeNameText.propTypes = {
  districtName: PropTypes.string,
  officeName: PropTypes.string,
  // officeLink: PropTypes.string,
  politicalParty: PropTypes.string,
  showOfficeName: PropTypes.bool,
  stateName: PropTypes.string,
  year: PropTypes.string,
};

const DistrictNameSpan = styled('span')`
  color: #333;
  font-weight: 600;
`;

const NoPoliticalPartySpan = styled('span')`
`;

const NoPoliticalPartyWrapper = styled('div')`
  line-height: 1.2;
`;

const OfficeAndDistrictSpan = styled('span')`
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
