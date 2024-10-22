import React, { useState } from 'react';
import styled from 'styled-components';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ThumbDownAltRounded } from '@mui/icons-material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Popover } from '@mui/material';
import DesignTokenColors from '../Style/DesignTokenColors';

function VoterPositionEntryAndDisplay () {
  const [voterOpinion, setVoterOpinion] = useState(null);
  const [anchorEl, setAnchorEL] = useState(null);

  const voter = {
    first_name: 'David',
    last_name: 'NiederKofler',
    full_name: 'David Niederkofler',
    voter_photo_url_medium: '',
  };

  const opinion = {
    opinion_body: 'Holly can get the job done',
    opinion_time_created: new Date(),
    opinion_likes: ['Blair H', 'Malena H', 'Anusha K', 'Ayobami B', 'Blair H', 'Blair H', 'Blair H', 'Blair H', 'Blair H', 'Blair H', 'Blair H', 'Blair H', 'Blair H', 'Blair H', 'Blair H', 'Blair H', 'Blair H', 'Blair H'],
    opinion_dislikes: ['Enrique C'],
  };

  const handleVoterEditClick = () => {
    console.log('Edit voter logic will go here');
  };

  const formatNewDate = (date) => new Intl.DateTimeFormat('en-US', { month: '2-digit', day: 'numeric', year: '2-digit' }).format(date);

  const voterOpinionClick = () => {
    setVoterOpinion(opinion);
  };

  const handleEditCommentClick = (e) => {
    setAnchorEL(e.currentTarget);
  };

  const handleEditCommentClose = () => {
    setAnchorEL(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const formatLikesDislikes = (arr) => {
    if (arr.length > 4) {
      const firstFourNames = arr.slice(0, 4).join(', ');
      const remainder = arr.length - 4;
      return (
        <p>
          {firstFourNames}
          {' '}
          and
          {' '}
          {remainder}
          {' '}
          others
        </p>
      );
    } else {
      return <p>{arr.join(', ')}</p>;
    }
  };

  return (
    <VoterPositionContainer>
      <VoterAvatarDisplayContainer>
        <VoterAvatar>
          {voter.voter_photo_url_medium ?
            <VoterImage src={voter.voter_photo_url_medium} alt="Voter" /> :
            (
              <>
                <VoterFirstName>
                  {voter.first_name[0]}
                </VoterFirstName>
                <VoterLastName>
                  {voter?.last_name?.[0]}
                </VoterLastName>
              </>
            )}
        </VoterAvatar>
        <VoterEdit onClick={handleVoterEditClick}>
          <EditIcon />
        </VoterEdit>
      </VoterAvatarDisplayContainer>
      <VoterOpinionDisplayContainer>
        {voterOpinion ? (
          <VoterOpinionContainer>
            <VoterTitle>
              {voter.full_name}
            </VoterTitle>
            <VoterComment>{opinion.opinion_body}</VoterComment>
            <CommentDetailsContainer>
              <CommentCreated>
                You commented
                {' '}
                {formatNewDate(opinion.opinion_time_created)}
                (visible to only your friends)
              </CommentCreated>
              <EditCommentPopoverClick type="button" onClick={handleEditCommentClick}>
                <ThreeDotsIcon />
              </EditCommentPopoverClick>
              <Popover
                open={open}
                id={id}
                anchorEl={anchorEl}
                onClose={handleEditCommentClose}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 0, left: 220 }}
              >
                <EditDeleteCommentContainer>
                  <EditCommentClick type="button">
                    <EditIconLrg />
                    Edit opinion
                  </EditCommentClick>
                  <DeleteCommentClick type="button">
                    <DeleteIcon />
                    Delete opinion
                  </DeleteCommentClick>
                </EditDeleteCommentContainer>
              </Popover>
            </CommentDetailsContainer>
            <CommentLikeDislikeContainer>
              <CommentLikeContainer>
                <CommentLikeIconContainer>
                  <CommentLikeIcon />
                </CommentLikeIconContainer>
                <CommentLikesDislikesNamesContainer>
                  {formatLikesDislikes(opinion.opinion_likes)}
                </CommentLikesDislikesNamesContainer>
              </CommentLikeContainer>
              <CommentDislikeContainer>
                <CommentDislikeIconContainer>
                  <CommentDislikeIcon />
                </CommentDislikeIconContainer>
                <CommentLikesDislikesNamesContainer>
                  {formatLikesDislikes(opinion.opinion_dislikes)}
                </CommentLikesDislikesNamesContainer>
              </CommentDislikeContainer>
            </CommentLikeDislikeContainer>
          </VoterOpinionContainer>
        ) :
          (
            <LeaveOpinion onClick={voterOpinionClick}>
              <LeaveOpinionText>What&apos;s your opinion?</LeaveOpinionText>
            </LeaveOpinion>
          )}
      </VoterOpinionDisplayContainer>
    </VoterPositionContainer>
  );
}

const VoterPositionContainer = styled('div')`
  display: flex;
  width: 484px;
  border-bottom: 1px solid ${DesignTokenColors.neutral100};
  padding-bottom: 15px;
`;

const VoterAvatarDisplayContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VoterAvatar = styled('div')`
  height: 43px;
  width: 43px;
  border-radius: 50%;
  background-color: ${DesignTokenColors.info600};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const VoterImage = styled('img')`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

const VoterFirstName = styled('p')`
  color: white;
  margin: 0;
  padding: 0;
  font-size: 16px;
`;

const VoterLastName = styled('p')`
  color: white;
  margin-bottom: -4px;
  padding: 0;
  font-size: 11px;
`;

const VoterEdit = styled('button')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border: none;
  border-radius: 50%;
  background-color: ${DesignTokenColors.primary50};
  margin-top: -16px;
  margin-left: 30px;
`;

const EditIcon = styled(CreateOutlinedIcon)`
  transform: scale(.65);
  color: ${DesignTokenColors.neutral400};
`;

const VoterOpinionDisplayContainer = styled('div')`
  display: flex;
`;

const VoterOpinionContainer =  styled('div')`
  display: flex;
  flex-direction: column;
  width: 380px;
  margin-left: 15px;
`;

const VoterTitle = styled('h2')`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: ${DesignTokenColors.neutral900}
`;

const VoterComment = styled('p')`
  font-size: 16px;
  margin: 0;
`;

const CommentDetailsContainer = styled('div')`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0;
  margin: 0;
`;

const CommentCreated = styled('p')`
  font-size: 14px;
  color: ${DesignTokenColors.neutral700};
  margin: 0;
  padding: 0;
`;

const EditCommentPopoverClick = styled('button')`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  height: 34px;
  width: 34px;
  padding: 0;

  &:hover {
    background-color: ${DesignTokenColors.neutral100};
  }
`;

const EditDeleteCommentContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

const EditCommentClick = styled('button')`
  background-color: white;
  color: ${DesignTokenColors.neutral900};
  border-radius: 5px 5px 0 0;
  border: 1px solid ${DesignTokenColors.neutral100};
  width: 201px;
  height: 42px;
  text-align: left;
  font-size: 16px;

  &:hover {
    background-color: ${DesignTokenColors.neutral100};
  }
`;

const EditIconLrg = styled(CreateOutlinedIcon)`
  margin: 0 5px 0 10px;
  color: ${DesignTokenColors.neutral400};
`;

const DeleteCommentClick = styled('button')`
  background-color: white;
  color: ${DesignTokenColors.neutral900};
  border-radius: 0 0 5px 5px;
  border-top: none;
  border-right: 1px solid ${DesignTokenColors.neutral100};
  border-bottom: 1px solid ${DesignTokenColors.neutral100};
  border-left: 1px solid ${DesignTokenColors.neutral100};
  width: 201px;
  height: 42px;
  text-align: left;

  &:hover {
    background-color: ${DesignTokenColors.neutral100};
  }
`;

const DeleteIcon = styled(DeleteOutlinedIcon)`
  margin: 0 5px 0 10px;
  color: ${DesignTokenColors.neutral400};
`;

const ThreeDotsIcon = styled(MoreHorizIcon)`
  color: ${DesignTokenColors.neutral400}
`;

const LeaveOpinion = styled('button')`
  background-color: transparent;
  border: 1px solid ${DesignTokenColors.neutral100};
  border-radius: 16px;
  width: 380px;
  height: 43px;
  text-align: left;
  margin-left: 10px;
`;

const LeaveOpinionText = styled('span')`
  text-size: 12px;
  margin-left: 20px;
  color: ${DesignTokenColors.neutral500}
`;

const CommentLikeDislikeContainer = styled('div')`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
`;

const CommentLikeContainer = styled('div')`
  display: flex;
  cursor: pointer;
`;

const CommentDislikeContainer = styled('div')`
  display: flex;
  cursor: pointer;
  margin: -5px 0 -15px 0;
`;

const CommentLikeIconContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${DesignTokenColors.tertiary800};
  border: none;
  border-radius: 50%;
  height: 25px;
  width: 25px;
`;

const CommentLikeIcon = styled(ThumbDownAltRounded)`
  transform: rotate(180deg) scale(.75);
  color: white;
`;

const CommentLikesDislikesNamesContainer = styled('div')`
  display: flex;
  font-size: 12px;
  margin-left: 5px;
`;

const CommentDislikeIconContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${DesignTokenColors.neutral300};
  border: none;
  border-radius: 50%;
  height: 25px;
  width: 25px;
`;

const CommentDislikeIcon = styled(ThumbDownAltRounded)`
  transform: scale(.75);
  color: white;
`;

export default VoterPositionEntryAndDisplay;
