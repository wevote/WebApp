import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// Secondary "Follow" action. Keeps its outlined pill shape in both states; when
// following it shows a filled red heart + "Following".
export default function FollowButton ({ following = false, onClick }) {
  return (
    <Button type="button" onClick={onClick} aria-pressed={following} $following={following}>
      {following ? (
        <FavoriteIcon style={{ fontSize: 22, margin: '-3px 0', color: DesignTokenColors.alert600 }} />
      ) : (
        <FavoriteBorderIcon style={{ fontSize: 22, margin: '-3px 0' }} />
      )}
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}
FollowButton.propTypes = {
  following: PropTypes.bool,
  onClick: PropTypes.func,
};

const Button = styled.button`
  align-items: center;
  background: ${({ $following }) => ($following ? DesignTokenColors.primary50 : DesignTokenColors.whiteUI)};
  border: 1.5px solid ${DesignTokenColors.primary600};
  border-radius: 9999px;
  box-sizing: border-box;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  display: inline-flex;
  font-size: 18px;
  font-weight: 400;
  gap: 8px;
  justify-content: center;
  padding: 4px 20px;
  width: 150px;

  &:hover {
    background: ${({ $following }) => ($following ? DesignTokenColors.primary100 : DesignTokenColors.primary50)};
  }
`;
