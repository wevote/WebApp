// import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ThumbDownOffAltRoundedIcon from '@mui/icons-material/ThumbDownOffAltRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HeartFavoriteToggleBase from '../Widgets/HeartFavoriteToggle/HeartFavoriteToggleBase';

function PositionForBallotItem () {
  const voter = {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvVfSCpfKXUaZB8s159zxg1HFNApJU2ra_vg&s',
    name: 'Bobbi Odessa',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  };

  const voterEndorsed = true;

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
              <button type="button" aria-label="Like" style={{ background: 'transparent', border: 'none' }}>
                <ThumbDownOffAltRoundedIcon style={{ fontSize: '21px', color: 'rgba(154, 154, 154, 1)', marginRight: '10px', transform: 'rotate(180deg)' }} />
              </button>
              <h3 style={{ marginTop: '7px' }}>7</h3>
              <LikeDislikeSeperator>&nbsp;</LikeDislikeSeperator>
              <button type="button" aria-label="Dislike" style={{ background: 'transparent', border: 'none' }}>
                <ThumbDownOffAltRoundedIcon style={{ fontSize: '21px', color: 'rgba(154, 154, 154, 1)', marginLeft: '10px' }} />
              </button>
              <button type="button" aria-label="Source" style={{ background: 'transparent', border: 'none' }}>
                <MoreHorizIcon style={{ color: 'rgba(132, 132, 132, 1)', fontSize: '30px' }} />
              </button>
            </VoterLikes>
          </VoterLikesSourceWrapper>
        </VoterPositionLikesSourceWrapper>
      </VoterInfoWrapper>
    </PositionForBallotItemWrapper>
  );
}

// PositionForBallotItem.propTypes = {
// };

const PositionForBallotItemWrapper = styled('div')`
  display: flex;
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
  width: 450px;
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

const LikeDislikeSeperator = styled('div')`
  margin-left: 8px;
  line-height: 16px;
  border-right: 1px solid rgba(197, 197, 197, 1);
`;

export default PositionForBallotItem;
