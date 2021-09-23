import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { normalizedHref } from '../../utils/applicationUtils';
import { renderLog } from '../../utils/logging';

const BallotElectionListWithFilters = React.lazy(() => import(/* webpackChunkName: 'BallotElectionListWithFilters' */ '../Ballot/BallotElectionListWithFilters'));

class VoterGuideChooseElectionModal extends Component {
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
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    const pathname = normalizedHref();
    const { pathname: nextPathname } = nextProps;
    if (pathname !== nextPathname) {
      // console.log('pathname:', pathname, ', nextProps.pathname:', nextPathname);
      return true;
    }
    if (this.props.organization_we_vote_id !== nextProps.organization_we_vote_id) {
      // console.log('this.props.organization_we_vote_id:', this.props.organization_we_vote_id, ', nextProps.organization_we_vote_id:', nextProps.organization_we_vote_id);
      return true;
    }
    // console.log('shouldComponentUpdate no change');
    return false;
  }

  render () {
    renderLog('VoterGuideChooseElectionModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(); }}
      >
        <DialogTitle>
          <Typography className="text-center">
            Choose Upcoming Election
          </Typography>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.props.toggleFunction(); }}
            id="profileCloseVoterGuideChooseElectionModal"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <BallotElectionListWithFilters
            hideUpcomingElectionTitle
            organizationWeVoteId={this.props.organization_we_vote_id}
            stateToShow="all"
            toggleFunction={this.props.toggleFunction}
          />
        </DialogContent>
      </Dialog>
    );
  }
}
VoterGuideChooseElectionModal.propTypes = {
  classes: PropTypes.object,
  organization_we_vote_id: PropTypes.string, // If looking at voter guide, we pass in the parent organization_we_vote_id
  show: PropTypes.bool,
  toggleFunction: PropTypes.func.isRequired,
  pathname: PropTypes.string,
};

const styles = (theme) => ({
  dialogPaper: {
    [theme.breakpoints.down('xs')]: {
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
    [theme.breakpoints.down('md')]: {
      padding: '0 8px',
    },
  },
  closeButton: {
    position: 'absolute',
    right: `${theme.spacing(1)}px`,
    top: `${theme.spacing(1)}px`,
  },
});

export default withTheme(withStyles(styles)(VoterGuideChooseElectionModal));
