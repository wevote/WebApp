import { Edit as EditIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// "Preview/Edit invitation" pencil link shown beside the invite text.
export default function PreviewEditInvitationLink ({ label, onClick }) {
  return (
    <LinkButton type="button" onClick={onClick}>
      <EditIcon style={{ fontSize: 16 }} />
      {label}
    </LinkButton>
  );
}
PreviewEditInvitationLink.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
};

const LinkButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 600;
  gap: 6px;
  padding: 0;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;
