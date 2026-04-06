import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import { ContentCopy, LaunchOutlined, MoreHoriz, MoreVert } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { openSnackbar } from '../../common/components/Widgets/SnackNotifier';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import webAppConfig from '../../config';

function OfficeHeaderTripleDotMenu ({ makeVertical = false, officeWeVoteId = '' }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [copyLinkText, setCopyLinkText] = useState('Copy ballot section page link');
  const [officeUrl, setOfficeUrl] = useState('');
  const copyLinkTimeoutRef = useRef(null);
  const open = Boolean(anchorEl);
  const id = open ? 'triple-dot-popover' : undefined;

  useEffect(() => () => {
    // Clear timeout when component unmounts
    if (copyLinkTimeoutRef.current) {
      clearTimeout(copyLinkTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    const officeUrlTemp = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/office/${officeWeVoteId}`;
    setOfficeUrl(officeUrlTemp);
  }, [officeWeVoteId]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleOpenNewTab = () => {
    window.open(officeUrl, '_blank');
    handlePopoverClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(officeUrl).then(() => {
      openSnackbar({ message: 'Link copied!', severity: 'success' });
      setCopyLinkText('Copied!');
      copyLinkTimeoutRef.current = setTimeout(() => {
        setCopyLinkText('Copy office page link');
      }, 3000);
    })
      .catch((err) => {
        console.error('Failed to copy link:', err);
        openSnackbar({ message: 'Failed to copy link', severity: 'error' });
        handlePopoverClose();
      });
  };

  if (!officeWeVoteId) {
    return null;
  }
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
}

OfficeHeaderTripleDotMenu.propTypes = {
  makeVertical: PropTypes.bool,
  officeWeVoteId: PropTypes.string,
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

export default OfficeHeaderTripleDotMenu;
