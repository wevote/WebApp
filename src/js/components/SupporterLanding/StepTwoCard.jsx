import { ChatBubbleOutline as ChatBubbleOutlineIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import CommentComposer from './CommentComposer';
import CommentList from './CommentList';
import StepCard from './StepCard';
import StepCardHeader from './StepCardHeader';

// Step 2 card — "Share why you're supporting Jane Dough": header, the compose box, and
// the "What others are saying" comment list. The title shortens on mobile.
export default function StepTwoCard ({ stepTwo, comments }) {
  const title = (
    <>
      <span className="u-show-desktop-tablet">{stepTwo.title}</span>
      <span className="u-show-mobile">{stepTwo.titleMobile}</span>
    </>
  );

  return (
    <StepCard>
      <StepCardHeader
        stepNumber={2}
        titleIcon={<ChatBubbleOutlineIcon style={{ fontSize: 20 }} />}
        title={title}
        why={stepTwo.why}
        fontSize={18}
        mobileFontSize={15}
      />
      <CommentComposer placeholder={stepTwo.placeholder} />
      <CommentList comments={comments} />
    </StepCard>
  );
}
StepTwoCard.propTypes = {
  stepTwo: PropTypes.shape({
    title: PropTypes.string,
    titleMobile: PropTypes.string,
    why: PropTypes.string,
    placeholder: PropTypes.string,
  }).isRequired,
  comments: PropTypes.arrayOf(PropTypes.object),
};
