import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import { ContentCopy, LaunchOutlined, MoreHoriz, MoreVert } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { openSnackbar } from '../../common/components/Widgets/SnackNotifier';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';

const TripleDotMenu = ({ makeVertical = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [copyLinkText, setCopyLinkText] = useState('Copy ballot section page link');
  const copyLinkTimeoutRef = useRef(null);
  const open = Boolean(anchorEl);
  const id = open ? 'triple-dot-popover' : undefined;

  useEffect(() => () => {
    if (copyLinkTimeoutRef.current) {
      clearTimeout(copyLinkTimeoutRef.current);
    }
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
    handlePopoverClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      openSnackbar({ message: 'Link copied!', severity: 'success' });
      setCopyLinkText('Copied!');
      copyLinkTimeoutRef.current = setTimeout(() => {
        setCopyLinkText('Copy ballot section page link');
      }, 3000);
    })
      .catch((err) => {
        console.error('Failed to copy link:', err);
        openSnackbar({ message: 'Failed to copy link', severity: 'error' });
        handlePopoverClose();
      });
  };

  return (
    <TripleDotWrapper>
      <TripleDotButton
        type="button"
        aria-label="more options"
        onClick={handleMenuClick}
      >
        {makeVertical ? <MoreVert /> : <MoreHoriz />}
      </TripleDotButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <PopoverWrapper>
          <PopoverOption onClick={handleOpenNewTab}>
            <LaunchOutlined style={{ fontSize: '14px', cursor: 'pointer', marginRight: '4px' }} />
            View this ballot section in new tab
          </PopoverOption>
          <PopoverOption onClick={handleCopyLink}>
            <ContentCopy style={{ fontSize: '14px', cursor: 'pointer', marginRight: '4px' }} />
            {copyLinkText}
          </PopoverOption>
        </PopoverWrapper>
      </Popover>
    </TripleDotWrapper>
  );
};

TripleDotMenu.propTypes = {
  makeVertical: PropTypes.bool,
};

// Styled Components

const TripleDotWrapper = styled.div`
  color: ${DesignTokenColors.neutral600};
  display: flex;
  align-items: center;
  ${isMobileScreenSize() ? 'margin-top: 5px' : ''};

  &:hover {
    color: ${DesignTokenColors.neutral400};
    cursor: pointer;
  }
`;

const TripleDotButton = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  color: inherit;
  outline: none;

  &:focus {
    outline: none;
  }

  svg {
    font-size: 20px;
  }
`;

const PopoverWrapper = styled.div`
  padding: 8px 0;
  min-width: 220px;
`;

const PopoverOption = styled.div`
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  color: ${DesignTokenColors.neutral900};
  white-space: nowrap;

  &:hover {
    background: ${DesignTokenColors.neutral100};
  }
`;

export default TripleDotMenu;
