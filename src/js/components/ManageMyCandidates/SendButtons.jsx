import React from 'react';
import Button from '@mui/material/Button';
import styled from 'styled-components';

import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

export function SendMessageButton({ disbaleBoolean, sendMessageFunction, buttonText = '' }) {
  return (
    <SendButton
      variant="contained"
      className="u-show-desktop-tablet"
      disabled={disbaleBoolean}
      onClick={sendMessageFunction}
    >
      {buttonText}
    </SendButton>
  );
}

export function SendMessageButtonMobile({ disbaleBoolean, sendThankYouFunction, buttonText = '' }) {
  return (
    <MobileBottomBar className="u-show-mobile">
      <MobileSendButton
        variant="contained"
        disabled={disbaleBoolean}
        onClick={sendThankYouFunction}
      >
        {buttonText}
      </MobileSendButton>
    </MobileBottomBar>
  );
}

export const SendButton = styled(Button)`
  && {
    margin-left: 12px;
    text-transform: none;
    border-radius: 999px;
  }
`;

const MobileBottomBar = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1300; /* above most UI */
  padding: 10px 12px;
  padding-bottom: calc(72px + env(safe-area-inset-bottom));
  background: ${DesignTokenColors.whiteUI};
  border-top: 1px solid #e5e7eb;
`;

const MobileSendButton = styled(Button)`
  && {
    border-radius: 999px;
    text-transform: none;
  }
`;
