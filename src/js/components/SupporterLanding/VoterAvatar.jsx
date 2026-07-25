import { Edit as EditIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// The purple "voter" avatar with initials and an edit-pencil badge. Sized via the `size`
// prop so it can serve the sidebar, mobile header, and comment composer.
export default function VoterAvatar ({ initials = 'D', size = 40 }) {
  return (
    <AvatarButton type="button" aria-label="Add your profile picture" $size={size}>
      <Initials $size={size}>{initials}</Initials>
      <EditBadge $size={size}>
        <EditIcon style={{ fontSize: Math.round(size * 0.32) }} />
      </EditBadge>
    </AvatarButton>
  );
}
VoterAvatar.propTypes = {
  initials: PropTypes.string,
  size: PropTypes.number,
};

const AvatarButton = styled.button`
  align-items: center;
  background: #8E2DA8;
  border: none;
  border-radius: 50%;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex: 0 0 auto;
  height: ${({ $size }) => $size}px;
  justify-content: center;
  position: relative;
  width: ${({ $size }) => $size}px;
`;

const EditBadge = styled.span`
  align-items: center;
  background: ${DesignTokenColors.info500};
  border: 2px solid ${DesignTokenColors.whiteUI};
  border-radius: 50%;
  bottom: -2px;
  color: ${DesignTokenColors.whiteUI};
  display: flex;
  height: ${({ $size }) => Math.round($size * 0.5)}px;
  justify-content: center;
  position: absolute;
  right: -2px;
  width: ${({ $size }) => Math.round($size * 0.5)}px;
`;

const Initials = styled.span`
  color: ${DesignTokenColors.whiteUI};
  font-size: ${({ $size }) => Math.round($size * 0.4)}px;
`;
