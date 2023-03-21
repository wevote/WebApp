import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { renderLog } from '../../utils/logging';

// React functional component example
export default function OfficeHeldNameText (props) {
  renderLog('OfficeHeldNameText');  // Set LOG_RENDER_EVENTS to log all renders
  let nameText = '';
  let { districtName } = props; // officeLink, // Dec 2022: Turning off officeLink until we can do design review
  const { officeHeldName } = props; // officeLink, // Dec 2022: Turning off officeLink until we can do design review
  if (officeHeldName && officeHeldName.includes(districtName)) {
    // This removes districtName in cases like 'Governor of California for California'
    districtName = '';
  }
  const officeLink = null;
  if (districtName) {
    if (officeHeldName === undefined) {
      nameText = (
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
      nameText = (
        <PartyAndOfficeWrapper>
          <span className="u-gray-darker">
            {officeHeldName}
            {' '}
          </span>
          <span>for </span>
          {officeLink ? (
            <Link id="officeHeldNameTextContestOfficeName" to={officeLink}>
              <DistrictNameSpan>{districtName}</DistrictNameSpan>
            </Link>
          ) : <DistrictNameSpan>{districtName}</DistrictNameSpan>}
        </PartyAndOfficeWrapper>
      );
    }
  } else {
    nameText = (
      <PartyAndYearWrapper>
        <span className="u-gray-darker">
          {officeHeldName}
        </span>
      </PartyAndYearWrapper>
    );
  }

  return nameText;
}
OfficeHeldNameText.propTypes = {
  officeHeldName: PropTypes.string,
  // officeLink: PropTypes.string,
  districtName: PropTypes.string,
};

const NoPoliticalPartySpan = styled('span')`
`;

const DistrictNameSpan = styled('span')`
  color: #333;
`;

const PartyAndYearWrapper = styled('div')`
`;

const PartyAndOfficeWrapper = styled('div')`
  line-height: 17px;
`;
