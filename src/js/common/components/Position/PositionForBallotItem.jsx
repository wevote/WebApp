import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled, { withTheme } from 'styled-components';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ThumbDownOffAltRoundedIcon from '@mui/icons-material/ThumbDownOffAltRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Popover from '@mui/material/Popover';
import { Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import HeartFavoriteToggleBase from '../Widgets/HeartFavoriteToggle/HeartFavoriteToggleBase';

function PositionForBallotItem ({ classes }) {
  const [anchorEl, setAnchorEL] = useState(null);

  const voter = {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvVfSCpfKXUaZB8s159zxg1HFNApJU2ra_vg&s',
    name: 'Bobbi Odessa',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  };

  const voterEndorsed = true;

  const onDotButtonClick = (e) => {
    setAnchorEL(e.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEL(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <PositionForBallotItemWrapper>
      <VoterImageWrapper>
        <VoterImage src={voter.image} />
      </VoterImageWrapper>
      <VoterInfoWrapper>
        <VoterInfoNameFavoritesWrapper>
          <VoterName>{voter.name}</VoterName>
          <HeartFavoriteToggleBaseWrapper>
            <HeartFavoriteToggleBase />
          </HeartFavoriteToggleBaseWrapper>
        </VoterInfoNameFavoritesWrapper>
        <VoterInfoBioWrapper>
          <VoterInfoBio>{voter.bio}</VoterInfoBio>
        </VoterInfoBioWrapper>
        <VoterPositionLikesSourceWrapper>
          <VoterPositionWrapper>
            {voterEndorsed ? (
              <VoterPosition>
                <CheckOutlinedIcon style={{ color: 'rgba(61, 61, 61, 1)' }} />
                <PositionText>Endorsed a month ago</PositionText>
              </VoterPosition>
            ) : (
              <VoterPosition>
                <BlockOutlinedIcon style={{ color: 'rgba(61, 61, 61, 1)' }} />
                <PositionText>Opposed a month ago</PositionText>
              </VoterPosition>
            )}
          </VoterPositionWrapper>
          <VoterLikesSourceWrapper>
            <VoterLikes>
              <VoterLikesThumbsUpContainer type="button" aria-label="Source">
                <ThumbDownOffAltRoundedIcon style={{ fontSize: '21px', color: 'rgba(154, 154, 154, 1)', marginRight: '10px', transform: 'rotate(180deg)' }} />
              </VoterLikesThumbsUpContainer>
              <h3 style={{ marginTop: '7px' }}>7</h3>
              <LikeDislikeSeperator>&nbsp;</LikeDislikeSeperator>
              <button type="button" aria-label="Dislike" style={{ background: 'transparent', border: 'none' }}>
                <ThumbDownOffAltRoundedIcon style={{ fontSize: '21px', color: 'rgba(154, 154, 154, 1)', marginLeft: '10px' }} />
              </button>
              <button type="button" aria-label="Source" style={{ background: !anchorEl ? 'transparent' : 'rgba(210, 210, 210, 1)', width: '34px', height: '34px', border: 'none', borderRadius: '30px', marginLeft: '10px' }} onClick={onDotButtonClick}>
                <MoreHorizIcon style={{ color: 'rgba(132, 132, 132, 1)', fontSize: '30px', marginLeft: '-4px', marginTop: '-.5px' }} />
              </button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                // anchorOrigin={{
                //   vertical: 'top',
                //   horizontal: 'left',
                // }}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 75, left: 370 }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                classes={{ root: classes.popoverRoot }}
                // sx={{
                //   '& .MuiPopover-paper': {
                //     borderRadius: 2,
                //     border: '1px solid rgba(210, 210, 210, 1)',
                //     marginTop: '3px',
                //   },
                // }}
              >
                <Typography sx={{ p: 1 }}>
                  <OpinionSource target="_blank">View source of opinion</OpinionSource>
                </Typography>
              </Popover>
            </VoterLikes>
          </VoterLikesSourceWrapper>
        </VoterPositionLikesSourceWrapper>
      </VoterInfoWrapper>
    </PositionForBallotItemWrapper>
  );
}

PositionForBallotItem.propTypes = {
  classes: PropTypes.object,
};

const PositionForBallotItemWrapper = styled('div')`
  display: flex;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(210, 210, 210, 1);
  }
`;

const VoterImageWrapper = styled('div')`
`;

const VoterImage = styled('img')`
  width: 43px;
  height: 43px;
  border-radius: 43px;
`;

const VoterInfoWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  width: 500px;
  margin-left: 15px;
`;

const VoterInfoNameFavoritesWrapper = styled('div')`
  display: flex;
  align-items: center;
`;

const HeartFavoriteToggleBaseWrapper = styled('div')`
  margin-top: -5px;
  margin-left: 5px;
`;

const VoterName = styled('h3')`
  font: Nunito;
  color: var(--NeutralUI-900, rgba(61, 61, 61, 1));
`;

const VoterInfoBioWrapper = styled('div')`
  max-width: 415px;
`;

const VoterInfoBio = styled('p')`
  color: var(Neutral/900, rgba(42, 42, 44, 1));
`;

const VoterPositionLikesSourceWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const VoterPositionWrapper = styled('div')`
  display: flex;
`;

const VoterPosition = styled('div')`
  display: flex;
`;

const PositionText = styled('p')`
  margin-left: 5px;
  font: Nunito;
  font-weight: 400;
  size: 14px;
  color: var(--Neutral-700, rgba(72, 72, 72, 1));
`;

const VoterLikesSourceWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -15px;
  `;

const VoterLikes = styled('div')`
  display: flex;
`;

const OpinionSource = styled('button')`
  background: transparent;
  border:none;
`;

const VoterLikesThumbsUpContainer = styled('button')`
  background: transparent; 
  border: none;
`;

const LikeDislikeSeperator = styled('div')`
  margin-left: 8px;
  line-height: 16px;
  border-right: 1px solid rgba(197, 197, 197, 1);
`;

const styles = () => ({
  popoverRoot: {
    borderRadius: 2,
    border: '1px solid rgba(210, 210, 210, 1)',
    marginTop: '3px',
  },
});

export default withTheme(withStyles(styles)(PositionForBallotItem));
