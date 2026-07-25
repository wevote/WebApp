import { Check as CheckIcon } from '@mui/icons-material';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// Green circle with a white check, matching the "STEP N" complete badge. Shared by the
// Choose and Make-support-public buttons.
export default function GreenCheckBadge () {
  return (
    <Badge>
      <CheckIcon style={{ fontSize: 15 }} />
    </Badge>
  );
}

const Badge = styled.span`
  align-items: center;
  background: ${DesignTokenColors.confirmation600};
  border-radius: 50%;
  color: ${DesignTokenColors.whiteUI};
  display: inline-flex;
  height: 20px;
  justify-content: center;
  margin: -2px 0;
  width: 20px;
`;
