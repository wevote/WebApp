import PropTypes from 'prop-types';
import withTheme from '@mui/styles/withTheme';
import React, { useState } from 'react';
import styled from 'styled-components';
import { withStyles } from '@mui/styles';
import { DeleteOutlined, EditOutlined, MoreHoriz } from '@mui/icons-material';
import Popover from '@mui/material/Popover';
import DesignTokenColors from '../Style/DesignTokenColors';


const VoterPositionEditTripleDot = ({ triggerDeleteOpinion, triggerEditOpinion }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const onDotButtonClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const triggerDeleteOpinionModeLocal = () => {
    if (triggerDeleteOpinion) {
      triggerDeleteOpinion();
    }
  };

  const triggerEditOpinionModeLocal = () => {
    if (triggerEditOpinion) {
      triggerEditOpinion();
    }
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <PrimaryDetails>
      <EditInviteeTripleDotWrapper>
        <TripleDotButton type="button" aria-label="source" onClick={onDotButtonClick}>
          <MoreHoriz />
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
            <PopoverNameAndMessageText>
              <StyledTypography onClick={triggerEditOpinionModeLocal}>
                <EditOutlined style={{ fontSize: '14px', cursor: 'pointer', marginRight: '4px' }} />
                Edit opinion
              </StyledTypography>
            </PopoverNameAndMessageText>
            <PopoverViewDetailsText>
              <StyledTypography onClick={triggerDeleteOpinionModeLocal}>
                <DeleteOutlined style={{ fontSize: '14px', cursor: 'pointer', marginRight: '4px' }} />
                Delete opinion
              </StyledTypography>
            </PopoverViewDetailsText>
          </PopoverWrapper>
        </Popover>
      </EditInviteeTripleDotWrapper>
    </PrimaryDetails>
  );
};

VoterPositionEditTripleDot.propTypes = {
  triggerDeleteOpinion: PropTypes.func,
  triggerEditOpinion: PropTypes.func,
};

const styles = () => ({
  searchButton: {
    borderRadius: 50,
  },

});

const PrimaryDetails = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditInviteeTripleDotWrapper = styled('div')`
  margin-right: 10px;
  color: ${DesignTokenColors.neutral900};
  :hover {
    color: ${DesignTokenColors.neutral400};
    cursor: pointer;
  }
`;

const PopoverWrapper = styled('div')`
  padding: 5px;
`;

const PopoverNameAndMessageText = styled('div')`
  padding: 6px;
`;

const PopoverViewDetailsText = styled('div')`
  padding: 6px;
  cursor: pointer;
`;

const StyledTypography = styled('div')`
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
`;

const TripleDotButton = styled('button')`
  background: transparent;
  border: 0;
`;

export default withTheme(withStyles(styles)(VoterPositionEditTripleDot));
