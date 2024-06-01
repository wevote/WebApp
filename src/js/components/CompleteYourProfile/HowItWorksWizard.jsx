import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Colors from '../../common/components/Style/Colors';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import HowItWorksStep from './Step';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

const crossIcon = normalizedImagePath('../../../img/global/icons/cross.svg');


const HowItWorksWizard = ({ steps, activeStep }) => {
  const [showHowItWorksWizard, setShowHowItWorksWizard] = useState(true);

  const hideHowItWorksWizard = () => {
    setShowHowItWorksWizard(false);
  };

  return showHowItWorksWizard && (
    <HowItWorksContainer>
      <HowItWorksHeader>
        <p>
          <span className="u-show-mobile">
            Turn your values into voting decisions!
          </span>
          <span className="u-show-desktop-tablet">
            See how to turn your values into voting decisions!
          </span>
        </p>
        <HowItWorksCrossIconContainer onClick={hideHowItWorksWizard}>
          <img src={crossIcon} alt="Close" style={{ filter: 'brightness(1.9)' }} />
        </HowItWorksCrossIconContainer>
      </HowItWorksHeader>

      <HowItWorksStepsContainer>
        {steps.map((step) => (
          <HowItWorksStep
            label={step.title}
            step={step.id}
            completed={step.completed}
            active={step.id === activeStep}
            key={`completeYourProfileIndicator-${step.id}`}
            id={`completeYourProfileIndicator-${step.id}`}
            onClick={() => { step.onClick(); }}
            width={step.width}
          />
        ))}
      </HowItWorksStepsContainer>
    </HowItWorksContainer>
  );
};

HowItWorksWizard.propTypes = {
  steps: PropTypes.array,
  activeStep: PropTypes.number,
};

const HowItWorksContainer = styled('div')`
  font-family: 'Open Sans', sans-serif;
  border-radius: 10px;
  border: 1px solid ${Colors.grey};
  background: ${DesignTokenColors.primary50};
  margin-bottom: 22px;
  overflow: hidden;
`;

const HowItWorksHeader = styled('div')`
  min-height: 33px;
  background: ${Colors.primary2024};
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    color: ${Colors.white};
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    margin: 0;
    padding-left: 16px;
  }
`;

const HowItWorksCrossIconContainer = styled('div')`
  padding-right: 8px;
  cursor: pointer;
`;

const HowItWorksStepsContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

export default HowItWorksWizard;
