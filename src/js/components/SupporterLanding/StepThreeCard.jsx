import { Public as PublicIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useReward } from 'react-rewards';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import MakePublicButton from './MakePublicButton';
import NameEntryForm from './NameEntryForm';
import StepCard from './StepCard';
import StepCardHeader from './StepCardHeader';
import { CONFETTI_COLORS } from './supporterLandingConstants';
import VisibilityCollapse from './VisibilityCollapse';

const CONFETTI_OPTIONS = {
  elementCount: 60,
  spread: 90,
  elementSize: 8,
  zIndex: 10,
  colors: CONFETTI_COLORS,
  startVelocity: 22,
  decay: 0.9,
  angle: 90,
};

// Step 3 card — "Make your support public". States: default, name-entry form (when the
// voter has no name), name-error (public attempted without a name), and made-public.
// `isPublic` is owned by the page so the stepper and this card can't disagree.
export default function StepThreeCard ({ stepThree, voterHasName, isPublic, onMadePublic }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showError, setShowError] = useState(false);

  const needsName = !voterHasName && !isPublic;

  // Confetti burst from the button when support is made public (matches the YourRank pattern).
  const { reward: triggerConfetti } = useReward('makePublicConfettiReward', 'confetti', CONFETTI_OPTIONS);

  const handleMakePublic = () => {
    if (needsName && !firstName.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    triggerConfetti();
    if (onMadePublic) onMadePublic();
  };

  return (
    <StepCard $gap={16} $mobileGap={14}>
      <StepCardHeader
        stepNumber={3}
        titleIcon={<PublicIcon style={{ fontSize: 20 }} />}
        title={isPublic ? stepThree.titlePublic : stepThree.title}
        why={stepThree.why}
        chosen={isPublic}
      />

      <BodyText>{stepThree.body}</BodyText>

      {needsName && (
        <NameEntryForm
          heading={stepThree.nameHeading}
          text={stepThree.nameText}
          firstName={firstName}
          lastName={lastName}
          onChangeFirst={(e) => setFirstName(e.target.value)}
          onChangeLast={(e) => setLastName(e.target.value)}
          firstNamePlaceholder={stepThree.firstNamePlaceholder}
          lastNamePlaceholder={stepThree.lastNamePlaceholder}
          showError={showError}
          errorText={stepThree.nameError}
        />
      )}

      <ButtonRow>
        {/* id anchors the confetti burst origin */}
        <span id="makePublicConfettiReward">
          <MakePublicButton
            isPublic={isPublic}
            label={stepThree.buttonLabel}
            labelPublic={stepThree.buttonLabelPublic}
            onClick={handleMakePublic}
          />
        </span>
      </ButtonRow>

      <VisibilityCollapse label={stepThree.visibilityLabel} />
    </StepCard>
  );
}
StepThreeCard.propTypes = {
  stepThree: PropTypes.shape({
    title: PropTypes.string,
    titlePublic: PropTypes.string,
    why: PropTypes.string,
    body: PropTypes.string,
    buttonLabel: PropTypes.string,
    buttonLabelPublic: PropTypes.string,
    nameHeading: PropTypes.string,
    nameText: PropTypes.string,
    nameError: PropTypes.string,
    firstNamePlaceholder: PropTypes.string,
    lastNamePlaceholder: PropTypes.string,
    visibilityLabel: PropTypes.string,
  }).isRequired,
  voterHasName: PropTypes.bool,
  isPublic: PropTypes.bool,
  onMadePublic: PropTypes.func,
};

const BodyText = styled.p`
  color: ${DesignTokenColors.neutral700};
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
`;

const ButtonRow = styled.div`
  align-items: flex-start;
  display: flex;
`;

