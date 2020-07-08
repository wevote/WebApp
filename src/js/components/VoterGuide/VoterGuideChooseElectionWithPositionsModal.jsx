import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogTitle, IconButton, Typography, DialogContent} from '@material-ui/core';
import {Close} from '@material-ui/icons';
import { withStyles, withTheme } from '@material-ui/core/styles';
import BallotElectionListWithFilters from '../Ballot/BallotElectionListWithFilters';
import { renderLog } from '../../utils/logging';
import { calculateBallotBaseUrlForVoterGuide } from '../../utils/textFormat';

class VoterGuideChooseElectionWithPositionsModal extends Component {
  // This modal will show a users ballot guides from previous and current elections.

  static propTypes = {
    ballotBaseUrl: PropTypes.string,
    classes: PropTypes.object,
    organizationWeVoteId: PropTypes.string, // If looking at voter guide, we pass in the parent organizationWeVoteId
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.setState({
    });
  }

  componentWillReceiveProps () {
    this.setState({
    });
  }

  shouldComponentUpdate (nextProps) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.props.pathname !== nextProps.pathname) {
      // console.log('this.props.pathname:', this.props.pathname, ', nextProps.pathname:', nextProps.pathname);
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
    const { classes, organizationWeVoteId, pathname, show } = this.props;
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
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <BallotElectionListWithFilters
            ballotBaseUrl={ballotBaseUrl}
            displayElectionsForOrganizationVoterGuidesMode
            hideUpcomingElectionTitle
            organizationWeVoteId={organizationWeVoteId}
            showPriorElectionsList
            toggleFunction={this.props.toggleFunction}
          />
        </DialogContent>
      </Dialog>
    );
  }
}
const styles = theme => ({
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

export default withTheme(withStyles(styles)(VoterGuideChooseElectionWithPositionsModal));
