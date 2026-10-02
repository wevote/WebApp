import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// "I'll decide later - Go to Step N" footer link below a step card. The prompt and link
// label vary per step.
export default function DecideLaterFooter ({ prompt, linkText, onGoToNextStep }) {
  return (
    <DecideLaterFooterWrapper>
      {prompt}
      {' - '}
      <GoLink type="button" onClick={onGoToNextStep}>{linkText}</GoLink>
    </DecideLaterFooterWrapper>
  );
}
DecideLaterFooter.propTypes = {
  prompt: PropTypes.string,
  linkText: PropTypes.string,
  onGoToNextStep: PropTypes.func,
};
DecideLaterFooter.defaultProps = {
  prompt: 'I’ll decide later',
  linkText: 'Go to Step 2',
};

const DecideLaterFooterWrapper = styled.div`
  color: ${DesignTokenColors.neutral800};
  font-size: 18px;
  padding: 8px 0;
  text-align: center;
`;

const GoLink = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary500};
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;
