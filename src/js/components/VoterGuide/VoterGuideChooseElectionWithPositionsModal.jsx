import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { renderLog } from '../../common/utils/logging';
import { calculateBallotBaseUrlForVoterGuide } from '../../utils/textFormat';

const BallotElectionListWithFilters = React.lazy(() => import(/* webpackChunkName: 'BallotElectionListWithFilters' */ '../Ballot/BallotElectionListWithFilters'));

class VoterGuideChooseElectionWithPositionsModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.setState({
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps () {
    this.setState({
    });
  }

  shouldComponentUpdate (nextProps) {
    const { location: { pathname } } = window;

    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (pathname !== nextProps.pathname) {
      // console.log('pathname:', pathname, ', nextProps.pathname:', nextProps.pathname);
      return true;
    }
    if (this.props.organizationWeVoteId !== nextProps.organizationWeVoteId) {
      // console.log('this.props.organizationWeVoteId:', this.props.organizationWeVoteId, ', nextProps.organizationWeVoteId:', nextProps.organizationWeVoteId);
      return true;
    }
    // console.log('shouldComponentUpdate no change');
    return false;
  }

  render () {
    renderLog('VoterGuideChooseElectionWithPositionsModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, organizationWeVoteId, show } = this.props;
    const { location: { pathname } } = window;
    const ballotBaseUrl = calculateBallotBaseUrlForVoterGuide(this.props.ballotBaseUrl, pathname);

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={show}
        onClose={() => { this.props.toggleFunction(); }}
      >
        <DialogTitle>
          <Typography className="text-center">
            Elections With Endorsements
          </Typography>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.props.toggleFunction(); }}
            id="profileCloseVoterGuideChooseElectionModal"
            size="large"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <Suspense fallback={<></>}>
            <BallotElectionListWithFilters
              ballotBaseUrl={ballotBaseUrl}
              displayElectionsForOrganizationVoterGuidesMode
              hideUpcomingElectionTitle
              organizationWeVoteId={organizationWeVoteId}
              showPriorElectionsList
              stateToShow="all"
              toggleFunction={this.props.toggleFunction}
            />
          </Suspense>
        </DialogContent>
      </Dialog>
    );
  }
}
VoterGuideChooseElectionWithPositionsModal.propTypes = {
  ballotBaseUrl: PropTypes.string,
  classes: PropTypes.object,
  organizationWeVoteId: PropTypes.string, // If looking at voter guide, we pass in the parent organizationWeVoteId
  show: PropTypes.bool,
  toggleFunction: PropTypes.func.isRequired,
  pathname: PropTypes.string,
};

const styles = (theme) => ({
  dialogPaper: {
    [theme.breakpoints.down('sm')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
  },
  dialogContent: {
    height: '100%',
    [theme.breakpoints.down('lg')]: {
      padding: '0 8px',
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
});

export default withTheme(withStyles(styles)(VoterGuideChooseElectionWithPositionsModal));
