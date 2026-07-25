import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ActionCountLabel from './ActionCountLabel';
import ChooseButton from './ChooseButton';
import FollowButton from './FollowButton';

// Mobile-only body for the Step 1 card. Unlike the desktop two-column layout, each
// action is a full-width button with its count beside it and its own explainer text
// below, separated by a horizontal "OR" divider.
export default function StepOneCardMobileBody ({ candidate, chosen, following, chosenCount, followingCount, onChoose, onFollow }) {
  return (
    <MobileBody>
      <ActionRow>
        <ButtonSlot>
          <ChooseButton chosen={chosen} onClick={onChoose} />
        </ButtonSlot>
        <CountSlot><ActionCountLabel count={chosenCount} suffix="have chosen" /></CountSlot>
      </ActionRow>

      {chosen ? (
        <ThanksText>
          Thanks for choosing
          {' '}
          {candidate.firstName}
          {' '}
          on your WeVote ballot. Choosing a candidate also follows them.
        </ThanksText>
      ) : (
        <ExplainerText>
          Choosing marks
          {' '}
          {candidate.firstName}
          {' '}
          on your WeVote digital ballot for the most impact.
        </ExplainerText>
      )}

      {!chosen && (
        <OrRow>
          <OrLine />
          <OrText>OR</OrText>
          <OrLine />
        </OrRow>
      )}

      <ActionRow>
        <ButtonSlot>
          <FollowButton following={following} onClick={onFollow} />
        </ButtonSlot>
        <CountSlot><ActionCountLabel count={followingCount} suffix="are following" /></CountSlot>
      </ActionRow>

      {!chosen && (
        <ExplainerText>
          <strong>Not ready to choose?</strong>
          {' '}
          Following
          {' '}
          {candidate.firstName}
          {' '}
          helps build public trust and lets WeVote suggest similar candidates and measures
          to help you complete your ballot.
          {' '}
          <InlineLink type="button">Learn more</InlineLink>
        </ExplainerText>
      )}
    </MobileBody>
  );
}
StepOneCardMobileBody.propTypes = {
  candidate: PropTypes.shape({
    firstName: PropTypes.string,
  }).isRequired,
  chosen: PropTypes.bool,
  following: PropTypes.bool,
  chosenCount: PropTypes.number,
  followingCount: PropTypes.number,
  onChoose: PropTypes.func,
  onFollow: PropTypes.func,
};

const ActionRow = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
`;

// Makes the wrapped Choose / Follow button stretch to fill the row.
const ButtonSlot = styled.div`
  flex: 1;
  min-width: 0;

  & > button {
    width: 100%;
  }
`;

// Fixed count width so both buttons end up the same width (and same centre).
const CountSlot = styled.div`
  flex: 0 0 128px;
  width: 128px;
`;

const ExplainerText = styled.p`
  color: ${DesignTokenColors.neutral700};
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
`;

const InlineLink = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  font-size: 15px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const MobileBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const OrLine = styled.span`
  background: ${DesignTokenColors.neutralUI200};
  flex: 1;
  height: 1px;
`;

// Spans exactly the button width (row minus the count column + gap), so "OR" centres
// on the buttons rather than on the full row.
const OrRow = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
  margin-right: 140px;
`;

const OrText = styled.span`
  color: ${DesignTokenColors.neutral500};
  font-size: 15px;
  font-weight: 400;
`;

const ThanksText = styled.p`
  color: ${DesignTokenColors.neutral700};
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
`;
