import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// "See more comments" link at the bottom of the comment list.
export default function SeeMoreCommentsLink ({ onClick }) {
  return (
    <SeeMoreButton type="button" onClick={onClick}>See more comments</SeeMoreButton>
  );
}
SeeMoreCommentsLink.propTypes = {
  onClick: PropTypes.func,
};

// Indented to line up with the comment text (past the 44px avatar + 14px gap), a touch
// lighter than the link blue, and one weight step above the "Endorsed ..." meta line.
const SeeMoreButton = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  color: ${DesignTokenColors.primary500};
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-left: 58px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 575px) {
    margin-left: 50px;
  }
`;
