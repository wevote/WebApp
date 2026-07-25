import {
  ContentCopy as CopyIcon, Facebook as FacebookIcon, Link as LinkIcon,
  People as PeopleIcon, QrCode2 as QrIcon, X as XIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

const ICONS = {
  people: PeopleIcon,
  copy: CopyIcon,
  link: LinkIcon,
  qr: QrIcon,
  facebook: FacebookIcon,
  x: XIcon,
};

// A single share affordance: a round icon chip over a label. Default chips are gray;
// `brand` ("facebook" | "x") gives the brand-colored chip.
export default function ShareOptionButton ({ label, icon, brand, onClick }) {
  const IconComponent = ICONS[icon];
  return (
    <OptionButton type="button" onClick={onClick}>
      <IconChip $brand={brand}>
        <IconComponent style={{ fontSize: brand ? 22 : 24 }} />
      </IconChip>
      <Label>{label}</Label>
    </OptionButton>
  );
}
ShareOptionButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  brand: PropTypes.oneOf(['facebook', 'x']),
  onClick: PropTypes.func,
};

function chipBackground ($brand) {
  if ($brand === 'facebook') return '#1877F2';
  if ($brand === 'x') return '#000000';
  return DesignTokenColors.neutralUI500;
}

const IconChip = styled.span`
  align-items: center;
  background: ${({ $brand }) => chipBackground($brand)};
  border-radius: 50%;
  color: ${DesignTokenColors.whiteUI};
  display: flex;
  height: 48px;
  justify-content: center;
  width: 48px;
`;

const Label = styled.span`
  color: ${DesignTokenColors.neutral800};
  font-size: 12px;
  line-height: 1.3;
  text-align: center;

  @media (max-width: 575px) {
    font-size: 11px;
  }
`;

const OptionButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 2px;
`;
