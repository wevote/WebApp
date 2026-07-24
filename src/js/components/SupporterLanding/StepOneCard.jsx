import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ChooseExplainerColumns from './ChooseExplainerColumns';
import ChooseFollowActions from './ChooseFollowActions';
import StepCard from './StepCard';
import StepCardHeader from './StepCardHeader';
import StepOneCardMobileBody from './StepOneCardMobileBody';

// The large gray Step 1 card. The header is shared; the body has a desktop/tablet
// layout (side-by-side actions + two-column explainer) and a distinct mobile layout
// (stacked full-width actions with interleaved explainer text).
export default function StepOneCard ({ candidate, chosen, following, chosenCount, followingCount, onChoose, onFollow }) {
  // Choosing implies following; either one marks Step 1 complete (green check).
  const complete = chosen || following;
  let title;
  if (chosen) {
    title = 'Chosen & following!';
  } else if (following) {
    title = 'Following!';
  } else {
    title = (
      <>
        {`Choose ${candidate.name} `}
        <OrFollow>(or follow)</OrFollow>
      </>
    );
  }

  return (
    <StepCard $mobileGap={8}>
      <StepCardHeader stepNumber={1} title={title} why="Builds trust" chosen={complete} />

      <DesktopBody className="u-show-desktop-tablet">
        <ChooseFollowActions
          chosen={chosen}
          following={complete}
          chosenCount={chosenCount}
          followingCount={followingCount}
          onChoose={onChoose}
          onFollow={onFollow}
        />

        {chosen ? (
          <ThanksText>
            Thanks for choosing
            {' '}
            {candidate.firstName}
            {' '}
            on your WeVote ballot.
            <br />
            Choosing a candidate also follows them.
          </ThanksText>
        ) : (
          <ChooseExplainerColumns candidateFirstName={candidate.firstName} />
        )}
      </DesktopBody>

      <MobileBodyWrapper className="u-show-mobile">
        <StepOneCardMobileBody
          candidate={candidate}
          chosen={chosen}
          following={complete}
          chosenCount={chosenCount}
          followingCount={followingCount}
          onChoose={onChoose}
          onFollow={onFollow}
        />
      </MobileBodyWrapper>
    </StepCard>
  );
}
StepOneCard.propTypes = {
  candidate: PropTypes.shape({
    name: PropTypes.string,
    firstName: PropTypes.string,
  }).isRequired,
  chosen: PropTypes.bool,
  following: PropTypes.bool,
  chosenCount: PropTypes.number,
  followingCount: PropTypes.number,
  onChoose: PropTypes.func,
  onFollow: PropTypes.func,
};

const DesktopBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MobileBodyWrapper = styled.div`
  display: block;
`;

const OrFollow = styled.span`
  font-weight: 400;
`;

const ThanksText = styled.p`
  color: ${DesignTokenColors.neutral700};
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
`;
