import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { AccountCircle, MoreHoriz } from '@material-ui/icons';
import ActivityCommentAdd from './ActivityCommentAdd';
import ActivityStore from '../../stores/ActivityStore';
import AppActions from '../../actions/AppActions';
import ReactionStore from '../../stores/ReactionStore';
import ReactionActions from '../../actions/ReactionActions';
import { renderLog } from '../../utils/logging';
import { timeFromDate } from '../../utils/textFormat';
import VoterStore from '../../stores/VoterStore';


const STARTING_NUMBER_OF_PARENT_COMMENTS_TO_DISPLAY = 1;

class ChildCommentList extends Component {
  static propTypes = {
    activityTidbitWeVoteId: PropTypes.string.isRequired,
    classes: PropTypes.object,
    editingTurnedOff: PropTypes.bool,
    onClickToggleReplyToComment: PropTypes.func,
    parentCommentWeVoteId: PropTypes.string.isRequired,
    showAllChildComments: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      commentWeVoteIdBeingEditedNow: '',
      childCommentsList: [],
      numberOfChildCommentsToDisplay: STARTING_NUMBER_OF_PARENT_COMMENTS_TO_DISPLAY,
      totalNumberOfChildComments: 0,
      voterLikesThisItemByWeVoteId: {},
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
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
    const { parentCommentWeVoteId } = this.props;
    const childCommentsList = ActivityStore.getChildCommentsByParentCommentWeVoteId(parentCommentWeVoteId);
    const totalNumberOfChildComments = childCommentsList.length || 0;
    this.setState({
      childCommentsList,
      totalNumberOfChildComments,
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

  commentEditSavedFunction = () => {
    this.setState({
      commentWeVoteIdBeingEditedNow: '',
    });
  }

  onClickEditComment = (commentWeVoteId) => {
    // const { commentWeVoteIdBeingEditedNow } = this.state;
    this.setState({
      commentWeVoteIdBeingEditedNow: commentWeVoteId,
    });
  }

  onClickEditCommentCancel = () => {
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
    AppActions.setActivityTidbitWeVoteIdForDrawer(activityTidbitWeVoteId);
    AppActions.setShowActivityTidbitDrawer(true);
  }

  onClickToggleReplyToCommentLocal = () => {
    const { parentCommentWeVoteId } = this.props;
    if (this.props.onClickToggleReplyToComment) {
      this.props.onClickToggleReplyToComment(parentCommentWeVoteId);
    }
  }

  increaseNumberOfActivityTidbitsToDisplay = () => {
    let { numberOfChildCommentsToDisplay } = this.state;
    numberOfChildCommentsToDisplay += 2;
    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfChildCommentsToDisplay,
      });
    }, 500);
  }

  render () {
    renderLog('ChildCommentList');  // Set LOG_RENDER_EVENTS to log all renders
    const { activityTidbitWeVoteId, classes, editingTurnedOff, parentCommentWeVoteId, showAllChildComments } = this.props;
    const {
      commentWeVoteIdBeingEditedNow, childCommentsList,
      numberOfChildCommentsToDisplay, totalNumberOfChildComments,
      voterLikesThisItemByWeVoteId, voterWeVoteId,
    } = this.state;
    if (!childCommentsList || childCommentsList.length === 0) {
      return null;
    }
    const hideChildCommentBottomLinks = ((totalNumberOfChildComments > 1) && !showAllChildComments);
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
                    <AccountCircle classes={{ root: classes.accountCircle }} />
                  </SpeakerAvatar>
                )}
              </ChildCommentPhotoDiv>
              <ChildCommentWrapper
                className={hideChildCommentBottomLinks ? 'u-cursor--pointer' : ''}
                onClick={hideChildCommentBottomLinks ? this.onClickShowActivityTidbitDrawer : null}
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
                    <div>
                      {childComment.statement_text}
                    </div>
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
                      >
                        <LikeTextWrapper likeButtonSelected={likeButtonSelected}>
                          Like
                        </LikeTextWrapper>
                      </IconButton>
                    </LikeWrapper>
                    <ReplyWrapper>
                      <IconButton
                        classes={{ root: classes.likeButton }}
                        id={`replyButton-${parentCommentWeVoteId}-${childComment.we_vote_id}`}
                        onClick={this.onClickToggleReplyToCommentLocal}
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

const styles = () => ({
  accountCircle: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  cancelButton: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: 6,
  },
  likeButton: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: 6,
  },
  likeButtonSelected: {
    color: '#2e3c5d',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: 6,
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

const ChildCommentBottomLinks = styled.div`
  align-items: center;
  display: flex;
  justify-content: start;
  margin-bottom: 3px;
  margin-left: 12px;
`;

const ChildCommentText = styled.div`
  align-items: center;
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

const ChildCommentPhotoDiv = styled.div`
`;

const ChildCommentWrapper = styled.div`
  width: 100%;
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

export default withTheme(withStyles(styles)(ChildCommentList));
