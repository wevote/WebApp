import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Colors from '../../common/components/Style/Colors';
// import DesignTokenColors from '../../common/components/Style/DesignTokenColors';  // 2024-04-16 Upgrade to using this
import StepIcon from './StepIcon';

function Step ({ onClick, step, label, completed, width }) {
  return (
    <HowItWorksStep
    completed={completed}
    id={`step${step}`}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
    role="button"
    tabIndex={0}
    width={width}
    >
      <StepIcon
        number={step}
        completed={completed}
      />
      <StepText
        completed={completed}
      >
        {label}
      </StepText>
    </HowItWorksStep>
  );
}
Step.propTypes = {
  onClick: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  completed: PropTypes.bool,
  width: PropTypes.string,
};

const HowItWorksStep = styled.div`
  display: flex;
  width: 33.33%;
  flex-direction: column;
  align-items: center;
  padding: 18px 12px 0 12px;
  cursor: pointer;
  border-right: 0.5px solid ${Colors.grey};
  border-left: 0.5px solid ${Colors.grey};

  &:hover {
    background-color: ${Colors.ultraLightGrey};
  }

  ${({ completed }) => `
  p {
    color: ${completed ? Colors.green : Colors.primary2024};
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    margin-top: 6px;
  }
`}
`;

const StepText = styled('div')`
  font-size: 16px;
  font-weight: 400;
  margin: 6px 0 6px 0;
  text-align: center;
  ${({ completed }) => `
    color: ${completed ? Colors.green : Colors.primary2024};
  }
`}
`;

export default Step;
