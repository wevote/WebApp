import { MoreHoriz } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactionActions from '../../actions/ReactionActions';
import { timeFromDate } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';
import ActivityStore from '../../stores/ActivityStore';
import AppObservableStore from '../../common/stores/AppObservableStore';
import ReactionStore from '../../stores/ReactionStore';
import VoterStore from '../../stores/VoterStore';
import ActivityCommentAdd from './ActivityCommentAdd';
import speakerDisplayNameToAvatarColor from '../../common/utils/speakerDisplayNameToAvatarColor';
import speakerDisplayNameToInitials from '../../common/utils/speakerDisplayNameToInitials';


const STARTING_NUMBER_OF_PARENT_COMMENTS_TO_DISPLAY = 1;

class ChildCommentList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      commentWeVoteIdBeingEditedNow: '',
      childCommentsList: [],
      numberOfChildCommentsToDisplay: STARTING_NUMBER_OF_PARENT_COMMENTS_TO_DISPLAY,
      voterLikesThisItemByWeVoteId: {},
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('ChildCommentList componentDidMount');
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
    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
  }

  onActivityStoreChange () {
    // console.log('ChildCommentList onActivityStoreChange');
    const { parentCommentWeVoteId } = this.props;
    const childCommentsList = ActivityStore.getChildCommentsByParentCommentWeVoteId(parentCommentWeVoteId);
    this.setState({
      childCommentsList,
    });
  }

  onReactionStoreChange () {
    // console.log('ChildCommentList onReactionStoreChange');
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
    // console.log('ChildCommentList onVoterStoreChange');
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    this.setState({
      voterWeVoteId,
    });
  }

  commentEditSavedFunction = () => {
    // console.log('commentEditSavedFunction');
    this.setState({
      commentWeVoteIdBeingEditedNow: '',
    });
  }

  onClickEditComment = (commentWeVoteId) => {
    // console.log('onClickEditComment');
    // const { commentWeVoteIdBeingEditedNow } = this.state;
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

  onClickShowActivityTidbitDrawer = () => {
    const { activityTidbitWeVoteId } = this.props;
    // console.log('onClickShowActivityTidbitDrawer activityTidbitWeVoteId:', activityTidbitWeVoteId);
    AppObservableStore.setActivityTidbitWeVoteIdForDrawer(activityTidbitWeVoteId);
    AppObservableStore.setShowActivityTidbitDrawer(true);
  }

  onClickToggleReplyToCommentLocal = () => {
    const { parentCommentWeVoteId } = this.props;
    // console.log('onClickToggleReplyToCommentLocal parentCommentWeVoteId:', parentCommentWeVoteId);
    if (this.props.onClickToggleReplyToComment && parentCommentWeVoteId) {
      this.props.onClickToggleReplyToComment(parentCommentWeVoteId);
    }
  }

  increaseNumberOfActivityTidbitsToDisplay = () => {
    // console.log('increaseNumberOfActivityTidbitsToDisplay');
    let { numberOfChildCommentsToDisplay } = this.state;
    numberOfChildCommentsToDisplay += 2;
    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfChildCommentsToDisplay,
      });
    }, 500);
  }

  render () {
    renderLog('ChildCommentList');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      activityTidbitWeVoteId, classes, editingTurnedOff, hideChildCommentBottomLinks,
      parentCommentWeVoteId, showAllChildComments,
    } = this.props;
    const {
      commentWeVoteIdBeingEditedNow, childCommentsList,
      numberOfChildCommentsToDisplay,
      voterLikesThisItemByWeVoteId, voterWeVoteId,
    } = this.state;
    // console.log('ChildCommentList render, childCommentsList:', childCommentsList);
    if (!childCommentsList || childCommentsList.length === 0) {
      return null;
    }
    let likeButtonSelected = false;
    let numberOfCommentsDisplayed = 0;
    let commenterIsVoter = false;
    let showMoreHasBeenShown = false;
    // console.log('voterLikesThisItemByWeVoteId:', voterLikesThisItemByWeVoteId);
    return (
      <Wrapper>
        {childCommentsList.map((childComment) => {
          // console.log('oneActivityTidbit:', oneActivityTidbit);
          // console.log('numberOfCommentsDisplayed:', numberOfCommentsDisplayed);
          if (!childComment || !childComment.commenter_name) {
            // console.log('Missing oneActivityTidbit.commenter_name:', childComment);
            return null;
          }
          if (showAllChildComments) {
            // Don't stop
          } else if (numberOfCommentsDisplayed >= numberOfChildCommentsToDisplay) {
            if (showMoreHasBeenShown) {
              return null;
            } else {
              showMoreHasBeenShown = true;
              return (
                <ShowMoreWrapper key={`showMore-${childComment.we_vote_id}`}>
                  <ShowMoreLink
                    className="u-cursor--pointer"
                    onClick={this.onClickShowActivityTidbitDrawer}
                  >
                    show more comments
                  </ShowMoreLink>
                </ShowMoreWrapper>
              );
            }
          }
          numberOfCommentsDisplayed += 1;
          likeButtonSelected = !!(voterLikesThisItemByWeVoteId[childComment.we_vote_id]);
          commenterIsVoter = (voterWeVoteId === childComment.commenter_voter_we_vote_id);
          // console.log('likeButtonSelected:', likeButtonSelected);
          return (
            <CommentWrapper key={`comment-${childComment.we_vote_id}`}>
              <ChildCommentPhotoDiv>
                {(childComment.commenter_profile_image_url_tiny) ? (
                  <SpeakerAvatar>
                    <ActivityImage src={childComment.commenter_profile_image_url_tiny} alt={`${childComment.commenter_name}`} />
                  </SpeakerAvatar>
                ) : (
                  <SpeakerAvatar>
                    <Avatar sx={speakerDisplayNameToAvatarColor(childComment.commenter_name)}>
                      {speakerDisplayNameToInitials(childComment.commenter_name)}
                    </Avatar>
                  </SpeakerAvatar>
                )}
              </ChildCommentPhotoDiv>
              <ChildCommentWrapper
                className={hideChildCommentBottomLinks ? 'u-cursor--pointer' : ''}
              >
                {commentWeVoteIdBeingEditedNow === childComment.we_vote_id ? (
                  <ActivityCommentAdd
                    activityTidbitWeVoteId={activityTidbitWeVoteId}
                    activityCommentWeVoteId={childComment.we_vote_id}
                    commentEditSavedFunction={this.commentEditSavedFunction}
                    hidePhotoFromTextField
                    inEditMode
                    parentCommentWeVoteId={childComment.parent_comment_we_vote_id}
                  />
                ) : (
                  <ChildCommentText>
                    {hideChildCommentBottomLinks ? (
                      <ChildCommentStatementText
                        onClick={this.onClickShowActivityTidbitDrawer}
                      >
                        {childComment.statement_text}
                      </ChildCommentStatementText>
                    ) : (
                      <ChildCommentStatementText>
                        {childComment.statement_text}
                      </ChildCommentStatementText>
                    )}
                    {(commenterIsVoter && !editingTurnedOff) && (
                      <ActivityCommentEditWrapper
                        id={`activityCommentEdit-${activityTidbitWeVoteId}-${childComment.we_vote_id}`}
                        onClick={() => this.onClickEditComment(childComment.we_vote_id)}
                      >
                        <MoreHoriz />
                      </ActivityCommentEditWrapper>
                    )}
                  </ChildCommentText>
                )}
                {(!hideChildCommentBottomLinks) && (
                  <ChildCommentBottomLinks>
                    {(childComment.date_created) && (
                      <CommentActivityTime>
                        {timeFromDate(childComment.date_created)}
                      </CommentActivityTime>
                    )}
                    <LikeWrapper>
                      <IconButton
                        classes={{ root: likeButtonSelected ? classes.likeButtonSelected : classes.likeButton }}
                        id={`likeButton-${childComment.parent_we_vote_id}-${childComment.we_vote_id}`}
                        onClick={() => this.onClickReactionLikeToggle(childComment.we_vote_id)}
                        size="large"
                      >
                        <LikeTextWrapper likeButtonSelected={likeButtonSelected}>
                          Like
                        </LikeTextWrapper>
                      </IconButton>
                    </LikeWrapper>
                    <ReplyWrapper>
                      <IconButton
                        classes={{ root: classes.replyButton }}
                        id={`replyButton-${parentCommentWeVoteId}-${childComment.we_vote_id}`}
                        onClick={this.onClickToggleReplyToCommentLocal}
                        size="large"
                      >
                        <ReplyTextWrapper>
                          Reply
                        </ReplyTextWrapper>
                      </IconButton>
                    </ReplyWrapper>
                    {(commentWeVoteIdBeingEditedNow === childComment.we_vote_id) && (
                      <CancelWrapper>
                        <IconButton
                          classes={{ root: classes.cancelButton }}
                          id={`cancelButton-${childComment.parent_we_vote_id}-${childComment.we_vote_id}`}
                          onClick={() => this.onClickEditCommentCancel(childComment.we_vote_id)}
                          size="large"
                        >
                          <CancelTextWrapper className="u-no-break">
                            Cancel Edit
                          </CancelTextWrapper>
                        </IconButton>
                      </CancelWrapper>
                    )}
                  </ChildCommentBottomLinks>
                )}
              </ChildCommentWrapper>
            </CommentWrapper>
          );
        })}
      </Wrapper>
    );
  }
}
ChildCommentList.propTypes = {
  activityTidbitWeVoteId: PropTypes.string.isRequired,
  classes: PropTypes.object,
  editingTurnedOff: PropTypes.bool,
  hideChildCommentBottomLinks: PropTypes.bool,
  onClickToggleReplyToComment: PropTypes.func,
  parentCommentWeVoteId: PropTypes.string.isRequired,
  showAllChildComments: PropTypes.bool,
};

const styles = () => ({
  accountCircle: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    width: 24,
    height: 24,
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

const ActivityCommentEditWrapper = styled('div')`
`;

const ActivityImage = styled('img')`
  border-radius: 4px;
  width: 24px;
  height: 24px;
`;

const CancelTextWrapper = styled('div')`
  color: #999;
  font-size: 11px;
  padding-left: 4px;
`;

const CancelWrapper = styled('div')`
`;

const ChildCommentBottomLinks = styled('div')`
  align-items: center;
  display: flex;
  justify-content: start;
  margin-bottom: 3px;
  margin-left: 12px;
`;

const ChildCommentStatementText = styled('div')`
  width: 100%;
`;

const ChildCommentText = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  border-radius: 32px;
  background: rgb(224, 224, 224);
  color: #2e3c5d;
  font-size: 14px;
  font-weight: 500;
  padding: 2px 12px;
  margin-top: 0;
`;

const ChildCommentPhotoDiv = styled('div')`
`;

const ChildCommentWrapper = styled('div')`
  width: 100%;
`;

const CommentActivityTime = styled('div')`
  color: #999;
  font-size: 11px;
  font-weight: 400;
  margin-right: 6px;
`;

const CommentWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-top: 3px;
  margin-bottom: 3px;
`;

const LikeTextWrapper = styled('div', {
  shouldForwardProp: (prop) => !['likeButtonSelected'].includes(prop),
})(({ likeButtonSelected }) => (`
  ${likeButtonSelected ? 'color: #2e3c5d;' : 'color: #999;'}
  font-size: 11px;
  ${likeButtonSelected ? 'font-weight: 600;' : ''}
  padding-left: 4px;
`));

const LikeWrapper = styled('div')`
`;

const ReplyTextWrapper = styled('div')`
  color: #999;
  font-size: 11px;
  padding-left: 4px;
`;

const ReplyWrapper = styled('div')`
`;

const ShowMoreLink = styled('div')`
  color: rgba(17, 17, 17, .4);
`;

const ShowMoreWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: -5px;
  width: 100%;
`;

const SpeakerAvatar = styled('div')`
  background: transparent;
  display: flex;
  justify-content: center;
  margin-right: 4px;
  position: relative;
`;

const Wrapper = styled('div')`
  margin-bottom: 6px !important;
  padding: 0 !important;
`;

export default withTheme(withStyles(styles)(ChildCommentList));
