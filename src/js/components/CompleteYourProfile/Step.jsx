import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Colors from '../../common/components/Style/Colors';
import StepIcon from './StepIcon';

const Step = ({ onClick, step, label, completed, width }) => (
  <HowItWorksStep completed={completed} onClick={onClick} width={width}>
    <StepIcon
       number={step}
       completed={completed}
    />
    <p>{label}</p>
  </HowItWorksStep>
);

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
  align-items: center;  padding: 0 12px;
  padding-top: 18px;
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
export default Step;





