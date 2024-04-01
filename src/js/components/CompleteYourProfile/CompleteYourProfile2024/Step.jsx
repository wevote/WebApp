import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Colors from '../../../common/components/Style/Colors';
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
    flex-direction: column;
    align-items: center;
    width: ${({ width }) => width};
    padding: 0 12px;
    cursor: pointer;

    ${({ completed }) => `
    p {
        color: ${completed ? '#007800' : Colors.primary2024};
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        margin-top: 6px;
    }
`}
`;
export default Step;





