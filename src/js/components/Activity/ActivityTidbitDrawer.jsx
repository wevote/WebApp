import { Drawer, IconButton } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import ActivityStore from '../../stores/ActivityStore';
import { hideZenDeskHelpVisibility, showZenDeskHelpVisibility } from '../../utils/applicationUtils';
import { cordovaDrawerTopMargin } from '../../utils/cordovaOffsets';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

const ActivityCommentAdd = React.lazy(() => import(/* webpackChunkName: 'ActivityCommentAdd' */ './ActivityCommentAdd'));
const ActivityTidbitAddReaction = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitAddReaction' */ './ActivityTidbitAddReaction'));
const ActivityTidbitComments = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitComments' */ './ActivityTidbitComments'));
const ActivityTidbitItem = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitItem' */ './ActivityTidbitItem'));
const ActivityTidbitReactionsSummary = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitReactionsSummary' */ './ActivityTidbitReactionsSummary'));
const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../Widgets/DelayedLoad'));


class ActivityTidbitDrawer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      modalOpen: this.props.modalOpen,
    };
  }

  componentDidMount () {
    this.onActivityStoreChange();
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
    hideZenDeskHelpVisibility();
  }

  componentWillUnmount () {
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
    this.activityStoreListener.remove();
    showZenDeskHelpVisibility();
  }

  onActivityStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    const activityTidbit = ActivityStore.getActivityTidbitByWeVoteId(activityTidbitWeVoteId);
    const {
      speaker_voter_we_vote_id: speakerVoterWeVoteId,
    } = activityTidbit;
    // console.log('ActivityTidbitItem onActivityStoreChange, activityTidbitWeVoteId:', activityTidbitWeVoteId, ', statementText:', statementText);
    this.setState({
      speakerVoterWeVoteId,
    });
  }

  closeActivityTidbitDrawer = () => {
    const { activityTidbitWeVoteId } = this.props;
    this.setState({ modalOpen: false });
    this.closeTimeout = setTimeout(() => {
      this.props.toggleFunction();
    }, 500);
    const { pathname: pathnameRaw, href: hrefRaw } = window.location;
    let pathname = pathnameRaw;
    if (isCordova()) {
      pathname = hrefRaw.replace(/file:\/\/.*?Vote.app\/www\/index.html#\//, '');
      // console.log('ATD -----------------------', pathname)
    }
    if (typeof pathname !== 'undefined' && pathname && pathname.startsWith('/news/a/')) {
      historyPush(`/news#${activityTidbitWeVoteId}`);
    }
  }

  render () {
    // console.log(this.props.candidate_we_vote_id);
    renderLog('ActivityTidbitDrawer');  // Set LOG_RENDER_EVENTS to log all renders
    const { activityTidbitWeVoteId, classes } = this.props;
    const { modalOpen, speakerVoterWeVoteId } = this.state;

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
            {(activityTidbitWeVoteId && speakerVoterWeVoteId) ? (
              <>
                <ActivityTidbitItemWrapper>
                  <ActivityTidbitItem
                    activityTidbitWeVoteId={activityTidbitWeVoteId}
                    startingNumberOfPositionsToDisplay={3}
                  />
                </ActivityTidbitItemWrapper>
                <ActivityTidbitReactionsSummary
                  activityTidbitWeVoteId={activityTidbitWeVoteId}
                />
                <ActivityTidbitAddReaction
                  activityTidbitWeVoteId={activityTidbitWeVoteId}
                />
                <ActivityTidbitComments
                  activityTidbitWeVoteId={activityTidbitWeVoteId}
                  showAllParentComments
                />
                <ActivityCommentAdd
                  activityTidbitWeVoteId={activityTidbitWeVoteId}
                />
              </>
            ) : (
              <DelayedLoad showLoadingText waitBeforeShow={500}>
                <div>
                  That discussion item could not be found, or you are not allowed to see it.
                  <br />
                  <br />
                  Please make sure you are signed in so you can see all of your friend&apos;s amazing thoughts!
                </div>
              </DelayedLoad>
            )}
          </ActivityTidbitDrawerInnerWrapper>
        </Drawer>
      </>
    );
  }
}
ActivityTidbitDrawer.propTypes = {
  activityTidbitWeVoteId: PropTypes.string.isRequired,
  classes: PropTypes.object,
  modalOpen: PropTypes.bool,
  toggleFunction: PropTypes.func.isRequired,
};

const styles = () => ({
  drawerClasses: {
    marginTop: cordovaDrawerTopMargin(),
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
