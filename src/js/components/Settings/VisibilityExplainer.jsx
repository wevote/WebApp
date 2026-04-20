import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';


function VisibilityExplainer ({ fontSize }) {
  const size = fontSize || 13;

  return (
    <ExplainerList fontSize={size}>
      <li>
        <strong>Public (recommended):</strong>
        {' '}
        Expand your reach and influence beyond just your friends.
      </li>
      <li>
        <strong>Your WeVote friends:</strong>
        {' '}
        People on the platform you&apos;ve added as friends&mdash;so you can see and share opinions more easily.
      </li>
      <li>
        <strong>Private:</strong>
        {' '}
        Ideal for personal reflection or when you&apos;re not ready to share publicly.
      </li>
    </ExplainerList>
  );
}

VisibilityExplainer.propTypes = {
  fontSize: PropTypes.number,
};

const ExplainerList = styled('ul')`
  color: ${DesignTokenColors.neutralUI500};
  font-size: ${(props) => props.fontSize}px;
  line-height: 1.5;
  margin: 4px 0;
  padding-left: 20px;

  li {
    margin-bottom: 4px;
  }

  strong {
    color: ${DesignTokenColors.neutralUI900};
  }
`;

export default VisibilityExplainer;
