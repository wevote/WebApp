import { DriveFileRenameOutline as PencilIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// "Help me write" AI-assist link shown under the comment input.
export default function HelpMeWriteButton ({ onClick }) {
  return (
    <Button type="button" onClick={onClick}>
      <PencilIcon style={{ fontSize: 18 }} />
      Help me write
    </Button>
  );
}
HelpMeWriteButton.propTypes = {
  onClick: PropTypes.func,
};

const Button = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  font-weight: 600;
  gap: 6px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;
