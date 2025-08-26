import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { withStyles } from '@mui/styles';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ThumbDownAltRounded } from '@mui/icons-material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Popover, Tooltip } from '@mui/material';
import DesignTokenColors from '../Style/DesignTokenColors';
import VoterPositionEditModal from '../../../components/PositionItem/VoterPositionEditModal';


// THIS VERSION IS DEPRECATED. Use this instead: src/js/components/PositionItem/VoterPositionEntryAndDisplay.jsx
function VoterPositionEntryAndDisplay ({ classes }) {
  const [voterOpinion, setVoterOpinion] = useState(true);
  const [anchorElEdit, setAnchorElEdit] = useState(null);
  const [anchorElLikes, setAnchorElLikes] = useState(null);
  const [anchorElDislikes, setAnchorElDislikes] = useState(null);
  const [showVoterEdit, setShowVoterEdit] = useState(false);

  // Still to take care of:
  // 1. hooking up the component to live data
  // 2. hooking up the edit feature
  // 3. format dislikes could be refactored with helper functions

  const voter = {
    first_name: 'David',
    last_name: 'NiederKofler',
    full_name: 'David Niederkofler',
    voter_photo_url_medium: '',
  };

  const candidateName = 'Holly Mitchell';

  const opinion = {
    opinion_body: 'Holly can get the job done',
    opinion_time_created: new Date(),
    opinion_likes: [
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Malenia', last_name: 'H', full_name: 'Malena H' },
      { first_name: 'Anusha', last_name: 'K', full_name: 'Anusha K' },
      { first_name: 'Ayobami', last_name: 'B', full_name: 'Ayobami B' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
      { first_name: 'Blair', last_name: 'H', full_name: 'Blair H' },
    ],
    opinion_dislikes: [
      { first_name: 'Enrique', last_name: 'C', full_name: 'Enrique C' },
    ],
  };

  // const handleVoterEditClick = () => {
  //   console.log('Edit voter logic will go here');
  // };

  const handleSetOpinionClick = () => {
    setVoterOpinion(opinion);
  };

  const formatNewDate = (date) => new Intl.DateTimeFormat('en-US', { month: '2-digit', day: 'numeric', year: '2-digit' }).format(date);

  const voterOpinionClick = () => {
    setShowVoterEdit(!showVoterEdit);
  };

  const handleEditCommentClick = (e) => {
    setAnchorElEdit(e.currentTarget);
  };

  const handleViewLikesClick = (e) => {
    setAnchorElLikes(e.currentTarget);
  };

  const handleViewDislikesClick = (e) => {
    setAnchorElDislikes(e.currentTarget);
  };

  const handleEditCommentClose = () => {
    setAnchorElEdit(null);
  };

  const handleViewLikesClose = () => {
    setAnchorElLikes(null);
  };

  const handleViewDislikesClose = () => {
    setAnchorElDislikes(null);
  };

  const openEdit = Boolean(anchorElEdit);
  const openLikes = Boolean(anchorElLikes);
  const openDislikes = Boolean(anchorElDislikes);

  const idEdit = openEdit ? 'simple-popover' : undefined;
  const idLikes = openLikes ? 'simple-popover' : undefined;
  const idDislikes = openDislikes ? 'simple-popover' : undefined;

  const formatLikesDislikes = (arr) => {
    if (arr.length > 4) {
      const firstFourNames = arr.slice(0, 4).map((nameObj) => nameObj.full_name).join(', ');
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
      return <p>{arr.map((nameObj) => nameObj.full_name).join(', ')}</p>;
    }
  };

  const toolTipMessage = (arr) => (
    <p>
      See
      {' '}
      {arr.length > 1 ? 'reactions ' : 'reaction '}
      from
      {' '}
      {arr.length}
      {' '}
      {arr.length > 1 ? 'users, ' : 'user, '}
      like:
      {' '}
      {arr.map((nameObj) => nameObj.full_name).join(' ')}
    </p>
  );

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
        <VoterEdit onClick={handleSetOpinionClick}>
          <EditIcon />
        </VoterEdit>
      </VoterAvatarDisplayContainer>
      <VoterOpinionDisplayContainer>
        <VoterPositionEditModal
          showVoterEdit={showVoterEdit}
          setShowVoterEdit={setShowVoterEdit}
          candidateName={candidateName}
          voter={voter}
        />
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
                open={openEdit}
                id={idEdit}
                anchorEl={anchorElEdit}
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
                <Tooltip
                  arrow
                  placement="top"
                  title={toolTipMessage(opinion.opinion_likes)}
                  classes={{ tooltip: classes.toolTip, arrow: classes.arrow }}
                >
                  <CommentLikesDislikesNamesContainer onClick={handleViewLikesClick}>
                    {formatLikesDislikes(opinion.opinion_likes)}
                  </CommentLikesDislikesNamesContainer>
                </Tooltip>
                <Popover
                    open={openLikes}
                    id={idLikes}
                    anchorEl={anchorElLikes}
                    onClose={handleViewLikesClose}
                    classes={{ paper: classes.popoverRoot }}
                >
                  <CommentLikesDislikesPopoverContainer>
                    <CommentLikesDislikesPopoverHeaderContainer>
                      <CommentLikesDislikesPopoverHeaderMessage>
                        {opinion.opinion_likes.length}
                        {' '}
                        {opinion.opinion_likes.length > 1 ? 'people ' : 'person'}
                        liked your comment
                      </CommentLikesDislikesPopoverHeaderMessage>
                      <ClosePopover aria-label="close-icon" type="button">
                        <CloseIcon
                          sx={{ stroke: 'white', strokeWidth: 0.5 }}
                          onClick={handleViewLikesClose}
                        />
                      </ClosePopover>
                    </CommentLikesDislikesPopoverHeaderContainer>
                    <CommentLikesDislikesPopoverBodyContainer>
                      {opinion.opinion_likes.map((nameObj) => (
                        <CommentLikesDislikesAuthorContainer>
                          <CommentLikesDislikesAuthorAvatarContainer>
                            <CommentLikesDislikesAuthorAvatar>
                              <CommentLikesDislikesAuthorFirstName>
                                {nameObj.first_name[0]}
                              </CommentLikesDislikesAuthorFirstName>
                              <CommentLikesDislikesAuthorLastName>
                                {nameObj.last_name[0]}
                              </CommentLikesDislikesAuthorLastName>
                            </CommentLikesDislikesAuthorAvatar>
                          </CommentLikesDislikesAuthorAvatarContainer>
                          <CommentLikesDislikesAuthorFullNameContainer>
                            <CommentLikesDislikesAuthorFullName>
                              {nameObj.full_name}
                            </CommentLikesDislikesAuthorFullName>
                          </CommentLikesDislikesAuthorFullNameContainer>
                        </CommentLikesDislikesAuthorContainer>
                      ))}
                    </CommentLikesDislikesPopoverBodyContainer>
                  </CommentLikesDislikesPopoverContainer>
                </Popover>
              </CommentLikeContainer>
              <CommentDislikeContainer>
                <CommentDislikeIconContainer>
                  <CommentDislikeIcon />
                </CommentDislikeIconContainer>
                <Tooltip
                  arrow
                  placement="top"
                  title={toolTipMessage(opinion.opinion_dislikes)}
                  classes={{ tooltip: classes.toolTip, arrow: classes.arrow }}
                >
                  <CommentLikesDislikesNamesContainer onClick={handleViewDislikesClick}>
                    {formatLikesDislikes(opinion.opinion_dislikes)}
                  </CommentLikesDislikesNamesContainer>
                </Tooltip>
                <Popover
                    open={openDislikes}
                    id={idDislikes}
                    anchorEl={anchorElDislikes}
                    onClose={handleViewDislikesClose}
                    classes={{ paper: classes.popoverRoot }}
                >
                  <CommentLikesDislikesPopoverContainer>
                    <CommentLikesDislikesPopoverHeaderContainer>
                      <CommentLikesDislikesPopoverHeaderMessage>
                        {opinion.opinion_dislikes.length}
                        {' '}
                        {opinion.opinion_dislikes.length > 1 ? 'people ' : 'person '}
                        disliked your comment
                      </CommentLikesDislikesPopoverHeaderMessage>
                      <ClosePopover aria-label="close-icon" type="button">
                        <CloseIcon
                          sx={{ stroke: 'white', strokeWidth: 0.5 }}
                          onClick={handleViewDislikesClose}
                        />
                      </ClosePopover>
                    </CommentLikesDislikesPopoverHeaderContainer>
                    <CommentLikesDislikesPopoverBodyContainer>
                      {opinion.opinion_dislikes.map((nameObj) => (
                        <CommentLikesDislikesAuthorContainer>
                          <CommentLikesDislikesAuthorAvatarContainer>
                            <CommentLikesDislikesAuthorAvatar>
                              <CommentLikesDislikesAuthorFirstName>
                                {nameObj.first_name[0]}
                              </CommentLikesDislikesAuthorFirstName>
                              <CommentLikesDislikesAuthorLastName>
                                {nameObj.last_name[0]}
                              </CommentLikesDislikesAuthorLastName>
                            </CommentLikesDislikesAuthorAvatar>
                          </CommentLikesDislikesAuthorAvatarContainer>
                          <CommentLikesDislikesAuthorFullNameContainer>
                            <CommentLikesDislikesAuthorFullName>
                              {nameObj.full_name}
                            </CommentLikesDislikesAuthorFullName>
                          </CommentLikesDislikesAuthorFullNameContainer>
                        </CommentLikesDislikesAuthorContainer>
                      ))}
                    </CommentLikesDislikesPopoverBodyContainer>
                  </CommentLikesDislikesPopoverContainer>
                </Popover>
              </CommentDislikeContainer>
            </CommentLikeDislikeContainer>
          </VoterOpinionContainer>
        ) :
          (
            <LeaveOpinion onClick={voterOpinionClick}>
              <LeaveOpinionText>What&apos;s your opinion? DEPRECATED</LeaveOpinionText>
            </LeaveOpinion>
          )}
      </VoterOpinionDisplayContainer>
    </VoterPositionContainer>
  );
}

VoterPositionEntryAndDisplay.propTypes = {
  classes: PropTypes.object,
};

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
  color: ${DesignTokenColors.whiteUI};
  margin: 0;
  padding: 0;
  font-size: 16px;
`;

const VoterLastName = styled('p')`
  color: ${DesignTokenColors.whiteUI};
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

const CommentLikesDislikesPopoverContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

const CommentLikesDislikesPopoverHeaderContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${DesignTokenColors.neutral100};
  width: 100%;
  padding: 15px 20px 15px 30px;
`;

const CommentLikesDislikesPopoverHeaderMessage = styled('h4')`
  font-size: 18px;
  margin: 0;
`;

const ClosePopover = styled('button')`
  border: none;
  background-color: transparent;
`;

const CommentLikesDislikesPopoverBodyContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

const CommentLikesDislikesAuthorContainer = styled('div')`
  display: flex;
  align-items: center;
  padding: 10px;
`;

const CommentLikesDislikesAuthorAvatarContainer = styled('div')`
  display: flex;
  align-items: center;
`;

const CommentLikesDislikesAuthorAvatar = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 43px;
  width: 43px;
  border-radius: 50%;
  background-color: ${DesignTokenColors.alert300};
  color: ${DesignTokenColors.whiteUI}
`;

const CommentLikesDislikesAuthorFirstName = styled('p')`
  font-size: 16px;
  margin: 0;
`;

const CommentLikesDislikesAuthorLastName = styled('p')`
  font-size: 11px;
  margin: 2px 0 0 0;
`;

const CommentLikesDislikesAuthorFullNameContainer = styled('div')`
  display: flex;
  align-items: center;
  margin: 0 0 0 10px;
`;

const CommentLikesDislikesAuthorFullName = styled('p')`
  margin: 0;
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

const styles = () => ({
  toolTip: {
    backgroundColor: `${DesignTokenColors.neutral900}`,
    width: '180px',
  },
  arrow: {
    color: `${DesignTokenColors.neutral900}`,
  },
  popoverRoot: {
    width: '304px',
    height: '420px',
    borderRadius: '30px',
    border: `1px solid ${DesignTokenColors.neutral100}`,
  },
});
export default withStyles(styles)(VoterPositionEntryAndDisplay);
