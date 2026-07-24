import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import StepNode from './StepNode';

// The "Previous 1—2—3—4 Next" stepper. `activeStep` is 1-indexed; steps before the
// active one render as complete. Connectors sit between the circles.
export default function StepProgressBar ({ steps, activeStep, chosen = false, onPrevious, onNext }) {
  return (
    <ProgressWrapper>
      <NavAction type="button" onClick={onPrevious} disabled={activeStep <= 1} $primary>
        Previous
      </NavAction>

      <StepsTrack>
        {steps.map((step, index) => {
          const isActive = step.stepNumber === activeStep;
          const isComplete = step.stepNumber < activeStep || (isActive && chosen);
          const label = (isComplete && step.labelChosen) ? step.labelChosen : step.label;
          return (
            <React.Fragment key={step.stepNumber}>
              {index > 0 && <Connector $filled={step.stepNumber <= activeStep} />}
              <StepNode
                stepNumber={step.stepNumber}
                label={label}
                active={isActive}
                complete={isComplete}
              />
            </React.Fragment>
          );
        })}
      </StepsTrack>

      <NavAction type="button" onClick={onNext} $primary>
        Next
      </NavAction>
    </ProgressWrapper>
  );
}
StepProgressBar.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    stepNumber: PropTypes.number,
    label: PropTypes.string,
    labelChosen: PropTypes.string,
  })).isRequired,
  activeStep: PropTypes.number,
  chosen: PropTypes.bool,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
};

const Connector = styled.div`
  align-self: flex-start;
  background: ${({ $filled }) => ($filled ? DesignTokenColors.neutral700 : DesignTokenColors.neutralUI200)};
  flex: 1;
  height: 2px;
  margin-top: 17px;
`;

const NavAction = styled.button`
  background: none;
  border: none;
  color: ${({ $primary, disabled }) => {
    if (disabled) return DesignTokenColors.neutral400;
    if ($primary) return DesignTokenColors.primary600;
    return DesignTokenColors.neutral500;
  }};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  font-size: 15px;
  font-weight: ${({ $primary }) => ($primary ? 600 : 400)};
  padding: 8px 0;
  white-space: nowrap;

  /* Mobile shows just the connected circles — no Previous / Next controls */
  @media (max-width: 575px) {
    display: none;
  }
`;

const ProgressWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 40px;
  justify-content: flex-start;
`;

const StepsTrack = styled.div`
  align-items: flex-start;
  display: flex;
  flex: 1;
  justify-content: space-between;
  max-width: 480px;
  /* Reserve room for the absolutely-positioned step labels below the circles */
  padding-bottom: 30px;

  @media (max-width: 575px) {
    padding-bottom: 0;
  }
`;
