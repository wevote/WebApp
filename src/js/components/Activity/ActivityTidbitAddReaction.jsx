import { Message, ThumbUp } from '@mui/icons-material'; // Reply,
import { IconButton } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactionActions from '../../actions/ReactionActions';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import ReactionStore from '../../stores/ReactionStore';


class ActivityTidbitAddReaction extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterLikesThisItem: false,
    };
  }

  componentDidMount () {
    this.reactionStoreListener = ReactionStore.addListener(this.onReactionStoreChange.bind(this));
    this.onReactionStoreChange();
  }

  componentWillUnmount () {
    this.reactionStoreListener.remove();
  }

  onReactionStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    // console.log('ActivityTidbitAddReaction onReactionStoreChange, activityTidbitWeVoteId:', activityTidbitWeVoteId);
    const voterLikesThisItem = ReactionStore.voterLikesThisItem(activityTidbitWeVoteId);
    this.setState({
      voterLikesThisItem,
    });
  }

  onClickReactionLikeToggle = () => {
    const { activityTidbitWeVoteId } = this.props;
    // console.log('onClickShowActivityTidbitDrawer activityTidbitWeVoteId:', activityTidbitWeVoteId);
    if (ReactionStore.voterLikesThisItem(activityTidbitWeVoteId)) {
      ReactionActions.voterReactionLikeOffSave(activityTidbitWeVoteId);
      this.setState({
        voterLikesThisItem: false,
      });
    } else {
      ReactionActions.voterReactionLikeOnSave(activityTidbitWeVoteId);
      this.setState({
        voterLikesThisItem: true,
      });
    }
  }

  onClickShowActivityTidbitDrawer = () => {
    const { activityTidbitWeVoteId } = this.props;
    // console.log('onClickShowActivityTidbitDrawer activityTidbitWeVoteId:', activityTidbitWeVoteId);
    AppObservableStore.setActivityTidbitWeVoteIdForDrawer(activityTidbitWeVoteId);
    AppObservableStore.setShowActivityTidbitDrawer(true);
  }

  render () {
    renderLog('ActivityTidbitAddReaction');  // Set LOG_RENDER_EVENTS to log all renders
    const { activityTidbitWeVoteId, classes } = this.props;
    const { voterLikesThisItem } = this.state;
    if (!activityTidbitWeVoteId) {
      return null;
    }
    return (
      <Wrapper>
        <LeftColumnWrapper>
          <LikeWrapper>
            <IconButton
              classes={{ root: voterLikesThisItem ? classes.likeButtonSelected  : classes.likeButton }}
              id={`likeButton-${activityTidbitWeVoteId}`}
              onClick={this.onClickReactionLikeToggle}
              size="large"
            >
              <ThumbUp classes={{ root: voterLikesThisItem ? classes.likeIconSelected : classes.likeIcon }} />
              <LikeTextWrapper>
                Like
              </LikeTextWrapper>
            </IconButton>
          </LikeWrapper>
        </LeftColumnWrapper>
        {/* <CenterColumnWrapper> */}
        {/* </CenterColumnWrapper> */}
        <RightColumnWrapper>
          <CommentWrapper>
            <IconButton
              classes={{ root: classes.commentsButton }}
              id={`commentsButton-${activityTidbitWeVoteId}`}
              onClick={this.onClickShowActivityTidbitDrawer}
              size="large"
            >
              <Message classes={{ root: classes.commentsIcon }} />
              <CommentTextWrapper>
                Comment
              </CommentTextWrapper>
            </IconButton>
          </CommentWrapper>
          {/* <ShareWrapper> */}
          {/*  <IconButton */}
          {/*    classes={{ root: classes.sendReply }} */}
          {/*    id={`sendReply-${activityTidbitWeVoteId}`} */}
          {/*    onClick={this.toggleProfilePopUp} */}
          {/*  > */}
          {/*    <Reply */}
          {/*      classes={{ root: classes.shareIcon }} */}
          {/*    /> */}
          {/*    <CommentTextWrapper> */}
          {/*      Share */}
          {/*    </CommentTextWrapper> */}
          {/*  </IconButton> */}
          {/* </ShareWrapper> */}
        </RightColumnWrapper>
      </Wrapper>
    );
  }
}
ActivityTidbitAddReaction.propTypes = {
  activityTidbitWeVoteId: PropTypes.string.isRequired,
  classes: PropTypes.object,
};

const styles = () => ({
  commentsButton: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: 6,
  },
  commentsIcon: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    width: 19,
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
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: 6,
  },
  likeIcon: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    width: 19,
  },
  likeIconSelected: {
    color: '#2e3c5d',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    width: 19,
  },
  sendReply: {
    color: 'rgba(17, 17, 17, .4)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: 6,
  },
  shareIcon: {
    transform: 'scaleX(-1)',
    position: 'relative',
    top: -1,
  },
});

const CommentWrapper = styled('div')`
`;

const CommentTextWrapper = styled('div')`
  font-size: 14px;
  padding-left: 4px;
`;

const LeftColumnWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

const RightColumnWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const LikeTextWrapper = styled('div')`
  font-size: 14px;
  padding-left: 4px;
`;

const LikeWrapper = styled('div')`
`;

const Wrapper = styled('div')`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  padding: 0 !important;
`;

export default withTheme(withStyles(styles)(ActivityTidbitAddReaction));
