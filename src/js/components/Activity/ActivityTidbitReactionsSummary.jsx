import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { ThumbUp } from '@material-ui/icons';
import ActivityStore from '../../stores/ActivityStore';
import AppActions from '../../actions/AppActions';
import { renderLog } from '../../utils/logging';
import ReactionStore from '../../stores/ReactionStore';


class ActivityTidbitReactionsSummary extends Component {
  static propTypes = {
    activityTidbitWeVoteId: PropTypes.string.isRequired,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      numberOfComments: 0,
      numberOfLikes: 0,
      // namesOfLikesList: [],
    };
  }

  componentDidMount () {
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
    this.reactionStoreListener = ReactionStore.addListener(this.onReactionStoreChange.bind(this));
    this.onReactionStoreChange();
  }

  componentWillUnmount () {
    this.activityStoreListener.remove();
    this.reactionStoreListener.remove();
  }

  onActivityStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    const numberOfComments = ActivityStore.getActivityCommentAllCountByTidbitWeVoteId(activityTidbitWeVoteId);
    this.setState({
      numberOfComments,
    });
  }

  onReactionStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    // console.log('ActivityTidbitReactionsSummary onReactionStoreChange, activityTidbitWeVoteId:', activityTidbitWeVoteId);
    const reactionLikeListForThisActivityTidbit = ReactionStore.getReactionLikeListByWeVoteId(activityTidbitWeVoteId);
    const numberOfLikes = reactionLikeListForThisActivityTidbit.length;
    // const namesOfLikesList = [];
    this.setState({
      // namesOfLikesList,
      numberOfLikes,
    });
  }

  onClickShowActivityTidbitDrawer = () => {
    const { activityTidbitWeVoteId } = this.props;
    // console.log('onClickShowActivityTidbitDrawer activityTidbitWeVoteId:', activityTidbitWeVoteId);
    AppActions.setActivityTidbitWeVoteIdForDrawer(activityTidbitWeVoteId);
    AppActions.setShowActivityTidbitDrawer(true);
  }

  render () {
    renderLog('ActivityTidbitReactionsSummary');  // Set LOG_RENDER_EVENTS to log all renders
    const { activityTidbitWeVoteId, classes } = this.props;
    const { numberOfComments, numberOfLikes } = this.state;
    if (!activityTidbitWeVoteId || numberOfLikes === 0) {
      return null;
    }
    return (
      <Wrapper>
        <LeftColumnWrapper>
          {(numberOfLikes) && (
            <LikeWrapper>
              <IconButton
                classes={{ root: classes.numberOfLikesButton }}
                id={`numberOfLikes-${activityTidbitWeVoteId}`}
              >
                <ThumbUp classes={{ root: classes.likeIcon }} />
                <LikeTextWrapper>
                  {numberOfLikes}
                </LikeTextWrapper>
              </IconButton>
            </LikeWrapper>
          )}
        </LeftColumnWrapper>
        <RightColumnWrapper>
          {!!(numberOfComments) && (
            <CommentWrapper>
              <IconButton
                classes={{ root: classes.numberOfCommentsButton }}
                id={`numberOfComments-${activityTidbitWeVoteId}`}
              >
                <CommentTextWrapper>
                  {numberOfComments}
                  {' '}
                  Comment
                  {numberOfComments === 1 ? '' : 's'}
                </CommentTextWrapper>
              </IconButton>
            </CommentWrapper>
          )}
        </RightColumnWrapper>
      </Wrapper>
    );
  }
}

const styles = () => ({
  likeIcon: {
    color: '#1fc06f', // #2e3c5d
    '&:hover': {
      backgroundColor: 'transparent',
    },
    width: 12,
    height: 12,
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

const LeftColumnWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

const RightColumnWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const CommentWrapper = styled.div`
`;

const CommentTextWrapper = styled.div`
  font-size: 10px;
  padding-left: 4px;
`;

const LikeTextWrapper = styled.div`
  color: #1fc06f;
  font-size: 10px;
  font-weight: 500;
  padding-left: 4px;
`;

const LikeWrapper = styled.div`
`;

const Wrapper = styled.div`
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0px !important;
  padding: 0px !important;
`;

export default withTheme(withStyles(styles)(ActivityTidbitReactionsSummary));
