import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

export default function SupporterAnalytics () {
  return (
    <Placeholder>
      Analytics (coming soon)
    </Placeholder>
  );
}

const Placeholder = styled.div`
  background: ${DesignTokenColors.neutralUI50};
  border: 1px dashed ${DesignTokenColors.neutralUI300};
  border-radius: 12px;
  color: ${DesignTokenColors.neutralUI600};
  padding: 24px;
`;
