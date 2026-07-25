import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// Small muted count shown under an action button, e.g. "143 have chosen".
export default function ActionCountLabel ({ count, suffix }) {
  return (
    <CountText>
      {count.toLocaleString()}
      {' '}
      {suffix}
    </CountText>
  );
}
ActionCountLabel.propTypes = {
  count: PropTypes.number.isRequired,
  suffix: PropTypes.string.isRequired,
};

const CountText = styled.span`
  color: ${DesignTokenColors.neutral600};
  font-size: 14px;
  font-weight: 400;
`;
