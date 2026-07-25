import { Check as CheckIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import GreenCheckBadge from './GreenCheckBadge';

// Primary "Choose" action. Toggles to a "Chosen" pill (lighter blue + a green badge
// with a white check) once the voter has chosen this candidate.
export default function ChooseButton ({ chosen = false, onClick }) {
  return (
    <Button type="button" onClick={onClick} $chosen={chosen} aria-pressed={chosen}>
      {chosen ? (
        <GreenCheckBadge />
      ) : (
        <CheckIcon style={{ fontSize: 22, margin: '-3px 0' }} />
      )}
      {chosen ? 'Chosen' : 'Choose'}
    </Button>
  );
}
ChooseButton.propTypes = {
  chosen: PropTypes.bool,
  onClick: PropTypes.func,
};

const Button = styled.button`
  align-items: center;
  background: ${({ $chosen }) => ($chosen ? DesignTokenColors.primary400 : DesignTokenColors.primary600)};
  border: 1.5px solid ${({ $chosen }) => ($chosen ? DesignTokenColors.primary400 : DesignTokenColors.primary600)};
  border-radius: 9999px;
  box-sizing: border-box;
  color: ${DesignTokenColors.whiteUI};
  cursor: pointer;
  display: inline-flex;
  font-size: 18px;
  font-weight: 400;
  gap: 8px;
  justify-content: center;
  padding: 4px 20px;
  width: 150px;

  &:hover {
    background: ${({ $chosen }) => ($chosen ? DesignTokenColors.primary400 : DesignTokenColors.primary700)};
    border-color: ${({ $chosen }) => ($chosen ? DesignTokenColors.primary400 : DesignTokenColors.primary700)};
  }
`;
