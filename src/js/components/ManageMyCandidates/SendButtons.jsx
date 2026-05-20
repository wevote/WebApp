import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import styled from 'styled-components';

import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

const sendButtonPropTypes = {
  verb: PropTypes.string,
  count: PropTypes.number,
  onClick: PropTypes.func,
};

function formatLabel (verb, count) {
  return `${verb} (${count})`;
}

export function SendMessageButton ({ verb = 'Send message', count = 0, onClick }) {
  return (
    <SendButton
      variant="contained"
      className="u-show-desktop-tablet"
      disabled={count === 0}
      onClick={onClick}
    >
      {formatLabel(verb, count)}
    </SendButton>
  );
}
SendMessageButton.propTypes = sendButtonPropTypes;

export function SendMessageButtonMobile ({ verb = 'Send message', count = 0, onClick }) {
  return (
    <MobileBottomBar className="u-show-mobile">
      <MobileSendButton
        variant="contained"
        disabled={count === 0}
        onClick={onClick}
      >
        {formatLabel(verb, count)}
      </MobileSendButton>
    </MobileBottomBar>
  );
}
SendMessageButtonMobile.propTypes = sendButtonPropTypes;

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
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.08), 0 -1px 2px rgba(0, 0, 0, 0.1);
`;

const MobileSendButton = styled(Button)`
  && {
    border-radius: 999px;
    font-size: 13px;
    padding: 5px 18px;
    text-transform: none;
  }

  &&.Mui-disabled {
    background: ${DesignTokenColors.neutralUI200};
    color: ${DesignTokenColors.whiteUI};
  }
`;

export const SendButton = styled(Button)`
  && {
    border-radius: 999px;
    margin-left: 12px;
    padding: 4px 14px;
    text-transform: none;
    white-space: nowrap;
  }

  &&.Mui-disabled {
    background: ${DesignTokenColors.neutralUI200};
    color: ${DesignTokenColors.whiteUI};
  }
`;
