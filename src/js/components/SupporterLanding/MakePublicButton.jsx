import { Public as PublicIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import GreenCheckBadge from './GreenCheckBadge';

// "Make support public" action. Mirrors ChooseButton: a filled blue pill that toggles to
// a lighter blue "made public" pill with a green check once support is public.
export default function MakePublicButton ({ isPublic = false, label, labelPublic, onClick }) {
  return (
    <Button type="button" onClick={onClick} $public={isPublic} aria-pressed={isPublic}>
      {isPublic ? (
        <GreenCheckBadge />
      ) : (
        <PublicIcon style={{ fontSize: 20, margin: '-2px 0' }} />
      )}
      {isPublic ? labelPublic : label}
    </Button>
  );
}
MakePublicButton.propTypes = {
  isPublic: PropTypes.bool,
  label: PropTypes.string,
  labelPublic: PropTypes.string,
  onClick: PropTypes.func,
};

const Button = styled.button`
  align-items: center;
  background: ${({ $public }) => ($public ? DesignTokenColors.primary400 : DesignTokenColors.primary600)};
  border: 1.5px solid ${({ $public }) => ($public ? DesignTokenColors.primary400 : DesignTokenColors.primary600)};
  border-radius: 9999px;
  box-sizing: border-box;
  color: ${DesignTokenColors.whiteUI};
  cursor: pointer;
  display: inline-flex;
  font-size: 18px;
  font-weight: 400;
  gap: 8px;
  justify-content: center;
  padding: 6px 22px;

  &:hover {
    background: ${({ $public }) => ($public ? DesignTokenColors.primary400 : DesignTokenColors.primary700)};
    border-color: ${({ $public }) => ($public ? DesignTokenColors.primary400 : DesignTokenColors.primary700)};
  }
`;
