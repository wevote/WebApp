import { Drawer, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import historyPush from '../../common/utils/historyPush';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import ActivityStore from '../../stores/ActivityStore';
import { cordovaDrawerTopMargin } from '../../utils/cordovaOffsets';

const ActivityCommentAdd = React.lazy(() => import(/* webpackChunkName: 'ActivityCommentAdd' */ './ActivityCommentAdd'));
const ActivityTidbitAddReaction = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitAddReaction' */ './ActivityTidbitAddReaction'));
const ActivityTidbitComments = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitComments' */ './ActivityTidbitComments'));
const ActivityTidbitItem = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitItem' */ './ActivityTidbitItem'));
const ActivityTidbitReactionsSummary = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitReactionsSummary' */ './ActivityTidbitReactionsSummary'));
const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));


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
  }

  componentWillUnmount () {
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
    this.activityStoreListener.remove();
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
          size="large"
        >
          <span className="u-cursor--pointer">
            <Close classes={{ root: classes.closeIcon }} />
          </span>
        </IconButton>
        <ActivityTidbitDrawerInnerWrapper>
          {(activityTidbitWeVoteId && speakerVoterWeVoteId) ? (
            <>
              <ActivityTidbitItemWrapper>
                <Suspense fallback={<></>}>
                  <ActivityTidbitItem
                    activityTidbitWeVoteId={activityTidbitWeVoteId}
                    startingNumberOfPositionsToDisplay={3}
                  />
                </Suspense>
              </ActivityTidbitItemWrapper>
              <Suspense fallback={<></>}>
                <ActivityTidbitReactionsSummary
                  activityTidbitWeVoteId={activityTidbitWeVoteId}
                />
              </Suspense>
              <Suspense fallback={<></>}>
                <ActivityTidbitAddReaction
                  activityTidbitWeVoteId={activityTidbitWeVoteId}
                />
              </Suspense>
              <Suspense fallback={<></>}>
                <ActivityTidbitComments
                  activityTidbitWeVoteId={activityTidbitWeVoteId}
                  showAllParentComments
                />
              </Suspense>
              <Suspense fallback={<></>}>
                <ActivityCommentAdd
                  activityTidbitWeVoteId={activityTidbitWeVoteId}
                />
              </Suspense>
            </>
          ) : (
            <Suspense fallback={<></>}>
              <DelayedLoad showLoadingText waitBeforeShow={500}>
                <div>
                  That discussion item could not be found, or you are not allowed to see it.
                  <br />
                  <br />
                  Please make sure you are signed in so you can see all of your friend&apos;s amazing thoughts!
                </div>
              </DelayedLoad>
            </Suspense>
          )}
        </ActivityTidbitDrawerInnerWrapper>
      </Drawer>
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
  closeIcon: {
    color: '#999',
    width: 24,
    height: 24,
  },
});

const ActivityTidbitItemWrapper = styled('div')`
`;

const ActivityTidbitDrawerInnerWrapper = styled('div')`
  margin-left: 12px;
  margin-right: 12px;
`;
export default withTheme(withStyles(styles)(ActivityTidbitDrawer));
