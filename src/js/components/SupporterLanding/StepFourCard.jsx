import { GroupAdd as GroupAddIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import { useReward } from 'react-rewards';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import PreviewEditInvitationLink from './PreviewEditInvitationLink';
import ShareOptionsGrid from './ShareOptionsGrid';
import StepCard from './StepCard';
import StepCardHeader from './StepCardHeader';
import { CONFETTI_COLORS } from './supporterLandingConstants';

const CONFETTI_OPTIONS = {
  elementCount: 90,
  spread: 120,
  elementSize: 8,
  zIndex: 10,
  colors: CONFETTI_COLORS,
  startVelocity: 26,
  decay: 0.9,
};

// Step 4 card — "Spread the word about Jane Dough". Clicking any share option (all no-ops
// for now) fires the confetti and marks the flow complete ("Word spread!"). `completed`
// is owned by the page so the stepper + the thank-you section below stay in sync.
export default function StepFourCard ({ stepFour, groups, completed, onComplete }) {
  const { reward: triggerConfetti } = useReward('spreadWordConfettiReward', 'confetti', CONFETTI_OPTIONS);

  const handleShare = () => {
    triggerConfetti();
    if (onComplete) onComplete();
  };

  return (
    <StepCard $gap={18} id="spreadWordConfettiReward">
      <StepCardHeader
        stepNumber={4}
        kickerSuffix={stepFour.kickerSuffix}
        titleIcon={<GroupAddIcon style={{ fontSize: 22 }} />}
        title={completed ? stepFour.titleComplete : stepFour.title}
        why={stepFour.why}
        chosen={completed}
        fontSize={18}
        reasonGap={24}
      />

      <InviteRow>
        <BodyText>{stepFour.body}</BodyText>
        <RowDivider />
        <PreviewEditInvitationLink label={stepFour.previewEditLabel} />
      </InviteRow>

      <ShareOptionsGrid groups={groups} onShare={handleShare} />
    </StepCard>
  );
}
StepFourCard.propTypes = {
  stepFour: PropTypes.shape({
    kickerSuffix: PropTypes.string,
    title: PropTypes.string,
    titleComplete: PropTypes.string,
    why: PropTypes.string,
    body: PropTypes.string,
    previewEditLabel: PropTypes.string,
  }).isRequired,
  groups: PropTypes.arrayOf(PropTypes.object),
  completed: PropTypes.bool,
  onComplete: PropTypes.func,
};

const BodyText = styled.span`
  color: ${DesignTokenColors.neutral700};
  font-size: 14px;
  line-height: 1.5;
`;

const InviteRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  /* Tighten the space below the header (WHY? / Multiplies your impact) */
  margin-top: -8px;
`;

const RowDivider = styled.span`
  background: ${DesignTokenColors.neutralUI300};
  height: 20px;
  width: 1px;

  @media (max-width: 575px) {
    display: none;
  }
`;
