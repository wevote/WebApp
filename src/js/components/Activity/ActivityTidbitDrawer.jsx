import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Drawer, IconButton } from '@material-ui/core';
import ActivityCommentAdd from './ActivityCommentAdd';
import ActivityTidbitAddReaction from './ActivityTidbitAddReaction';
import ActivityTidbitComments from './ActivityTidbitComments';
import ActivityTidbitItem from './ActivityTidbitItem';
import ActivityTidbitReactionsSummary from './ActivityTidbitReactionsSummary';
import { renderLog } from '../../utils/logging';
import webAppConfig from '../../config';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

class ActivityTidbitDrawer extends Component {
  static propTypes = {
    activityTidbitWeVoteId: PropTypes.string.isRequired,
    classes: PropTypes.object,
    modalOpen: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      modalOpen: this.props.modalOpen,
    };
  }

  componentDidMount () {
  }

  closeActivityTidbitDrawer = () => {
    this.setState({ modalOpen: false });
    setTimeout(() => {
      this.props.toggleFunction();
    }, 500);
  }

  render () {
    // console.log(this.props.candidate_we_vote_id);
    renderLog('ActivityTidbitDrawer');  // Set LOG_RENDER_EVENTS to log all renders
    const { activityTidbitWeVoteId, classes } = this.props;
    const { modalOpen } = this.state;

    return (
      <>
        <Drawer
          anchor="right"
          classes={{ paper: classes.drawerClasses }}
          direction="left"
          id="share-menu"
          onClose={this.closeActivityTidbitDrawer}
          open={modalOpen}
        >
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            id="closeActivityTidbitDrawer"
             onClick={this.closeActivityTidbitDrawer}
          >
            <span className="fas fa-times u-cursor--pointer" />
          </IconButton>
          <ActivityTidbitDrawerInnerWrapper>
            <ActivityTidbitItemWrapper>
              <ActivityTidbitItem
                activityTidbitWeVoteId={activityTidbitWeVoteId}
              />
            </ActivityTidbitItemWrapper>
            {nextReleaseFeaturesEnabled && (
              <>
                <ActivityTidbitReactionsSummary
                  activityTidbitWeVoteId={activityTidbitWeVoteId}
                />
                <ActivityTidbitAddReaction
                  activityTidbitWeVoteId={activityTidbitWeVoteId}
                />
                <ActivityTidbitComments
                  activityTidbitWeVoteId={activityTidbitWeVoteId}
                />
                <ActivityCommentAdd
                  activityTidbitWeVoteId={activityTidbitWeVoteId}
                />
              </>
            )}
          </ActivityTidbitDrawerInnerWrapper>
        </Drawer>
      </>
    );
  }
}

const styles = () => ({
  drawerClasses: {
    maxWidth: '550px !important',
    '& *': {
      maxWidth: '550px !important',
    },
    '@media(max-width: 576px)': {
      maxWidth: '360px !important',
      '& *': {
        maxWidth: '360px !important',
      },
    },
  },
  closeButton: {
    marginRight: 'auto',
  },
});

const ActivityTidbitItemWrapper = styled.div`
`;

const ActivityTidbitDrawerInnerWrapper = styled.div`
  margin-left: 12px;
  margin-right: 12px;
`;
export default withTheme(withStyles(styles)(ActivityTidbitDrawer));
