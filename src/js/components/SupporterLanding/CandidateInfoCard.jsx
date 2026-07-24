import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import normalizedImagePath from '../../common/utils/normalizedImagePath';

const avatarGeneric = '../../../img/global/svg-icons/avatar-generic.svg';

// Candidate identity block. Desktop/tablet: name over party, a vertical divider, then
// "Learn more". Mobile: name on its own row, then "Independent | Learn more about Jane"
// on a single row beneath it.
export default function CandidateInfoCard ({ candidate }) {
  const { name, party, officeDescription, learnMoreUrl } = candidate;
  const firstName = candidate.firstName || name.split(' ')[0];

  const learnMore = (
    <LearnMoreLink to={learnMoreUrl}>
      Learn more about
      {' '}
      {firstName}
      <OpenInNewIcon style={{ fontSize: 16 }} />
    </LearnMoreLink>
  );

  return (
    <CardWrapper>
      <CandidateAvatar src={normalizedImagePath(avatarGeneric)} alt={name} />
      <CandidateDetails>
        <IdentityRow className="u-show-desktop-tablet">
          <NameStack>
            <CandidateName to={learnMoreUrl}>{name}</CandidateName>
            <Party>{party}</Party>
          </NameStack>
          <RowDivider />
          {learnMore}
        </IdentityRow>

        <MobileIdentity className="u-show-mobile">
          <CandidateName to={learnMoreUrl}>{name}</CandidateName>
          <MobileMeta>
            <Party>{party}</Party>
            <MobileDivider />
            {learnMore}
          </MobileMeta>
        </MobileIdentity>

        <OfficeDescription>{officeDescription}</OfficeDescription>
      </CandidateDetails>
    </CardWrapper>
  );
}
CandidateInfoCard.propTypes = {
  candidate: PropTypes.shape({
    name: PropTypes.string,
    firstName: PropTypes.string,
    party: PropTypes.string,
    officeDescription: PropTypes.string,
    learnMoreUrl: PropTypes.string,
  }).isRequired,
};

const CandidateAvatar = styled.img`
  border: 2px solid ${DesignTokenColors.neutralUI200};
  border-radius: 50%;
  flex: 0 0 auto;
  height: 72px;
  width: 72px;

  @media (max-width: 575px) {
    height: 52px;
    width: 52px;
  }
`;

const CandidateDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const CandidateName = styled(Link)`
  color: ${DesignTokenColors.primary600};
  font-size: 22px;
  font-weight: 400;
  line-height: 1.15;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 575px) {
    font-size: 20px;
  }
`;

const CardWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 16px;

  @media (max-width: 575px) {
    align-items: flex-start;
    gap: 10px;
  }
`;

const IdentityRow = styled.div`
  align-items: center;
  column-gap: 12px;
  display: flex;
  flex-wrap: wrap;
  row-gap: 4px;
`;

const LearnMoreLink = styled(Link)`
  align-items: center;
  color: ${DesignTokenColors.primary600};
  display: inline-flex;
  font-size: 16px;
  font-weight: 400;
  gap: 4px;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 575px) {
    font-size: 14px;
  }
`;

const MobileDivider = styled.span`
  background: ${DesignTokenColors.neutralUI200};
  flex: 0 0 auto;
  height: 16px;
  width: 1px;
`;

const MobileIdentity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MobileMeta = styled.div`
  align-items: center;
  display: flex;
  gap: 6px;
`;

const NameStack = styled.div`
  display: flex;
  flex-direction: column;
`;

const OfficeDescription = styled.p`
  color: ${DesignTokenColors.neutral600};
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
`;

const Party = styled.span`
  color: ${DesignTokenColors.neutral800};
  font-size: 17px;
  white-space: nowrap;

  @media (max-width: 575px) {
    font-size: 14px;
  }
`;

const RowDivider = styled.span`
  background: ${DesignTokenColors.neutralUI200};
  height: 40px;
  width: 1px;
`;
