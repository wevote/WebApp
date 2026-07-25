import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import CommentReactions from './CommentReactions';

const avatarGeneric = '../../../img/global/svg-icons/avatar-generic.svg';

// A single endorsement comment: avatar, author + reactions, the text, and a meta line
// with an overflow (•••) menu button.
export default function CommentItem ({ comment }) {
  const { authorName, likeCount, text, meta } = comment;
  return (
    <Item>
      <CommentAvatar src={normalizedImagePath(avatarGeneric)} alt={authorName} />
      <CommentBody>
        <TopRow>
          <AuthorName>{authorName}</AuthorName>
          <CommentReactions likeCount={likeCount} />
        </TopRow>
        <CommentText>{text}</CommentText>
        <MetaRow>
          <CommentMeta>{meta}</CommentMeta>
          <MoreButton type="button" aria-label="More options">
            <MoreHorizIcon style={{ fontSize: 20 }} />
          </MoreButton>
        </MetaRow>
      </CommentBody>
    </Item>
  );
}
CommentItem.propTypes = {
  comment: PropTypes.shape({
    authorName: PropTypes.string,
    likeCount: PropTypes.number,
    text: PropTypes.string,
    meta: PropTypes.string,
  }).isRequired,
};

const AuthorName = styled.span`
  color: ${DesignTokenColors.neutral900};
  font-size: 16px;
  font-weight: 700;

  @media (max-width: 575px) {
    font-size: 14px;
  }
`;

const CommentAvatar = styled.img`
  background: ${DesignTokenColors.neutralUI100};
  border-radius: 50%;
  flex: 0 0 auto;
  height: 44px;
  width: 44px;

  @media (max-width: 575px) {
    height: 36px;
    width: 36px;
  }
`;

const CommentBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const CommentMeta = styled.span`
  color: ${DesignTokenColors.neutral500};
  font-size: 13px;

  /* Keep the meta line + ••• menu on a single row on phones */
  @media (max-width: 575px) {
    font-size: 12px;
    white-space: nowrap;
  }
`;

const CommentText = styled.p`
  color: ${DesignTokenColors.neutral800};
  font-size: 15px;
  line-height: 1.5;
  margin: 0;

  @media (max-width: 575px) {
    font-size: 14px;
  }
`;

const Item = styled.div`
  display: flex;
  gap: 14px;
`;

const MetaRow = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
`;

const MoreButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${DesignTokenColors.neutral500};
  cursor: pointer;
  display: inline-flex;
  padding: 0;

  &:hover {
    color: ${DesignTokenColors.neutral800};
  }
`;

const TopRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
