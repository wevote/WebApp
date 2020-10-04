import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { AccountCircle, MoreHoriz } from '@material-ui/icons';
import ActivityCommentAdd from './ActivityCommentAdd';
import ActivityStore from '../../stores/ActivityStore';
import AppActions from '../../actions/AppActions';
import ChildCommentList from './ChildCommentList';
import ReactionStore from '../../stores/ReactionStore';
import ReactionActions from '../../actions/ReactionActions';
import { renderLog } from '../../utils/logging';
import { timeFromDate } from '../../utils/textFormat';
import VoterStore from '../../stores/VoterStore';


const STARTING_NUMBER_OF_PARENT_COMMENTS_TO_DISPLAY = 1;

class ActivityTidbitComments extends Component {
  constructor (props) {
    super(props);
    this.state = {
      addChildCommentOpenByParentCommentWeVoteId: {},
      commentWeVoteIdBeingEditedNow: '',
      commentsInTree: [],
      numberOfParentCommentsToDisplay: STARTING_NUMBER_OF_PARENT_COMMENTS_TO_DISPLAY,
      totalNumberOfParentComments: 0,
      voterLikesThisItemByWeVoteId: {},
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('ActivityTidbitComments componentDidMount');
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
    this.reactionStoreListener = ReactionStore.addListener(this.onReactionStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onActivityStoreChange();
    this.onReactionStoreChange();
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    this.activityStoreListener.remove();
    this.reactionStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onActivityStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    const commentsInTree = ActivityStore.getActivityCommentsInTreeByTidbitWeVoteId(activityTidbitWeVoteId);
    const totalNumberOfParentComments = commentsInTree.length || 0;
    this.setState({
      commentsInTree,
      totalNumberOfParentComments,
    });
  }

  onReactionStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    const { voterLikesThisItemByWeVoteId } = this.state;
    // console.log('ActivityTidbitReactionsSummary onReactionStoreChange, activityTidbitWeVoteId:', activityTidbitWeVoteId);
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    const reactionLikesListUnderActivityTidbitWeVoteId = ReactionStore.getReactionLikesByParentActivityTidbitWeVoteId(activityTidbitWeVoteId);
    // For interaction speed we work off voterLikesThisItemByWeVoteId, so when new data comes in modify that
    // console.log('onReactionStoreChange reactionLikesListUnderActivityTidbitWeVoteId:', reactionLikesListUnderActivityTidbitWeVoteId);
    reactionLikesListUnderActivityTidbitWeVoteId.forEach((reactionLike) => {
      if (reactionLike.voter_we_vote_id === voterWeVoteId) {
        if (ReactionStore.voterLikesThisItem(reactionLike.liked_item_we_vote_id)) {
          voterLikesThisItemByWeVoteId[reactionLike.liked_item_we_vote_id] = true;
        }
      }
    });
    this.setState({
      voterLikesThisItemByWeVoteId,
    });
  }

  onVoterStoreChange () {
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    this.setState({
      voterWeVoteId,
    });
  }

  addChildSavedFunction = (parentCommentWeVoteId) => {
    const { addChildCommentOpenByParentCommentWeVoteId } = this.state;
    if (parentCommentWeVoteId) {
      addChildCommentOpenByParentCommentWeVoteId[parentCommentWeVoteId] = false;
      this.setState({
        addChildCommentOpenByParentCommentWeVoteId,
      });
    }
    // console.log('addChildSavedFunction addChildCommentOpenByParentCommentWeVoteId:', addChildCommentOpenByParentCommentWeVoteId);
  }

  commentEditSavedFunction = () => {
    // console.log('commentEditSavedFunction');
    this.setState({
      commentWeVoteIdBeingEditedNow: '',
    });
  }

  onClickEditComment = (commentWeVoteId) => {
    // const { commentWeVoteIdBeingEditedNow } = this.state;
    // console.log('onClickEditComment, commentWeVoteId:', commentWeVoteId);
    this.setState({
      commentWeVoteIdBeingEditedNow: commentWeVoteId,
    });
  }

  onClickEditCommentCancel = () => {
    // console.log('onClickEditCommentCancel');
    this.setState({
      commentWeVoteIdBeingEditedNow: '',
    });
  }

  onClickReactionLikeToggle = (likedItemWeVoteId) => {
    // console.log('onClickReactionLikeToggle likedItemWeVoteId:', likedItemWeVoteId);
    const { activityTidbitWeVoteId } = this.props;
    const { voterLikesThisItemByWeVoteId } = this.state;
    if (ReactionStore.voterLikesThisItem(likedItemWeVoteId)) {
      ReactionActions.voterReactionLikeOffSave(likedItemWeVoteId);
      voterLikesThisItemByWeVoteId[likedItemWeVoteId] = false;
    } else {
      ReactionActions.voterReactionLikeOnSave(likedItemWeVoteId, activityTidbitWeVoteId);
      voterLikesThisItemByWeVoteId[likedItemWeVoteId] = true;
    }
    this.setState({
      voterLikesThisItemByWeVoteId,
    });
  }

  onClickToggleReplyToComment = (parentCommentWeVoteId) => {
    const { addChildCommentOpenByParentCommentWeVoteId } = this.state;
    // console.log('onClickToggleReplyToComment addChildCommentOpenByParentCommentWeVoteId', addChildCommentOpenByParentCommentWeVoteId);
    if (parentCommentWeVoteId) {
      // Set it the first time to false
      if (!addChildCommentOpenByParentCommentWeVoteId[parentCommentWeVoteId]) {
        addChildCommentOpenByParentCommentWeVoteId[parentCommentWeVoteId] = false;
      }
      if (addChildCommentOpenByParentCommentWeVoteId[parentCommentWeVoteId]) {
        addChildCommentOpenByParentCommentWeVoteId[parentCommentWeVoteId] = false;
      } else {
        addChildCommentOpenByParentCommentWeVoteId[parentCommentWeVoteId] = true;
      }
      this.setState({
        addChildCommentOpenByParentCommentWeVoteId,
      });
    }
    // console.log('onClickReactionLikeToggle parentCommentWeVoteId:', parentCommentWeVoteId, ', addChildCommentOpenByParentCommentWeVoteId[parentCommentWeVoteId]', addChildCommentOpenByParentCommentWeVoteId[parentCommentWeVoteId]);
  }

  onClickShowActivityTidbitDrawer = () => {
    const { activityTidbitWeVoteId } = this.props;
    // console.log('onClickShowActivityTidbitDrawer activityTidbitWeVoteId:', activityTidbitWeVoteId);
    AppActions.setActivityTidbitWeVoteIdForDrawer(activityTidbitWeVoteId);
    AppActions.setShowActivityTidbitDrawer(true);
  }

  increaseNumberOfActivityTidbitsToDisplay = () => {
    // console.log('increaseNumberOfActivityTidbitsToDisplay');
    let { numberOfParentCommentsToDisplay } = this.state;
    numberOfParentCommentsToDisplay += 2;
    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfParentCommentsToDisplay,
      });
    }, 500);
  }

  render () {
    renderLog('ActivityTidbitComments');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('ActivityTidbitComments render');
    const { activityTidbitWeVoteId, classes, editingTurnedOff, showAllParentComments } = this.props;
    const {
      addChildCommentOpenByParentCommentWeVoteId, commentWeVoteIdBeingEditedNow, commentsInTree,
      numberOfParentCommentsToDisplay, totalNumberOfParentComments,
      voterLikesThisItemByWeVoteId, voterWeVoteId,
    } = this.state;
    if (!commentsInTree || commentsInTree.length === 0) {
      return null;
    }
    const hideParentCommentBottomLinks = !showAllParentComments;
    let likeButtonSelected = false;
    let numberOfCommentsDisplayed = 0;
    let commenterIsVoter = false;
    let showMoreHasBeenShown = false;
    // console.log('voterLikesThisItemByWeVoteId:', voterLikesThisItemByWeVoteId);
    return (
      <Wrapper>
        {commentsInTree.map((parentComment) => {
          // console.log('oneActivityTidbit:', oneActivityTidbit);
          // console.log('numberOfCommentsDisplayed:', numberOfCommentsDisplayed);
          if (!parentComment || !parentComment.commenter_name) {
            // console.log('Missing oneActivityTidbit.commenter_name:', parentComment);
            return null;
          }
          if (showAllParentComments) {
            // Don't stop
          } else if (numberOfCommentsDisplayed >= numberOfParentCommentsToDisplay) {
            if (showMoreHasBeenShown) {
              return null;
            } else {
              showMoreHasBeenShown = true;
              return (
                <ShowMoreWrapper key={`showMore-${parentComment.we_vote_id}`}>
                  <ShowMoreLink
                    className="u-cursor--pointer"
                    onClick={this.onClickShowActivityTidbitDrawer}
                  >
                    show all
                    {' '}
                    {totalNumberOfParentComments}
                    {' '}
                    comments
                  </ShowMoreLink>
                </ShowMoreWrapper>
              );
            }
          }
          numberOfCommentsDisplayed += 1;
          likeButtonSelected = !!(voterLikesThisItemByWeVoteId[parentComment.we_vote_id]);
          commenterIsVoter = (voterWeVoteId === parentComment.commenter_voter_we_vote_id);
          // console.log('parentComment.comment_list:', parentComment.comment_list);
          return (
            <CommentWrapper key={`comment-${parentComment.we_vote_id}`}>
              <ParentPhotoDiv>
                {(parentComment.commenter_profile_image_url_tiny) ? (
                  <SpeakerAvatar>
                    <ActivityImage src={parentComment.commenter_profile_image_url_tiny} alt={`${parentComment.commenter_name}`} />
                  </SpeakerAvatar>
                ) : (
                  <SpeakerAvatar>
                    <AccountCircle classes={{ root: classes.accountCircle }} />
                  </SpeakerAvatar>
                )}
              </ParentPhotoDiv>
              <ParentCommentWrapper
                className={hideParentCommentBottomLinks ? 'u-cursor--pointer' : ''}
              >
                {commentWeVoteIdBeingEditedNow === parentComment.we_vote_id ? (
                  <ActivityCommentAdd
                    activityTidbitWeVoteId={activityTidbitWeVoteId}
                    activityCommentWeVoteId={parentComment.we_vote_id}
                    commentEditSavedFunction={this.commentEditSavedFunction}
                    hidePhotoFromTextField
                    inEditMode
                  />
                ) : (
                  <ParentCommentStatementTextOutsideWrapper>
                    {hideParentCommentBottomLinks ? (
                      <ParentCommentStatementText
                        onClick={this.onClickShowActivityTidbitDrawer}
                      >
                        {parentComment.statement_text}
                      </ParentCommentStatementText>
                    ) : (
                      <ParentCommentStatementText>
                        {parentComment.statement_text}
                      </ParentCommentStatementText>
                    )}
                    {(commenterIsVoter && !editingTurnedOff) && (
                      <ActivityCommentEditWrapper
                        id={`activityCommentEdit-${activityTidbitWeVoteId}-${parentComment.we_vote_id}`}
                        onClick={() => this.onClickEditComment(parentComment.we_vote_id)}
                      >
                        <MoreHoriz />
                      </ActivityCommentEditWrapper>
                    )}
                  </ParentCommentStatementTextOutsideWrapper>
                )}
                {(!hideParentCommentBottomLinks) && (
                  <ParentCommentBottomLinks>
                    {(parentComment.date_created) && (
                      <CommentActivityTime>
                        {timeFromDate(parentComment.date_created)}
                      </CommentActivityTime>
                    )}
                    <LikeWrapper>
                      <IconButton
                        classes={{ root: likeButtonSelected ? classes.likeButtonSelected : classes.likeButton }}
                        id={`likeButton-${parentComment.parent_we_vote_id}-${parentComment.we_vote_id}`}
                        onClick={() => this.onClickReactionLikeToggle(parentComment.we_vote_id)}
                      >
                        <LikeTextWrapper likeButtonSelected={likeButtonSelected}>
                          Like
                        </LikeTextWrapper>
                      </IconButton>
                    </LikeWrapper>
                    <ReplyWrapper>
                      <IconButton
                        classes={{ root: classes.replyButton }}
                        id={`replyButton-${parentComment.parent_we_vote_id}-${parentComment.we_vote_id}`}
                        onClick={() => this.onClickToggleReplyToComment(parentComment.we_vote_id)}
                      >
                        <ReplyTextWrapper>
                          Reply
                        </ReplyTextWrapper>
                      </IconButton>
                    </ReplyWrapper>
                    {(commentWeVoteIdBeingEditedNow === parentComment.we_vote_id) && (
                      <CancelWrapper>
                        <IconButton
                          classes={{ root: classes.cancelButton }}
                          id={`cancelButton-${parentComment.parent_we_vote_id}-${parentComment.we_vote_id}`}
                          onClick={() => this.onClickEditCommentCancel(parentComment.we_vote_id)}
                        >
                          <CancelTextWrapper className="u-no-break">
                            Cancel Edit
                          </CancelTextWrapper>
                        </IconButton>
                      </CancelWrapper>
                    )}
                  </ParentCommentBottomLinks>
                )}
                {(parentComment.comment_list && parentComment.comment_list.length > 0) && (
                  <ChildCommentListWrapper>
                    <ChildCommentList
                      activityTidbitWeVoteId={activityTidbitWeVoteId}
                      editingTurnedOff={editingTurnedOff}
                      hideChildCommentBottomLinks={hideParentCommentBottomLinks}
                      onClickToggleReplyToComment={this.onClickToggleReplyToComment}
                      parentCommentWeVoteId={parentComment.we_vote_id}
                      showAllChildComments={showAllParentComments}
                    />
                  </ChildCommentListWrapper>
                )}
                {(totalNumberOfParentComments === 1) && (
                  <SpacerBelowComments />
                )}
                {(addChildCommentOpenByParentCommentWeVoteId && addChildCommentOpenByParentCommentWeVoteId[parentComment.we_vote_id]) && (
                  <ActivityCommentAdd
                    activityTidbitWeVoteId={activityTidbitWeVoteId}
                    parentCommentWeVoteId={parentComment.we_vote_id}
                    addChildSavedFunction={this.addChildSavedFunction}
                  />
                )}
              </ParentCommentWrapper>
            </CommentWrapper>
          );
        })}
      </Wrapper>
    );
  }
}
ActivityTidbitComments.propTypes = {
  activityTidbitWeVoteId: PropTypes.string.isRequired,
  classes: PropTypes.object,
  editingTurnedOff: PropTypes.bool,
  showAllParentComments: PropTypes.bool,
};

const styles = () => ({
  accountCircle: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    width: 32,
    height: 32,
  },
  cancelButton: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: '4px 6px 6px 6px',
  },
  likeButton: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: '4px 6px 6px 6px',
  },
  likeButtonSelected: {
    color: '#2e3c5d',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: '4px 6px 6px 6px',
  },
  numberOfLikesButton: {
    padding: 6,
  },
  numberOfCommentsButton: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: 6,
  },
  replyButton: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: '4px 6px 6px 6px',
  },
});

const ActivityCommentEditWrapper = styled.div`
`;

const ActivityImage = styled.img`
  border-radius: 4px;
  width: 32px;
`;

const CancelTextWrapper = styled.div`
  color: #999;
  font-size: 11px;
  padding-left: 4px;
`;

const CancelWrapper = styled.div`
`;

const ChildCommentListWrapper = styled.div`
`;

const CommentActivityTime = styled.div`
  color: #999;
  font-size: 11px;
  font-weight: 400;
  margin-right: 6px;
`;

const CommentWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
`;

const LikeTextWrapper = styled.div`
  ${({ likeButtonSelected }) => (likeButtonSelected ? 'color: #2e3c5d;' : 'color: #999;')}
  font-size: 11px;
  ${({ likeButtonSelected }) => (likeButtonSelected ? 'font-weight: 600;' : '')}
  padding-left: 4px;
`;

const LikeWrapper = styled.div`
`;

const ParentCommentBottomLinks = styled.div`
  align-items: center;
  display: flex;
  justify-content: start;
  margin-bottom: 3px;
  margin-left: 12px;
`;

const ParentCommentStatementText = styled.div`
  width: 100%;
`;

const ParentCommentStatementTextOutsideWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  border-radius: 32px;
  background: rgb(224, 224, 224);
  color: #2e3c5d;
  font-size: 16px;
  font-weight: 500;
  padding: 4px 12px;
  margin-top: 0px;
`;

const ParentCommentWrapper = styled.div`
  width: 100%;
`;

const ParentPhotoDiv = styled.div`
`;

const ReplyTextWrapper = styled.div`
  color: #999;
  font-size: 11px;
  padding-left: 4px;
`;

const ReplyWrapper = styled.div`
`;

const ShowMoreLink = styled.div`
  color: rgba(17, 17, 17, .4);
`;

const ShowMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -5px;
  width: 100%;
`;

const SpacerBelowComments = styled.div`
  height: 4px;
`;

const SpeakerAvatar = styled.div`
  background: transparent;
  display: flex;
  justify-content: center;
  margin-right: 4px;
  position: relative;
`;

const Wrapper = styled.div`
  margin-bottom: 6px !important;
  padding: 0px !important;
`;

export default withTheme(withStyles(styles)(ActivityTidbitComments));
