import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import CommentItem from './CommentItem';
import SeeMoreCommentsLink from './SeeMoreCommentsLink';

// "WHAT OTHERS ARE SAYING" — the heading, the list of endorsement comments, and the
// "See more comments" link.
export default function CommentList ({ comments }) {
  return (
    <Section>
      <Heading>What others are saying</Heading>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
      <SeeMoreCommentsLink />
    </Section>
  );
}
CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
};

const Heading = styled.h3`
  color: ${DesignTokenColors.neutral600};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin: 0;
  text-transform: uppercase;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
